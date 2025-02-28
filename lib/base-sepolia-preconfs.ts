import { defineChain } from "viem";
import { baseSepolia } from "viem/chains";

export const baseSepoliaPreconfs = defineChain({
  ...baseSepolia,
  name: "Base Sepolia ⚡🤖",
  rpcUrls: {
    default: {
      http: ["https://sepolia-preconf.base.org"],
      webSocket: ["wss://sepolia.flashblocks.base.org/ws"],
    },
  },
});
