module password_manager::seal {
    use sui::object::{UID, ID};
    use sui::object; // gives the 'object::new' and 'object::id' helpers
    use sui::tx_context::sender;
    use sui::transfer;
    use std::vector;

    public struct Seal has key {
        id: UID,
        owner: address,
    }

    public fun create(owner: address, ctx: &mut TxContext): Seal {
        Seal { id: object::new(ctx), owner }
    }

    public entry fun mint_to_sender(ctx: &mut TxContext) {
        let s_owner = sender(ctx);
        let s = create(s_owner, ctx);
        transfer::transfer(s, s_owner);
    }

    public fun assert_owner(seal: &Seal, caller: address) {
        assert!(seal.owner == caller, 0);
    }

    public fun id_of(seal: &Seal): ID {
        object::id(seal)
    }

    public entry fun transfer_seal(seal: Seal, recipient: address, _ctx: &mut TxContext) {
        transfer::transfer(seal, recipient);
    }
}