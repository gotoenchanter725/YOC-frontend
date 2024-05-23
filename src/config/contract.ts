const ETH_NETWORK = {
    mainnet: {
        // RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        // RPC_URL: "https://rpc.ankr.com/eth",
        RPC_URL: "https://rpc.ankr.com/eth/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        https: "https://rpc.ankr.com/eth/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        wss: "wss://rpc.ankr.com/eth/ws/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        CHAIN_ID: 1
    },
    testnet: {
        // RPC_URL: "https://rpc.sepolia.org",
        // RPC_URL: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
        // https: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
        // RPC_URL: "https://sepolia.infura.io/v3/f00540d3d0c846d093e61d939dd3be59",
        RPC_URL: "https://rpc.ankr.com/eth_sepolia",
        https: "https://rpc.ankr.com/eth_sepolia/",
        // wss: "wss://rpc.ankr.com/eth_sepolia/ws/",
        wss: "wss://ethereum-sepolia.publicnode.com/",
        // RPC_URL: "https://rpc.ankr.com/eth_sepolia/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        // https: "https://rpc.ankr.com/eth_sepolia/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        // wss: "wss://rpc.ankr.com/eth_sepolia/ws/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        CHAIN_ID: 11155111
    }
}

const ETH_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xcd6cf55CeCab067dEf3f84559bF7aDEbF4594B9D",
    ProjectDetailAddress: "0x205B8fC3cF8865955EC9b6a1Fac2cC862f95af10",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    USDCAddress: "0x99AabD4C350e27395eec102a4a89066D26906Cc9",
    YOCAddress: "0x3C1517f719c379f94160F53D37983A304e273FB8",
    YOCSwapFactoryAddress: "0x90F0EDF5B9D8aA7f2306ca016C50B1272c87d78F",
    YOCSwapRouterAddress: "0x29736DA7D866e4e4CF53e1b1e8AeBf171bA64bDb",
    YOCFarmAddress: "0xFe4A1fEDBf327Cc93a6F72866dE827eB1813E5C5",
    YUSDAddress: "0xb5b930812cc7433C4c2FF7C8F3A60d7FB680591c",
    ProjectTradeAddress: "0xC1b607CE0f45f6c5bdb4FD5C5D6bd982C759d738",
}

const BNB_NETWORK = {
    mainnet: {
        // RPC_URL: "https://bsc-dataseed1.binance.org/",
        // RPC_URL: "https://rpc.ankr.com/bsc/",
        RPC_URL: "https://rpc.ankr.com/bsc/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        https: "https://rpc.ankr.com/bsc/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        wss: "wss://rpc.ankr.com/bsc/ws/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        CHAIN_ID: 56
    },
    testnet: {
        // RPC_URL: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        RPC_URL: "https://rpc.ankr.com/bsc_testnet_chapel",
        https: "https://rpc.ankr.com/bsc_testnet_chapel/",
        wss: "wss://rpc.ankr.com/bsc_testnet_chapel/ws/",
        // RPC_URL: "https://rpc.ankr.com/bsc_testnet_chapel/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        // https: "https://rpc.ankr.com/bsc_testnet_chapel/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        // wss: "wss://rpc.ankr.com/bsc_testnet_chapel/ws/8520362fc199056906a44b06b68b4efa1f09aeeaee96a8aa84d9c3e0f94c9eaf",
        CHAIN_ID: 97
    }
}

const BNB_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0x31Ac6A58287da86d95875E5dFc3Fe797eF80f385",
    ProjectDetailAddress: "0x8E2AAEF73371AD54f8dbF6C39963D5729D2A38eA",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    USDCAddress: "0x932836a161E7e6dd0272BC4D8912B17af8060C84",
    YOCAddress: "0x040930f16EC07B155475F6F21c25859dB36405Ec",
    YOCSwapFactoryAddress: "0xeC08F56A8F45d196c76bf0C3BDd04A14A7eD56E6",
    YOCSwapRouterAddress: "0xF837e5670C9Eb93eEfe4682199A9a96B48B33c65",
    YOCFarmAddress: "0x7f6B2C27B397F2E1b68C7A18e626edB275d07b2a",
    YUSDAddress: "0x01EDb3444A197E346Ba613B22EdBA4B00ff03cB4",
    ProjectTradeAddress: "0xBFF3F3b75390934ff5e48c2381967c691BDA3074",
}

const NETWORK = process.env.NET_WORK === "ETH" ? (process.env.NEXT_PUBLIC_ENV == 'development' ? ETH_NETWORK.testnet : ETH_NETWORK.mainnet) : (process.env.NEXT_PUBLIC_ENV == 'development' ? BNB_NETWORK.testnet : BNB_NETWORK.mainnet);
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export {
    NETWORK,
    CONTRACT_ADDRESS,
    PRIVATE_KEY
}