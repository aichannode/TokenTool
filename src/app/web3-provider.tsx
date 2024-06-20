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
  bscTestnet
  // polygonMumbai
} from 'wagmi/chains';

import { ThemeProvider } from "@material-tailwind/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
// import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
// import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { useMemo } from 'react'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import '@solana/wallet-adapter-react-ui/styles.css';

import { CoinbaseWalletAdapter, PhantomWalletAdapter, CloverWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from
  "@solana/wallet-adapter-wallets";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { AutoConnectProvider } from './AutoConnectProvider';
import { defineChain } from 'viem';

export const blast = /*#__PURE__*/ defineChain({
  id: 81457,
  network: 'blast',
  name: 'Blast',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    public: { http: ['https://rpc.blast.io'] },
    default: { http: ['https://rpc.blast.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Blastscan',
      url: 'https://blastscan.io',
      apiUrl: 'https://api.blastscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 212929,
    },
  },
  iconUrl: "https://blastscan.io/images/svg/brands/main-light.svg?v=24.3.2.2"
})

const { chains, publicClient, webSocketPublicClient } =
  configureChains(
    [
      mainnet,
      bsc,
      polygon,
      base,
      optimism,
      avalanche,
      arbitrum,
      blast,
      bscTestnet
    ],
    [publicProvider()]

  );
const projectId = process.env.nextPublicWalletConnectProjectID ?? "";

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId,
  chains,
});



const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});


const queryClient = new QueryClient();


export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  // const network = WalletAdapterNetwork.Mainnet;
  const network = WalletAdapterNetwork.Devnet;
  // const endpoint = clusterApiUrl('mainnet-beta')
  const endpoint = "https://devnet.helius-rpc.com/?api-key=27daa736-6d02-4ebd-b415-4c7842590e04";
  // const endpoint = "https://mainnet.helius-rpc.com/?api-key=27daa736-6d02-4ebd-b415-4c7842590e04";
  const solana_wallets = useMemo(() => [
    new CoinbaseWalletAdapter(),
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new CloverWalletAdapter()], [network]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <ThemeProvider>
      <ThirdwebProvider
        activeChain="ethereum"
        clientId="a543187fb1e825c2b92e9aaad47323d7"
      >
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={solana_wallets} autoConnect={true}>
            <WalletModalProvider>
              <WagmiConfig config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                  <RainbowKitProvider coolMode modalSize="compact" chains={chains}>{children}</RainbowKitProvider>
                </QueryClientProvider>
              </WagmiConfig>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThirdwebProvider>
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

