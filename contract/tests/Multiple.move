#[test_only]
module tumbuh::usdc_vault_multiple_tests {
    use std::option;
    use std::vector;
    use sui::test_scenario::{Self, Scenario, next_tx, ctx};
    use sui::coin::{Self, Coin, mint_for_testing};
    use sui::balance;
    use sui::clock::{Self, Clock};
    use sui::test_utils;

    use tumbuh::usdc_vault::{
        Self, 
        Vault, 
        AdminCap, 
        ManagerCap, 
        AIAgentCap, 
        USDC_VAULT,
        test_init,
        deposit_with_vector,
        get_vault_stats
    };
    use tumbuh::mock_usdc::MOCK_USDC;

    // Test addresses
    const ADMIN: address = @0xA11CE;
    const USER1: address = @0xB0B;
    const USER2: address = @0xCAFE;

    // Helper function to create test USDC coins
    fun create_test_usdc_coins(amounts: vector<u64>, ctx: &mut sui::tx_context::TxContext): vector<Coin<MOCK_USDC>> {
        let mut coins = vector::empty<Coin<MOCK_USDC>>();
        let mut i = 0;
        while (i < vector::length(&amounts)) {
            let amount = *vector::borrow(&amounts, i);
            let coin = mint_for_testing<MOCK_USDC>(amount, ctx);
            vector::push_back(&mut coins, coin);
            i = i + 1;
        };
        coins
    }

    #[test]
    fun test_deposit_with_vector_single_coin() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize vault
        test_init(ctx);

        next_tx(&mut scenario, USER1);
        {
            let mut vault = test_scenario::take_shared<Vault>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);

            // Create single coin
            let amounts = vector[1000000]; // 1 USDC
            let coins = create_test_usdc_coins(amounts, ctx);

            // Deposit with vector containing single coin
            deposit_with_vector(
                &mut vault,
                coins,
                1000000, // deposit full amount
                USER1,
                ctx
            );

            // Verify vault state
            let (usdc_balance, susdc_balance, total_yield, is_paused, _has_strategy) = get_vault_stats(&vault);
            assert!(usdc_balance == 1000000, 1);
            assert!(susdc_balance == 1000000, 2); // 1:1 ratio for first deposit
            assert!(total_yield == 0, 3);
            assert!(!is_paused, 4);

            test_scenario::return_shared(vault);
        };

        // Verify user received sUSDC
        next_tx(&mut scenario, USER1);
        {
            let susdc_coin = test_scenario::take_from_address<Coin<USDC_VAULT>>(&scenario, USER1);
            assert!(coin::value(&susdc_coin) == 1000000, 5);
            test_scenario::return_to_address(USER1, susdc_coin);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_deposit_with_vector_multiple_coins() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize vault
        test_init(ctx);

        next_tx(&mut scenario, USER1);
        {
            let mut vault = test_scenario::take_shared<Vault>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);

            // Create multiple coins with different amounts
            let amounts = vector[300000, 400000, 300000]; // Total: 1M USDC
            let coins = create_test_usdc_coins(amounts, ctx);

            // Deposit with vector containing multiple coins
            deposit_with_vector(
                &mut vault,
                coins,
                1000000, // deposit full amount
                USER1,
                ctx
            );

            // Verify vault state
            let (usdc_balance, susdc_balance, _total_yield, _is_paused, _has_strategy) = get_vault_stats(&vault);
            assert!(usdc_balance == 1000000, 1);
            assert!(susdc_balance == 1000000, 2);

            test_scenario::return_shared(vault);
        };

        // Verify user received correct sUSDC amount
        next_tx(&mut scenario, USER1);
        {
            let susdc_coin = test_scenario::take_from_address<Coin<USDC_VAULT>>(&scenario, USER1);
            assert!(coin::value(&susdc_coin) == 1000000, 3);
            test_scenario::return_to_address(USER1, susdc_coin);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_deposit_with_vector_partial_amount() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize vault
        test_init(ctx);

        next_tx(&mut scenario, USER1);
        {
            let mut vault = test_scenario::take_shared<Vault>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);

            // Create coins with more than needed
            let amounts = vector[600000, 700000]; // Total: 1.3M USDC
            let coins = create_test_usdc_coins(amounts, ctx);

            // Deposit only 1M USDC (partial amount)
            deposit_with_vector(
                &mut vault,
                coins,
                1000000, // deposit less than total coins value
                USER1,
                ctx
            );

            // Verify vault received correct amount
            let (usdc_balance, susdc_balance, _total_yield, _is_paused, _has_strategy) = get_vault_stats(&vault);
            assert!(usdc_balance == 1000000, 1);
            assert!(susdc_balance == 1000000, 2);

            test_scenario::return_shared(vault);
        };

        next_tx(&mut scenario, USER1);
        {
            // Verify user received sUSDC
            let susdc_coin = test_scenario::take_from_address<Coin<USDC_VAULT>>(&scenario, USER1);
            assert!(coin::value(&susdc_coin) == 1000000, 3);
            test_scenario::return_to_address(USER1, susdc_coin);

            // Verify user received change back (300000 USDC)
            let change_coin = test_scenario::take_from_address<Coin<MOCK_USDC>>(&scenario, USER1);
            assert!(coin::value(&change_coin) == 300000, 4);
            test_scenario::return_to_address(USER1, change_coin);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = tumbuh::usdc_vault::EZeroAmount)]
    fun test_deposit_with_vector_zero_amount() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize vault
        test_init(ctx);

        next_tx(&mut scenario, USER1);
        {
            let mut vault = test_scenario::take_shared<Vault>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);

            let amounts = vector[1000000];
            let coins = create_test_usdc_coins(amounts, ctx);

            // Should fail with zero amount
            deposit_with_vector(
                &mut vault,
                coins,
                0, // zero amount should fail
                USER1,
                ctx
            );

            test_scenario::return_shared(vault);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = tumbuh::usdc_vault::EZeroAmount)]
    fun test_deposit_with_vector_empty_coins() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize vault
        test_init(ctx);

        next_tx(&mut scenario, USER1);
        {
            let mut vault = test_scenario::take_shared<Vault>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);

            // Empty vector should fail
            let coins = vector::empty<Coin<MOCK_USDC>>();

            deposit_with_vector(
                &mut vault,
                coins,
                1000000,
                USER1,
                ctx
            );

            test_scenario::return_shared(vault);
        };

        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = tumbuh::usdc_vault::EZeroAmount)]
    fun test_deposit_with_vector_insufficient_coins() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize vault
        test_init(ctx);

        next_tx(&mut scenario, USER1);
        {
            let mut vault = test_scenario::take_shared<Vault>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);

            // Coins with insufficient total value
            let amounts = vector[300000, 400000]; // Total: 700k USDC
            let coins = create_test_usdc_coins(amounts, ctx);

            // Try to deposit more than available
            deposit_with_vector(
                &mut vault,
                coins,
                1000000, // More than 700k available
                USER1,
                ctx
            );

            test_scenario::return_shared(vault);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_deposit_with_vector_many_small_coins() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize vault
        test_init(ctx);

        next_tx(&mut scenario, USER1);
        {
            let mut vault = test_scenario::take_shared<Vault>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);

            // Many small coins (simulating fragmented wallet)
            let amounts = vector[100000, 150000, 200000, 250000, 300000]; // Total: 1M USDC
            let coins = create_test_usdc_coins(amounts, ctx);

            deposit_with_vector(
                &mut vault,
                coins,
                1000000,
                USER1,
                ctx
            );

            // Verify vault state
            let (usdc_balance, susdc_balance, _total_yield, _is_paused, _has_strategy) = get_vault_stats(&vault);
            assert!(usdc_balance == 1000000, 1);
            assert!(susdc_balance == 1000000, 2);

            test_scenario::return_shared(vault);
        };

        next_tx(&mut scenario, USER1);
        {
            let susdc_coin = test_scenario::take_from_address<Coin<USDC_VAULT>>(&scenario, USER1);
            assert!(coin::value(&susdc_coin) == 1000000, 3);
            test_scenario::return_to_address(USER1, susdc_coin);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_deposit_with_vector_exact_amount_match() {
        let mut scenario = test_scenario::begin(ADMIN);
        let ctx = test_scenario::ctx(&mut scenario);

        // Initialize vault
        test_init(ctx);

        next_tx(&mut scenario, USER1);
        {
            let mut vault = test_scenario::take_shared<Vault>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);

            // Coins that exactly match deposit amount
            let amounts = vector[400000, 350000, 250000]; // Total: 1M USDC exactly
            let coins = create_test_usdc_coins(amounts, ctx);

            deposit_with_vector(
                &mut vault,
                coins,
                1000000, // Exact match
                USER1,
                ctx
            );

            test_scenario::return_shared(vault);
        };

        // User should only receive sUSDC, no change
        next_tx(&mut scenario, USER1);
        {
            let susdc_coin = test_scenario::take_from_address<Coin<USDC_VAULT>>(&scenario, USER1);
            assert!(coin::value(&susdc_coin) == 1000000, 1);
            test_scenario::return_to_address(USER1, susdc_coin);

            // Should not receive any change back
            assert!(!test_scenario::has_most_recent_for_address<Coin<MOCK_USDC>>(USER1), 2);
        };

        test_scenario::end(scenario);
    }
}