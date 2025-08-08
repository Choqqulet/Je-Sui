module password_manager::seal {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    /// A capability token that can be used to authorize sensitive actions
    struct Seal has key {
        id: UID,
        owner: address,
    }

    /// Create a new Seal and transfer it to the caller
    public entry fun create_seal(ctx: &mut TxContext): Seal {
        let id = object::new(ctx);
        let owner = tx_context::sender(ctx);
        Seal { id, owner }
    }

    /// Check if the caller owns the Seal
    public fun assert_owner(seal: &Seal, caller: address) {
        assert!(seal.owner == caller, 0);
    }

    /// Optional: Transfer Seal to another address
    public entry fun transfer_seal(seal: Seal, recipient: address, ctx: &mut TxContext) {
        sui::transfer::transfer(seal, recipient);
    }
}
