import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
export const sui = new SuiClient({ url: getFullnodeUrl(import.meta.env.VITE_SUI_NETWORK || "testnet") });
export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID!;