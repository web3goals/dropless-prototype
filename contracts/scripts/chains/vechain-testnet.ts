import { defineChain } from "viem";

export const vechainTestnet = defineChain({
  id: 100010,
  name: "VeChain Testnet",
  nativeCurrency: { name: "VTHO", symbol: "VTHO", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet.vechain.org"],
    },
  },
  testnet: true,
});
