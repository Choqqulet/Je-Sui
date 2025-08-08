import { WalrusClient, WalrusFile } from "@mysten/walrus";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import type { Ed25519Keypair } from "@mysten/sui/cryptography";
import walrusWasmUrl from "@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url";

const sui = new SuiClient({ url: getFullnodeUrl(import.meta.env.VITE_SUI_NETWORK || "testnet") });

export async function getWalrusBlobId(secret: string, signer: Ed25519Keypair) {
  const walrus = new WalrusClient({
    network: (import.meta.env.VITE_SUI_NETWORK || "testnet") as "testnet",
    suiClient: sui,
    wasmUrl: walrusWasmUrl,
  });

  const file = WalrusFile.from(
    JSON.stringify({ password: secret }),
    { identifier: "credential", tags: { type: "credential" } }
  );

  const { blobId } = await walrus.writeFiles({
    files: [file],
    epochs: 3,
    deletable: true,
    signer, // Sui keypair
  });

  return blobId;
}