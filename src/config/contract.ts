const ETH_NETWORK = {
    mainnet: {
        RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        CHAIN_ID: 1
    },
    testnet: {
        // RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        // CHAIN_ID: 5
        // RPC_URL: "https://rpc.sepolia.org",
        // RPC_URL: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
        RPC_URL: "https://rpc.ankr.com/eth_sepolia",
        CHAIN_ID: 11155111
    }
}

const ETH_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xf9dC36E8EE98d7f4480B240B8bd0759FffdBD831",
    ProjectDetailAddress: "0xc5A075199840A73d0D1553C52377cbD7Dc670ae4",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    USDCAddress: "0x5E4702eD9b138B1985ca3a978fD89a5842026F10",
    YOCAddress: "0x9CfB68F8Da3474d56b42cc7837ad27aF3d9952d8",
    YOCSwapFactoryAddress: "0x197B4684e6C6aE77Fb06389898Bd0ACFf1ac690B",
    YOCSwapRouterAddress: "0x1470E600ddE363186DC0c0C17c9860a27846b6C8",
    YOCFarmAddress: "0x391f8b0a4D316769C621C6D1686E6174e370c1B0",
    YUSDAddress: "0x28Db395cEfd65A736D1843641fF92C108056c5A8",
}

const BNB_NETWORK = {
    mainnet: {
        RPC_URL: "https://bsc-dataseed1.binance.org/",
        CHAIN_ID: 56
    },
    testnet: {
        // RPC_URL: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        RPC_URL: "https://rpc.ankr.com/bsc_testnet_chapel",
        CHAIN_ID: 97
    }
}

const BNB_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0x17B04150F1569aDADEB43f5a707c8ecC45443826",
    ProjectDetailAddress: "0xF26ab3153bA7E90E2abd9EA2074e8395eA5C88a5",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    USDCAddress: "0x932836a161E7e6dd0272BC4D8912B17af8060C84",
    YOCAddress: "0x040930f16EC07B155475F6F21c25859dB36405Ec",
    YOCSwapFactoryAddress: "0xeC08F56A8F45d196c76bf0C3BDd04A14A7eD56E6",
    YOCSwapRouterAddress: "0xF837e5670C9Eb93eEfe4682199A9a96B48B33c65",
    YOCFarmAddress: "0x7f6B2C27B397F2E1b68C7A18e626edB275d07b2a",
    YUSDAddress: "0x0e142A81A7e3496969F413bE5075Cbf11026fbfF",
}

const NETWORK = process.env.NET_WORK === "ETH" ? (process.env.env == 'development' ? ETH_NETWORK.testnet : ETH_NETWORK.mainnet) : (process.env.env == 'development' ? BNB_NETWORK.testnet : BNB_NETWORK.mainnet);
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export {
    NETWORK,
    CONTRACT_ADDRESS,
    PRIVATE_KEY
}