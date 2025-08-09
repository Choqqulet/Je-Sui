import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import { Shield, Lock, Wallet, Zap, Key, Globe } from "lucide-react";
import logo from "../assets/logo.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen w-full">
      {/* Top Nav */}
      <header className="sticky top-0 z-30 w-full border-b border-sky-100/50 bg-white/70 backdrop-blur dark:bg-black/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Je Sui"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-lg font-bold tracking-tight">Je Sui</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
            <a href="#features" className="hover:text-sky-600">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-sky-600">
              How it works
            </a>
            <Link to="/vault" className="hover:text-sky-600">
              Vault
            </Link>
          </nav>
          <div className="hidden md:block">
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-purple-50 dark:from-sky-950/30 dark:via-black dark:to-purple-950/20" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl dark:text-white">
              Only "Je" can unlock my passwords
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
              Je Sui (French “Je” = “I”). Je Sui — a zkLogin‑powered password
              vault on Sui. OAuth becomes a verifiable on‑chain identity,
              secrets are sealed client‑side, and data lives on Walrus.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LoginButton />
              <a
                href="#how-it-works"
                className="rounded-lg border border-sky-200 px-4 py-2 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950"
              >
                Learn how it works
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="rounded-full border border-sky-200 px-3 py-1 dark:border-sky-800">
                zkLogin
              </span>
              <span className="rounded-full border border-sky-200 px-3 py-1 dark:border-sky-800">
                OAuth
              </span>
              <span className="rounded-full border border-sky-200 px-3 py-1 dark:border-sky-800">
                Sui
              </span>
              <span className="rounded-full border border-sky-200 px-3 py-1 dark:border-sky-800">
                Walrus
              </span>
              <span className="rounded-full border border-sky-200 px-3 py-1 dark:border-sky-800">
                Seal
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="panel">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-sky-500" />
                  <div>
                    <div className="text-sm font-semibold">
                      Zero‑Knowledge Login
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Turn OAuth into a Sui signature with zkLogin.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-sm font-semibold">
                      Client‑side sealing
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Encrypt secrets locally before they ever leave your
                      device.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-emerald-500" />
                  <div>
                    <div className="text-sm font-semibold">
                      Own your identity
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Your zk address is derived from your OAuth identity.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Key className="h-6 w-6 text-sky-600" />}
            title="Password manager, re‑imagined"
            desc="A delightful vault UI with modern UX patterns and strong defaults."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-purple-600" />}
            title="OAuth → Sui via zkLogin"
            desc="Prove who you are without revealing the JWT, then sign transactions."
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-emerald-600" />}
            title="Walrus + Seal security"
            desc="Seal encrypts client‑side; Walrus ensures availability for your blobs."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          How it works
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Step
            n={1}
            title="Sign in with Google"
            body="We generate an ephemeral key and randomness, derive a nonce, and redirect to Google."
          />
          <Step
            n={2}
            title="zk proof from OAuth token"
            body="On callback, we decode the id_token, request a zk proof, and derive your Sui address from the JWT claims."
          />
          <Step
            n={3}
            title="Create a Sui transaction"
            body="We sign bytes with your ephemeral key and attach the zkLogin signature, submitting to the Sui network."
          />
          <Step
            n={4}
            title="Seal and store secrets"
            body="Passwords are encrypted client‑side via Seal, then stored as blobs on Walrus for durable availability."
          />
        </div>

        <div className="mt-10 rounded-xl border border-sky-100 bg-white p-6 shadow-sm dark:border-sky-900/50 dark:bg-black">
          <ol className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <li className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="text-xs font-semibold text-gray-500">Step 1</div>
              <div className="mt-1 text-sm">Ephemeral key + nonce</div>
            </li>
            <li className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="text-xs font-semibold text-gray-500">Step 2</div>
              <div className="mt-1 text-sm">JWT → zk proof (prover)</div>
            </li>
            <li className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="text-xs font-semibold text-gray-500">Step 3</div>
              <div className="mt-1 text-sm">zkLogin signature → Sui</div>
            </li>
            <li className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="text-xs font-semibold text-gray-500">Step 4</div>
              <div className="mt-1 text-sm">Seal encrypts → Walrus stores</div>
            </li>
          </ol>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            to="/vault"
            className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
          >
            Explore the Vault UI
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-10 text-center text-sm text-gray-500 dark:border-gray-800">
        Built for the hackathon — Je Sui. zkLogin • Seal • Walrus • Sui.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-black">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-sky-50 p-2 dark:bg-sky-950/40">
          {icon}
        </div>
        <div>
          <div className="text-base font-semibold">{title}</div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-black">
      <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
          {n}
        </div>
        <div>
          <div className="text-base font-semibold">{title}</div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}
