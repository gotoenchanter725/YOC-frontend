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
    ProjectManagerAddress: "0x84f0E234f79F8Ee555079CeAD8e280Fab685C101",
    ProjectDetailAddress: "0xa3368cE1B26aFb22Af711c72fdB32E0acb187252",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x25AA07166F85d78A75605fFaaC63dbacac4CD74E",
    USDCAddress: "0x9F4bDEeb51b8aC3c6EcBa43Ceaeb9C070c7F4e9e",
    YOCSwapFactoryAddress: "0x362B28Be698862e9772eBB96eEe0E6c9fFB58C81",
    YOCSwapRouterAddress: "0x930166727472E4BC49DA6D27F0BDF7B10a5e6615",
    YOCFarmAddress: "0xaE237552cDB398903b20fe8c01caB47D6ba780ff",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}