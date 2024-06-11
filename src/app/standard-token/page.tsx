"use client"
import React, { useCallback, useEffect, useState } from "react";
import { addTokenToWallet, blockExplorers, chainInfoList, explorerName, priceList, tokenInfoList } from "../../global/config"
import { Select, Option, Slider, Dialog, DialogBody, DialogHeader, Button, DialogFooter, Spinner, Switch } from "@material-tailwind/react";
import { useAccount, useBalance, useChainId, useContractRead, useContractWrite, useSwitchNetwork, usePrepareContractWrite, useContractEvent, useWaitForTransaction } from "wagmi";
import evmTokenContractData from "../../global/global";
import { Address, formatUnits, parseUnits } from 'viem';
import { stdTokenFactoryAbi } from "../../global/abi/stdTokenFactoryAbi";
import { watchContractEvent } from "wagmi/actions";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function StandardToken() {
  const [decimal, setDecimal] = useState(0);
  const [sliderValue, setSliderValue] = useState<number>(100);
  const [sliderSupplyValue, setSliderSupplyValue] = useState<number>(100);
  const [deployLoading, setDeployLoading] = useState<boolean>(false);
  const [tokenName, setTokenName] = useState<string>("");
  const [liquidityAmount, setLiquidityAmount] = useState<number>(0);
  const [tokenNameValidateMsg, setTokenNameValidateMsg] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenSymbolValidateMsg, setTokenSymbolValidateMsg] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(18);
  const [decimalsValidationMsg, setDecimalsValidationMsg] = useState<string>("");
  const [totalSupply, setTotalSupply] = useState<number>(1000);
  const [totalSupplyValidationMsg, setTotalSupplyValidationMsg] = useState<string>("");
  const [flatFee, setFlatFee] = useState<bigint | undefined>();
  const [createdTx, setCreatedTx] = useState<string>("");
  const [createTokenAddress, setCreatedTokenAddress] = useState<string | undefined>('');
  const [open, setOpen] = useState<boolean>(false)
  const [balanceModalOpen, setBalanceModalOpen] = useState<boolean>(false)
  const { isConnected, address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const [addLiquidityOption, setAddLiquidityOption] = useState<boolean>(false);
  const chainId = useChainId();

  useEffect(() => {
    console.log("🚀 ~ StandardToken ~ addLiquidityOption:", addLiquidityOption)
  }, [addLiquidityOption])


  const result = useContractRead({
    abi: stdTokenFactoryAbi,
    address: evmTokenContractData[chainId]?.stdTokenFactoryAddress as Address,
    functionName: 'flatFee'
  });

  const mybalance = useBalance({
    address: address as Address,
  })

  const { config, error: prepareError, isError: isPrepareError, refetch: prepareRefetch } = usePrepareContractWrite({
    chainId: chainId,
    address: evmTokenContractData[chainId]?.stdTokenFactoryAddress as Address,
    abi: stdTokenFactoryAbi,
    functionName: 'create',
    args: [
      tokenName,
      tokenSymbol,
      decimals,
      parseUnits(totalSupply.toString(), 18)
    ],
    value: flatFee,
    onSuccess(data) {
      setDeployLoading(false)
    },
    onError(error) {
      setDeployLoading(false)
    },
  })

  const { data, write, isLoading: isWriteLoading, isError } = useContractWrite(config);

  useEffect(() => {
    if (isError)
      setDeployLoading(false)
  }, [isError])


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

  const checkBalance = () => {
    if (mybalance.data?.value != undefined) {
      console.log("mybalance", parseFloat(formatUnits(mybalance.data?.value, 18)));
      console.log("required balance", priceList[chainId as keyof typeof priceList].price);
      if (parseFloat(formatUnits(mybalance.data?.value, 18)) < priceList[chainId as keyof typeof priceList].price)
        return false
    }
    return true;
  }

  const handleCreateToken = () => {
    if (!checkBalance()) {
      setBalanceModalOpen(true);
      return;
    }
    if (!checkValidation())
      return;

    if (isPrepareError) {
      console.log('Create fair launch error', prepareError?.message)
      return;
    }
    setDeployLoading(true);
    write?.()

  }
  const { isLoading } = useWaitForTransaction({
    chainId: chainId,
    confirmations: 10,
    hash: data?.hash,
    onSuccess(txData) {
      console.log('hash:', data?.hash)
      setDeployLoading(false);
    },
    onError(error) {
      setDeployLoading(false);
      console.log(`Create fairlaunch Error:`, error?.message)
    },
  })

  const unwatch = useContractEvent({
    address: evmTokenContractData[chainId]?.stdTokenFactoryAddress as Address,
    abi: stdTokenFactoryAbi,
    eventName: 'TokenCreated',
    listener(logs) {
      setDeployLoading(false);
      setOpen(true);
      setCreatedTx(logs[0].transactionHash)
      setCreatedTokenAddress(logs[0].args["token"])
      setTokenName("")
      setTokenSymbol("")
      setTotalSupply(0)
      setDecimal(18)
      unwatch?.();
    },
  })


  useEffect(() => {
    let decimalNum = parseInt((sliderValue / 100 * 18).toFixed(0));
    setDecimal(decimalNum);
    setDecimals(decimalNum);
  }, [sliderValue])


  const handleAddTokenToWallet = useCallback(async () => {
    await addTokenToWallet({ createTokenAddress, tokenSymbol, decimal })
  }, [createTokenAddress, tokenSymbol, decimal])



  const openTokenOnScan = () => {
    window.open(blockExplorers(chainId) + "address/" + createTokenAddress)
  }

  const openTransactionOnScan = () => {
    window.open(blockExplorers(chainId) + "tx/" + createdTx)
  }


  return (
    <div className="flex flex-col items-center px-[20px] pt-[60px] md:pt-[80px] ">
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
              onChange={(e: any) => {
                setTokenName(e.target.value)
                tokenNameValidation(e.target.value)
              }}
              value={tokenName}
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
              value={tokenSymbol}
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
                      if (switchNetwork) {
                        switchNetwork(Number(item.chainId));
                      } else {
                        console.error('Network switching is not available.');
                      }
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
          <p className="text-gray-900 text-[20px] md:text-[24px] font-[700]">
            Token Supply
          </p>
          <p className="text-gray-800 text-[16px] md:text-[20px]">
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
            value={totalSupply}
            onChange={(e: any) => {
              setTotalSupply(e.target.value)
              totalSupplyValidation(e.target.value)
            }}
            type="number"
            placeholder="1000"
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
          <p className="text-gray-900 text-[20px] md:text-[24px] font-[700]">
            Liquidity Options
          </p>
          <p className="text-gray-800 text-[16px] md:text-[20px]">
            Quickly add liquidity for your token.
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px] flex flex-row items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-gray-800 text-[14px] md:text-[16px] font-[600]">
              Add Initial Liquidity
            </p>
            <p className="text-gray-700 text-[12px] md:text-[16px] font-[500]">
              Automatically create and fund the liqudity pool, this will allow users to buy your token.
            </p>
          </div>
          <Switch
            checked={addLiquidityOption}
            onChange={(e) => {
              console.log("🚀 ~ StandardToken ~ e:", e)
              setAddLiquidityOption(!addLiquidityOption)
            }}
            crossOrigin={() => { }}
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }} />
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
                  Pair a percentage of your token supply with BNB to fundthe liquidity pool, We recommend pairing at least 10% of your token supply with at least 1 BNB.
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-[20px]">
                <div className=" flex flex-row items-center w-full">
                  <p className="w-full">
                    Token Supply (%)
                  </p>
                  <p className="w-full">
                    BNB Amount
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
                      setLiquidityAmount(parseInt(e.target.value))
                    }}
                    value={liquidityAmount}
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
                      43,000
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start w-full p-[10px] border-[1px] rounded-xl">
                  <div className="flex flex-col items-start">
                    <p className="text-[18px] text-gray-800">
                      ETH
                    </p>
                    <p className="text-[18px] text-gray-800">
                      19.90
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
                      46.28 ETH
                      <span className="text-[14px]">
                        (~176,248.28 USD)
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
                      0.000463ETH
                      <span className="text-[14px]">
                        (~1.76 USD)
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
                We'll use the selected DEX to create your liquidity pair and seed the initial pool.
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
                  <Option className="flex flex-row items-center gap-2"
                    onClick={() => {
                    }}>
                    <p>
                      SushiSwap V2
                    </p>
                  </Option>
                  <Option className="flex flex-row items-center gap-2"
                    onClick={() => {
                    }}>
                    <p>
                      Uniswap V2
                    </p>
                  </Option>
                </Select >
              </div>
            </div>
            <div className="w-full border-[1px] " />
            <div className="p-[20px]">
              <p className="text-gray-800 text-[14px] md:text-[16px] font-[600]">
                Liquidity Action & Ownership
              </p>
              <p className="text-gray-700 text-[12px] md:text-[16px] font-[500]">
                By default, the liquidity will be sent to you. However, you can choose to burn or lock the liquidity. We recommend burning the liquidity, or locking for at least 1 year.
              </p>
            </div>
          </div>
        }
      </div>

      <div className="border-[1px] rounded-xl border-[#AAA] bg-white w-full md:w-[800px] mt-[20px]">
        <div className="p-[20px]">
          <p className="text-gray-900 text-[20px] md:text-[24px] font-[700]">
            Deploy Token
          </p>
        </div>
        <div className="w-full border-[1px] " />
        <div className="p-[20px]">
          <p className="text-center text-gray-900 text-[18px]">
            {flatFee !== undefined ? formatUnits(flatFee, 18) : '0'} {evmTokenContractData[chainId].currencyName}
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
      <Dialog className="bg-transparent flex flex-col justify-center items-center" open={deployLoading} handler={() => { }} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <Spinner onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} />
      </Dialog>
      <Dialog open={open} handler={() => { }} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <DialogHeader placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          Token creted successfully!
        </DialogHeader>
        <DialogBody className="flex flex-col gap-2 font-[500] text-[18px]" placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          <button className="w-full h-[50px] rounded-full bg-blue-800 text-white" onClick={openTokenOnScan}>
            Open Token on {explorerName(chainId)}
          </button>
          <button className="w-full h-[50px] rounded-full bg-gray-100 text-black" onClick={handleAddTokenToWallet}>
            Add Token to Wallet
          </button>
          <button className="w-full h-[50px] rounded-full bg-gray-100 text-black" onClick={openTransactionOnScan}>
            Open Transaction on {explorerName(chainId)}
          </button>
          <button className="w-full h-[50px] rounded-full bg-red-800 text-white" onClick={() => setOpen(false)}>
            Close
          </button>
        </DialogBody>
      </Dialog>
      <Dialog open={balanceModalOpen} handler={() => { }} placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <DialogBody placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          You need at least {priceList[chainId as keyof typeof priceList].price} {priceList[chainId as keyof typeof priceList].currency} to create your token
        </DialogBody>
        <DialogFooter placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          <Button placeholder={""} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} variant="gradient" color="blue" onClick={() => {
            setBalanceModalOpen(false)
          }}>
            <span>OK</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Footer />
    </div>)
}
