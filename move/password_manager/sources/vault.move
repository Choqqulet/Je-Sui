module password_manager::vault {
    use sui::object::UID;
    use sui::tx_context::TxContext;

    use password_manager::seal;

    public struct Vault has key, store {
        id: UID,
        owner: address,
        label: vector<u8>,
        blob_id: vector<u8>,
        seal_owner: address,
    }

    /// Return the created Vault so tests / callers can mutate & assert on it.
    public entry fun create_vault(
        label: vector<u8>,
        blob_id: vector<u8>,
        presented_seal: &seal::Seal,
        ctx: &mut TxContext
    ): Vault {
        let sender = sui::tx_context::sender(ctx);
        // Require caller to own the seal
        seal::assert_owner(presented_seal, sender);

        Vault {
            id: sui::object::new(ctx),
            owner: sender,
            label,
            blob_id,
            seal_owner: sender,
        }
    }

    public entry fun update_vault(
        v: &mut Vault,
        new_blob_id: vector<u8>,
        presented_seal: &seal::Seal,
        ctx: &mut TxContext
    ) {
        let sender = sui::tx_context::sender(ctx);
        // Same owner must present their seal
        assert!(sender == v.owner, 1);
        seal::assert_owner(presented_seal, sender);
        v.blob_id = new_blob_id;
    }

    // Accessor for tests / frontend
    public fun get_blob_id(v: &Vault): vector<u8> { v.blob_id }
}