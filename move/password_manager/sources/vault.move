module password_manager::vault {
    use sui::event;
    use sui::object::{UID, new};
    use sui::tx_context::{TxContext, sender};
    use sui::transfer;
    use password_manager::seal;

    public struct Vault has key, store {
        id: UID,
        owner: address,
        label: vector<u8>,
        blob_id: vector<u8>,
    }

    public entry fun create_vault(label: vector<u8>, blob_id: vector<u8>, ctx: &mut TxContext) {
        let v = Vault { id: new(ctx), owner: sender(ctx), label, blob_id };
        transfer::transfer(v, sender(ctx));
    }

    public entry fun update_vault(v: &mut Vault, new_blob_id: vector<u8>, s: &seal::Seal, ctx: &TxContext) {
        seal::assert_owner(s, sender(ctx));
        v.blob_id = new_blob_id;
    }

    // Allow other modules in this package (policy.move) to call this.
    public(package) fun apply_update(v: &mut Vault, new_blob_id: vector<u8>) {
        v.blob_id = new_blob_id;
    }

    // Public getter to avoid reading private field outside this module.
    public fun owner_of(v: &Vault): address {
        v.owner
    }
}
