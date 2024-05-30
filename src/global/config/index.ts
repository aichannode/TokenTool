import EthereumIcon from "@/assets/icons/ethereum.png"
import SolanaIcon from "@/assets/icons/solana.png"
import BinanceIcon from "@/assets/icons/binance.png"
import PolygonIcon from "@/assets/icons/polygon.png"
import BaseIcon from "@/assets/icons/base.png"
import OptimismIcon from "@/assets/icons/optimism.png"
import ArbitrumIcon from "@/assets/icons/arbitrum.png"
import AvalancheIcon from "@/assets/icons/avalanche.png"
import BlastIcon from "@/assets/icons/blast.png"

import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia, bscTestnet, optimism, arbitrum, avalanche, blast, polygon, base, bsc } from '@wagmi/core/chains'

export const config = createConfig({
    chains: [mainnet, sepolia, bscTestnet, optimism, arbitrum, avalanche, blast, polygon, base, bsc],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [bscTestnet.id]: http(),
        [bsc.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [avalanche.id]: http(),
        [blast.id]: http(),
        [polygon.id]: http(),
        [base.id]: http(),
    },
})

export const menuList = [
    {
        icon: EthereumIcon,
        name: "EVM Token Creator",
        router: "/standard-token"
    },
    {
        icon: SolanaIcon,
        name: "Solana Token Creator",
        router: "/spl-token"
    },
    {
        icon: "",
        name: "Pricing",
        router: "/pricing"
    },
]

export const tokenInfoList = [
    {
        title: "Standard Token on EVM",
        info: "Our most popular token, includes all standard features from ERC20 standard token. Including Base, Ethereum, Blast and many more!",
        utils: ["ERC20", "Supply limits", "Ownership", "Minting", "Burning", "Pausable"],
        router: "standard-token",
        icon: [EthereumIcon, BinanceIcon, PolygonIcon, BaseIcon, ArbitrumIcon, OptimismIcon, AvalancheIcon, BlastIcon]
    },
    {
        title: "Solana SPL Token",
        info: "SPL Token is the standard for creating tokens on the solana blockchain, comes with all the standard functionability! Customize the name, symbol, and logo for your token and deploy!",
        utils: ["SPL Token", "Name", "Symbol", "Decimals", "Logo", "Metadata", "Metaplex"],
        router: "spl-token",
        icon: [SolanaIcon]
    },
]



export const chainInfoList = [
    {
        icon: EthereumIcon,
        title: "Ethereum",
        chainId: "1"
    },
    {
        icon: BinanceIcon,
        title: "Binance Smart Chain",
        chainId: "56"
    },
    {
        icon: PolygonIcon,
        title: "Polygon",
        chainId: "137"
    },
    {
        icon: BaseIcon,
        title: "Base",
        chainId: "8453"
    },
    {
        icon: OptimismIcon,
        title: "Op Mainnet",
        chainId: "10"
    },
    {
        icon: ArbitrumIcon,
        title: "Arbitrum One",
        chainId: "42161"
    },
    {
        icon: AvalancheIcon,
        title: "Avalanche",
        chainId: "43114"
    },
    {
        icon: BlastIcon,
        title: "Blast",
        chainId: "81457"
    },
]


export const TABLE_HEAD = ["Chain Name", "Price"];

export const TABLE_ROWS = [
    {
        icon: EthereumIcon,
        title: "Ethereum",
        price: '0.015 ETH'
    },
    {
        icon: BinanceIcon,
        title: "Binance Smart Chain",
        price: '0.1 BNB'
    },
    {
        icon: PolygonIcon,
        title: "Polygon",
        price: '50 MATIC'
    },
    {
        icon: BaseIcon,
        title: "Base",
        price: '0.015 ETH'
    },
    {
        icon: OptimismIcon,
        title: "Op Mainnet",
        price: '0.015 ETH'
    },
    {
        icon: ArbitrumIcon,
        title: "Arbitrum One",
        price: '0.015 ETH'
    },
    {
        icon: AvalancheIcon,
        title: "Avalanche",
        price: '1.5 AVAX'
    },
    {
        icon: BlastIcon,
        title: "Blast",
        price: '0.015 ETH'
    },
    {
        icon: SolanaIcon,
        title: "Solana",
        price: '0.25 SOL'
    }]
