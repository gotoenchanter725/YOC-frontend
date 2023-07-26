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
    ProjectManagerAddress: "0xCA384783C401adD31Fdc9E9C1510FC051A87deb8",
    ProjectDetailAddress: "0xa89F7C7FE1E9396Ea928234B347F05e9daFeF2F3",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    YOCAddress: "0xb7F6D0175Dd92e2C7f9386E7698a1ab0B0a504cA",
    USDCAddress: "0xfF70cCf26dDbcC7F09D9C0642F6bCac34678f3CA",
    YOCSwapFactoryAddress: "0xfF6D3352c1ba773cAdbE769018AB321C92376D6C",
    YOCSwapRouterAddress: "0x8690552a54975c37Ed77eE72055C3A5fa9d8E06A",
    YOCFarmAddress: "0x7f331f7B7D47802e0FBbfe14ddcFD12646fC7030",
}

const BNB_NETWORK = {
    mainnet: {
        RPC_URL: "https://bsc-dataseed1.binance.org/",
        CHAIN_ID: 56
    },
    testnet: {
        RPC_URL: "https://data-seed-prebsc-1-s3.binance.org:8545/",
        CHAIN_ID: 97
    }
}

const BNB_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xEe3B436C4d6533183633976DC22D07D53061aB47",
    ProjectDetailAddress: "0x5E2EE322F5eF8e37936595dF973B18253c0f1176",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0xFA4e64Cf46b4D5825f32fAD5f974ff70696Fde38",
    USDCAddress: "0x1F0d2AcEb4B4f519b787ec0e2EdfAfDbA921cD45",
    YOCSwapFactoryAddress: "0x5766955CebD58664FdBC6e92E4FF06D8A94D7B26",
    YOCSwapRouterAddress: "0xF968Cc2F5edbBa1CA1067330377Cb1aD1D49d412",
    YOCFarmAddress: "0x027b7Dc0624eeC92c4ad638C1B74EAEA096dAEe8",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}