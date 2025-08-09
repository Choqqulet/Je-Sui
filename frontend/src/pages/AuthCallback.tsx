import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  getZkLoginSignature,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
  genAddressSeed,
} from "@mysten/sui/zklogin";
import { Transaction } from "@mysten/sui/transactions";
import { jwtDecode } from "jwt-decode";
import {
  buildProverRequest,
  suiClient,
  ensureAddressHasSui,
  explorerAltLinks,
  getOrCreateUserSalt,
  requestZkProof,
} from "../zkLogin";
import LoginButton from "./LoginButton";
import logo from "../assets/logo.jpg";

export default function AuthCallback() {
  const [status, setStatus] = useState("processing...");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(
          window.location.hash.replace("#", "?")
        );
        let idToken =
          params.get("id_token") ||
          new URLSearchParams(window.location.search).get("id_token");
        if (!idToken) {
          setStatus("No id_token found in URL");
          return;
        }

        setStatus("Restoring ephemeral key...");
        const skB64 = sessionStorage.getItem("zk_ephemeral_sk");
        const randomness = sessionStorage.getItem("zk_randomness");
        const maxEpoch = Number(sessionStorage.getItem("zk_max_epoch") || "2");
        if (!skB64 || !randomness) {
          setStatus("Missing ephemeral key/session. Start login from home.");
          return;
        }

        const kp = Ed25519Keypair.fromSecretKey(skB64);

        setStatus("Obtaining salt...");
        const salt = getOrCreateUserSalt(idToken);

        setStatus("Decoding JWT and computing zk address...");
        const decoded = jwtDecode<any>(idToken);
        if (!decoded?.sub) throw new Error("JWT missing 'sub' claim");
        if (!decoded?.aud) throw new Error("JWT missing 'aud' claim");
        const address = jwtToAddress(idToken, BigInt(salt));

        // Compute extended ephemeral pubkey now and include in cache key
        const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
          kp.getPublicKey()
        );

        // Try cache proof first for efficiency, scoped to this ephemeral key
        const cacheKey = `zk_proof_${salt}_${maxEpoch}_${extendedEphemeralPublicKey}`;
        const cachedInputs = sessionStorage.getItem(cacheKey);
        let inputs: any | null = null;
        if (cachedInputs) {
          setStatus("Using cached ZK proof...");
          try {
            inputs = JSON.parse(cachedInputs);
          } catch {
            // ignore parse errors
          }
        }

        setStatus(
          inputs
            ? "Validating cached proof..."
            : "Requesting proof from prover..."
        );
        if (!inputs) {
          const proverPayload = buildProverRequest(
            extendedEphemeralPublicKey,
            idToken,
            randomness!,
            salt,
            maxEpoch
          );
          inputs = await requestZkProof(proverPayload);
          if (!inputs?.proofPoints?.a)
            throw new Error(
              "invalid prover response (missing proofPoints). Check PROVER_URL and request payload."
            );
          // cache for session use
          sessionStorage.setItem(cacheKey, JSON.stringify(inputs));
        }

        setStatus("Ensuring gas (faucet on devnet/testnet)...");
        await ensureAddressHasSui(address);

        setStatus("Building transaction and zkLogin signature...");
        const addressSeed = genAddressSeed(
          BigInt(salt),
          "sub",
          decoded?.sub,
          decoded?.aud
        ).toString();

        const txb = new Transaction();
        txb.setSender(address);
        const { bytes, signature: userSignature } = await txb.sign({
          client: suiClient,
          signer: kp,
        });

        const zkSignature = await getZkLoginSignature({
          inputs: { ...inputs, addressSeed },
          maxEpoch,
          userSignature,
        });

        setStatus("Submitting transaction to Sui...");
        const res = await suiClient.executeTransactionBlock({
          transactionBlock: bytes,
          signature: zkSignature,
        });

        // Optionally confirm local execution and show explorer link
        const digest = (res as any).digest as string;
        let executed = false;
        try {
          const status = await suiClient.waitForTransaction({
            digest,
            // dev defaults are fine; keep it simple
          });
          executed = status?.confirmedLocalExecution === true;
        } catch {}

        const [official, suiscan, suivision] = explorerAltLinks(digest);
        setStatus(
          `Done: tx submitted. digest=${digest} executed=${executed}\n` +
            `Explorer: ${official}\n` +
            `Open on Suiscan: ${suiscan}\n` +
            `Open on Suivision: ${suivision}`
        );
        // redirect to vault on success
        navigate("/vault", { replace: true });
      } catch (err: any) {
        console.error(err);
        setStatus("Error: " + (err.message || String(err)));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const isError = status.startsWith("Error:") || status.includes("Missing ephemeral");

  return (
    <div className="min-h-screen w-full px-4 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-black">
        <div className="mb-4 flex items-center gap-3">
          <img src={logo} alt="Je Sui" className="h-8 w-8 rounded-lg object-cover" />
          <h2 className="text-lg font-bold">Authenticating…</h2>
        </div>

        <div className="rounded-lg border border-sky-100 bg-sky-50 p-4 text-sm text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-200">
          <pre className={`whitespace-pre-wrap break-words font-sans ${isError ? "text-red-600 dark:text-red-400" : ""}`}>{status}</pre>
        </div>

        {isError && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LoginButton />
            <Link
              to="/"
              className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>

      {isLoading && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-black">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
            <p className="text-sm text-gray-700 dark:text-gray-300">Signing in, please wait…</p>
          </div>
        </div>
      )}
    </div>
  );
}
