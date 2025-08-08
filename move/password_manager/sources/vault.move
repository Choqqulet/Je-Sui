module password_manager::vault {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    
    // Since 'seal' package might not exist, I'll create a simple seal struct
    // Replace this with your actual seal implementation
    public struct Sealed has store, copy, drop {
        id: address,
        owner: address,
    }

    public struct Vault has key, store {
        id: UID,
        owner: address,
        label: vector<u8>,
        blob_id: vector<u8>,
        seal: Sealed,
    }

    // Helper functions for seal (replace with your actual seal module functions)
    fun seal(uid: &UID, owner: address): Sealed {
        Sealed {
            id: object::uid_to_address(uid),
            owner,
        }
    }

    fun check(sealed: &Sealed, caller: address) {
        assert!(sealed.owner == caller, 0); // Error code 0 for unauthorized access
    }

    public entry fun create_vault(
        label: vector<u8>,
        blob_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let uid = object::new(ctx);
        let owner = tx_context::sender(ctx);
        let sealed = seal(&uid, owner);

        let vault = Vault {
            id: uid,
            owner,
            label,
            blob_id,
            seal: sealed
        };

        transfer::transfer(vault, owner);
    }

    public fun get_label(v: &Vault): vector<u8> {
        v.label
    }

    public fun get_blob_id(v: &Vault): vector<u8> {
        v.blob_id
    }

    public entry fun update_vault(
        vault: &mut Vault,
        new_blob_id: vector<u8>,
        ctx: &TxContext
    ) {
        let owner = tx_context::sender(ctx);
        check(&vault.seal, owner);
        vault.blob_id = new_blob_id;
    }
}