#[test_only]
module password_manager::vault_test {
    use sui::tx_context::TxContext;

    use password_manager::seal;
    use password_manager::vault;

    #[test]
    public entry fun test_update_vault_with_seal(ctx: &mut TxContext) {
        let label = b"TestVault";
        let blob_id = b"initial_blob";
        let new_blob_id = b"updated_blob";

        // 1) Create a seal owned by the test sender
        let s = seal::create_seal(ctx);

        // 2) Create a vault with that seal
        // NOTE: create_vault must RETURN Vault for this to work.
        let mut v = vault::create_vault(label, blob_id, &s, ctx);

        // 3) Update the vault using the same seal
        vault::update_vault(&mut v, new_blob_id, &s, ctx);

        // 4) Assert via accessor (don’t reach into private fields)
        assert!(vault::get_blob_id(&v) == new_blob_id, 100);
    }
}