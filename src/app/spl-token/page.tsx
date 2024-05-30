"use client";
import { useCallback, useEffect, useState } from "react";
import { tokenInfoList } from "../../global/config"
import { Slider, Switch, Dialog, DialogBody, DialogHeader, Button, DialogFooter } from "@material-tailwind/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import StyledDropzone from "../../components/Dropzone";
import { useStorageUpload } from "@thirdweb-dev/react";
import { createSetAuthorityInstruction, AuthorityType } from '@solana/spl-token';


export default function SplToken() {
  const [decimal, setDecimal] = useState(0);
  const [sliderValue, setSliderValue] = useState<number>(100);
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [tokenName, setTokenName] = useState('')
  const [tokenNameValidateMsg, setTokenNameValidateMsg] = useState<string>("");
  const [symbol, setSymbol] = useState('')
  const [tokenSymbolValidateMsg, setTokenSymbolValidateMsg] = useState<string>("");
  const [metadataImage, setMetadataImage] = useState("");
  const [amount, setAmount] = useState(0);
  const [totalSupplyValidationMsg, setTotalSupplyValidationMsg] = useState<string>("");
  const [metaDataValidateionMsg, setMetaDataValidationMsg] = useState<string>("");
  const [decimals, setDecimals] = useState('');
  const [decimalsValidationMsg, setDecimalsValidationMsg] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false)
  const [createdTx, setCreatedTx] = useState<string>("");
  const [createTokenAddress, setCreatedTokenAddress] = useState<string>('');
  const [tokenDescription, setTokenDescription] = useState("");
  const [enableTokenDescription, setEnableTokenDescription] = useState(false);

  const [freezeAuthority, setFreezeAuthority] = useState<boolean>(true);
  const [mintAuthority, setMintAuthority] = useState<boolean>(true);
  const [enableMetadata, setEnableMetadata] = useState<boolean>(true);
  const [mutable, setMutable] = useState<boolean>(false);



  useEffect(() => {
    let decimalNum = parseInt((sliderValue / 100 * 9).toFixed(0));
    setDecimal(decimalNum);
    setDecimals(decimalNum.toString());
  }, [sliderValue])

  const { mutateAsync: upload } = useStorageUpload();

  const onClick = useCallback(async (form: any) => {
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const mintKeypair = Keypair.generate();
    const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey!);

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
        mintAuthority: publicKey!,
        payer: publicKey!,
        updateAuthority: publicKey!,
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
        fromPubkey: publicKey!,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports: lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintKeypair.publicKey,  //mint address
        form.decimals, //Number of Decimals of New mint
        publicKey!, //Mint Authority
        !freezeAuthority ? publicKey : null,//Freeze Authority
        TOKEN_PROGRAM_ID),
      createAssociatedTokenAccountInstruction(
        publicKey!,//Payer 
        tokenATA,//Associated token account 
        publicKey!, //token owner
        mintKeypair.publicKey,//Mint
      ),
      createMintToInstruction(
        mintKeypair.publicKey,//Mint
        tokenATA, //Destination Token Account
        publicKey!, //Authority
        form.amount * Math.pow(10, form.decimals),//number of tokens
      ),
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey("5hYsGSXaMv7B4YJx1Vu3Gv7fmFQ5fHTUcMSyfekijDXo"),
        lamports: 0.001 * LAMPORTS_PER_SOL // Custom fee amount in lamports
      }),
      createMetadataInstruction,
      ...(mintAuthority ? [createSetAuthorityInstruction(
        mintKeypair.publicKey, // Mint
        publicKey!, // Current mint authority
        AuthorityType.MintTokens,
        null // New authority (null to remove minting capability)
      )] : [])
    );
    if (mintAuthority) {
      createSetAuthorityInstruction(
        mintKeypair.publicKey, // Mint
        publicKey!, // Current mint authority
        AuthorityType.MintTokens,
        null // New authority (null to remove minting capability)
      )
    }

    let res = await sendTransaction(createNewTokenTransaction, connection, { signers: [mintKeypair] });
    setCreatedTx(res);
    setCreatedTokenAddress(mintKeypair.publicKey.toBase58());
    setOpen(true)
  }, [publicKey, connection, sendTransaction, mutable, freezeAuthority, mintAuthority,]);


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

  const metaDataValidation = (input: string) => {
    if (input == "") {
      setMetaDataValidationMsg("Please select meta image"!);
      return false
    }
    else {
      setMetaDataValidationMsg("")
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

  const handleCreateToken = async () => {
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

  return (
    <div className="flex flex-col items-center p-[20px] pt-[60px] md:pt-[80px]">
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
          <p className="text-gray-900 text-[24px] font-[700]">
            Token Information
          </p>
          <p className="text-gray-800 text-[20px]">
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
              type="text" placeholder="dogwifhat" className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
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
              type="text" placeholder="WIF" className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
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
          <input type="number" placeholder="100000" className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]"
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
          <p className="text-gray-900 text-[24px] font-[700]">
            Additional Metadata
          </p>
          <p className="text-gray-800 text-[20px]">
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
          <p className="text-gray-900 text-[24px] font-[700]">
            Options
          </p>
          <p className="text-gray-800 text-[20px]">
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

      </div>

      <div className="border-[1px] border-[#AAA] bg-white rounded-xl w-full md:w-[800px] mt-[20px]">
        <div className="p-[20px]">
          <p className="text-gray-900 text-[24px] font-[700]">
            Deploy Token
          </p>
          <p className="text-gray-800 text-[20px]">
            Ready to deploy?
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <p className="text-center text-gray-900 text-[18px]">
            0.3 SOL
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

      <Dialog open={open} handler={() => { }} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <DialogHeader placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          Token creted successfully!
        </DialogHeader>
        <DialogBody placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          <div className="flex flex-row items-center justify-between">
            <div>
              Created Token Address:
            </div>
            <div className="w-[350px] break-words">
              {createTokenAddress}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between mt-[20px]">
            <div>
              Created Token Transaction:
            </div>
            <div className="w-[350px] break-words">
              {createdTx}
            </div>
          </div>
        </DialogBody>
        <DialogFooter placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          <Button placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} variant="gradient" color="blue" onClick={() => {
            setOpen(false)
          }}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
        {/* <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter> */}
      </Dialog>
    </div >)
}
