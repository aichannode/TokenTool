import Image from "next/image";

import { tokenInfoList } from "../global/config"
import TokenPanel from "../components/TokenPanel";
import Footer from "../components/Footer"

export default function Home() {
  return (
    <main className="flex flex-col items-center  px-[20px] pt-[20px] mt-[60px] md:mt-[80px]">
      <h1 className=" text-[30px] md:text-[50px] font-[700] text-black">
        Crypto Token Creator
      </h1>
      <h2 className="text-gray-500 font-[500] text-[14px] text-center md:text-[20px]">
        Create your own crypto or meme token, in just 1 minute. Pick from our selection of tokens.
      </h2>

      {
        tokenInfoList.map((item: any, index: number) => {
          return <div key={index}>
            <TokenPanel title={item.title} icon={item.icon} info={item.info} utils={item.utils} router={item.router} />
          </div>
        })
      }
      <div className="flex flex-col items-start w-full md:w-[800px]">
        <div className="flex flex-col items-start gap-2 mt-[20px]">
          <p className="text-[16px] font-[700]">
            What is TokenTool.io?
          </p>
          <p className="text-[14px] font-[500]">
            TokenTool is an online tool to create and deploy your own ERC20 and Solana Tokens on many different blockchains such as Ethereum, BNB Smart Chain, Solana, BASE and more!
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is an Ethereum Token?
          </p>
          <p className="text-[14px] font-[500]">
            An Ethereum token is a digital asset that represents something of value, such as a currency, a company share, or a virtual collectible. Tokens are managed by a smart contract, which is a program on Ethereum that stores the balance of each address as a mapping of addresses to numbers
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is Solana?
          </p>
          <p className="text-[14px] font-[500]">
            Solana is a blockchain platform that aims to provide fast and low-cost transactions. It's known for its scalability and can handle thousands of transactions per second. Solana is open, interoperable, and decentralized, and is used for a range of use cases, including finance, payments, and gaming.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is BASE?
          </p>
          <p className="text-[14px] font-[500]">
            Base is a Layer 2 (L2) blockchain network developed by Coinbase, a crypto exchange company, that was launched on August 9, 2023. Base is designed to be secure, low-cost, and developer-friendly, while also being open source and decentralized. Base is built on top of OP Stack, an open-source template that allows anyone to build their own Ethereum L2.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is Binance Smart Chain?
          </p>
          <p className="text-[14px] font-[500]">
            Binance Smart Chain (BSC) is a blockchain network that supports smart contracts and decentralized applications (DApps). It was launched by Binance in September 2020 and runs alongside the Binance Chain, which supports high transaction volumes. BSC has a dual-chain architecture that's compatible with the Ethereum network, which provides faster transaction speeds and lower fees.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is Blast?
          </p>
          <p className="text-[14px] font-[500]">
            The Blast Network is an Ethereum Layer 2 network that offers native yield for stablecoins and ETH. It is known for its fast growth and diverse ecosystem of gaming and DeFi projects. The network provides token holders with extra rewards through auto rebasing and staking, which earns interest rates that are automatically passed back to Blast users. Users can earn up to 5% interest rates.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is Polygon?
          </p>
          <p className="text-[14px] font-[500]">
            Polygon is a blockchain platform and cryptocurrency that connects and scales blockchain networks. It was launched in 2017 under the name Matic Network, and was rebranded as Polygon Technology in 2021. Polygon is a "layer two" or "sidechain" scaling solution that runs alongside the Ethereum blockchain. Polygon's native currency is MATIC, which is used for fees, staking, network security, and governance.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is Op Mainnet?
          </p>
          <p className="text-[14px] font-[500]">
            OP Mainnet uses optimistic rollup technology, which bundles together transactions to boost efficiency while leveraging the underlying security of Ethereum. 1. As of September 2023, OP Mainnet's ecosystem includes 180+ dApps and is growing rapidly
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is Arbitrum One?
          </p>
          <p className="text-[14px] font-[500]">
            Arbitrum is a layer 2 cryptocurrency network that aims to make Ethereum transactions faster and more affordable. It uses optimistic rollups (OR) technology to batch transactions and execute them off the main Ethereum chain, which reduces congestion on the mainnet. This allows Arbitrum to offer lower fees and higher throughput.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-[10px]">
          <p className="text-[16px] font-[700]">
            What is Avalanche?
          </p>
          <p className="text-[14px] font-[500]">
            Avalanche is a blockchain platform that allows users to create decentralized applications (dApps), financial assets, and trading. It's designed to scale quickly without sacrificing speed, reliability, and security. Avalanche is a competitor to Ethereum (ETH), but it has a key advantage in that it's also compatible with Ethereum.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
