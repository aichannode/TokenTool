import EthereumIcon from "@/assets/icons/ethereum.png"
import SolanaIcon from "@/assets/icons/solana.png"
import BinanceIcon from "@/assets/icons/binance.png"
import PolygonIcon from "@/assets/icons/polygon.png"
import BaseIcon from "@/assets/icons/base.png"
import OptimismIcon from "@/assets/icons/optimism.png"
import ArbitrumIcon from "@/assets/icons/arbitrum.png"
import AvalancheIcon from "@/assets/icons/avalanche.png"
import BlastIcon from "@/assets/icons/blast.png"
import ToolIcon from "@/assets/icons/tools.svg"

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
        icon: ToolIcon,
        name: "Raydium Liquidity Manager",
        router: "/liquidity-manager"
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

export const priceList = {
    1: {
        price: 0.015,
        currency: "ETH"
    },
    56: {
        // price: 0,
        price: 0.1,
        currency: "BNB"
    },
    97: {
        price: 0.1,
        currency: "BNB"
    },
    137: {
        price: 50,
        currency: "MATIC"
    },
    8453: {
        // price: 0.0,
        price: 0.015,
        currency: "ETH"
    },
    10: {
        price: 0.015,
        currency: "ETH"
    },
    42161: {
        price: 0.015,
        currency: "ETH"
    },
    43114: {
        price: 1.5,
        currency: "AVAX"
    },
    81457: {
        price: 0.015,
        currency: "ETH"
    },
}


export const addTokenToWallet = async ({
    createTokenAddress, tokenSymbol, decimal
}: any) => {
    const { ethereum } = window;
    console.log("ethereum", ethereum, createTokenAddress, tokenSymbol, decimal)

    if (!ethereum) {
        console.error('MetaMask is not installed!');
        return;
    }

    try {
        const wasAdded = await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: createTokenAddress,
                    symbol: tokenSymbol,
                    decimals: decimal,
                    image: ""
                }
            }
        });

        if (wasAdded) {
            console.log('Token added successfully!');
        } else {
            console.log('Token addition was rejected by the user.');
        }
    } catch (error) {
        console.error('Error adding token to wallet:', error);
    }
};


export const blockExplorers = (chainId: number) => {
    let url = 'https://etherscan.io/';
    switch (chainId) {
        case 56:
            url = 'https://bscscan.com/';
            break;
        case 1:
            url = 'https://etherscan.io/';
            break;
        case 137:
            url = 'https://polygonscan.com/';
            break;
        case 97:
            url = 'https://testnet.bscscan.com/';
            break;
        case 43114:
            url = 'https://snowtrace.io';
            break;
        case 81457:
            url = 'https://blastscan.io/';
            break;
        case 8453:
            url = 'https://basescan.io/';
            break;
        case 10:
            url = 'https://optimistic.etherscan.io/';
            break;
        case 42161:
            url = 'https://arbiscan.io/';
            break;

        // case 'Mumbai':
        //     url = 'https://mumbai.polygonscan.com/';
        //     break;
        default:
            break;
    }
    return url;
}

export const explorerName = (chainId: number) => {
    let name = "Etherscan";
    switch (chainId) {
        case 56:
            name = "BSCScan";
            break;
        case 1:
            name = "Etherscan";
            break;
        case 137:
            name = "PolygonScan";
            break;
        case 97:
            name = "BSCTestnetScan";
            break;
        case 43114:
            name = "Snowtrace";
            break;
        case 81457:
            name = "BlastScan";
            break;
        case 8453:
            name = "BaseScan";
            break;
        case 10:
            name = "OptimisticScan";
            break;
        case 42161:
            name = "ArbiScan";
            break;

            break;
    }
    return name;
}


