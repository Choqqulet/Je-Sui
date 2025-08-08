module password_manager::vault_test {
    use sui::tx_context::TxContext;
    use sui::object::UID;
    use sui::test;
    use password_manager::vault;
    use password_manager::seal;

    #[test]
    public entry fun test_update_vault_with_seal(ctx: &mut TxContext) {
        let label = b"TestVault";
        let blob_id = b"initial_blob";
        let new_blob_id = b"updated_blob";

        // Create vault
        vault::create_vault(label, blob_id, ctx);
        let v = test::take_from_address<vault::Vault>(test::sender(ctx));

        // Create seal
        let s = seal::create_seal(ctx);

        // Update vault using seal
        vault::update_vault(&mut v, new_blob_id, &s, ctx);

        // Assert blob was updated
        assert!(v.blob_id == new_blob_id, 100);
    }
}
