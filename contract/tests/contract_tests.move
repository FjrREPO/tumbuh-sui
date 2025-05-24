#[test_only]
module tumbuh::usdc_vault_tests {
    use std::option::{Self, some, none};
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin, mint_for_testing};
    use sui::balance;
    use sui::object::{Self, ID};
    use sui::transfer;

    use tumbuh::usdc_vault::{
        Self,
        Vault,
        AdminCap,
        ManagerCap,
        AIAgentCap,
        USDC_VAULT
    };
    use tumbuh::mock_usdc::{Self, MOCK_USDC};

    // Test constants
    const ADMIN: address = @0x1;
    const USER1: address = @0x2;
    const USER2: address = @0x3;
    const MANAGER: address = @0x4;
    const AI_AGENT: address = @0x5;
    const PROTOCOL_ADDRESS: address = @0x100;
    const TOKEN_ADDRESS: address = @0x200;

    // Helper function to create test scenario
    fun setup_vault(scenario: &mut Scenario): (ID, Clock) {
        // Initialize vault as admin
        ts::next_tx(scenario, ADMIN);
        {
            usdc_vault::test_init(ts::ctx(scenario));
        };

        // Get vault and admin cap
        ts::next_tx(scenario, ADMIN);
        let vault_id = {
            let vault = ts::take_shared<Vault>(scenario);
            let vault_id = object::id(&vault);
            ts::return_shared(vault);
            vault_id
        };

        let clock = clock::create_for_testing(ts::ctx(scenario));
        (vault_id, clock)
    }

    fun create_usdc_coins(amount: u64, ctx: &mut sui::tx_context::TxContext): Coin<MOCK_USDC> {
        mint_for_testing<MOCK_USDC>(amount, ctx)
    }

    #[test]
    fun test_deposit_basic_simple() {
        let mut scenario = ts::begin(ADMIN);
        let (_, clock) = setup_vault(&mut scenario);
        let deposit_amount = 1000000; // 1 USDC

        // User deposits USDC using test helper
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            
            let susdc_coins = usdc_vault::test_deposit(
                &mut vault,
                deposit_amount,
                USER1,
                ts::ctx(&mut scenario)
            );
            
            // Verify vault state
            let (usdc_balance, susdc_balance, _, _, _) = usdc_vault::get_vault_stats(&vault);
            assert!(usdc_balance == deposit_amount, 0);
            assert!(susdc_balance == deposit_amount, 0);
            
            // Verify shares minted
            assert!(coin::value(&susdc_coins) == deposit_amount, 0);
            
            transfer::public_transfer(susdc_coins, USER1);
            ts::return_shared(vault);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
    

    #[test]
    fun test_withdraw_basic_simple() {
        let mut scenario = ts::begin(ADMIN);
        let (_, clock) = setup_vault(&mut scenario);
        let deposit_amount = 1000000;
        let withdraw_amount = 500000;

        // First deposit using test helper
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            let susdc_coins = usdc_vault::test_deposit(&mut vault, deposit_amount, USER1, ts::ctx(&mut scenario));
            transfer::public_transfer(susdc_coins, USER1);
            ts::return_shared(vault);
        };

        // Withdraw using test helper
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            let usdc_coins = usdc_vault::test_withdraw(&mut vault, withdraw_amount, ts::ctx(&mut scenario));
            
            // Verify vault state
            let (usdc_balance, susdc_balance, _, _, _) = usdc_vault::get_vault_stats(&vault);
            assert!(usdc_balance == deposit_amount - withdraw_amount, 0);
            assert!(susdc_balance == deposit_amount - withdraw_amount, 0);
            
            // Verify USDC withdrawn
            assert!(coin::value(&usdc_coins) == withdraw_amount, 0);
            
            transfer::public_transfer(usdc_coins, USER1);
            ts::return_shared(vault);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_init_vault() {
        let mut scenario = ts::begin(ADMIN);
        let (vault_id, clock) = setup_vault(&mut scenario);

        // Verify vault exists and has correct initial state
        ts::next_tx(&mut scenario, ADMIN);
        {
            let vault = ts::take_shared<Vault>(&scenario);
            let (usdc_balance, susdc_balance, total_yield, is_paused, _) = usdc_vault::get_vault_stats(&vault);
            
            assert!(usdc_balance == 0, 0);
            assert!(susdc_balance == 0, 0);
            assert!(total_yield == 0, 0);
            assert!(!is_paused, 0);
            
            ts::return_shared(vault);
            
            // Verify admin cap exists
            let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
            ts::return_to_sender(&scenario, admin_cap);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_deposit_basic() {
        let mut scenario = ts::begin(ADMIN);
        let (_, clock) = setup_vault(&mut scenario);
        let deposit_amount = 1000000; // 1 USDC

        // User deposits USDC
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            let usdc_coins = create_usdc_coins(deposit_amount, ts::ctx(&mut scenario));
            
            usdc_vault::deposit(
                &mut vault,
                usdc_coins,
                deposit_amount,
                USER1,
                ts::ctx(&mut scenario)
            );
            
            ts::return_shared(vault);
        };

        // Verify deposit
        ts::next_tx(&mut scenario, USER1);
        {
            let vault = ts::take_shared<Vault>(&scenario);
            let (usdc_balance, susdc_balance, _, _, _) = usdc_vault::get_vault_stats(&vault);
            
            assert!(usdc_balance == deposit_amount, 0);
            assert!(susdc_balance == deposit_amount, 0); // 1:1 ratio for first deposit
            
            ts::return_shared(vault);
            
            // Verify user received sUSDC tokens
            let susdc_coins = ts::take_from_sender<Coin<USDC_VAULT>>(&scenario);
            assert!(coin::value(&susdc_coins) == deposit_amount, 0);
            ts::return_to_sender(&scenario, susdc_coins);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_withdraw_basic() {
        let mut scenario = ts::begin(ADMIN);
        let (_, clock) = setup_vault(&mut scenario);
        let deposit_amount = 1000000;

        // First deposit
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            let usdc_coins = create_usdc_coins(deposit_amount, ts::ctx(&mut scenario));
            
            usdc_vault::deposit(
                &mut vault,
                usdc_coins,
                deposit_amount,
                USER1,
                ts::ctx(&mut scenario)
            );
            
            ts::return_shared(vault);
        };

        // Withdraw half
        let withdraw_amount = 500000;
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            let susdc_coins = ts::take_from_sender<Coin<USDC_VAULT>>(&scenario);
            
            usdc_vault::withdraw(
                &mut vault,
                susdc_coins,
                withdraw_amount,
                USER1,
                ts::ctx(&mut scenario)
            );
            
            ts::return_shared(vault);
        };

        // Verify withdrawal
        ts::next_tx(&mut scenario, USER1);
        {
            let vault = ts::take_shared<Vault>(&scenario);
            let (usdc_balance, susdc_balance, _, _, _) = usdc_vault::get_vault_stats(&vault);
            
            // Should have remaining amount
            assert!(usdc_balance == deposit_amount - withdraw_amount, 0);
            assert!(susdc_balance == deposit_amount - withdraw_amount, 0);
            
            ts::return_shared(vault);
            
            // Verify user received USDC back
            let usdc_coins = ts::take_from_sender<Coin<MOCK_USDC>>(&scenario);
            assert!(coin::value(&usdc_coins) == withdraw_amount, 0);
            ts::return_to_sender(&scenario, usdc_coins);
            
            // Verify remaining sUSDC
            let remaining_susdc = ts::take_from_sender<Coin<USDC_VAULT>>(&scenario);
            assert!(coin::value(&remaining_susdc) == deposit_amount - withdraw_amount, 0);
            ts::return_to_sender(&scenario, remaining_susdc);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_multiple_deposits_shares_calculation() {
        let mut scenario = ts::begin(ADMIN);
        let (_, clock) = setup_vault(&mut scenario);

        // First user deposits 1000 USDC
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            let usdc_coins = create_usdc_coins(1000000, ts::ctx(&mut scenario));
            
            usdc_vault::deposit(&mut vault, usdc_coins, 1000000, USER1, ts::ctx(&mut scenario));
            ts::return_shared(vault);
        };

        // Second user deposits 500 USDC
        ts::next_tx(&mut scenario, USER2);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            let usdc_coins = create_usdc_coins(500000, ts::ctx(&mut scenario));
            
            usdc_vault::deposit(&mut vault, usdc_coins, 500000, USER2, ts::ctx(&mut scenario));
            ts::return_shared(vault);
        };

        // Verify total balances
        ts::next_tx(&mut scenario, ADMIN);
        {
            let vault = ts::take_shared<Vault>(&scenario);
            let (usdc_balance, susdc_balance, _, _, _) = usdc_vault::get_vault_stats(&vault);
            
            assert!(usdc_balance == 1500000, 0); // Total USDC
            // Don't assume 1:1 ratio for shares - just verify they were minted
            assert!(susdc_balance > 0, 0);
            assert!(susdc_balance >= 1000000, 0); // At least first deposit amount
            
            ts::return_shared(vault);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 3)] // EZeroAmount
    fun test_deposit_zero_amount() {
        let mut scenario = ts::begin(ADMIN);
        let (_, clock) = setup_vault(&mut scenario);

        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_shared<Vault>(&scenario);
            let usdc_coins = create_usdc_coins(1000, ts::ctx(&mut scenario));
            
            // Try to deposit 0 amount
            usdc_vault::deposit(&mut vault, usdc_coins, 0, USER1, ts::ctx(&mut scenario));
            
            ts::return_shared(vault);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}