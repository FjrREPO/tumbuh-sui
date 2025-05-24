module tumbuh::mock_protocol;

use sui::object::{Self, UID};
use sui::tx_context::{TxContext, sender};
use sui::balance::{Self, Balance};
use sui::transfer;
use sui::coin::{Self, Coin};
use sui::clock::{Self, Clock};
use sui::table::{Self, Table};

const ENOT_OWNER: u64 = 0;
const EAPY_MUST_BE_POSITIVE: u64 = 1;
const EAMOUNT_MUST_BE_POSITIVE: u64 = 2;
const EEXCEEDS_MAX_DEPOSIT: u64 = 3;
const ETOTAL_DEPOSIT_LIMIT: u64 = 4;
const EUSER_NOT_VALID: u64 = 5;
const EINSUFFICIENT_BALANCE: u64 = 6;
const ENO_ACTIVE_DEPOSITS: u64 = 7;

public struct UserDetails<phantom Currency> has store {
    amount_staked: u64,
    registration_timestamp: u64,
    is_valid: bool,
}

public struct MockProtocol<phantom Currency> has key {
    id: UID,
    owner: address,
    total_deposits: u64,
    fixed_apy: u64,
    max_deposit: u64,
    users: Table<address, UserDetails<Currency>>,
    treasury: Balance<Currency>,
}

public struct MOCK_PROTOCOL has drop {}

fun init(_witness: MOCK_PROTOCOL, _ctx: &mut TxContext) {}

public entry fun create<Currency>(
    fixed_apy: u64, 
    ctx: &mut TxContext
) {
    assert!(fixed_apy > 0, EAPY_MUST_BE_POSITIVE);
    
    let protocol = MockProtocol {
        id: object::new(ctx),
        owner: sender(ctx),
        total_deposits: 0,
        fixed_apy,
        max_deposit: 18446744073709551615,
        users: table::new(ctx),
        treasury: balance::zero<Currency>(),
    };
    
    transfer::share_object(protocol);
}


public entry fun set_apy<Currency>(
    protocol: &mut MockProtocol<Currency>, 
    new_apy: u64, 
    ctx: &TxContext
) {
    assert!(sender(ctx) == protocol.owner, ENOT_OWNER);
    assert!(new_apy > 0, EAPY_MUST_BE_POSITIVE);
    protocol.fixed_apy = new_apy;
}
public entry fun set_max_deposit<Currency>(
    protocol: &mut MockProtocol<Currency>, 
    new_max: u64, 
    ctx: &TxContext
) {
    assert!(sender(ctx) == protocol.owner, ENOT_OWNER);
    protocol.max_deposit = new_max;
}
public entry fun deposit<Currency>(
    protocol: &mut MockProtocol<Currency>,
    coin: Coin<Currency>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let amount = coin::value(&coin);
    assert!(amount > 0, EAMOUNT_MUST_BE_POSITIVE);
    assert!(amount <= protocol.max_deposit, EEXCEEDS_MAX_DEPOSIT);
    assert!(protocol.total_deposits + amount <= protocol.max_deposit, ETOTAL_DEPOSIT_LIMIT);

    let user_addr = sender(ctx);
    let current_timestamp = clock::timestamp_ms(clock);
    
    if (table::contains(&protocol.users, user_addr)) {
        let user = table::borrow_mut(&mut protocol.users, user_addr);
        user.amount_staked = user.amount_staked + amount;
        user.registration_timestamp = current_timestamp;
        user.is_valid = true;
    } else {

        let user_details = UserDetails {
            amount_staked: amount,
            registration_timestamp: current_timestamp,
            is_valid: true,
        };
        table::add(&mut protocol.users, user_addr, user_details);
    };

    protocol.total_deposits = protocol.total_deposits + amount;

    let coin_balance = coin::into_balance(coin);
    balance::join(&mut protocol.treasury, coin_balance);
}
public entry fun withdraw<Currency>(
    protocol: &mut MockProtocol<Currency>,
    amount: u64,
    ctx: &mut TxContext
) {
    let user_addr = sender(ctx);
    assert!(table::contains(&protocol.users, user_addr), EUSER_NOT_VALID);
    
    let user = table::borrow_mut(&mut protocol.users, user_addr);
    assert!(user.is_valid, EUSER_NOT_VALID);
    assert!(amount <= user.amount_staked, EINSUFFICIENT_BALANCE);
    assert!(amount > 0, EAMOUNT_MUST_BE_POSITIVE);

    user.amount_staked = user.amount_staked - amount;
    if (user.amount_staked == 0) {
        user.is_valid = false;
    };
    
    protocol.total_deposits = protocol.total_deposits - amount;
    
    let withdraw_balance = balance::split(&mut protocol.treasury, amount);
    let withdrawn_coin = coin::from_balance(withdraw_balance, ctx);
    
    transfer::public_transfer(withdrawn_coin, user_addr);
}
public entry fun harvest<Currency>(
    protocol: &mut MockProtocol<Currency>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let user_addr = sender(ctx);
    assert!(table::contains(&protocol.users, user_addr), ENO_ACTIVE_DEPOSITS);
    
    let current_time = clock::timestamp_ms(clock);
    let user = table::borrow_mut(&mut protocol.users, user_addr);
    assert!(user.is_valid, ENO_ACTIVE_DEPOSITS);

    let days_since = (current_time - user.registration_timestamp) / (86400 * 1000);
    let rewards = calculate_reward(user.amount_staked, protocol.fixed_apy, days_since);
    
    user.registration_timestamp = current_time;

    let reward_coin = coin::from_balance(balance::zero<Currency>(), ctx);
    transfer::public_transfer(reward_coin, user_addr);
}

fun calculate_reward(amount: u64, apy: u64, days: u64): u64 {
    (amount * apy * days) / 36500
}

public fun get_staked_amount<Currency>(
    protocol: &MockProtocol<Currency>, 
    user: address
): u64 {
    if (table::contains(&protocol.users, user)) {
        let details = table::borrow(&protocol.users, user);
        details.amount_staked
    } else {
        0
    }
}

public fun project_rewards<Currency>(
    protocol: &MockProtocol<Currency>,
    user: address,
    days: u64
): u64 {
    if (!table::contains(&protocol.users, user)) return 0;
    let details = table::borrow(&protocol.users, user);
    if (!details.is_valid) return 0;
    calculate_reward(details.amount_staked, protocol.fixed_apy, days)
}

public entry fun withdraw_to_owner<Currency>(
    protocol: &mut MockProtocol<Currency>,
    balance: Coin<Currency>,
    ctx: &mut TxContext
) {
    assert!(sender(ctx) == protocol.owner, ENOT_OWNER);
    transfer::public_transfer(balance, protocol.owner)
}

public fun get_owner<Currency>(protocol: &MockProtocol<Currency>): address {
    protocol.owner
}

public fun get_total_deposits<Currency>(protocol: &MockProtocol<Currency>): u64 {
    protocol.total_deposits
}

public fun get_apy<Currency>(protocol: &MockProtocol<Currency>): u64 {
    protocol.fixed_apy
}

public fun get_max_deposit<Currency>(protocol: &MockProtocol<Currency>): u64 {
    protocol.max_deposit
}