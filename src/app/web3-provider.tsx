'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  blast,
  avalanche,
  bsc
} from 'wagmi/chains';

import { ThemeProvider } from "@material-tailwind/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { useMemo } from 'react'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import '@solana/wallet-adapter-react-ui/styles.css';


const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: 'TokenTool',
  projectId: '2fd02bd025d0ba1825800df4245a7be4',
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    mainnet,
    bsc,
    polygon,
    optimism,
    arbitrum,
    base,
    avalanche,
    blast,
  ],
  ssr: true,
});

const queryClient = new QueryClient();


export function Providers({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  // const network = WalletAdapterNetwork.Devnet;
  // const endpoint = clusterApiUrl('mainnet-beta')
  // const endpoint = "https://devnet.helius-rpc.com/?api-key=27daa736-6d02-4ebd-b415-4c7842590e04";
  const endpoint = "https://mainnet.helius-rpc.com/?api-key=27daa736-6d02-4ebd-b415-4c7842590e04";
  const solana_wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()], []);
  return (
    <ThemeProvider>
      <ThirdwebProvider
        activeChain="ethereum"
        clientId="a543187fb1e825c2b92e9aaad47323d7"
      >
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={solana_wallets} autoConnect={true}>
            <WalletModalProvider>
              <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                  <RainbowKitProvider>{children}</RainbowKitProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
