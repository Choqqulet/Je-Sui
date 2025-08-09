import { Transaction } from "@mysten/sui/transactions";
import { sui, PACKAGE_ID } from "./suiClient";
import type { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const enc = new TextEncoder();

export async function createVault({
  label,
  blobId,
  signer,
}: {
  label: string;
  blobId: string;
  signer: Ed25519Keypair;
}) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::vault::create_vault`,
    arguments: [
      tx.pure.vector("u8", Array.from(enc.encode(label))),
      tx.pure.vector("u8", Array.from(enc.encode(blobId))),
    ],
  });
  tx.setGasBudget(10_000_000);
  return sui.signAndExecuteTransaction({ signer, transaction: tx });
}

export async function updateVault({
  vaultId,
  newBlobId,
  signer,
}: {
  vaultId: string;
  newBlobId: string;
  signer: Ed25519Keypair;
}) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::vault::update_vault`,
    arguments: [
      tx.object(vaultId),
      tx.pure.vector("u8", Array.from(enc.encode(newBlobId))),
    ],
  });
  tx.setGasBudget(10_000_000);
  return sui.signAndExecuteTransaction({ signer, transaction: tx });
}
