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
        RPC_URL: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        CHAIN_ID: 97
    }
}

const BNB_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xd37573B004A26bdc678C50cA56f1EDE157eb9339",
    ProjectDetailAddress: "0xe4A4a973412eC04FD3325b564e5F7172286c577b",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x971B57E27B01c5Ed3076B43001cE153f38E91E8c",
    USDCAddress: "0x9F4bDEeb51b8aC3c6EcBa43Ceaeb9C070c7F4e9e",
    YOCSwapFactoryAddress: "0x7A6089063e4264Cc6fE10aEBdE42078247DB12E4",
    YOCSwapRouterAddress: "0x027dB82bE6dc5457C907425ec2430414073D9c46",
    YOCFarmAddress: "0x18F7fb60b29a6aE6d63822fa25aa457a90bBB8F3",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}