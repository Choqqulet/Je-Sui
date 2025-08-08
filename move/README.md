# Move Contracts (Sui) — `password_manager`

This package contains the on-chain logic for the Je-Sui on-chain password manager.  
It defines a **Vault** object (stores a Walrus blob id) and a **Policy** object (2-of-N approvals with optional timelock) for controlled updates.

---

## Modules

### `password_manager::vault`

**Purpose:** Ownable vault that stores a label and a Walrus `blob_id`. Updates must pass through policy execution (or owner, depending on your current checks).

**Key structs**
- `Vault has key, store`  
  - `id: UID`  
  - `owner: address`  
  - `label: vector<u8>`  
  - `blob_id: vector<u8>`  
  - *(optional, planned)* `policy_id: option::Option<address>`

**Entry functions**
- `public entry fun create_vault(label: vector<u8>, blob_id: vector<u8>, ctx: &mut TxContext)`  
  Creates a new `Vault` and **transfers** it to `sender()`.
- `public entry fun update_vault(vault: &mut Vault, new_blob_id: vector<u8>, ctx: &TxContext)`  
  Updates `blob_id`. (In the demo, called indirectly by policy `execute`).

**Read helpers (if present)**
- `public fun get_blob_id(&Vault): vector<u8>`  
- `public fun get_label(&Vault): vector<u8>`

---

### `password_manager::policy`

**Purpose:** Collective-approval control for vault updates (social recovery / guardians).

**Key structs**
- `Policy has key, store`  
  - `owner: address` (creator)  
  - `guardians: vector<address>`  
  - `threshold: u8` (min approvals required)  
  - `timelock_ms: u64` (optional, set `0` to disable)
- `PendingOp has key, store`  
  - Represents a proposed update (e.g., new `blob_id`) moving between guardians for approvals.

**Entry functions**
- `public entry fun create_policy(guardians: vector<address>, threshold: u8, timelock_ms: u64, ctx: &mut TxContext)`  
  Creates a `Policy` and **transfers** it to `sender()`.
- `public entry fun propose_update(policy: &Policy, new_blob_id: vector<u8>, clock: &Clock, ctx: &mut TxContext)`  
  Creates a `PendingOp` owned by the proposer (the owner in our demo).
- `public entry fun approve(op: &mut PendingOp, policy: &Policy, ctx: &TxContext)`  
  Guardian calls this to record approval. Typically the op is **transferred** to each guardian who approves, then sent back.
- `public entry fun execute(op: PendingOp, policy: &Policy, vault: &mut vault::Vault, clock: &Clock, ctx: &mut TxContext)`  
  Checks threshold (+ timelock) and applies the update to the `Vault`.

**Notes**
- Guardians are `address`es; `threshold` must be `<= guardians.len()`.  
- In tests we route the `PendingOp` via `sui::transfer::public_transfer` to each guardian before final execution.

---

## Build, Test, Publish

From the repo root:

```bash
# Build
sui move build

# Unit tests (includes end-to-end 2-of-2 flow)
sui move test

# Publish (testnet; make sure you have gas via faucet)
sui client publish --gas-budget 50000000
