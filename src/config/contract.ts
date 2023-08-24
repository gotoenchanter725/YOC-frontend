const ETH_NETWORK = {
    mainnet: {
        RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        CHAIN_ID: 1
    },
    testnet: {
        // RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        // CHAIN_ID: 5
        // RPC_URL: "https://rpc.sepolia.org",
        RPC_URL: "https://eth-sepolia.g.alchemy.com/v2/9XxUB2Hodsix6mDB_6uE4U-Ap6tg4c5c",
        CHAIN_ID: 11155111
    }
}

const ETH_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xf9dC36E8EE98d7f4480B240B8bd0759FffdBD831",
    ProjectDetailAddress: "0xc5A075199840A73d0D1553C52377cbD7Dc670ae4",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    USDCAddress: "0x5E4702eD9b138B1985ca3a978fD89a5842026F10",
    YOCAddress: "0xd6fcF1B7D28fEd52Ff9E6899015570987662B4EB",
    YOCSwapFactoryAddress: "0x10a2320cdD923d95c70a3c73194744fFB97c4303",
    YOCSwapRouterAddress: "0x859f758E173716B3e9B35dEf946c4E962CDd5f2E",
    YOCFarmAddress: "0x421eCcA8c5b1E83F9336eCd8b81fA70D6A0fdc81",
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
    ProjectManagerAddress: "0x17B04150F1569aDADEB43f5a707c8ecC45443826",
    ProjectDetailAddress: "0xF26ab3153bA7E90E2abd9EA2074e8395eA5C88a5",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x447E31d54ff2677b566D03ea6B0AA2a5cC446b49",
    USDCAddress: "0x932836a161E7e6dd0272BC4D8912B17af8060C84",
    YOCSwapFactoryAddress: "0x7022c65cc0773c8BbB60a1C99CB65589a5fb44E4",
    YOCSwapRouterAddress: "0x88275255647E76a5264a516Aba2977c60Ae2C7ba",
    YOCFarmAddress: "0xD0Fb8765Ac849112c52ed66CF76a24EF475E33e7",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}