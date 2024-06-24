"use client";
import React, { useCallback, useEffect, useState } from "react";
import { tokenInfoList } from "../../global/config"
import { Slider, Dialog, DialogBody, DialogHeader, Button, DialogFooter, Switch, Tabs, TabsHeader, TabsBody, Tab, TabPanel, Spinner, Option, Select } from "@material-tailwind/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from '@solana/web3.js';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction, getAssociatedTokenAddressSync, createBurnInstruction, getAccount, createSyncNativeInstruction, createAccount, createTransferInstruction, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import StyledDropzone from "../../components/Dropzone";
import { useStorageUpload } from "@thirdweb-dev/react";
import { createSetAuthorityInstruction, AuthorityType } from '@solana/spl-token';
import Footer from "@/components/Footer";
import { fetchSolPrice } from "@/global/service";
import { accountExist, getAmmConfigAddress, getAuthAddress, getOrcleAccountAddress, getPoolAddress, getPoolLpMintAddress, getPoolVaultAddress, getSeconds, useGetLiquidityProgram, useGetProgram } from "@/global/util";
import { Program, BN } from "@coral-xyz/anchor";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";


export default function SplToken() {
  const [decimal, setDecimal] = useState(0);
  const [sliderValue, setSliderValue] = useState<number>(100);
  const [sliderSupplyValue, setSliderSupplyValue] = useState<number>(100);
  const { publicKey, sendTransaction, connected, signAllTransactions } = useWallet();
  const anchorWallet = useAnchorWallet()
  const [tokenName, setTokenName] = useState('');
  const [tokenNameValidateMsg, setTokenNameValidateMsg] = useState<string>("");
  const [symbol, setSymbol] = useState('')
  const [tokenSymbolValidateMsg, setTokenSymbolValidateMsg] = useState<string>("");
  const [metadataImage, setMetadataImage] = useState("");
  const [amount, setAmount] = useState<number>(1000);
  const [totalSupplyValidationMsg, setTotalSupplyValidationMsg] = useState<string>("");
  const [metaDataValidateionMsg, setMetaDataValidationMsg] = useState<string>("");
  const [decimals, setDecimals] = useState('');
  const [decimalsValidationMsg, setDecimalsValidationMsg] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState<boolean>(false);
  const [createdTx, setCreatedTx] = useState<string>("");
  const [createTokenAddress, setCreatedTokenAddress] = useState<string>('');
  const [tokenDescription, setTokenDescription] = useState("");
  const [enableTokenDescription, setEnableTokenDescription] = useState(false);
  const [lpAction, setLpAction] = useState<String>("none" || 'burn');

  const [freezeAuthority, setFreezeAuthority] = useState<boolean>(true);
  const [mintAuthority, setMintAuthority] = useState<boolean>(true);
  const [enableMetadata, setEnableMetadata] = useState<boolean>(true);
  const [mutable, setMutable] = useState<boolean>(false);

  const [addLiquidityOption, setAddLiquidityOption] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [solAmount, setSolAmount] = useState<number>(2);
  const [launchMarketcap, setLaunchMarketCap] = useState<number>(0);
  const [launchMarketcapUSD, setLaunchMarketCapUSD] = useState<number>(0);
  const [launchTokenPrice, setLaunchTokenPrice] = useState<number>(0)
  const [launchTokenPriceUSD, setLaunchTokenPriceUSD] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [fixedFee, setFixedFee] = useState<boolean>(true);
  const [feeAmount, setFeeAmount] = useState<number>(0.3);
  // const [lockDurationAmount, setLockDurationAmount] = useState<number>(1);
  // const [lockDuration, setLockDuration] = useState<"year" | "month" | "week" | "day">('year');
  const { connection } = useConnection();

  const { getProgram } = useGetProgram(connection, anchorWallet!)
  const { getLiquidityProgram } = useGetLiquidityProgram(connection, anchorWallet!)

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


  useEffect(() => {
    if (!fixedFee) {
      if (sliderSupplyValue > 95)
        setSliderSupplyValue(95)
    }
    let tmpTokenAmount = Math.floor(amount / 100 * sliderSupplyValue)
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
  }, [sliderSupplyValue, amount, solAmount, fixedFee]);

  useEffect(() => {
    let decimalNum = parseInt((sliderValue / 100 * 9).toFixed(0));
    setDecimal(decimalNum);
    setDecimals(decimalNum.toString());
  }, [sliderValue])

  useEffect(() => {
    if (addLiquidityOption)
      if (fixedFee)
        setFeeAmount(0.3 + 0.3 + solAmount)
      else
        setFeeAmount(0.3 + solAmount)
  }, [addLiquidityOption, fixedFee, solAmount])

  const { mutateAsync: upload } = useStorageUpload();


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

  // const initializeLockAccount = async (program: Program<LockerManager>) => {
  //   if (!publicKey) {
  //     console.log("Please connect your wallet.");
  //     return;
  //   }
  //   const [lockAccountPDA, _] = await PublicKey.findProgramAddress(
  //     [Buffer.from("lock_account"), publicKey.toBuffer()],
  //     program.programId
  //   );

  //   const initialTx = await program.methods
  //     .initializeLockAccount()
  //     .accounts({
  //       lockAccount: lockAccountPDA,
  //       owner: publicKey!,
  //       systemProgram: SystemProgram.programId,
  //     }).transaction()

  //   return { lockAccount: lockAccountPDA, tx: initialTx };
  // }

  // const lockLPTokens = async (
  //   tokenMintAddress: string,
  // ) => {
  //   if (!publicKey) {
  //     console.log("Please connect your wallet.");
  //     return;
  //   }
  //   try {
  //     const mint = new PublicKey(tokenMintAddress);
  //     // Get the token account for the LP token
  //     const ownerTokenAccount = await getAssociatedTokenAddress(mint, publicKey);
  //     const accountInfo = await connection.getTokenAccountBalance(ownerTokenAccount);
  //     const lockTime = getSeconds(lockDurationAmount, lockDuration);
  //     const liquidityProgram = getLiquidityProgram()

  //     const fromAssociatedTokenAddress = await getAssociatedTokenAddress(
  //       mint,
  //       publicKey
  //     );
  //     console.log("🚀 ~ SplToken ~ fromAssociatedTokenAddress:", fromAssociatedTokenAddress.toBase58())

  //     // Check if the associated token account already exists
  //     const fromTokenAccount = await connection.getAccountInfo(fromAssociatedTokenAddress);
  //     if (!fromTokenAccount) {
  //       console.log("Token account not exist");
  //     }

  //     // Create toTokenAccount with a different owner
  //     const toTokenAccountOwner = Keypair.generate();

  //     const toAssociatedTokenAddress = await getAssociatedTokenAddress(
  //       mint,
  //       toTokenAccountOwner.publicKey
  //     );

  //     console.log("🚀 ~ SplToken ~ toAssociatedTokenAddress:", toAssociatedTokenAddress.toBase58())
  //     // Create the associated token account instruction
  //     const createTokenAccountIx = createAssociatedTokenAccountInstruction(
  //       publicKey, // Payer
  //       toAssociatedTokenAddress, // Associated token account address
  //       toTokenAccountOwner.publicKey, // Owner of the token account
  //       mint // Token mint address
  //     );

  //     const res = await initializeLockAccount(liquidityProgram);
  //     if (!res) {
  //       console.log("Initialize lock account error")
  //       return
  //     }

  //     const lockTx = await liquidityProgram.methods
  //       .lockTokens(new BN(accountInfo.value.amount), new BN(lockTime))
  //       .accounts({
  //         owner: publicKey!,
  //         lockAccount: res.lockAccount,
  //         from: fromAssociatedTokenAddress,
  //         to: toAssociatedTokenAddress,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //       }).transaction()


  //     // Create the lock transaction
  //     const transaction = new Transaction().add(
  //       res.tx,
  //       createTokenAccountIx,
  //       lockTx
  //     );

  //     const transactionSignature = await sendTransaction(
  //       transaction,
  //       connection,
  //       { skipPreflight: true, preflightCommitment: "finalized" }
  //     );

  //     console.log("🚀 ~ SplToken ~ transactionSignature:", transactionSignature)
  //     const ret1 = await connection.confirmTransaction(transactionSignature, "confirmed")
  //     if (ret1.value.err) {
  //       console.log("error", ret1.value.err.toString())
  //       setLoading(false);
  //     }
  //     else {
  //       console.log("success")
  //     }

  //     return transactionSignature;
  //   } catch (error) {
  //     console.error("Failed to lock LP tokens:", error);
  //     throw error;
  //   }
  // };


  const onClick = useCallback(async (form: any) => {
    if (!publicKey) {
      console.log("Please connect your wallet.");
      return;
    }
    try {

      setLoadingMessage("Creating token....")
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = Keypair.generate();
      const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);




      const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
        {
          metadata: PublicKey.findProgramAddressSync(
            [
              Buffer.from("metadata"),
              PROGRAM_ID.toBuffer(),
              mintKeypair.publicKey.toBuffer(),
            ],
            PROGRAM_ID,
          )[0],
          mint: mintKeypair.publicKey,
          mintAuthority: publicKey,
          payer: publicKey,
          updateAuthority: publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: {
              name: form.tokenName,
              symbol: form.symbol,
              uri: form.metadata[0],
              creators: null,
              sellerFeeBasisPoints: 0,
              uses: null,
              collection: null,
            },
            isMutable: mutable,
            collectionDetails: null,
          },
        },
      );

      const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports: lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,  //mint address
          form.decimals, //Number of Decimals of New mint
          publicKey, //Mint Authority
          !freezeAuthority ? publicKey : null,//Freeze Authority
          TOKEN_PROGRAM_ID),
        createAssociatedTokenAccountInstruction(
          publicKey,//Payer 
          tokenATA,//Associated token account 
          publicKey, //token owner
          mintKeypair.publicKey,//Mint
        ),
        createMintToInstruction(
          mintKeypair.publicKey,//Mint
          tokenATA, //Destination Token Account
          publicKey, //Authority
          form.amount * Math.pow(10, form.decimals),//number of tokens
        ),
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("5hYsGSXaMv7B4YJx1Vu3Gv7fmFQ5fHTUcMSyfekijDXo"),
          lamports: 0.28 * LAMPORTS_PER_SOL // Custom fee amount in lamports
        }),
        createMetadataInstruction,
        ...(mintAuthority ? [createSetAuthorityInstruction(
          mintKeypair.publicKey, // Mint
          publicKey, // Current mint authority
          AuthorityType.MintTokens,
          null // New authority (null to remove minting capability)
        )] : [])
      );
      if (mintAuthority) {
        createSetAuthorityInstruction(
          mintKeypair.publicKey, // Mint
          publicKey, // Current mint authority
          AuthorityType.MintTokens,
          null // New authority (null to remove minting capability)
        )
      }

      let res = await sendTransaction(createNewTokenTransaction, connection, { signers: [mintKeypair] });
      const ret = await connection.confirmTransaction(res, "finalized")
      if (ret.value.err) {
        console.log("error", ret.value.err.toString())
        setLoading(false);
      }
      else {
        console.log("success")
      }


      /////////////////Create Liquidity Pool on Raydium

      if (addLiquidityOption) {
        if (fixedFee)
          setLoadingMessage("Wrapping SOL and 0.3 SOL as a fee....")
        else
          setLoadingMessage("Wrapping SOL and 5% of Token as a fee....")
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

        let tokenFeeTx;

        if (!fixedFee) {
          const senderTokenAccountAddress = await getAssociatedTokenAddress(
            mintKeypair.publicKey,
            publicKey
          );

          const associatedTokenAddress = await getAssociatedTokenAddress(
            mintKeypair.publicKey,
            new PublicKey("5hYsGSXaMv7B4YJx1Vu3Gv7fmFQ5fHTUcMSyfekijDXo"),
          );

          tokenFeeTx = new Transaction().add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              associatedTokenAddress,
              new PublicKey("5hYsGSXaMv7B4YJx1Vu3Gv7fmFQ5fHTUcMSyfekijDXo"),
              mintKeypair.publicKey,
              TOKEN_PROGRAM_ID
            ),
            createTransferInstruction(
              senderTokenAccountAddress,
              associatedTokenAddress,
              publicKey,
              parseInt((amount * 5 / 100 * LAMPORTS_PER_SOL).toString())
            )
          )

        }
        else {
          tokenFeeTx = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey("5hYsGSXaMv7B4YJx1Vu3Gv7fmFQ5fHTUcMSyfekijDXo"),
            lamports: (0.3) * LAMPORTS_PER_SOL // Custom fee amount in lamports
          })
        }


        const wrapSolAmount = solAmount * 10 ** 9;
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: associatedTokenAccount,
            lamports: wrapSolAmount,
          }),
          createSyncNativeInstruction(associatedTokenAccount),
          tokenFeeTx
        );
        const signature = await sendTransaction(transaction, connection);
        const wrapSolRet = await connection.confirmTransaction(signature, "finalized")
        if (wrapSolRet.value.err) {
          console.log("error", wrapSolRet.value.err.toString())
          setLoading(false);
        }
        else {
          console.log("success")
        }

        setLoadingMessage("Creating Raydium Pool....")
        let configAddress: PublicKey;
        if (!publicKey) {
          return
        }

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
        const mintA = mintKeypair.publicKey
        const isFront = new BN(new PublicKey(mintA.toBase58()).toBuffer()).lte(
          new BN(new PublicKey(mintB.toBase58()).toBuffer()),
        );

        const [token0, token1] = isFront ? [mintA, mintB] : [mintB, mintA];
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

        const createPoolFee = new PublicKey("G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2")
        const ins = await program.methods
          .initialize(new BN(solAmount).mul(new BN(LAMPORTS_PER_SOL)), new BN(tokenAmount).mul(new BN(LAMPORTS_PER_SOL)), new BN(0))
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

        tx.add(ins)

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
        // else if (lpAction == "lock") {
        //   setLoadingMessage("Locking LP token....")
        //   await lockLPTokens(lpMintAddress.toBase58());

        // }
      }


      // setCreatedTx(res);
      setCreatedTokenAddress(mintKeypair.publicKey.toBase58());
      setOpen(true);
      setSymbol("");
      setDecimal(9);
      setTokenName("");
      setAmount(0);
      setLoading(false);
    } catch (error) {
      console.log("error", error)
      setLoading(false);
    }
  }, [publicKey, connection, sendTransaction, mutable, freezeAuthority, mintAuthority, tokenAmount, solAmount, addLiquidityOption, lpAction, fixedFee]);


  const tokenNameValidation = (input: string) => {
    if (input == "") {
      setTokenNameValidateMsg("Token Name is required!");
      return false
    }
    else {
      setTokenNameValidateMsg("");
      return true
    }
  }

  const tokenSymbolValidation = (input: string) => {
    if (input == "") {
      setTokenSymbolValidateMsg("Token Symbol is required!");
      return false
    }
    else {
      setTokenSymbolValidateMsg("")
      return true
    }
  }

  const decimalsValidation = (input: number) => {
    if (input <= 0) {
      setDecimalsValidationMsg("Decimals should be greater than zero!");
      return false
    }
    else {
      setDecimalsValidationMsg("");
      return true
    }
  }

  const totalSupplyValidation = (input: number) => {
    if (input <= 0) {
      setTotalSupplyValidationMsg("Total Supply should be greater than zero!");
      return false
    }
    else {
      setTotalSupplyValidationMsg("")
      return true
    }
  }

  const checkValidation = () => {
    if (
      tokenNameValidation(tokenName) &&
      tokenSymbolValidation(symbol) &&
      decimalsValidation(decimal) &&
      totalSupplyValidation(amount)
    )
      return true
    else
      return false
  }


  const checkBalance = async () => {
    if (!publicKey) {
      console.log("Please connect your wallet.");
      return;
    }
    const balance = await connection.getBalance(publicKey)
    const lamportBalance = (balance / LAMPORTS_PER_SOL);
    if (lamportBalance < feeAmount)
      return false;
    return true;
  }


  const handleCreateToken = async () => {
    let balanceCheck = await checkBalance();
    if (!balanceCheck) {
      setBalanceModalOpen(true)
      return;
    }
    setLoading(true);
    if (!checkValidation())
      return;

    const metadata = {
      name: tokenName,
      symbol: symbol,
      description: enableTokenDescription ? tokenDescription : "",
      image: metadataImage[0]
    }

    const jsonString = JSON.stringify(metadata);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], "metadata.json", { type: "application/json" });
    const uploadUrl = await upload({
      data: [file],
      options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
    });


    onClick({ decimals: Number(decimals), amount: Number(amount), metadata: uploadUrl, symbol: symbol, tokenName: tokenName })

  }

  const openTokenOnScan = () => {
    window.open("https://solscan.io/account/" + createTokenAddress)
  }

  const openTransactionOnScan = () => {
    window.open("https://solscan.io/tx/" + createdTx)
  }


  return (
    <div className="flex flex-col items-center px-[20px] pt-[60px] md:pt-[80px]">
      <Dialog className="bg-transparent flex flex-col justify-center items-center" open={loading} handler={() => { }} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <Spinner onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} />
        <p className="text-white text-[20px] mt-[20px]">
          {loadingMessage}
        </p>
      </Dialog>
      <p className="text-[30px] md:text-[40px] text-gray-900 font-[700] mt-[20px]">
        {tokenInfoList[1].title}
      </p>
      <p className="w-full md:w-[800px] text-[16px]  md:text-[18px] text-gray-500 font-[500] mt-[20px]">
        {tokenInfoList[1].info}
      </p>
      {/* <div className="flex flex-wrap items-center gap-2 mt-[20px]">
                {
                    tokenInfoList[1].utils.map((item, index) => {
                        return <div key={index} className="border-[1px] rounded-full border-blue-600 text-blue-600 text-[12px] p-[2px_6px] md:p-[4px_10px] ">
                            {item}
                        </div>
                    })
                }
            </div> */}
      <div className="mt-[20px]">
        <WalletMultiButton />
      </div>
      <div className="border-[1px] border-[#AAA] bg-white rounded-xl w-full md:w-[800px] mt-[20px]">
        <div className="p-[20px]">
          <p className="text-gray-900 text-[20px] md:text-[24px] font-[700]">
            Token Information
          </p>
          <p className="text-gray-800 text-[16px] md:text-[20px]">
            Basic Information about your token
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="w-full flex flex-row items-center">
          <div className="w-full p-[20px]">
            <p className="font-[500] text-[18px] text-gray-800">
              Token Name
            </p>
            <input
              type="text" placeholder="dogwifhat" value={tokenName} className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
              onChange={(e) => {
                tokenNameValidation(e.target.value)
                setTokenName(e.target.value)
              }} />
            <p className="text-red-500 text-[14px]">
              {tokenNameValidateMsg}
            </p>
          </div>
          <div className="w-full p-[20px]">
            <p className="font-[500] text-[18px] text-gray-800">
              Token Symbol
            </p>
            <input
              type="text" placeholder="WIF" value={symbol} className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
              onChange={(e) => {
                setSymbol(e.target.value)
                tokenSymbolValidation(e.target.value)
              }} />
            <p className="text-red-500 text-[14px]">
              {tokenSymbolValidateMsg}
            </p>
          </div>
        </div>
        <div className="w-full border-[1px] " />
        <div className="gap-4 p-[20px]">
          <p className="font-[500] text-[18px] text-gray-800">
            Custom Decimals
          </p>
          <p className="font-[500] text-[14px] text-gray-500">
            Change the number of decimals for your token.
          </p>
          <div className="flex flex-row items-center gap-2">
            <Slider
              value={sliderValue}
              onChange={(e) => {
                setSliderValue(parseInt(e.target.value));
                setDecimals(parseInt(e.target.value).toString())
                decimalsValidation(parseInt(e.target.value))
              }}
              color="blue"
              placeholder={""}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }} />
            <p className="font-[700] text-[20px] text-gray-800">
              {decimal}
            </p>
          </div>
          <p className="text-red-500 text-[14px]">
            {decimalsValidationMsg}
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="w-full p-[20px]">
          <p className="font-[500] text-[18px] text-gray-800">
            Token Supply
          </p>
          <input type="number" placeholder="100000" value={amount} className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
            onChange={(e: any) => {
              setAmount(parseInt(e.target.value))
              totalSupplyValidation(e.target.value)
            }} />
          <p className="text-red-500 text-[14px]">
            {
              totalSupplyValidationMsg
            }
          </p>
        </div>
      </div>

      <div className="border-[1px] border-[#AAA] bg-white rounded-xl w-full md:w-[800px] mt-[20px]">
        <div className="p-[20px]">
          <p className="text-gray-900 text-[20px] md:text-[24px] font-[700]">
            Additional Metadata
          </p>
          <p className="text-gray-800 text-[16px] md:text-[20px]">
            Additional details about your token.
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <p className="text-[16px] text-gray-800">
            Custom Logo (Optional)
          </p>
          <StyledDropzone metadata={metadataImage} setMetadata={setMetadataImage} />
          <p className="text-red-500 text-[14px]">
            {
              metaDataValidateionMsg
            }
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <p className="text-[16px] text-gray-800">
            Token Description
          </p>
          <div className="flex flex-row justify-between items-center">
            <p className="text-[14px] text-gray-600">
              Add Custom token description
            </p>
            <Switch
              checked={enableTokenDescription}
              onChange={(e) => {
                setEnableTokenDescription(e.target.checked)
              }}
              crossOrigin={() => { }}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }} />
          </div>
          {
            enableTokenDescription &&
            <textarea placeholder="Token Descrition here" className="w-full h-[100px] border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
              onChange={(e) => {
                setTokenDescription(e.target.value)
              }} />
          }
        </div>
      </div>

      <div className="border-[1px] border-[#AAA] bg-white rounded-xl w-full md:w-[800px] mt-[20px]">
        <div className="p-[20px]">
          <p className="text-gray-900 text-[20px] md:text-[24px] font-[700]">
            Options
          </p>
          <p className="text-gray-800 text-[16px] md:text-[20px]">
            Extra options for your token.
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-gray-700 text-[14px]">
                Revoke Freeze Authority (Free)
              </p>
              <p className="text-gray-500 text-14px">
                Renounce the ability to freeze holder wallets. Required for liquidity pool creation.
              </p>
            </div>
            <Switch
              checked={freezeAuthority}
              onChange={(e) => {
                setFreezeAuthority(e.target.checked)
              }}
              crossOrigin={() => { }}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }} />
          </div>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-gray-700 text-[14px]">
                Revoke Mint Authority (Free)
              </p>
              <p className="text-gray-500 text-14px">
                Renounce the ability to mint more tokens for added safety & trust.
              </p>
            </div>
            <Switch
              checked={mintAuthority}
              onChange={(e) => {
                setMintAuthority(e.target.checked)
              }}
              crossOrigin={() => { }}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }} />
          </div>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-gray-700 text-[14px]">
                Enable Metaplex Metadata (Enabled)
              </p>
              <p className="text-gray-500 text-14px">
                Registers your token on the Metaplex Protocol for visibility & discoverability.
              </p>
            </div>
            <Switch
              checked={enableMetadata}
              onChange={(e) => {
                setEnableMetadata(true)
              }}
              crossOrigin={() => { }}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }} />
          </div>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-gray-700 text-[14px]">
                Immutable Metadata
              </p>
              <p className="text-gray-500 text-14px">
                Lock token metadata for added security & trust.
              </p>
            </div>
            <Switch
              checked={mutable}
              onChange={(e) => {
                setMutable(e.target.checked)
              }}
              crossOrigin={() => { }}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }} />
          </div>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-gray-700 text-[14px]">
                Add Initial Liquidity
              </p>
              <p className="text-gray-500 text-14px">
                Automatically create and fund the liqudity pool, this will allow users to buy your token.
              </p>
            </div>
            <Switch
              checked={addLiquidityOption}
              onChange={(e) => {
                setAddLiquidityOption(e.target.checked)
              }}
              crossOrigin={() => { }}
              onPointerEnterCapture={() => { }}
              onPointerLeaveCapture={() => { }} />
          </div>
        </div>
        {
          addLiquidityOption &&
          <div>
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
                <div className=" flex flex-row items-center w-full">
                  <p className="w-full">
                    Token Supply (%)
                  </p>
                  <p className="w-full">
                    SOL Amount
                  </p>
                </div>
                <div className="w-full flex flex-row items-center gap-2">
                  <div className="flex flex-row items-center gap-2 w-full">
                    <Slider
                      value={sliderSupplyValue}
                      onChange={(e) => {
                        setSliderSupplyValue(parseInt(e.target.value));
                      }}
                      color="blue"
                      placeholder={""}
                      onPointerEnterCapture={() => { }}
                      onPointerLeaveCapture={() => { }} />
                    <p className="text-[16px] md:text-[20px]">
                      {sliderSupplyValue}%
                    </p>
                  </div>
                  <input
                    onChange={(e: any) => {
                      setSolAmount(parseFloat(e.target.value))
                    }}
                    value={solAmount}
                    type="number"
                    className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]" />
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
              <div className="flex flex-row items-center gap-2 mt-[20px]">
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
                Fee Option
              </p>
              <div className="flex flex-row w-full justify-between">
                <p className="text-gray-700 text-[12px] md:text-[16px] font-[500]">
                  5% of Minted Token
                </p>
                <Switch
                  checked={!fixedFee}
                  onChange={(e) => {
                    setFixedFee(!fixedFee)
                  }}
                  crossOrigin={() => { }}
                  onPointerEnterCapture={() => { }}
                  onPointerLeaveCapture={() => { }} />
              </div>
              <div className="flex flex-row w-full justify-between">
                <p className="text-gray-700 text-[12px] md:text-[16px] font-[500]">
                  0.3 SOL
                </p>
                <Switch
                  checked={fixedFee}
                  onChange={(e) => {
                    setFixedFee(e.target.checked)
                  }}
                  crossOrigin={() => { }}
                  onPointerEnterCapture={() => { }}
                  onPointerLeaveCapture={() => { }} />
              </div>
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
          </div>
        }
      </div>

      <div className="border-[1px] border-[#AAA] bg-white rounded-xl w-full md:w-[800px] mt-[20px]">
        <div className="p-[20px]">
          <p className="text-gray-900 text-[20px] md:text-[24px] font-[700]">
            Deploy Token
          </p>
          <p className="text-gray-800 text-[16px] md:text-[20px]">
            Ready to deploy?
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <p className="text-center text-gray-900 text-[18px]">
            {feeAmount} SOL
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="flex flex-col items-center p-[20px]">
          {
            !connected ?
              <WalletMultiButton />
              :
              <div className="flex flex-row items-center gap-5">
                <button className="w-[150px] h-[50px] bg-blue-900 hover:bg-gray-900 rounded-md"
                  onClick={handleCreateToken}>
                  <p className="text-white text-[18px] font-700">
                    Deploy Token
                  </p>
                </button>
                <WalletMultiButton />
              </div>
          }
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-[20px] w-full md:w-[800px]">
        <h1 className="text-gray-800 text-[15px] font-[700] w-full text-center">
          Create Solana Token
        </h1>
        <h3 className="text-gray-800 text-[15px]">
          Effortlessly create your Solana SPL Token with our 6+4 step process – no coding required.
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          Customize your Solana Token exactly the way you envision it. It takes 1  minute, at an affordable cost.
        </h3>
        <h1 className="text-gray-800 text-[15px] font-[700] w-full text-center">
          How to use Solana Token Creator
        </h1>
        <h3 className="text-gray-800 text-[15px]">
          1. Connect your Solana wallet.
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          2. Specify the desired name for your Token
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          3. Indicate the symbol (max 8 characters).
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          4. Select the decimals quantity (0 for Whitelist Token, 5 for utility Token, 9 for meme token).
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          5. Provide a brief description for your SPL Token.
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          6. Upload the image for your token (PNG).
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          7. Determine the Supply of your Token.
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          8. Click on deploy, accept the transaction and wait until your tokens ready.
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          The cost of Token creation is 0.3 SOL, covering all fees for SPL Token Creation.
        </h3>
        <h1 className="text-gray-800 text-[15px] font-[700] w-full text-center">
          Revoke Freeze Authority:
        </h1>
        <h3 className="text-gray-800 text-[15px]">
          If you want to create a liquidity pool you will need to "Revoke Freeze Authority" of the Token, you can do that here. This is free on TokenTool!
        </h3>
        <h1 className="text-gray-800 text-[15px] font-[700] w-full text-center">
          Revoke Mint Authority:
        </h1>
        <h3 className="text-gray-800 text-[15px]">
          Revoking mint authority ensures that there can be no more tokens minted than the total supply. This provides security and peace of mind to buyers. This is also free on TokenTool!
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          Once the creation process starts, it will only take a few seconds! Once complete, you will receive the total supply of the token in your wallet.
        </h3>
        <h3 className="text-gray-800 text-[15px]">
          With our user-friendly platform, managing your tokens is simple and affordable. Using your wallet, you can easily create tokens, increase their supply, or freeze them as needed. Discover the ease of Solana Token creation with us
        </h3>

      </div>
      <Footer />
      <Dialog open={open} handler={() => { }} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <DialogHeader placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          Token creted successfully!
        </DialogHeader>
        <DialogBody className="flex flex-col gap-2 font-[500] text-[18px]" placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          <button className="w-full h-[50px] rounded-full bg-blue-800 text-white" onClick={openTokenOnScan}>
            Open Token on Solscan
          </button>
          <button className="w-full h-[50px] rounded-full bg-gray-100 text-black" onClick={openTransactionOnScan}>
            Open Transaction on Solscan
          </button>
          <button className="w-full h-[50px] rounded-full bg-red-800 text-white" onClick={() => setOpen(false)}>
            Close
          </button>
        </DialogBody>
      </Dialog>
      <Dialog open={balanceModalOpen} handler={() => { }} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <DialogBody placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          You need at least {feeAmount} sol to create your token
        </DialogBody>
        <DialogFooter placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          <Button placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} variant="gradient" color="blue" onClick={() => {
            setBalanceModalOpen(false)
          }}>
            <span>OK</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div >)
}
