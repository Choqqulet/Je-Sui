#[test_only]
module password_manager::policy_test {
    use sui::test_scenario;
    use sui::transfer::public_transfer;
    use sui::clock;
    use std::vector;

    use password_manager::vault;
    use password_manager::policy;

    /// End-to-end flow (2-of-2):
    /// - owner creates vault
    /// - owner creates policy with guardians g1, g2 (threshold 2)
    /// - owner proposes update
    /// - op is transferred to g1 then g2 for approvals
    /// - op is transferred back to owner and executed, mutating the vault
    #[test]
    fun end_to_end_2of2() {
        let owner = @0xCAFE;
        let g1    = @0xF00D;
        let g2    = @0xBEEF;

        // Begin as owner
        let mut sc = test_scenario::begin(owner);

        // Testing clock (timelock=0 but propose/execute need &Clock)
        let clk = clock::create_for_testing(sc.ctx());

        //
        // 1) Create vault (transfers to owner)
        //
        {
            // b"..." is already vector<u8>, no .to_vec() needed
            let label: vector<u8> = b"gmail";
            let blob1: vector<u8> = b"blob-1";
            vault::create_vault(label, blob1, sc.ctx());
        };
        // Take the vault from owner's account
        sc.next_tx(owner);
        let mut v = sc.take_from_sender<vault::Vault>();

        //
        // 2) Create policy (2-of-2)
        //
        {
            let mut guardians = vector::empty<address>();
            vector::push_back(&mut guardians, g1);
            vector::push_back(&mut guardians, g2);
            policy::create_policy(guardians, 2, 0, sc.ctx());
        };
        // Pull the policy object
        sc.next_tx(owner);
        let p = sc.take_from_sender<policy::Policy>();

        //
        // 3) Propose update (owner)
        //
        {
            let new_blob: vector<u8> = b"blob-2";
            policy::propose_update(&p, new_blob, &clk, sc.ctx());
        };

        // Take the PendingOp now owned by owner
        sc.next_tx(owner);
        let mut op = sc.take_from_sender<policy::PendingOp>();

        //
        // 4) Approve by guardian #1
        //
        public_transfer(op, g1);

        sc.next_tx(g1);
        let mut op_g1 = sc.take_from_sender<policy::PendingOp>();
        policy::approve(&mut op_g1, &p, sc.ctx());
        // Pass to guardian #2
        public_transfer(op_g1, g2);

        //
        // 5) Approve by guardian #2
        //
        sc.next_tx(g2);
        let mut op_g2 = sc.take_from_sender<policy::PendingOp>();
        policy::approve(&mut op_g2, &p, sc.ctx());
        // Return to owner for execution
        public_transfer(op_g2, owner);

        //
        // 6) Execute (owner)
        //
        // 6) Execute (owner)
        sc.next_tx(owner);
        let op_final = sc.take_from_sender<policy::PendingOp>();
        policy::execute(op_final, &p, &mut v, &clk, sc.ctx());

        // Return the mutated vault to owner (took it this tx)
        sc.return_to_sender(v);

        // Put policy back to owner via transfer (we took it in an earlier tx)
        sui::transfer::public_transfer(p, owner);

        // Destroy the test clock (key object w/o drop)
        sui::clock::destroy_for_testing(clk);

        sc.end();
    }
}