/*
Notes:
- This uses Web Crypto for AES-GCM encryption of your JSON entry.
- Then shows how to call SealClient.encrypt/decrypt to wrap/unwrap a payload.
- You’ll need to adjust server config if your team picked specific Seal servers.
*/

const te = new TextEncoder();
const td = new TextDecoder();

export async function generateSymmetricKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportKeyRaw(key: CryptoKey): Promise<Uint8Array> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return new Uint8Array(raw);
}

export async function importKeyRaw(raw: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

export type EncryptedJson = {
  nonce: Uint8Array;
  ciphertext: Uint8Array;
};

// Encrypt any JSON-serializable value with AES-GCM
export async function encryptJsonWithKey(
  data: unknown,
  key: CryptoKey
): Promise<EncryptedJson> {
  const plaintext = te.encode(JSON.stringify(data));
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const buf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    key,
    plaintext
  );
  return { nonce, ciphertext: new Uint8Array(buf) };
}

export async function decryptJsonWithKey<T>(
  enc: EncryptedJson,
  key: CryptoKey
): Promise<T> {
  const buf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: enc.nonce },
    key,
    enc.ciphertext
  );
  return JSON.parse(td.decode(new Uint8Array(buf))) as T;
}