import { useState } from "react";
import { generateSymmetricKey, encryptJsonWithKey, decryptJsonWithKey } from "../utils/seal";
import { walrusWrite, walrusReadBytes } from "../utils/walrus";

const te = new TextEncoder();
const td = new TextDecoder();

type VaultPayload = {
  label: string;
  username: string;
  password: string;
  notes?: string;
};

export default function VaultForm() {
  const [label, setLabel] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  async function handleSave() {
    try {
      setStatus("Encrypting…");
      const key = await generateSymmetricKey();

      const payload: VaultPayload = { label, username, password, notes };
      const enc = await encryptJsonWithKey(payload, key);

      // Serialize {nonce, ciphertext} -> bytes
      const json = JSON.stringify({
        nonce: Array.from(enc.nonce),
        ciphertext: Array.from(enc.ciphertext),
      });
      const bytes = te.encode(json);

      // Write to Walrus (stub = localStorage; real later)
      const blobId = await walrusWrite(bytes, label);
      setStatus(`Saved: ${blobId}`);

      // Optional: read back & decrypt to prove round-trip
      const readBack = await walrusReadBytes(blobId);
      const parsed = JSON.parse(td.decode(readBack)) as {
        nonce: number[];
        ciphertext: number[];
      };
      const dec = await decryptJsonWithKey<VaultPayload>(
        {
          nonce: new Uint8Array(parsed.nonce),
          ciphertext: new Uint8Array(parsed.ciphertext),
        },
        key
      );
      console.log("Decrypted round-trip:", dec);
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e.message ?? String(e)}`);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", display: "grid", gap: 8 }}>
      <h2>Store a Vault Entry</h2>
      <input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button onClick={handleSave}>Save</button>
      <div>{status}</div>
    </div>
  );
}