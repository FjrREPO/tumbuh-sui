module tumbuh::mock_usdc;

use sui::coin::{Self, TreasuryCap, create_currency};
use sui::object::{Self, UID, new};
use sui::transfer::{public_transfer, public_freeze_object, share_object};
use sui::tx_context::{Self, TxContext};
use std::option::{Self, Option};
use sui::url;

public struct MOCK_USDC has drop {}

public struct TreasuryStore has key, store { // Added 'store' ability
    id: UID,
    cap: TreasuryCap<MOCK_USDC>,
}

fun init(witness: MOCK_USDC, ctx: &mut TxContext) {
    let (treasury, metadata) = coin::create_currency(
        witness,
        6,
        b"USDC",
        b"USD Coin",
        b"",
        std::option::some(url::new_unsafe_from_bytes(b"https://www.circle.com/en/usdc")),
        ctx
    );

    public_freeze_object(metadata);

    let store = TreasuryStore {
        id: new(ctx),
        cap: treasury,
    };

    // Share the TreasuryStore object globally
    share_object(store);
}
public entry fun mint(
    store: &mut TreasuryStore, // The shared TreasuryStore object is now passed as a mutable reference
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    // Now 'store' is directly available as a mutable reference, no need for borrow_global_mut
    let coin = coin::mint(&mut store.cap, amount, ctx);
    public_transfer(coin, recipient);
}
