module tumbuh::agent;

use std::option::none;
use sui::clock::{Self, Clock};
use sui::event;
use sui::table::{Self, Table};

use tumbuh::usdc_vault::{Self, Vault, AIAgentCap};

// ===== Constants =====
const MAX_ALLOCATION: u64 = 10000;

// ===== Errors =====
const EProtocolAlreadyMonitored: u64 = 1;
const EProtocolNotMonitored: u64 = 2;
const ENoProtocolsMonitored: u64 = 3;
const ENoLiquidity: u64 = 4;
const EUnauthorized: u64 = 5;
const EProtocolNotFound: u64 = 7;

// ===== Structs =====
public struct Agent has key {
    id: UID,
    vault_id: Option<ID>,
    ai_agent_cap: Option<AIAgentCap>,
    monitored_protocols: vector<ProtocolYield>,
    is_monitored: Table<ProtocolKey, bool>,
    admin: address,
    ai_operators: Table<address, bool>,
    is_vault_connected: bool,
}

public struct ProtocolYield has store, copy, drop {
    protocol: address,
    token: address,
    apy: u64,
    liquidity: u64,
    last_updated: u64,
}

public struct ProtocolKey has store, copy, drop {
    protocol: address,
    token: address,
}

public struct AgentAdminCap has key, store {
    id: UID,
    agent_id: ID,
}

// ===== Events =====
public struct AgentInitialized has copy, drop {
    agent_id: ID,
    admin: address,
}

public struct VaultConnected has copy, drop {
    agent_id: ID,
    vault_id: ID,
}

public struct ProtocolAdded has copy, drop {
    protocol: address,
    token: address,
    apy: u64,
}

public struct ProtocolRemoved has copy, drop {
    protocol: address,
    token: address,
}

public struct YieldUpdated has copy, drop {
    protocol: address,
    token: address,
    old_apy: u64,
    new_apy: u64,
}

public struct StrategyExecuted has copy, drop {
    target_token: address,
    protocol: address,
    allocation: u64,
    expected_yield: u64,
}

public struct AIOperatorAdded has copy, drop {
    operator: address,
}

public struct AIOperatorRemoved has copy, drop {
    operator: address,
}

// ===== Init Function =====
fun init(ctx: &mut TxContext) {
    // Create admin capability for the deployer
    let admin = tx_context::sender(ctx);
    
    let agent_id = object::new(ctx);
    let agent_uid = object::uid_to_inner(&agent_id);
    
    let admin_cap = AgentAdminCap {
        id: object::new(ctx),
        agent_id: agent_uid,
    };

    let mut ai_operators = table::new(ctx);
    table::add(&mut ai_operators, admin, true);

    let agent = Agent {
        id: agent_id,
        vault_id: option::none(),
        ai_agent_cap: option::none(),
        monitored_protocols: vector::empty(),
        is_monitored: table::new(ctx),
        admin,
        ai_operators,
        is_vault_connected: false,
    };

    // Emit initialization event
    event::emit(AgentInitialized {
        agent_id: agent_uid,
        admin,
    });

    // Transfer the admin cap to the deployer
    transfer::public_transfer(admin_cap, admin);
    // Share the agent object
    transfer::share_object(agent);
}

// ===== Entry Functions =====
entry fun connect_to_vault(
    agent: &mut Agent,
    _admin_cap: &AgentAdminCap,
    vault_id: ID,
    ai_agent_cap: AIAgentCap,
) {
    // Assert vault is not already connected
    assert!(!agent.is_vault_connected, EProtocolAlreadyMonitored);
    
    // Use option::fill to set the values
    option::fill(&mut agent.vault_id, vault_id);
    option::fill(&mut agent.ai_agent_cap, ai_agent_cap);
    agent.is_vault_connected = true;
    
    // Emit vault connection event
    event::emit(VaultConnected {
        agent_id: object::uid_to_inner(&agent.id),
        vault_id,
    });
}

entry fun remove_ai_operator(
    agent: &mut Agent,
    _admin_cap: &AgentAdminCap,
    operator: address,
) {
    assert!(table::contains(&agent.ai_operators, operator), EUnauthorized);
    *table::borrow_mut(&mut agent.ai_operators, operator) = false;

    event::emit(AIOperatorRemoved { operator });
}

entry fun add_protocol(
    agent: &mut Agent,
    vault: &mut Vault,
    protocol: address,
    token: address,
    initial_apy: u64,
    initial_liquidity: u64,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // Check authorization
    let sender = tx_context::sender(ctx);
    assert!(table::contains(&agent.ai_operators, sender) && 
            *table::borrow(&agent.ai_operators, sender), EUnauthorized);

    // Check vault connection
    assert!(agent.is_vault_connected, ENoLiquidity);

    let protocol_key = ProtocolKey { protocol, token };
    assert!(!table::contains(&agent.is_monitored, protocol_key), EProtocolAlreadyMonitored);

    // Validate liquidity
    assert!(initial_liquidity > 0, ENoLiquidity);

    // Add protocol
    let protocol_yield = ProtocolYield {
        protocol,
        token,
        apy: initial_apy,
        liquidity: initial_liquidity,
        last_updated: clock::timestamp_ms(clock),
    };

    vector::push_back(&mut agent.monitored_protocols, protocol_yield);
    table::add(&mut agent.is_monitored, protocol_key, true);

    // Auto-propose strategy if this is the first or best protocol
    propose_user_strategy_internal(agent, vault, clock, ctx);

    event::emit(ProtocolAdded {
        protocol,
        token,
        apy: initial_apy,
    });
}

entry fun remove_protocol(
    agent: &mut Agent,
    protocol: address,
    token: address,
    ctx: &mut TxContext
) {
    // Check authorization
    let sender = tx_context::sender(ctx);
    assert!(table::contains(&agent.ai_operators, sender) && 
            *table::borrow(&agent.ai_operators, sender), EUnauthorized);

    let protocol_key = ProtocolKey { protocol, token };
    assert!(table::contains(&agent.is_monitored, protocol_key), EProtocolNotMonitored);

    // Remove from vector
    let protocols_len = vector::length(&agent.monitored_protocols);
    let mut i = 0;
    let mut found = false;
    
    while (i < protocols_len) {
        let current_protocol = vector::borrow(&agent.monitored_protocols, i);
        if (current_protocol.protocol == protocol && current_protocol.token == token) {
            vector::remove(&mut agent.monitored_protocols, i);
            found = true;
            break
        };
        i = i + 1;
    };

    assert!(found, EProtocolNotFound);
    
    table::remove(&mut agent.is_monitored, protocol_key);

    event::emit(ProtocolRemoved { protocol, token });
}

entry fun update_yield(
    agent: &mut Agent,
    protocol: address,
    token: address,
    new_apy: u64,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // Check authorization
    let sender = tx_context::sender(ctx);
    assert!(table::contains(&agent.ai_operators, sender) && 
            *table::borrow(&agent.ai_operators, sender), EUnauthorized);

    let protocol_key = ProtocolKey { protocol, token };
    assert!(table::contains(&agent.is_monitored, protocol_key), EProtocolNotMonitored);

    // Update yield
    let protocols_len = vector::length(&agent.monitored_protocols);
    let mut i = 0;
    let mut old_apy = 0;
    
    while (i < protocols_len) {
        let protocol_yield = vector::borrow_mut(&mut agent.monitored_protocols, i);
        if (protocol_yield.protocol == protocol && protocol_yield.token == token) {
            old_apy = protocol_yield.apy;
            protocol_yield.apy = new_apy;
            protocol_yield.last_updated = clock::timestamp_ms(clock);
            break
        };
        i = i + 1;
    };

    event::emit(YieldUpdated {
        protocol,
        token,
        old_apy,
        new_apy,
    });
}

entry fun propose_strategy(
    agent: &Agent,
    vault: &mut Vault,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // Check authorization
    let sender = tx_context::sender(ctx);
    assert!(table::contains(&agent.ai_operators, sender) && 
            *table::borrow(&agent.ai_operators, sender), EUnauthorized);

    // Check vault connection
    assert!(agent.is_vault_connected, ENoLiquidity);

    let best_protocol = find_highest_yield_protocol(agent);
    assert!(best_protocol.liquidity > 0, ENoLiquidity);

    // Update vault strategy
    usdc_vault::update_strategy(
        vault,
        option::borrow(&agent.ai_agent_cap),
        best_protocol.token,
        best_protocol.protocol,
        MAX_ALLOCATION,
        best_protocol.apy,
        clock,
        ctx
    );

    event::emit(StrategyExecuted {
        target_token: best_protocol.token,
        protocol: best_protocol.protocol,
        allocation: MAX_ALLOCATION,
        expected_yield: best_protocol.apy,
    });
}

entry fun execute_strategy(
    agent: &Agent,
    vault: &mut Vault,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // Check authorization
    let sender = tx_context::sender(ctx);
    assert!(table::contains(&agent.ai_operators, sender) && 
            *table::borrow(&agent.ai_operators, sender), EUnauthorized);

    // Check vault connection
    assert!(agent.is_vault_connected, ENoLiquidity);

    usdc_vault::execute_strategy(vault, option::borrow(&agent.ai_agent_cap), clock, ctx);
}

entry fun harvest_yield(
    agent: &Agent,
    vault: &mut Vault,
    harvest_amount: u64,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // Check authorization
    let sender = tx_context::sender(ctx);
    assert!(table::contains(&agent.ai_operators, sender) && 
            *table::borrow(&agent.ai_operators, sender), EUnauthorized);

    // Check vault connection
    assert!(agent.is_vault_connected, ENoLiquidity);

    usdc_vault::harvest_yield(vault, option::borrow(&agent.ai_agent_cap), harvest_amount, clock, ctx);
}

entry fun transfer_agent_admin_cap(admin_cap: AgentAdminCap, recipient: address) {
    transfer::public_transfer(admin_cap, recipient);
}

// ===== View Functions (kept as public for queries) =====
public fun get_monitored_protocol_length(agent: &Agent): u64 {
    vector::length(&agent.monitored_protocols)
}

public fun get_monitored_protocol(agent: &Agent, index: u64): &ProtocolYield {
    vector::borrow(&agent.monitored_protocols, index)
}

public fun is_protocol_monitored(agent: &Agent, protocol: address, token: address): bool {
    let protocol_key = ProtocolKey { protocol, token };
    table::contains(&agent.is_monitored, protocol_key)
}

public fun get_vault_id(agent: &Agent): Option<ID> {
    agent.vault_id
}

public fun has_vault_connection(agent: &Agent): bool {
    agent.is_vault_connected
}

public fun is_ai_operator(agent: &Agent, operator: address): bool {
    table::contains(&agent.ai_operators, operator) && 
    *table::borrow(&agent.ai_operators, operator)
}

public fun find_highest_yield_protocol(agent: &Agent): ProtocolYield {
    assert!(vector::length(&agent.monitored_protocols) > 0, ENoProtocolsMonitored);

    let mut highest_apy = 0;
    let mut best_protocol = *vector::borrow(&agent.monitored_protocols, 0);

    let protocols_len = vector::length(&agent.monitored_protocols);
    let mut i = 0;
    
    while (i < protocols_len) {
        let protocol = vector::borrow(&agent.monitored_protocols, i);
        
        if (protocol.apy > highest_apy && protocol.liquidity > 0) {
            highest_apy = protocol.apy;
            best_protocol = *protocol;
        };
        i = i + 1;
    };

    best_protocol
}

// ===== Internal Functions =====
fun propose_user_strategy_internal(
    agent: &Agent,
    vault: &mut Vault,
    clock: &Clock,
    ctx: &mut TxContext
): bool {
    // Check if vault is connected before proceeding
    if (!agent.is_vault_connected) {
        return false
    };

    let best_protocol = find_highest_yield_protocol(agent);
    assert!(best_protocol.liquidity > 0, ENoLiquidity);

    usdc_vault::update_strategy(
        vault,
        option::borrow(&agent.ai_agent_cap),
        best_protocol.token,
        best_protocol.protocol,
        MAX_ALLOCATION,
        best_protocol.apy,
        clock,
        ctx
    );

    true
}