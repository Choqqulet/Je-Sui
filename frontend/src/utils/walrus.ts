import { WalrusClient, WalrusFile } from "@mysten/walrus";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import type { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import walrusWasmUrl from "@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url";

const sui = new SuiClient({
  url: getFullnodeUrl(import.meta.env.VITE_SUI_NETWORK || "testnet"),
});

export async function getWalrusBlobId(secret: string, signer: Ed25519Keypair) {
  const walrus = new WalrusClient({
    network: (import.meta.env.VITE_SUI_NETWORK || "testnet") as "testnet",
    suiClient: sui,
    wasmUrl: walrusWasmUrl,
  });

  const contents = new TextEncoder().encode(
    JSON.stringify({ password: secret })
  );
  const file = WalrusFile.from({
    contents,
    identifier: "credential",
    tags: { type: "credential" },
  });

  const [{ blobId }] = await walrus.writeFiles({
    files: [file],
    epochs: 3,
    deletable: true,
    signer, // Sui keypair
  });

  return blobId;
}

// --- Simple local stub storage for development ---
const LOCAL_PREFIX = "walrus:";
const LOCAL_INDEX_KEY = `${LOCAL_PREFIX}index`;

function generateLocalBlobId(label?: string) {
  const rand = Math.random().toString(36).slice(2, 10);
  return `local-${Date.now()}-${rand}${label ? `-${label}` : ""}`;
}

export async function walrusWrite(
  bytes: Uint8Array,
  label?: string
): Promise<string> {
  try {
    const blobId = generateLocalBlobId(label);
    const payload = {
      label: label ?? null,
      createdAt: Date.now(),
      bytes: Array.from(bytes),
    };
    localStorage.setItem(`${LOCAL_PREFIX}${blobId}`, JSON.stringify(payload));

    const indexRaw = localStorage.getItem(LOCAL_INDEX_KEY);
    const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];
    if (!index.includes(blobId)) {
      index.push(blobId);
      localStorage.setItem(LOCAL_INDEX_KEY, JSON.stringify(index));
    }

    return blobId;
  } catch (e) {
    throw new Error(
      `walrusWrite failed: ${(e as Error)?.message ?? String(e)}`
    );
  }
}

export async function walrusReadBytes(blobId: string): Promise<Uint8Array> {
  try {
    const raw = localStorage.getItem(`${LOCAL_PREFIX}${blobId}`);
    if (!raw) throw new Error("blob not found");
    const parsed = JSON.parse(raw) as { bytes: number[] };
    if (!parsed?.bytes) throw new Error("invalid blob format");
    return new Uint8Array(parsed.bytes);
  } catch (e) {
    throw new Error(
      `walrusReadBytes failed: ${(e as Error)?.message ?? String(e)}`
    );
  }
}
