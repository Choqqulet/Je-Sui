import { Transaction } from "@mysten/sui/transactions";
import type { Ed25519Keypair } from "@mysten/sui/cryptography";
import { sui, PACKAGE_ID } from "./suiClient";

const CLOCK_ID = "0x6"; // Sui shared Clock

export async function createPolicy({
  guardians, threshold, timelockMs, signer,
}: { guardians: string[]; threshold: number; timelockMs: number | bigint; signer: Ed25519Keypair; }) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::policy::create_policy`,
    arguments: [
      tx.pure.addresses(guardians),
      tx.pure.u8(threshold),
      tx.pure.u64(BigInt(timelockMs)),
    ],
  });
  tx.setGasBudget(10_000_000);
  return sui.signAndExecuteTransaction({ signer, transaction: tx });
}

export async function proposeUpdate({
  policyId, newBlobId, signer,
}: { policyId: string; newBlobId: string; signer: Ed25519Keypair; }) {
  const tx = new Transaction();
  const enc = new TextEncoder();
  tx.moveCall({
    target: `${PACKAGE_ID}::policy::propose_update`,
    arguments: [
      tx.object(policyId),
      tx.pure.vector("u8", Array.from(enc.encode(newBlobId))),
      tx.object(CLOCK_ID),
    ],
  });
  tx.setGasBudget(10_000_000);
  return sui.signAndExecuteTransaction({ signer, transaction: tx });
}

export async function approveOp({
  opId, policyId, signer,
}: { opId: string; policyId: string; signer: Ed25519Keypair }) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::policy::approve`,
    arguments: [tx.object(opId), tx.object(policyId)],
  });
  tx.setGasBudget(6_000_000);
  return sui.signAndExecuteTransaction({ signer, transaction: tx });
}

export async function executeOp({
  opId, policyId, vaultId, signer,
}: { opId: string; policyId: string; vaultId: string; signer: Ed25519Keypair }) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::policy::execute`,
    arguments: [tx.object(opId), tx.object(policyId), tx.object(vaultId), tx.object(CLOCK_ID)],
  });
  tx.setGasBudget(10_000_000);
  return sui.signAndExecuteTransaction({ signer, transaction: tx });
}