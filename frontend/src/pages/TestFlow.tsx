import { useState } from "react";
import { createVault } from "../utils/vault";
import { createPolicy, proposeUpdate, approveOp, executeOp } from "../utils/policy";
import { getWalrusBlobId } from "../utils/walrus";
import { keypairFromZkLogin } from "../utils/auth";

export default function TestFlow() {
  const [status, setStatus] = useState("");

  async function runTest() {
    try {
      setStatus("Logging in…");
      const { address, keypair } = await keypairFromZkLogin();

      setStatus("Uploading to Walrus…");
      const blobId = await getWalrusBlobId("mySecretPassword", keypair);

      setStatus("Creating vault…");
      const vaultRes = await createVault({ label: "Gmail", blobId, signer: keypair });
      console.log("Vault created:", vaultRes);

      const myAddr = address; // for demo you can list yourself as guardian twice
      setStatus("Creating policy…");
      const policyRes = await createPolicy({
        guardians: [myAddr, myAddr],
        threshold: 1,
        timelockMs: 0,
        signer: keypair,
      });
      console.log("Policy created:", policyRes);

      setStatus("Done! Check console.");
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + (err?.message || String(err)));
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <button onClick={runTest}>Run Vault/Policy Test</button>
      <p>{status}</p>
    </div>
  );
}