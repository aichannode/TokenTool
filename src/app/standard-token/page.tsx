"use client"
import React, { useEffect, useState } from "react";
import { chainInfoList, config, tokenInfoList } from "../../global/config"
import { Select, Option, Slider, Dialog, DialogBody, DialogHeader, Button, DialogFooter } from "@material-tailwind/react";
import { useAccount, useChainId, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import evmTokenContractData from "../../global/global";
import { Address, formatUnits, parseUnits } from 'viem';
import { stdTokenFactoryAbi } from "../../global/abi/stdTokenFactoryAbi";
import { watchContractEvent } from "wagmi/actions";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function StandardToken() {
  const [decimal, setDecimal] = useState(0);
  const [sliderValue, setSliderValue] = useState<number>(100);
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenNameValidateMsg, setTokenNameValidateMsg] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenSymbolValidateMsg, setTokenSymbolValidateMsg] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(18);
  const [decimalsValidationMsg, setDecimalsValidationMsg] = useState<string>("");
  const [totalSupply, setTotalSupply] = useState<number>(1000);
  const [totalSupplyValidationMsg, setTotalSupplyValidationMsg] = useState<string>("");
  const [flatFee, setFlatFee] = useState<bigint | undefined>();
  const [createdTx, setCreatedTx] = useState<string>("");
  const [createTokenAddress, setCreatedTokenAddress] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false)
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract } = useWriteContract();
  const chainId = useChainId();


  const result = useReadContract({
    abi: stdTokenFactoryAbi,
    address: evmTokenContractData[chainId]?.stdTokenFactoryAddress as Address,
    functionName: 'flatFee'
  });

  useEffect(() => {
    if (result?.data) {
      setFlatFee(result?.data);
    }
  }, [result])

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
      tokenSymbolValidation(tokenSymbol) &&
      decimalsValidation(decimals) &&
      totalSupplyValidation(totalSupply)
    )
      return true
    else
      return false
  }

  const handleCreateToken = () => {
    if (!checkValidation())
      return;
    writeContract({
      chainId: chainId,
      abi: stdTokenFactoryAbi,
      address: evmTokenContractData[chainId]?.stdTokenFactoryAddress as Address,
      functionName: 'create',
      args: [
        tokenName,
        tokenSymbol,
        decimals,
        parseUnits(totalSupply.toString(), 18)
      ],
      value: flatFee
    })
  }

  const unwatch = watchContractEvent(config, {
    address: evmTokenContractData[chainId]?.stdTokenFactoryAddress as Address,
    abi: stdTokenFactoryAbi,
    eventName: 'TokenCreated',
    onLogs(logs: any) {
      setOpen(true);
      setCreatedTx(logs[0].transactionHash)
      setCreatedTokenAddress(logs[0].args["token"])
      unwatch();
    },
  })


  useEffect(() => {
    let decimalNum = parseInt((sliderValue / 100 * 18).toFixed(0));
    setDecimal(decimalNum);
    setDecimals(decimalNum);
  }, [sliderValue])

  return (
    <div className="flex flex-col items-center p-[20px] pt-[60px] md:pt-[80px] ">
      <p className="text-[30px] md:text-[40px] text-gray-900 font-[700]  mt-[20px]">
        {tokenInfoList[0].title}
      </p>
      <h2 className="w-full md:w-[800px] text-[16px]  md:text-[18px] text-gray-500 font-[500] mt-[20px]">
        Our most popular token, includes all standard features from ERC20 standard token. Including Base, Ethereum, Blast and many more!
      </h2>
      {/* <div className="flex flex-wrap items-center gap-2 mt-[20px]">
                {
                    tokenInfoList[0].utils.map((item, index) => {
                        return <div key={index} className="border-[1px] rounded-full border-blue-600 text-blue-600 text-[12px] p-[2px_6px] md:p-[4px_10px] ">
                            {item}
                        </div>
                    })
                }
            </div> */}
      <div className="mt-[20px]">
        {
          <ConnectButton />
        }
      </div>
      <div className="border-[1px] rounded-xl border-[#AAA] bg-white w-full md:w-[800px] mt-[20px]">
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
              onChange={(e: any) => {
                setTokenName(e.target.value)
                tokenNameValidation(e.target.value)
              }}
              type="text"
              placeholder="Shiba Inu"
              className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]" />
            <p className="text-red-500 text-[14px]">
              {tokenNameValidateMsg}
            </p>
          </div>
          <div className="w-full p-[20px]">
            <p className="font-[500] text-[18px] text-gray-800">
              Token Symbol
            </p>
            <input
              onChange={(e: any) => {
                setTokenSymbol(e.target.value)
                tokenSymbolValidation(e.target.value)
              }}
              type="text"
              placeholder="SHIB"
              className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]" />
            <p className="text-red-500 text-[14px]">
              {tokenSymbolValidateMsg}
            </p>
          </div>
        </div>
        <div className="w-full border-[1px] " />
        <div className="gap-4 p-[20px]">
          <p className="font-[500] text-[18px] text-gray-800">
            Blockchain Network
          </p>
          <div className="mt-[20px]">
            <Select
              selected={(element) =>
                element &&
                React.cloneElement(element, {
                  disabled: true,
                  className:
                    "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                })
              }
              value={chainId.toString()} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
              {
                chainInfoList.map((item: any, index: number) => {
                  return <Option className="flex flex-row items-center gap-2" key={index} value={item.chainId}
                    onClick={() => {
                      switchChain({ chainId: Number(item.chainId) })
                    }}>
                    <Image src={item.icon} alt={item.icon} className="w-[30px] h-[30px] rounded-full" />
                    <p>
                      {item.title}
                    </p>
                  </Option>
                })
              }
            </Select >
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
                setDecimals(parseInt(e.target.value))
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
      </div>

      <div className="border-[1px] rounded-xl border-[#AAA] bg-white w-full md:w-[800px] mt-[20px]">
        <div className="p-[20px]">
          <p className="text-gray-900 text-[24px] font-[700]">
            Token Supply
          </p>
          <p className="text-gray-800 text-[20px]">
            Let's set the supply options for your token.
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <p className="text-[16px] text-gray-800">
            Total Supply
          </p>
          <input
            // defaultValue={totalSupply}
            onChange={(e: any) => {
              setTotalSupply(e.target.value)
              totalSupplyValidation(e.target.value)
            }}
            type="number"
            placeholder="1000000000"
            className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]" />
          <p className="text-red-500 text-[14px]">
            {
              totalSupplyValidationMsg
            }
          </p>
          {/* <p className="text-[16px] text-gray-800 mt-[10px]">
                        Maximum Supply
                    </p>
                    <input type="text" placeholder="Awesome Token" className="w-full border-[1px] p-[8px] outline-none mt-[8px] rounded-[6px]" /> */}
        </div>
      </div>

      <div className="border-[1px] rounded-xl border-[#AAA] bg-white w-full md:w-[800px] mt-[20px]">
        <div className="p-[20px]">
          <p className="text-gray-900 text-[24px] font-[700]">
            Deploy Token
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <p className="text-center text-gray-900 text-[18px]">
            {flatFee !== undefined ? formatUnits(flatFee, 18) : 'N/A'} {evmTokenContractData[chainId].currencyName}
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="flex flex-col items-center p-[20px]">
          {
            isConnected ?
              <button
                onClick={handleCreateToken}
                className="w-[180px] rounded-full bg-blue-500 h-[50px]" >
                <p className="text-white text-[20px] font-[700]">
                  Deploy Token
                </p>
              </button>
              :
              <ConnectButton />
          }
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-[20px] w-full md:w-[800px]">
        <h2 className="text-gray-800 text-[15px]">
          Please note that some wallets won’t automatically show your token. You might have to import or unhide your custom tokens in the wallet settings.
        </h2>
        <p></p>
        <h1 className="w-full text-gray-800 text-[15px] font-[700] text-center">
          How to use EVM Ethereum Standard token creator
        </h1>
        <h2 className="text-gray-800 text-[15px]">
          1 <span className="font-[700]">Connect Wallet</span>: Simply connect any supported wallet to our platform and you’ll be able to create your token in no time
        </h2>
        <h2 className="text-gray-800 text-[15px]">
          2 <span className="font-[700]">Add token details</span>: Add basic details about your tokens such as the name, symbol decimals, and supply
        </h2>
        <h2 className="text-gray-800 text-[15px]">
          3  <span className="font-[700]">Deploy</span>: Once deployed, your token will be available across the entire blockchain ecosystem
        </h2>
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
      </Dialog>
    </div>)
}
