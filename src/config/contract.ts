const ETH_NETWORK = {
    mainnet: {
        RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        CHAIN_ID: 1
    },
    testnet: {
        // RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        // CHAIN_ID: 5
        RPC_URL: "https://rpc.sepolia.org",
        CHAIN_ID: 11155111
    }
}

const ETH_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xeF823783e5E3AB17867D29cFbaA42d1850490fBA",
    ProjectDetailAddress: "0x0CdFcF9a27A7E8DEe3E34dDBfDcDF6629727D9F6",
    WETH: "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92",
    YOCAddress: "0xbf430C5d801AB583288cF1121232Ee080336450E",
    USDCAddress: "0xfF70cCf26dDbcC7F09D9C0642F6bCac34678f3CA",
    YOCSwapFactoryAddress: "0xF39016655Df0Dc368E86327Dec5F9b2798447D2D",
    YOCSwapRouterAddress: "0x89aAE0b7996150BF298cb83F639448E737914051",
    YOCFarmAddress: "0x50b350cB8AD0328Dbcc5Bc03951500f5a992ECbA",
}

const BNB_NETWORK = {
    mainnet: {
        RPC_URL: "https://bsc-dataseed1.binance.org/",
        CHAIN_ID: 56
    },
    testnet: {
        RPC_URL: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        CHAIN_ID: 97
    }
}

const BNB_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xD6DcEdDdcAdab4429C67919161E858b387a71dB2",
    ProjectDetailAddress: "0x9F8e4cc016aE8aF5732Fb6d2A981f79Cb2D369E6",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0xDc8DF8890Be490626D1d6D19a0092c1C345BC464",
    USDCAddress: "0x9F4bDEeb51b8aC3c6EcBa43Ceaeb9C070c7F4e9e",
    YOCSwapFactoryAddress: "0x483E50E8EAEB5fDA90656e471e21BA0b79c99A6a",
    YOCSwapRouterAddress: "0x8DF8caa97987df60eead659D1226137d1f06Fd39",
    YOCFarmAddress: "0xf520e12Df547ef2E14953c99581A9046805538e8",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}