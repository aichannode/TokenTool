"use client";
import Footer from "@/components/Footer";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { fetchPoolInfo, fetchSolPrice } from "@/global/service";
import { accountExist, cleanString, getAmmConfigAddress, getAuthAddress, getOrcleAccountAddress, getPoolAddress, getPoolLpMintAddress, getPoolVaultAddress, isValidSolanaAddress, useGetProgram } from "@/global/util";
import { BN } from "@coral-xyz/anchor";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { Slider, Tabs, TabsHeader, TabsBody, Tab, TabPanel, } from "@material-tailwind/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync, createBurnInstruction, createSyncNativeInstruction } from '@solana/spl-token';
import { Metadata, PROGRAM_ADDRESS } from '@metaplex-foundation/mpl-token-metadata';


interface TokenInfo {
    mintAddress: string;
    tokenAmount: number;
}

export default function LiquidityManager() {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { publicKey, sendTransaction, connected, signAllTransactions } = useWallet();

    const [launchMarketcap, setLaunchMarketCap] = useState<number>(0);
    const [launchMarketcapUSD, setLaunchMarketCapUSD] = useState<number>(0);
    const [launchTokenPrice, setLaunchTokenPrice] = useState<number>(0)
    const [launchTokenPriceUSD, setLaunchTokenPriceUSD] = useState<number>(0);
    const [tokenAmount, setTokenAmount] = useState<number>(0);
    const [solAmount, setSolAmount] = useState<number>(2);
    const [sliderSupplyValue, setSliderSupplyValue] = useState<number>(100);
    const [loading, setLoading] = useState<boolean>(false);

    const [lpAction, setLpAction] = useState<String>("none" || 'burn');
    const [enableAddLiquidity, setEnableAddLiquidity] = useState<boolean>(false);
    const [createdAmount, setCreatedAmount] = useState<number>(0);
    const [loadingMessage, setLoadingMessage] = useState<string>("");

    const [tokenMintList, setTokenMintList] = useState<TokenInfo[] | undefined>([]);
    const [tokenPair, setTokenPair] = useState<string>();
    const [tokenName, setTokenName] = useState<string>();
    const [tokenSymbol, setTokenSymbol] = useState<string>();
    const [totalSupply, setTotalSupply] = useState<number>();
    const [validatePool, setValidatePool] = useState<boolean>(false);
    const [validateToken, setValidateToken] = useState<boolean>(false);

    const data = [
        {
            label: "None",
            value: "none",
            desc: `Liquidity will be sent to your wallet. You will retain full ownership and control of the LP.`,
        },
        {
            label: "Burn",
            value: "burn",
            desc: `Liquidity will be burned, locking the initial liquidity forever. Once the liquidity is burned, it can never be recovered in any way.`,
        },
        // {
        //   label: "Lock",
        //   value: "lock",
        //   desc: `Liquidity will be sent to your wallet. You will retain full ownership and control of the LP.`,
        // },
    ];

    const { getProgram } = useGetProgram(connection, anchorWallet!)

    const getTokenName = async (tokenMintAddress: string) => {

        // Convert the provided address to a PublicKey
        const mintPublicKey = new PublicKey(tokenMintAddress);

        // Get token metadata address
        const [metadataAddress] = await PublicKey.findProgramAddress(
            [
                Buffer.from('metadata'),
                new PublicKey(PROGRAM_ADDRESS).toBuffer(),
                mintPublicKey.toBuffer(),
            ],
            new PublicKey(PROGRAM_ADDRESS)
        );

        // Fetch and deserialize token metadata
        const metadataAccountInfo = await connection.getAccountInfo(metadataAddress);
        if (!metadataAccountInfo) {
            console.log('No metadata account found for the given mint address.');
            return null;
        }
        const metadata = Metadata.deserialize(metadataAccountInfo.data)[0];

        const mintAccountInfo = await connection.getParsedAccountInfo(mintPublicKey);
        let mintedAmount, decimals;
        if (!mintAccountInfo || !mintAccountInfo.value) {
            console.log('No mint account found for the given mint address.');
            return null;
        }

        if ('parsed' in mintAccountInfo.value.data) {
            mintedAmount = mintAccountInfo.value.data.parsed.info.supply;
            decimals = mintAccountInfo.value.data.parsed.info.decimals;
        }
        return {
            name: cleanString(metadata.data.name.trim()),
            symbol: cleanString(metadata.data.symbol.trim()),
            totalSupply: Number(mintedAmount) / Math.pow(10, decimals)
        };
    };

    const getTokenAccounts = async (ownerAddress: PublicKey) => {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerAddress, {
            programId: TOKEN_PROGRAM_ID,
        });

        const tokenList: TokenInfo[] = tokenAccounts.value.map((item) => ({
            mintAddress: item.account.data.parsed.info.mint,
            tokenAmount: item.account.data.parsed.info.tokenAmount.uiAmount
        }));
        console.log("🚀 ~ consttokenList:TokenInfo[]=tokenAccounts.value.map ~ tokenList:", tokenList)
        setTokenMintList(tokenList)
    }

    useEffect(() => {
        if (!publicKey) {
            console.log("Please connect your wallet.");
            return;
        }

        getTokenAccounts(publicKey)
    }, [publicKey, connected])


    useEffect(() => {
        let tmpTokenAmount = Math.floor(createdAmount / 100 * sliderSupplyValue)
        setTokenAmount(tmpTokenAmount)
        let tmpMarketCap = Math.floor(solAmount / sliderSupplyValue * 100 * 100) / 100 as number;
        let tmpTokenPrice = Math.floor(solAmount / tmpTokenAmount * 100000) / 100000 as number;
        setLaunchMarketCap(tmpMarketCap);
        setLaunchTokenPrice(tmpTokenPrice);
        const calculateLaunchMarketCap = async () => {
            let res = await fetchSolPrice();
            setLaunchMarketCapUSD(Math.floor(res.data.Price * 100) / 100 * tmpMarketCap);
            setLaunchTokenPriceUSD(Math.floor(res.data.Price * 100) / 100 * tmpTokenPrice);
        }
        calculateLaunchMarketCap();
    }, [sliderSupplyValue, createdAmount, solAmount]);



    useEffect(() => {
        const fetchTokenInfo = async () => {
            if (!tokenPair) {
                console.log("Please select token.");
                return;
            }

            if (!isValidSolanaAddress(tokenPair)) {
                setValidateToken(false)
                return
            }
            let res = await getTokenName(tokenPair)
            console.log("res", res)
            if (res) {
                setTokenName(res.name);
                setTokenSymbol(res.symbol);
                setTotalSupply(res.totalSupply);
                setTokenAmount(res.totalSupply);
                setValidateToken(true)
            } else {
                console.log("Token information could not be retrieved.");
                setValidateToken(false)
            }
            validatePoolInfo()
        }
        fetchTokenInfo()
    }, [tokenPair])

    useEffect(() => {
        if (validatePool && validateToken)
            setEnableAddLiquidity(true)
        else
            setEnableAddLiquidity(false)
    }, [validatePool, validateToken])

    const validatePoolInfo = async () => {
        let res = await fetchPoolInfo(tokenPair)
        if (res.data.data.count > 0) {
            setValidatePool(false)
            console.log("Pool already exists")
        } else {
            setValidatePool(true)
            console.log("Pool does not exist")
        }
    }


    const burnLPTokens = async (
        tokenMintAddress: string
    ) => {
        if (!publicKey) {
            console.log("Please connect your wallet.");
            return;
        }
        try {

            const mint = new PublicKey(tokenMintAddress);

            // Get the token account for the LP token
            const ownerTokenAccount = await getAssociatedTokenAddress(mint, publicKey);
            const accountInfo = await connection.getTokenAccountBalance(ownerTokenAccount);

            // Create the burn transaction
            const transaction = new Transaction().add(
                createBurnInstruction(
                    ownerTokenAccount,
                    mint,
                    publicKey,
                    Number(accountInfo.value.amount),
                    [],
                    TOKEN_PROGRAM_ID
                )
            );

            const transactionSignature = await sendTransaction(
                transaction,
                connection,
                { skipPreflight: true, preflightCommitment: "finalized" }
            );
            const ret1 = await connection.confirmTransaction(transactionSignature, "confirmed")
            if (ret1.value.err) {
                console.log("error", ret1.value.err.toString())
                setLoading(false);
            }
            else {
                console.log("success")
            }

            return transactionSignature;
        } catch (error) {
            console.error("Failed to burn LP tokens:", error);
            throw error;
        }
    };


    const onAddLiquidityClick = useCallback(async (props: any) => {
        if (!publicKey) {
            console.log("Please connect your wallet.");
            setLoading(false);
            return;
        }

        if (!tokenPair) {
            console.log("Please select token.");
            setLoading(false);
            return;
        }

        setLoadingMessage("Creating Raydium Pool....")

        try {

            /////////////////Create Liquidity Pool on Raydium
            // setLoadingMessage("Wrapping SOL and Create Liquidity....")
            ///////////Wrapping SOl
            const associatedTokenAccount = await getAssociatedTokenAddress(
                new PublicKey("So11111111111111111111111111111111111111112"), // WSOL address
                publicKey
            );
            const transaction = new Transaction();
            const accountInfo = await connection.getAccountInfo(associatedTokenAccount);
            if (accountInfo === null) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        publicKey,
                        associatedTokenAccount,
                        publicKey,
                        new PublicKey("So11111111111111111111111111111111111111112")
                    )
                );
            }

            const wrapSolAmount = solAmount * 10 ** 9;
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: associatedTokenAccount,
                    lamports: wrapSolAmount,
                }),
                createSyncNativeInstruction(associatedTokenAccount)
            );
            // const signature = await sendTransaction(transaction, connection);
            // const wrapSolRet = await connection.confirmTransaction(signature, "finalized")
            // if (wrapSolRet.value.err) {
            //   console.log("error", wrapSolRet.value.err.toString())
            //   setLoading(false);
            // }
            // else {
            //   console.log("success")
            // }


            let configAddress: PublicKey;

            const program = getProgram()
            const [address, _] = await getAmmConfigAddress(
                0,
                program.programId
            );

            configAddress = address
            if (await accountExist(connection, address)) {
                console.log("amm config already exists")
            } else {
                const tx = await program.methods
                    .createAmmConfig(
                        0,
                        new BN(10),
                        new BN(1000),
                        new BN(25000),
                        new BN(0)
                    )
                    .accounts({
                        owner: publicKey,
                        ammConfig: address,
                        systemProgram: SystemProgram.programId,
                    })
                    .transaction();

                const transactionSignature = await sendTransaction(
                    tx,
                    connection
                );

                const ret = await connection.confirmTransaction(transactionSignature, "finalized")
                if (ret.value.err) {
                    console.log("error", ret.value.err.toString())
                    setLoading(false);
                }
                else {
                    console.log("success")
                }
            }

            const mintB = new PublicKey("So11111111111111111111111111111111111111112")
            const mintA = new PublicKey(tokenPair)

            const mintBAmount = new BN(solAmount * LAMPORTS_PER_SOL);
            const mintAAmount = new BN(tokenAmount).mul(new BN(LAMPORTS_PER_SOL))

            const isFront = new BN(new PublicKey(mintA.toBase58()).toBuffer()).lte(
                new BN(new PublicKey(mintB.toBase58()).toBuffer()),
            );

            const [token0, token1] = isFront ? [mintA, mintB] : [mintB, mintA];
            const [token0Amount, token1Amount] = isFront ? [mintAAmount, mintBAmount] : [mintBAmount, mintAAmount];
            const [auth] = await getAuthAddress(program.programId);

            const [poolAddress] = await getPoolAddress(
                configAddress,
                token0,
                token1,
                program.programId
            );

            const [lpMintAddress] = await getPoolLpMintAddress(
                poolAddress,
                program.programId
            );

            const [vault0] = await getPoolVaultAddress(
                poolAddress,
                token0,
                program.programId
            );

            const [vault1] = await getPoolVaultAddress(
                poolAddress,
                token1,
                program.programId
            );

            const [creatorLpTokenAddress] = await PublicKey.findProgramAddress(
                [
                    publicKey.toBuffer(),
                    TOKEN_PROGRAM_ID.toBuffer(),
                    lpMintAddress.toBuffer(),
                ],
                ASSOCIATED_PROGRAM_ID
            );

            const [observationAddress] = await getOrcleAccountAddress(
                poolAddress,
                program.programId
            );

            const tx = new Transaction()

            const creatorToken0 = getAssociatedTokenAddressSync(
                token0,
                publicKey,
                false,
                TOKEN_PROGRAM_ID
            );
            const creatorToken1 = getAssociatedTokenAddressSync(
                token1,
                publicKey,
                false,
                TOKEN_PROGRAM_ID
            );

            // const createPoolFee = new PublicKey("G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2")  devnet
            const createPoolFee = new PublicKey("DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8")
            const ins = await program.methods
                .initialize(token0Amount, token1Amount, new BN(0))
                .accounts({
                    creator: publicKey,
                    ammConfig: configAddress,
                    authority: auth,
                    poolState: poolAddress,
                    token0Mint: token0,
                    token1Mint: token1,
                    lpMint: lpMintAddress,
                    creatorToken0,
                    creatorToken1,
                    creatorLpToken: creatorLpTokenAddress,
                    token0Vault: vault0,
                    token1Vault: vault1,
                    createPoolFee,
                    observationState: observationAddress,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    token0Program: TOKEN_PROGRAM_ID,
                    token1Program: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .instruction();

            tx.add(transaction, ins)

            // let result = await simulateTransaction(connection, tx, )
            // console.log("🚀 ~ onAddLiquidityClick ~ result:", result)

            const transactionSignature = await sendTransaction(
                tx,
                connection,
                { skipPreflight: true, preflightCommitment: "finalized" }
            );
            const ret1 = await connection.confirmTransaction(transactionSignature, "confirmed")
            if (ret1.value.err) {
                console.log("error", ret1.value.err.toString())
                setLoading(false);
            }
            else {
                console.log("success")
            }

            if (lpAction == "burn") {
                setLoadingMessage("Burning LP token....")
                await burnLPTokens(lpMintAddress.toBase58())
            }
            setLoading(false)
            // else if (lpAction == "lock") {
            //   setLoadingMessage("Locking LP token....")
            //   await lockLPTokens(lpMintAddress.toBase58());

            // }
        } catch (error) {
            setLoading(false)
        }

    }, [tokenAmount, solAmount, lpAction, loadingMessage, loading, publicKey, tokenPair])


    const handleAddLiquidity = async () => {
        // let balanceCheck = await checkBalance();
        // if (!balanceCheck) {
        //   setBalanceModalOpen(true)
        //   return;
        // }
        setLoading(true);
        onAddLiquidityClick({ publicKey, tokenAmount, solAmount, lpAction })

    }


    return (
        <div className="min-h-screen flex flex-col items-center pt-[60px] md:pt-[80px] px-[20px]">
            <p className="text-[30px] md:text-[40px] text-gray-900 font-[700] mt-[20px]">
                Solana Liquidity Manager
            </p>
            <p className="w-full md:w-[800px] text-[16px]  md:text-[18px] text-gray-500 font-[500] mt-[20px]">
                Automatically create and fund the liquidity pool, this will allow users to buy your token.
            </p>
            <div className="mt-[20px]">
                <WalletMultiButton />
            </div>
            <div className="border-[1px] border-[#AAA] bg-white rounded-xl w-full md:w-[800px] mt-[20px]">
                <div className="p-[20px]">
                    <p className="text-gray-900 text-[20px] md:text-[24px] font-[700]">
                        Add Liquidity
                    </p>
                    <p className="text-gray-800 text-[16px] md:text-[20px]">
                        Automatically create and fund the liqudity pool, this will allow users to buy your token.
                    </p>
                </div>
                {
                    <div>
                        <div className="w-full border-[1px] " />
                        <div className="p-[20px]">
                            <div className="flex flex-col w-full">
                                <p className="w-full">
                                    Select or Input Token Address
                                </p>
                                <div className="mt-[10px]">
                                    <div className="w-full h-[40px] flex flex-row items-center gap-2 border-[1px] rounded-md">

                                        <input autoComplete="on" list="suggestions" className="w-full h-full outline-none rounded-md p-[10px]" onChange={(e) => {
                                            setTokenPair(e.target.value)
                                        }} />
                                        <datalist id="suggestions" className="">
                                            {
                                                tokenMintList?.map((item, index) => {
                                                    return <option key={index} value={item.mintAddress}>{item.mintAddress}</option>
                                                })
                                            }
                                        </datalist>
                                    </div>
                                </div>
                                {
                                    tokenPair && validateToken &&
                                    <div className="mt-[10px]">
                                        <p className="text-[14px] text-gray-700">Token Name: {tokenName}</p>
                                        <p className="text-[14px] text-gray-700">Token Symbol: {tokenSymbol}</p>
                                        <p className="text-[14px] text-gray-700">Total Supply: {totalSupply}</p>
                                    </div>
                                }
                                {
                                    tokenPair && !validateToken &&
                                    <p className="text-[14px] text-red-700">Invalid Token</p>
                                }
                                {
                                    tokenPair && validateToken && !validatePool &&
                                    <p className="text-[14px] text-red-700">Raydium Pool already exists</p>
                                }
                            </div>
                        </div>
                        <div className="w-full border-[1px] " />
                        <div className="p-[20px]">
                            <div className="flex flex-col items-start">
                                <p className="text-gray-800 text-[14px] md:text-[16px] font-[600]">
                                    Token Paring & Funding
                                </p>
                                <p className="text-gray-700 text-[12px] md:text-[16px] font-[500]">
                                    Pair a percentage of your token supply with SOL to fund the liquidity pool, We recommend pairing at least 10% of your token supply with at least 1SOL.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 mt-[20px]">
                                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
                                    <div className="flex flex-col w-full">
                                        <p className="w-full">
                                            Token Supply (%)
                                        </p>
                                        <div className="w-full flex flex-row items-center gap-1 md:gap-2 w-full md:mt-[15px]">
                                            <Slider
                                                value={sliderSupplyValue}
                                                onChange={(e) => {
                                                    setSliderSupplyValue(parseInt(e.target.value));
                                                }}
                                                color="blue"
                                                className="min-w-[20px]"
                                                placeholder={""}
                                                onPointerEnterCapture={() => { }}
                                                onPointerLeaveCapture={() => { }} />
                                            <p className="text-[16px] md:text-[20px]">
                                                {sliderSupplyValue}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <p className="w-full">
                                            SOL Amount
                                        </p>
                                        <input
                                            onChange={(e: any) => {
                                                setSolAmount(parseFloat(e.target.value))
                                            }}
                                            value={solAmount}
                                            type="number"
                                            className=" w-full border-[1px] p-[8px] outline-none mt-1 md:mt-2 rounded-[6px]" />
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-row items-center gap-2 mt-[20px]">
                                <div className="flex flex-col items-end w-full p-[10px] border-[1px] rounded-xl">
                                    <div className="flex flex-col items-end">
                                        <p className="text-[18px] text-gray-800">
                                            Token
                                        </p>
                                        <p className="text-[18px] text-gray-800">
                                            {tokenAmount}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start w-full p-[10px] border-[1px] rounded-xl">
                                    <div className="flex flex-col items-start">
                                        <p className="text-[18px] text-gray-800">
                                            SOL
                                        </p>
                                        <p className="text-[18px] text-gray-800">
                                            {solAmount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[20px] text-gray-700 text-[16px]">
                                Based on the selected options and values above, your token will launch with the following initial parameters, including the starting market cap and the starting price of your token.
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-2 mt-[20px]">
                                <div className="flex flex-col items-start w-full p-[10px] border-[1px] rounded-xl">
                                    <div className="flex flex-col items-start">
                                        <p className="text-[16px] text-gray-900">
                                            Launch Market Cap
                                        </p>
                                        <p className="text-[16px] text-gray-900">
                                            {launchMarketcap} SOL
                                            <span className="text-[14px]">
                                                (~ {launchMarketcapUSD} USD)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start w-full p-[10px] border-[1px] rounded-xl">
                                    <div className="flex flex-col items-start">
                                        <p className="text-[16px] text-gray-900">
                                            Launch Token Price
                                        </p>
                                        <p className="text-[16px] text-gray-900">
                                            {launchTokenPrice} SOL
                                            <span className="text-[14px]">
                                                (~{launchTokenPriceUSD} USD)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full border-[1px] " />
                        <div className="p-[20px]">
                            <p className="text-gray-800 text-[14px] md:text-[16px] font-[600]">
                                DEX Exchange
                            </p>
                            <p className="text-gray-700 text-[12px] md:text-[16px] font-[500]">
                                We'll use the Raydium to create your liquidity pair and seed the initial pool.
                            </p>
                        </div>
                        <div className="w-full border-[1px] " />
                        <div className="p-[20px]">
                            <p className="text-gray-800 text-[14px] md:text-[16px] font-[600]">
                                Liquidity Action & Ownership
                            </p>
                            <p className="text-gray-700 text-[12px] md:text-[16px] font-[500]">
                                By default, the liquidity will be sent to you. However, you can choose to burn the liquidity. We recommend burning the liquidity.
                            </p>
                            <div className="mt-[20px]">
                                <Tabs value="none">
                                    <TabsHeader placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                                        {data.map(({ label, value }) => (
                                            <Tab placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} key={value} value={value} onClick={() => {
                                                setLpAction(value)
                                            }}>
                                                {label}
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                    <TabsBody placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                                        {data.map(({ value, desc }) => (
                                            <TabPanel key={value} value={value}  >
                                                {desc}
                                            </TabPanel>
                                        ))}
                                    </TabsBody>
                                </Tabs>
                            </div>
                        </div>
                        {/* {
              lpAction == "lock" &&
              <>
                <div className="w-full border-[1px] " />
                <div className="p-[20px]">
                  <p className="text-gray-800 text-[14px] md:text-[16px] font-[600]">
                    Lock Duration
                  </p>
                  <p className="text-gray-700 text-[12px] md:text-[16px] font-[500]">
                    Let's decide on how long you want to lock the liquidity for. We recommend locking for at least 1 year. After the lock expires, you are free to withdraw the liquidity or lock it again.
                  </p>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-5 mt-[10px]">
                    <input type="number" placeholder="100000" value={lockDurationAmount} className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
                      onChange={(e: any) => {
                        setLockDurationAmount(parseInt(e.target.value))
                      }} />
                    <Select value={lockDuration} onChange={(val: any) => setLockDuration(val)} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} label="Select Duration">
                      <Option value="day">Days</Option>
                      <Option value="week" >Weeks</Option>
                      <Option value="month">Months</Option>
                      <Option value="year" >Years</Option>
                    </Select>
                  </div>
                </div>
              </>
            } */}
                        <div className="w-full border-[1px] " />
                        <div className="w-full flex flex-col items-center p-[20px]">
                            <div className="w-full md:w-[300px]">
                                <div className="flex flex-row item-center justify-between">
                                    <p className="text-[16px] text-gray-900">
                                        Raydium Fee :
                                    </p>
                                    <p className="text-[16px] text-gray-900">
                                        0.2 SOL
                                    </p>
                                </div>
                                <div className="flex flex-row item-center justify-between">
                                    <p className="text-[16px] text-gray-900">
                                        Liquidity :
                                    </p>
                                    <p className="text-[16px] text-gray-900">
                                        {solAmount} SOL
                                    </p>
                                </div>
                                <p className="text-center text-black mt-[10px] text-[20px]">
                                    {solAmount + 0.2} SOL
                                </p>
                            </div>
                        </div>
                        <div className="w-full border-[1px] " />
                        <div className="flex flex-col items-center p-[20px]">
                            {
                                !connected ?
                                    <WalletMultiButton />
                                    :
                                    <div className="flex flex-row items-center gap-5">
                                        <button className={`w-[150px] h-[50px] ${enableAddLiquidity ? 'bg-blue-900  hover:bg-gray-900 ' : 'bg-gray-500 cursor-not-allowed'}  rounded-md`}
                                            onClick={() => enableAddLiquidity && handleAddLiquidity()}>
                                            <p className="text-white text-[18px] font-700">
                                                Add Liquidity
                                            </p>
                                        </button>
                                        <WalletMultiButton />
                                    </div>
                            }
                        </div>
                    </div>

                }
            </div>
            <Footer />
        </div>)
}