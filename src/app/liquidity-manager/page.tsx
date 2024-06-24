"use client";
import Footer from "@/components/Footer";
import { useGetLiquidityProgram } from "@/global/util";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";


export default function LiquidityManager() {
    const [isEvm, setIsEvm] = useState<boolean>(true);
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { publicKey, sendTransaction, connected, signAllTransactions } = useWallet();
    const { getLiquidityProgram } = useGetLiquidityProgram(connection, anchorWallet!);

    useEffect(() => {
        const getLockAccount = async () => {
            if (!publicKey) {
                console.log("Please connect your wallet.");
                return;
            }
            const liquidityProgram = getLiquidityProgram();
            // Find all LockAccount PDAs for the given wallet
            const [lockAccountPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("lock_account"), publicKey.toBuffer()],
                liquidityProgram.programId
            );
            console.log("🚀 ~ getLockAccount ~ lockAccountPDA:", lockAccountPDA.toBase58())
            const lockAccountInfo = await liquidityProgram.account.LockAccount.fetch(lockAccountPDA);
            console.log("🚀 ~ getLockAccount ~ lockAccountInfo:", lockAccountInfo)

        }
        getLockAccount();
    }, [publicKey])



    return (
        <div className="min-h-screen flex flex-col items-center pt-[60px] md:pt-[80px] px-[20px]">
            <h1 className="text-[30px] md:text-[40px] text-gray-900 font-[700]  mt-[20px]">
                Liquidity Manager
            </h1>
            <h2 className="w-full md:w-[800px] text-[18px] md:text-[24px] text-gray-900  text-center font-[700] mt-[10px] md:mt-[20px]">
                Automatically create and fund the liquidity pool, this will allow users to buy your token.
            </h2>

            {
                <div className="w-full rounded-t-md md:rounded-t-xl md:w-[800px] flex flex-row items-center justify-between text-white mt-[20px] border-[1px] border-[#ddd]">
                    <button className={`w-full p-[10px] md:p-[20px] rounded-t-md md:rounded-t-xl text-[16px] md:text-[20px] ${isEvm ? "bg-blue-600 text-white" : "bg-[#FBFBFB] text-blue-500"}`} onClick={() => { setIsEvm(true) }}>
                        EVM Liquidity Manager
                    </button>
                    <button className={`w-full p-[10px] md:p-[20px] rounded-t-md md:rounded-t-xl text-[16px] md:text-[20px] ${!isEvm ? "bg-blue-600  text-white" : "bg-[#FBFBFB] text-blue-500"}`} onClick={() => { setIsEvm(false) }}>
                        SPL Liquidity Manager
                    </button>
                </div>
            }

            {
                isEvm ?
                    <div className="border-[1px] border-[#DDD] bg-white rounded-b-md md:rounded-b-xl w-full md:w-[800px] ">
                        <div className="p-[10px] md:p-[20px]">
                            <p className="text-gray-700 text-[16px] md:text-[20px] font-[700]">
                                Coming Soon...
                            </p>
                        </div>
                    </div>
                    :
                    <div className="border-[1px] border-[#DDD] bg-white rounded-b-md md:rounded-b-xl w-full md:w-[800px] ">
                        <div className="p-[10px] md:p-[20px]">
                            <p className="text-gray-700 text-[16px] md:text-[20px] font-[700]">
                                UnLock Liquidity
                            </p>
                        </div>
                        <div className="w-full border-[1px] " />
                        <div className="flex flex-col md:flex-row justify-center gap-3 p-[20px]">
                        </div>
                    </div>
            }
            <Footer />
        </div>)
}