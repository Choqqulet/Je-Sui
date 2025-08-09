// wallet provider setup (so you can connect Sui Wallet / Suiet).
import type { ReactNode } from "react";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import "@mysten/dapp-kit/dist/index.css";

const NETWORK = (import.meta.env.VITE_SUI_NETWORK as "testnet") || "testnet";

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

export default function WalletRootProvider({ children }: { children: ReactNode }) {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork={NETWORK}>
      <WalletProvider>{children}</WalletProvider>
    </SuiClientProvider>
  );
}