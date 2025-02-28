"use client";

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import "./globals.css";

import { baseSepoliaPreconfs } from "@/lib/base-sepolia-preconfs";

const config = getDefaultConfig({
  appName: "FlashReflex",
  projectId: "7817345d4eed1ad1d3bb967cdd1e6bea",
  chains: [baseSepolia, baseSepoliaPreconfs],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
