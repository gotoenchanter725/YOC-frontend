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
    YOCAddress: "0xbfD69b5Dc37fB3fD163bEC9CD2070666d7427Cf6",
    YOCSwapFactoryAddress: "0x7aAfc014E77fe5ba9FcC3DfF94520e4825189478",
    YOCSwapRouterAddress: "0x16A6CD1E799B2180951a44c62da3f2D36DDA5B9A",
    YOCFarmAddress: "0xFAc6c631005042C69A82B092F115063E6e3086d5",
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
    YOCAddress: "0x81fB54a6770c3fEd965C84Ff2128fed1BFB8A504",
    USDCAddress: "0x932836a161E7e6dd0272BC4D8912B17af8060C84",
    YOCSwapFactoryAddress: "0x4A95F706C7E9E4852A1c2D39B606D1F222D0cA81",
    YOCSwapRouterAddress: "0x5145570F213Fce7bC2d9Db4D2b66844Bf21bb255",
    YOCFarmAddress: "0x6e98897f674B1f9b487d034a8b852DA135fE174B",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}