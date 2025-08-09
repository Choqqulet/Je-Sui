// src/lib/zklogin.ts
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import {
  getFaucetHost,
  requestSuiFromFaucetV2,
  FaucetRateLimitError,
} from "@mysten/sui/faucet";
import { generateNonce, generateRandomness } from "@mysten/sui/zklogin";
import { jwtDecode } from "jwt-decode";

const RPC =
  (import.meta.env.VITE_SUI_RPC as string) || getFullnodeUrl("devnet");
export const suiClient = new SuiClient({ url: RPC });
export const PROVER_URL: string =
  (import.meta.env.VITE_PROVER_URL as string) ||
  "https://prover-dev.mystenlabs.com/v1";

// Utilities
function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...Array.from(bytes)));
}
function fromBase64ToU8a(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function randomSaltDecimalString(): string {
  const bytes = new Uint8Array(16);
  // Browser crypto
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return BigInt("0x" + hex).toString();
}

export function getOrCreateUserSalt(idToken: string): string {
  const decoded: any = jwtDecode(idToken);
  const iss = decoded?.iss;
  const sub = decoded?.sub;
  if (!iss || !sub) throw new Error("invalid_jwt_missing_iss_or_sub");
  const key = `zk_salt_${iss}|${sub}`;
  let salt = localStorage.getItem(key);
  if (!salt) {
    salt = randomSaltDecimalString();
    localStorage.setItem(key, salt);
  }
  return salt;
}

export async function createEphemeral(epochHorizon = 2) {
  const kp = Ed25519Keypair.generate();
  const secretKey = kp.getSecretKey() as unknown;
  const skB64 =
    secretKey instanceof Uint8Array ? toBase64(secretKey) : String(secretKey);

  // Use SDK helpers per docs to generate randomness and nonce
  const randomness = generateRandomness();
  const { epoch } = await suiClient.getLatestSuiSystemState();
  const maxEpoch = Number(epoch) + Number(epochHorizon);
  const nonce = generateNonce(kp.getPublicKey(), maxEpoch, randomness as any);

  sessionStorage.setItem("zk_ephemeral_sk", skB64);
  sessionStorage.setItem("zk_randomness", String(randomness));
  sessionStorage.setItem("zk_max_epoch", String(maxEpoch));

  return { kp, randomness: String(randomness), maxEpoch, nonce };
}

export function restoreEphemeralFromSession() {
  const skB64 = sessionStorage.getItem("zk_ephemeral_sk");
  if (!skB64) return null;
  try {
    const sk = fromBase64ToU8a(skB64);
    return Ed25519Keypair.fromSecretKey(sk);
  } catch {
    return null;
  }
}

// Build the OAuth URL for Google (implicit id_token flow)
export function buildGoogleAuthUrl(
  clientId: string,
  redirectUri: string,
  nonce: string
) {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=id_token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=openid%20email%20profile&nonce=${encodeURIComponent(nonce)}`;
  return url;
}

// Build prover request payload — shape your backend expects
export function buildProverRequest(
  extendedEphemeralPublicKey: string,
  jwt: string,
  randomness: string,
  salt: string | number,
  maxEpoch: number
) {
  return {
    jwt,
    extendedEphemeralPublicKey,
    maxEpoch: String(maxEpoch),
    jwtRandomness: randomness,
    salt: String(salt),
    keyClaimName: "sub",
  };
}

export async function requestZkProof(payload: {
  jwt: string;
  extendedEphemeralPublicKey: string;
  maxEpoch: string | number;
  jwtRandomness: string;
  salt: string;
  keyClaimName: string;
}) {
  const r = await fetch(PROVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const ct = r.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await r.text().catch(() => "");
    throw new Error(
      `prover expected JSON, got '${ct || "unknown"}' ${
        text ? `— body: ${text.slice(0, 160)}…` : ""
      }`
    );
  }
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(
      `prover failed: ${r.status} ${r.statusText} ${JSON.stringify(err)}`
    );
  }
  return r.json();
}

// Network helpers
export function getCurrentNetwork():
  | "devnet"
  | "testnet"
  | "mainnet"
  | "localnet"
  | "unknown" {
  try {
    const host = new URL(RPC).hostname.toLowerCase();
    if (host.includes("devnet")) return "devnet";
    if (host.includes("testnet")) return "testnet";
    if (host.includes("mainnet")) return "mainnet";
    if (host.includes("localhost") || host.includes("127.0.0.1"))
      return "localnet";
    return "unknown";
  } catch {
    return "unknown";
  }
}

export function explorerTxUrl(digest: string): string {
  const net = getCurrentNetwork();
  const networkParam = net === "unknown" ? "devnet" : net;
  return `https://explorer.sui.io/transaction/${digest}?network=${networkParam}`;
}

export function explorerAltLinks(digest: string): string[] {
  const net = getCurrentNetwork();
  const networkParam = net === "unknown" ? "devnet" : net;

  const official = `https://explorer.sui.io/transaction/${digest}?network=${networkParam}`;

  const suiscan =
    networkParam === "mainnet"
      ? `https://suiscan.xyz/tx/${digest}`
      : `https://suiscan.xyz/${networkParam}/tx/${digest}`;

  const suivision =
    networkParam === "mainnet"
      ? `https://suivision.xyz/txblock/${digest}`
      : `https://suivision.xyz/txblock/${digest}?network=${networkParam}`;

  return [official, suiscan, suivision];
}

// Determine network from RPC URL for faucet selection
function detectNetworkFromRpc(
  rpcUrl: string
): "devnet" | "testnet" | "localnet" | "unknown" | "mainnet" {
  try {
    const u = new URL(rpcUrl);
    const host = u.hostname.toLowerCase();
    if (host.includes("devnet")) return "devnet";
    if (host.includes("testnet")) return "testnet";
    if (host.includes("localhost") || host.includes("127.0.0.1"))
      return "localnet";
    if (host.includes("mainnet")) return "mainnet";
    return "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Ensure the given address has at least some SUI for gas on devnet/testnet/localnet.
 * On mainnet/unknown networks, this does nothing (caller should handle funding or sponsorship).
 */
export async function ensureAddressHasSui(
  address: string,
  opts?: { minBalance?: bigint; pollMs?: number; timeoutMs?: number }
) {
  const minBalance = opts?.minBalance ?? 1n; // non-zero
  const pollMs = opts?.pollMs ?? 1500;
  const timeoutMs = opts?.timeoutMs ?? 20_000;

  const hasBalance = async () => {
    try {
      const bal = await suiClient.getBalance({ owner: address });
      return BigInt(bal.totalBalance || 0) >= minBalance;
    } catch {
      return false;
    }
  };

  if (await hasBalance()) return;

  let faucetNetwork: "devnet" | "testnet" | "localnet" = "devnet";
  try {
    const host = new URL(RPC).hostname.toLowerCase();
    if (host.includes("testnet")) faucetNetwork = "testnet";
    else if (host.includes("localhost") || host.includes("127.0.0.1"))
      faucetNetwork = "localnet";
  } catch {}
  const faucetHost = getFaucetHost(faucetNetwork);
  try {
    await requestSuiFromFaucetV2({ host: faucetHost, recipient: address });
  } catch (e) {
    if (e instanceof FaucetRateLimitError) {
      // Swallow rate limit; we will still poll in case funds arrive from a previous request
    } else {
      throw e;
    }
  }

  // Poll until balance shows up or timeout
  const start = Date.now();
  while (!(await hasBalance())) {
    if (Date.now() - start > timeoutMs) break;
    await new Promise((r) => setTimeout(r, pollMs));
  }
}
