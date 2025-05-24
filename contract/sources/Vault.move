module tumbuh::usdc_vault;

use std::option::{some, none};
use sui::tx_context::{TxContext, sender};
use sui::clock::{Self, Clock};
use sui::event;
use sui::transfer;
use sui::coin::{Self, Coin, TreasuryCap, value, into_balance, mint, mint_balance, burn, from_balance};
use sui::balance::{Self, Balance, join, split, destroy_zero};
use sui::table::{Self, Table};
use sui::object::{Self, UID, ID};

use tumbuh::mock_usdc::MOCK_USDC;

// Constants
const PROTOCOL_FEE: u64 = 200;
const BASIS_POINTS: u64 = 10000;
const PROTOCOL_WITHDRAW_PERCENT: u64 = 7000;
const MAX_ALLOCATION: u64 = 10000;

// Error constants
const ETokenNotSupported: u64 = 1;
const EAllocationExceeded: u64 = 2;
const EZeroAmount: u64 = 3;
const ENoActiveStrategy: u64 = 6;
const EVaultPaused: u64 = 13;

// One-Time Witness for the SUSDC token - this will be used for currency creation
public struct USDC_VAULT has drop {}

// Main vault struct - now as shared object
public struct Vault has key {
    id: UID,
    usdc_balance: Balance<MOCK_USDC>,
    susdc_balance: Balance<USDC_VAULT>,
    treasury_cap: TreasuryCap<USDC_VAULT>,
    current_strategy: Option<Strategy>,
    previous_strategy: Option<Strategy>,
    supported_tokens: Table<address, bool>,
    total_yield_earned: u64,
    last_yield_calculation_time: u64,
    admin_cap_id: ID,
    is_paused: bool,
}

public struct Strategy has store, copy, drop {
    target_token: address,
    protocol: address,
    allocation: u64,
    expected_yield: u64,
    active: bool,
    deployed_amount: u64,
    deployment_time: u64,
    last_harvest_time: u64,
    harvested_yield: u64,
}

public struct AdminCap has key, store {
    id: UID,
    vault_id: ID,
}

public struct ManagerCap has key, store {
    id: UID,
    vault_id: ID,
}

public struct AIAgentCap has key, store {
    id: UID,
    vault_id: ID,
}

// Events
public struct StrategyUpdated has copy, drop {
    target_token: address,
    protocol: address,
    allocation: u64,
    expected_yield: u64,
}

public struct Withdrawn has copy, drop {
    owner: address,
    receiver: address,
    susdc_amount: u64,
    usdc_amount: u64,
}

public struct YieldHarvested has copy, drop {
    amount: u64,
    yield_rate: u64,
}

public struct StrategyFundsDeployed has copy, drop {
    protocol: address,
    token: address,
    amount: u64,
}

public struct StrategyFundsWithdrawn has copy, drop {
    protocol: address,
    token: address,
    amount: u64,
}

public struct DepositCompleted has copy, drop {
    user: address,
    assets: u64,
    shares: u64,
}

public struct EmergencyWithdrawal has copy, drop {
    token: address,
    amount: u64,
    recipient: address,
}

public struct VaultPaused has copy, drop {
    paused: bool,
}

// Initialize function - called once during package publication
// Modify the init function to include manager cap creation and token support
fun init(otw: USDC_VAULT, ctx: &mut TxContext) {
    // Create SUSDC treasury cap using the OTW
    let (treasury_cap, metadata) = coin::create_currency<USDC_VAULT>(
        otw,
        6, // decimals
        b"sUSDC",
        b"Staked USDC",
        b"Yield-bearing USDC tokens from Tumbuh Vault",
        option::none(),
        ctx
    );
    
    // Transfer metadata to sender
    transfer::public_freeze_object(metadata);
    
    // Create vault ID and admin cap
    let vault_id = object::new(ctx);
    let vault_uid = object::uid_to_inner(&vault_id);
    
    let admin_cap_id = object::new(ctx);
    let admin_cap = AdminCap {
        id: admin_cap_id,
        vault_id: vault_uid,
    };
    
    // Create AI Agent Cap
    let ai_agent_cap = AIAgentCap {
        id: object::new(ctx),
        vault_id: vault_uid,
    };

    // Create the single vault instance
    let mut vault = Vault {
        id: vault_id,
        usdc_balance: balance::zero<MOCK_USDC>(),
        susdc_balance: balance::zero<USDC_VAULT>(),
        treasury_cap,
        current_strategy: option::none(),
        previous_strategy: option::none(),
        supported_tokens: table::new(ctx),
        total_yield_earned: 0,
        last_yield_calculation_time: 0,
        admin_cap_id: object::uid_to_inner(&admin_cap.id),
        is_paused: false,
    };

    let mock_usdc_address = @0x0;
    table::add(&mut vault.supported_tokens, mock_usdc_address, true);
    
    transfer::share_object(vault);
    
    let manager_cap = ManagerCap {
        id: object::new(ctx),
        vault_id: vault_uid,
    };
    
    let deployer = sender(ctx);
    transfer::transfer(admin_cap, deployer);
    transfer::transfer(ai_agent_cap, deployer);
    transfer::transfer(manager_cap, deployer);
}


// Deposit function - user specifies amount to deposit
entry fun deposit(
    vault: &mut Vault,
    mut usdc_coins: Coin<MOCK_USDC>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext
) {
    assert!(!vault.is_paused, EVaultPaused);
    assert!(amount > 0, EZeroAmount);

    let coin_value = value(&usdc_coins);
    assert!(coin_value >= amount, EZeroAmount); // Ensure user has enough coins

    // Split the exact amount needed
    let deposit_coin = if (coin_value == amount) {
        usdc_coins
    } else {
        let deposit_coin = coin::split(&mut usdc_coins, amount, ctx);
        // Return remaining coins to sender
        transfer::public_transfer(usdc_coins, sender(ctx));
        deposit_coin
    };

    let usdc_balance = into_balance(deposit_coin);
    balance::join(&mut vault.usdc_balance, usdc_balance);

    let shares_to_mint = calculate_shares_to_mint(vault, amount);
    let susdc_coins = mint(&mut vault.treasury_cap, shares_to_mint, ctx);

    let tracking_balance = mint_balance(&mut vault.treasury_cap, shares_to_mint);
    balance::join(&mut vault.susdc_balance, tracking_balance);

    execute_user_strategy(vault, amount);

    event::emit(DepositCompleted {
        user: sender(ctx),
        assets: amount,
        shares: shares_to_mint,
    });

    transfer::public_transfer(susdc_coins, recipient);
}

// Deposit function with vector
entry fun deposit_with_vector(
    vault: &mut Vault,
    mut coins: vector<Coin<MOCK_USDC>>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext
) {
    assert!(!vault.is_paused, EVaultPaused);
    assert!(amount > 0, EZeroAmount);
    assert!(!vector::is_empty(&coins), EZeroAmount);

    // Merge all coins into the first one
    let mut merged_coin = vector::pop_back(&mut coins);
    
    while (!vector::is_empty(&coins)) {
        let coin = vector::pop_back(&mut coins);
        coin::join(&mut merged_coin, coin);
    };
    
    // Destroy empty vector
    vector::destroy_empty(coins);

    // Validasi dan proses seperti deposit biasa
    let total_value = coin::value(&merged_coin);
    assert!(total_value >= amount, EZeroAmount);

    let deposit_coin = if (total_value == amount) {
        merged_coin
    } else {
        let deposit_coin = coin::split(&mut merged_coin, amount, ctx);
        transfer::public_transfer(merged_coin, sender(ctx));
        deposit_coin
    };

    // Continue with normal deposit logic
    let usdc_balance = into_balance(deposit_coin);
    balance::join(&mut vault.usdc_balance, usdc_balance);

    let shares_to_mint = calculate_shares_to_mint(vault, amount);
    let susdc_coins = mint(&mut vault.treasury_cap, shares_to_mint, ctx);

    let tracking_balance = mint_balance(&mut vault.treasury_cap, shares_to_mint);
    balance::join(&mut vault.susdc_balance, tracking_balance);

    execute_user_strategy(vault, amount);

    event::emit(DepositCompleted {
        user: sender(ctx),
        assets: amount,
        shares: shares_to_mint,
    });

    transfer::public_transfer(susdc_coins, recipient);
}

// Withdraw function - user specifies amount of shares to burn
entry fun withdraw(
    vault: &mut Vault,
    mut susdc_coins: Coin<USDC_VAULT>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext
) {
    assert!(!vault.is_paused, EVaultPaused);
    assert!(amount > 0, EZeroAmount);

    let coin_value = coin::value(&susdc_coins);
    assert!(coin_value >= amount, EZeroAmount);

    // Split the exact amount needed
    let burn_coin = if (coin_value == amount) {
        susdc_coins
    } else {
        let burn_coin = coin::split(&mut susdc_coins, amount, ctx);
        transfer::public_transfer(susdc_coins, sender(ctx));
        burn_coin
    };

    let assets_to_withdraw = calculate_assets_to_withdraw(vault, amount);
    handle_protocol_withdrawal(vault, assets_to_withdraw);

    // Burn the shares
    coin::burn(&mut vault.treasury_cap, burn_coin);

    // Update tracking balance - split the amount and burn it using treasury_cap
    let withdrawn_balance = balance::split(&mut vault.susdc_balance, amount);
    burn(&mut vault.treasury_cap, from_balance(withdrawn_balance, ctx));

    // Withdraw USDC
    let usdc_balance = balance::split(&mut vault.usdc_balance, assets_to_withdraw);
    let usdc_coins = coin::from_balance(usdc_balance, ctx);

    event::emit(Withdrawn {
        owner: sender(ctx),
        receiver: recipient,
        susdc_amount: amount,
        usdc_amount: assets_to_withdraw,
    });

    transfer::public_transfer(usdc_coins, recipient);
}

// Strategy management functions
public fun update_strategy(
    vault: &mut Vault,
    _ai_agent_cap: &AIAgentCap,
    target_token: address,
    protocol: address,
    allocation: u64,
    expected_yield: u64,
    clock: &Clock,
    _ctx: &mut TxContext
) {
    assert!(!vault.is_paused, EVaultPaused);
    assert!(allocation <= MAX_ALLOCATION, EAllocationExceeded);
    assert!(table::contains(&vault.supported_tokens, target_token), ETokenNotSupported);

    let current_time = clock::timestamp_ms(clock);

    vault.previous_strategy = vault.current_strategy;

    let new_strategy = Strategy {
        target_token,
        protocol,
        allocation,
        expected_yield,
        active: true,
        deployed_amount: 0,
        deployment_time: current_time,
        last_harvest_time: current_time,
        harvested_yield: 0,
    };

    vault.current_strategy = some(new_strategy);
    handle_strategy_transition(vault);

    event::emit(StrategyUpdated {
        target_token,
        protocol,
        allocation,
        expected_yield,
    });
}

public fun execute_strategy(
    vault: &mut Vault,
    _ai_agent_cap: &AIAgentCap,
    _clock: &Clock,
    _ctx: &mut TxContext
) {
    assert!(!vault.is_paused, EVaultPaused);
    assert!(option::is_some(&vault.current_strategy), ENoActiveStrategy);

    let vault_balance = balance::value(&vault.usdc_balance);

    if (vault_balance > 0) {
        let amount_to_deploy = (vault_balance * PROTOCOL_WITHDRAW_PERCENT) / BASIS_POINTS;
        deploy_to_protocol(vault, amount_to_deploy);
    };
}

public fun harvest_yield(
    vault: &mut Vault,
    _ai_agent_cap: &AIAgentCap,
    harvest_amount: u64,
    clock: &Clock,
    _ctx: &mut TxContext
) {
    assert!(!vault.is_paused, EVaultPaused);
    assert!(option::is_some(&vault.current_strategy), ENoActiveStrategy);

    if (harvest_amount > 0) {
        let strategy = option::borrow_mut(&mut vault.current_strategy);
        let current_time = clock::timestamp_ms(clock);
        
        let time_since_last_harvest = current_time - strategy.last_harvest_time;
        let annualized_yield_rate = if (time_since_last_harvest > 0 && strategy.deployed_amount > 0) {
            (harvest_amount * 365 * 24 * 60 * 60 * 1000 * BASIS_POINTS) / 
            (time_since_last_harvest * strategy.deployed_amount)
        } else {
            0
        };

        strategy.harvested_yield = strategy.harvested_yield + annualized_yield_rate;
        strategy.last_harvest_time = current_time;
        vault.total_yield_earned = vault.total_yield_earned + annualized_yield_rate;

        event::emit(YieldHarvested {
            amount: harvest_amount,
            yield_rate: annualized_yield_rate,
        });
    };
}

public fun pause(
    vault: &mut Vault,
    _manager_cap: &ManagerCap,
) {
    vault.is_paused = true;
    event::emit(VaultPaused { paused: true });
}

public fun unpause(
    vault: &mut Vault,
    _manager_cap: &ManagerCap,
) {
    vault.is_paused = false;
    event::emit(VaultPaused { paused: false });
}

public fun emergency_withdraw(
    _vault: &mut Vault,
    _manager_cap: &ManagerCap,
    amount: u64,
    recipient: address,
    _ctx: &mut TxContext
) {
    event::emit(EmergencyWithdrawal {
        token: @0x0,
        amount,
        recipient,
    });
}

// View functions
public fun get_current_apy(vault: &Vault): u64 {
    if (option::is_none(&vault.current_strategy)) {
        return 0
    };

    let strategy = option::borrow(&vault.current_strategy);
    if (!strategy.active || strategy.expected_yield == 0) {
        return 0
    };

    let current_apy = strategy.expected_yield;
    (current_apy * (BASIS_POINTS - PROTOCOL_FEE)) / BASIS_POINTS
}

public fun get_projected_yield(
    vault: &Vault,
    amount: u64,
    days: u64
): u64 {
    let apy = get_current_apy(vault);
    (amount * apy * days) / (BASIS_POINTS * 365)
}

public fun get_vault_info(vault: &Vault): (u64, u64, u64, bool) {
    (
        balance::value(&vault.usdc_balance),
        balance::value(&vault.susdc_balance),
        vault.total_yield_earned,
        vault.is_paused
    )
}

// Internal helper functions
fun calculate_shares_to_mint(
    vault: &Vault,
    deposit_amount: u64
): u64 {
    let total_supply = balance::value(&vault.susdc_balance);
    let total_assets = balance::value(&vault.usdc_balance) + get_deployed_assets_value(vault);

    if (total_supply == 0 || total_assets == 0) {
        deposit_amount
    } else {
        (deposit_amount * total_supply) / total_assets
    }
}

fun calculate_assets_to_withdraw(
    vault: &Vault,
    shares_to_burn: u64
): u64 {
    let total_supply = balance::value(&vault.susdc_balance);
    let total_assets = balance::value(&vault.usdc_balance) + get_deployed_assets_value(vault);

    if (total_supply == 0) {
        0
    } else {
        (shares_to_burn * total_assets) / total_supply
    }
}

fun get_deployed_assets_value(vault: &Vault): u64 {
    if (option::is_none(&vault.current_strategy)) {
        return 0
    };

    let strategy = option::borrow(&vault.current_strategy);
    if (!strategy.active) {
        return 0
    };

    strategy.deployed_amount
}

fun execute_user_strategy(
    vault: &mut Vault,
    amount: u64,
) {
    if (option::is_some(&vault.current_strategy)) {
        let strategy_active = {
            let strategy = option::borrow(&vault.current_strategy);
            strategy.active
        };
        
        if (strategy_active) {
            let amount_to_deploy = (amount * PROTOCOL_WITHDRAW_PERCENT) / BASIS_POINTS;
            deploy_to_protocol(vault, amount_to_deploy);
        };
    };
}

fun handle_strategy_transition(
    vault: &mut Vault,
) {
    if (option::is_some(&vault.previous_strategy)) {
        let (should_withdraw, prev_protocol, prev_token, prev_deployed) = {
            let prev_strategy = option::borrow(&vault.previous_strategy);
            (prev_strategy.active && prev_strategy.deployed_amount > 0,
             prev_strategy.protocol,
             prev_strategy.target_token,
             prev_strategy.deployed_amount)
        };
        
        if (should_withdraw) {
            event::emit(StrategyFundsWithdrawn {
                protocol: prev_protocol,
                token: prev_token,
                amount: prev_deployed,
            });
        };
    };

    if (option::is_some(&vault.current_strategy)) {
        let vault_balance = balance::value(&vault.usdc_balance);
        if (vault_balance > 0) {
            let allocation = {
                let strategy = option::borrow(&vault.current_strategy);
                strategy.allocation
            };
            let amount_to_deploy = (vault_balance * allocation) / BASIS_POINTS;
            deploy_to_protocol(vault, amount_to_deploy);
        };
    };
}

fun handle_protocol_withdrawal(
    vault: &mut Vault,
    assets_needed: u64,
) {
    if (option::is_some(&vault.current_strategy)) {
        let (should_withdraw, withdrawal_amount, protocol, token) = {
            let strategy = option::borrow(&vault.current_strategy);
            let withdrawal_amount = if (strategy.deployed_amount < assets_needed) {
                strategy.deployed_amount
            } else {
                assets_needed
            };
            
            (strategy.active && strategy.deployed_amount > 0,
             withdrawal_amount,
             strategy.protocol,
             strategy.target_token)
        };
        
        if (should_withdraw) {
            let strategy = option::borrow_mut(&mut vault.current_strategy);
            strategy.deployed_amount = strategy.deployed_amount - withdrawal_amount;
            
            event::emit(StrategyFundsWithdrawn {
                protocol,
                token,
                amount: withdrawal_amount,
            });
        };
    };
}

fun deploy_to_protocol(
    vault: &mut Vault,
    amount: u64,
) {
    if (amount > 0 && option::is_some(&vault.current_strategy)) {
        let (protocol, token) = {
            let strategy = option::borrow(&vault.current_strategy);
            (strategy.protocol, strategy.target_token)
        };
        
        let current_strategy = option::borrow_mut(&mut vault.current_strategy);
        current_strategy.deployed_amount = current_strategy.deployed_amount + amount;

        event::emit(StrategyFundsDeployed {
            protocol,
            token,
            amount,
        });
    };
}

// Capability transfer functions
public fun transfer_admin_cap(admin_cap: AdminCap, recipient: address) {
    transfer::public_transfer(admin_cap, recipient);
}

public fun transfer_manager_cap(manager_cap: ManagerCap, recipient: address) {
    transfer::public_transfer(manager_cap, recipient);
}

public fun transfer_ai_agent_cap(ai_agent_cap: AIAgentCap, recipient: address) {
    transfer::public_transfer(ai_agent_cap, recipient);
}

// Test helper functions - hanya tersedia saat testing
#[test_only]
public fun test_init(ctx: &mut TxContext) {
    let otw = USDC_VAULT {};
    init(otw, ctx);
}

#[test_only]
public fun create_test_usdc_vault_otw(): USDC_VAULT {
    USDC_VAULT {}
}

// Helper function untuk testing deposit tanpa event emission
#[test_only]
public fun test_deposit(
    vault: &mut Vault,
    usdc_amount: u64,
    _recipient: address,
    ctx: &mut TxContext
): Coin<USDC_VAULT> {    assert!(!vault.is_paused, EVaultPaused);
    assert!(usdc_amount > 0, EZeroAmount);

    // Simulate adding USDC to vault balance
    let usdc_balance = balance::create_for_testing<MOCK_USDC>(usdc_amount);
    balance::join(&mut vault.usdc_balance, usdc_balance);

    let shares_to_mint = calculate_shares_to_mint(vault, usdc_amount);
    let susdc_coins = mint(&mut vault.treasury_cap, shares_to_mint, ctx);

    let tracking_balance = mint_balance(&mut vault.treasury_cap, shares_to_mint);
    balance::join(&mut vault.susdc_balance, tracking_balance);

    execute_user_strategy(vault, usdc_amount);

    susdc_coins
}

// Helper function untuk testing withdraw
#[test_only]
public fun test_withdraw(
    vault: &mut Vault,
    susdc_amount: u64,
    ctx: &mut TxContext
): Coin<MOCK_USDC> {
    assert!(!vault.is_paused, EVaultPaused);
    assert!(susdc_amount > 0, EZeroAmount);

    let assets_to_withdraw = calculate_assets_to_withdraw(vault, susdc_amount);
    handle_protocol_withdrawal(vault, assets_to_withdraw);

    // Update tracking balance - split and burn the withdrawn amount
    let withdrawn_balance = balance::split(&mut vault.susdc_balance, susdc_amount);
    burn(&mut vault.treasury_cap, from_balance(withdrawn_balance, ctx));

    let usdc_balance = balance::split(&mut vault.usdc_balance, assets_to_withdraw);
    coin::from_balance(usdc_balance, ctx)
}

// Helper function untuk mendapatkan vault stats
#[test_only]
public fun get_vault_stats(vault: &Vault): (u64, u64, u64, bool, bool) {
    let (usdc_balance, susdc_balance, total_yield, is_paused) = get_vault_info(vault);
    let has_strategy = option::is_some(&vault.current_strategy);
    (usdc_balance, susdc_balance, total_yield, is_paused, has_strategy)
}

// Helper function untuk mendapatkan strategy info
#[test_only]
public fun get_strategy_info(vault: &Vault): (address, address, u64, u64, bool) {
    assert!(option::is_some(&vault.current_strategy), ENoActiveStrategy);
    let strategy = option::borrow(&vault.current_strategy);
    (
        strategy.target_token,
        strategy.protocol,
        strategy.allocation,
        strategy.expected_yield,
        strategy.active
    )
}