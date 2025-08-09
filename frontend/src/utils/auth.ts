// temporary mock until zkLogin is wired

import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export async function keypairFromZkLogin() {
  // TODO: replace with real zkLogin. For now, reuse a local keypair (persisted).
  const LS_KEY = "demo-ed25519-secret";
  let kp: Ed25519Keypair;
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    kp = Ed25519Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
  } else {
    kp = Ed25519Keypair.generate();
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(kp.getSecretKey())));
  }
  const address = kp.getPublicKey().toSuiAddress();
  return { address, keypair: kp };
}
