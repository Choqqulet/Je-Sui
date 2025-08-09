module password_manager::vault {
    use sui::event;
    use sui::object::{UID, new};
    use sui::tx_context::sender;
    use sui::transfer;
    use password_manager::seal;

    public struct Vault has key, store {
        id: UID,
        owner: address,
        seal_id: ID, // Seal ID for ownership checks
        label: vector<u8>,
        blob_id: vector<u8>,
    }

    public entry fun create_vault(
        label: vector<u8>,
        blob_id: vector<u8>,
        presented_seal: &seal::Seal,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        seal::assert_owner(presented_seal, sender);
        let v = Vault {
            id: object::new(ctx),
            owner: sender,
            seal_id: seal::id_of(presented_seal),
            label,
            blob_id,
        };
        transfer::transfer(v, sender);
    }

    public entry fun update_blob(
        vault: &mut Vault,
        new_blob_id: vector<u8>,
        presented_seal: &seal::Seal,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // 1) ensure the seal is owned by sender
        seal::assert_owner(presented_seal, sender);
        // 2) ensure this is the *right* seal for this vault
        assert!(vault.seal_id == seal::id_of(presented_seal), 1);
        // 3) perform update
        vault.blob_id = new_blob_id;
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
