module password_manager::policy {
    use sui::event;
    use sui::object::new;
    use sui::tx_context::{TxContext, sender};
    use sui::transfer::public_transfer;
    use sui::clock::{Clock, timestamp_ms};
    use std::vector;
    use password_manager::vault;

    /// Owner-configurable approval policy (social recovery / guardians).
    public struct Policy has key, store {
        id: UID,
        owner: address,
        guardians: vector<address>,
        threshold: u8,        // e.g., 2 (for 2-of-N)
        timelock_ms: u64,     // e.g., 0 for none
    }

    /// A staged vault update that needs approvals to execute.
    public struct PendingOp has key, store {
        id: UID,
        policy_owner: address,        // bind op to a specific policy owner
        new_blob_id: vector<u8>,      // proposed new Walrus blob id
        approvals: vector<address>,   // guardian addresses who signed off
        created_at: u64,              // timestamp_ms at proposal time
    }

    // ---------------- Policy lifecycle ----------------

    /// Create a policy you own.
    public entry fun create_policy(
        guardians: vector<address>,
        threshold: u8,
        timelock_ms: u64,
        ctx: &mut TxContext
    ) {
        assert!(threshold > 0, 1);
        assert!((threshold as u64) <= vector::length(&guardians), 2);

        let p = Policy {
            id: new(ctx),
            owner: sender(ctx),
            guardians,
            threshold,
            timelock_ms,
        };
        transfer::transfer(p, sender(ctx));
    }

    public entry fun set_threshold(p: &mut Policy, new_threshold: u8, ctx: &TxContext) {
        assert!(p.owner == sender(ctx), 3);
        assert!((new_threshold as u64) <= vector::length(&p.guardians), 4);
        p.threshold = new_threshold;
    }

    public entry fun add_guardian(p: &mut Policy, g: address, ctx: &TxContext) {
        assert!(p.owner == sender(ctx), 5);
        assert!(!contains(&p.guardians, g), 6);
        vector::push_back(&mut p.guardians, g);
        assert!((p.threshold as u64) <= vector::length(&p.guardians), 7);
    }

    public entry fun remove_guardian(p: &mut Policy, g: address, ctx: &TxContext) {
        assert!(p.owner == sender(ctx), 8);
        let ok = swap_remove_addr(&mut p.guardians, g);
        assert!(ok, 9);
        assert!((p.threshold as u64) <= vector::length(&p.guardians), 10);
    }

    // ---------------- Propose / Approve / Execute ----------------

    /// Propose an update for any vault OWNED by the same address as this policy.
    /// (We verify alignment in `execute` by checking `vault.owner == policy.owner`.)
    public entry fun propose_update(
        policy: &Policy,
        new_blob_id: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Anyone can propose if they hold the policy; typically the policy owner calls this.
        let op = PendingOp {
            id: new(ctx),
            policy_owner: policy.owner,
            new_blob_id,
            approvals: vector::empty<address>(),
            created_at: timestamp_ms(clock),
        };
        transfer::transfer(op, sender(ctx));
    }

    /// Guardians approve the pending operation.
    public entry fun approve(op: &mut PendingOp, policy: &Policy, ctx: &TxContext) {
        // op must be for this policy's owner
        assert!(op.policy_owner == policy.owner, 11);

        let who = sender(ctx);
        assert!(contains(&policy.guardians, who), 12);          // must be guardian
        assert!(!contains(&op.approvals, who), 13);             // no duplicates
        vector::push_back(&mut op.approvals, who);
    }

    /// Execute once threshold met AND timelock passed.
    /// NOTE: Requires the global Clock object. On devnet/testnet, pass the Clock shared object.
    public entry fun execute(
        op: PendingOp,
        policy: &Policy,
        v: &mut vault::Vault,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(op.policy_owner == policy.owner, 14);
        assert!(vault::owner_of(v) == policy.owner, 15);
        assert!((vector::length(&op.approvals) as u8) >= policy.threshold, 16);
        let now = timestamp_ms(clock);
        assert!(now >= op.created_at + policy.timelock_ms, 17);

        vault::apply_update(v, op.new_blob_id);

        // consume the op
        public_transfer(op, sender(ctx));
    }

    // ---------------- helpers ----------------

    fun contains(xs: &vector<address>, a: address): bool {
        let mut i = 0;
        let n = vector::length(xs);
        while (i < n) {
            if (*vector::borrow(xs, i) == a) return true;
            i = i + 1;
        };
        false
    }

    /// swap_remove an address; returns true if found
    fun swap_remove_addr(xs: &mut vector<address>, a: address): bool {
        let mut i = 0;
        let n = vector::length(xs);
        while (i < n) {
            if (*vector::borrow(xs, i) == a) {
                vector::swap_remove(xs, i);
                return true
            };
            i = i + 1;
        };
        false
    }
}