'use client';

import * as React from 'react';
import {
  mainnet,
  bsc,
  polygon,
  base,
  optimism,
  avalanche,
  arbitrum,
  bscTestnet,
  blast,
} from 'wagmi/chains';

import { ThemeProvider } from "@material-tailwind/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { useMemo } from 'react'
import '@solana/wallet-adapter-react-ui/styles.css';

import { CoinbaseWalletAdapter, PhantomWalletAdapter, CloverWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from
  "@solana/wallet-adapter-wallets";

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { AutoConnectProvider } from './AutoConnectProvider';

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  (process.env as Record<string, string | undefined>).nextPublicWalletConnectProjectID ??
  '';

const wagmiConfig = getDefaultConfig({
  appName: 'TokenTool',
  projectId,
  chains: [
    mainnet,
    bsc,
    polygon,
    base,
    optimism,
    arbitrum,
    avalanche,
    blast,
    bscTestnet,
  ],
  ssr: true,
});

const queryClient = new QueryClient();


export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const endpoint = "https://mainnet.helius-rpc.com/?api-key=27daa736-6d02-4ebd-b415-4c7842590e04";
  const solana_wallets = useMemo(() => [
    new CoinbaseWalletAdapter(),
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new CloverWalletAdapter()], []);

  return (
    <ThemeProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={solana_wallets} autoConnect={true}>
          <WalletModalProvider>
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                  theme={darkTheme({
                    accentColor: '#3b82f6',
                    accentColorForeground: 'white',
                    borderRadius: 'medium',
                  })}
                  coolMode
                  modalSize="compact"
                >
                  {children}
                </RainbowKitProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  );
};
