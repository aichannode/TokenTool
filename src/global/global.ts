interface TokenData {
    tokenFactoryManagerAddress: string;
    stdTokenAddress: string;
    stdTokenFactoryAddress: string;
    currencyName: string;
}

interface IndexedTokenData {
    [key: number]: TokenData;
}

const evmTokenContractData: IndexedTokenData = {
    1: {
        tokenFactoryManagerAddress: "0x780F75F4e8CE21fE60755E1E884ad8513fc1B2A4",
        stdTokenAddress: "0x1a803a2971A9Ef09418a8C42AB357fb85CFE8afA",
        stdTokenFactoryAddress: "0xFA2055Fa54532E5e9B05ca3A71d092106Fe67c75",
        currencyName: "ETH"
    },
    97: {
        tokenFactoryManagerAddress: "0xA941fA73eB0fcA62AdDd878Ccb93982a4F8EfA79",
        stdTokenAddress: "0xA546729084bC27F08A2067Ea0B328d168c5be56d",
        stdTokenFactoryAddress: "0x6f72344b91f0b781D3a151f65086B4102af507e8",
        currencyName: "tBNB"
    },
    56: {
        tokenFactoryManagerAddress: "0x1D724D30D496b5332b4D223d8b59f8D93CD58940",
        stdTokenAddress: "0x8e99313a8041220f83BC4747A0C94faA440BF699",
        stdTokenFactoryAddress: "0x780F75F4e8CE21fE60755E1E884ad8513fc1B2A4",
        currencyName: "BNB"
    },
    137: {
        tokenFactoryManagerAddress: "0x1D724D30D496b5332b4D223d8b59f8D93CD58940",
        stdTokenAddress: "0x8e99313a8041220f83BC4747A0C94faA440BF699",
        stdTokenFactoryAddress: "0x780F75F4e8CE21fE60755E1E884ad8513fc1B2A4",
        currencyName: "Matic"
    },
    8453: {
        tokenFactoryManagerAddress: "0x1D724D30D496b5332b4D223d8b59f8D93CD58940",
        stdTokenAddress: "0x8e99313a8041220f83BC4747A0C94faA440BF699",
        stdTokenFactoryAddress: "0x780F75F4e8CE21fE60755E1E884ad8513fc1B2A4",
        currencyName: "ETH"
    },
    10: {
        tokenFactoryManagerAddress: "0x1D724D30D496b5332b4D223d8b59f8D93CD58940",
        stdTokenAddress: "0x8e99313a8041220f83BC4747A0C94faA440BF699",
        stdTokenFactoryAddress: "0x780F75F4e8CE21fE60755E1E884ad8513fc1B2A4",
        currencyName: "ETH"
    },
    42161: {
        tokenFactoryManagerAddress: "0x1D724D30D496b5332b4D223d8b59f8D93CD58940",
        stdTokenAddress: "0x8e99313a8041220f83BC4747A0C94faA440BF699",
        stdTokenFactoryAddress: "0x780F75F4e8CE21fE60755E1E884ad8513fc1B2A4",
        currencyName: "ETH"
    },
    43114: {
        tokenFactoryManagerAddress: "0x1D724D30D496b5332b4D223d8b59f8D93CD58940",
        stdTokenAddress: "0x8e99313a8041220f83BC4747A0C94faA440BF699",
        stdTokenFactoryAddress: "0x780F75F4e8CE21fE60755E1E884ad8513fc1B2A4",
        currencyName: "AVAX"
    },
    81457: {
        tokenFactoryManagerAddress: "0x1D724D30D496b5332b4D223d8b59f8D93CD58940",
        stdTokenAddress: "0x8e99313a8041220f83BC4747A0C94faA440BF699",
        stdTokenFactoryAddress: "0x780F75F4e8CE21fE60755E1E884ad8513fc1B2A4",
        currencyName: "ETH"
    }
}

export function shortenEvmWalletAddress(walletAddress: string): string {
    const lowercaseAddress = walletAddress.toLowerCase();
    const shortenedAddress = lowercaseAddress.substring(0, 6) + "..." + lowercaseAddress.substring(lowercaseAddress.length - 4);
    return shortenedAddress;
}

export default evmTokenContractData