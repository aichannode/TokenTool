'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';

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
import { WagmiProvider, createConfig, http } from 'wagmi';
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
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { AutoConnectProvider } from './AutoConnectProvider';


const { wallets } = getDefaultWallets();


// const config = getDefaultConfig({
//   appName: 'TokenTool',
//   projectId: '0223afa9d737c7dca5ee7da65f2b9e97',
//   wallets: [
//     ...wallets,
//     {
//       groupName: 'Other',
//       wallets: [argentWallet, trustWallet, ledgerWallet],
//     },
//   ],
//   chains: [
// mainnet,
// bsc,
// polygon,
// optimism,
// arbitrum,
// base,
// avalanche,
// blast,
//   ],
//   ssr: true,
// });
const connectors = connectorsForWallets(
  [
    ...wallets,
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'TokenTool',
    projectId: '0223afa9d737c7dca5ee7da65f2b9e97',
  }
);

const config = createConfig({
  connectors,
  chains: [mainnet,
    bsc,
    polygon,
    optimism,
    arbitrum,
    base,
    avalanche,
    blast,],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [blast.id]: http(),
  },
  ssr: true
})

const queryClient = new QueryClient();


export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  // const network = WalletAdapterNetwork.Devnet;
  // const endpoint = clusterApiUrl('mainnet-beta')
  // const endpoint = "https://devnet.helius-rpc.com/?api-key=27daa736-6d02-4ebd-b415-4c7842590e04";
  const endpoint = "https://mainnet.helius-rpc.com/?api-key=27daa736-6d02-4ebd-b415-4c7842590e04";
  const solana_wallets = useMemo(() => [
    new CoinbaseWalletAdapter(),
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new CloverWalletAdapter()], [network]);
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
                  <RainbowKitProvider >{children}</RainbowKitProvider>
                </QueryClientProvider>
              </WagmiProvider>
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

