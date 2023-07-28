const ETH_NETWORK = {
    mainnet: {
        RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        CHAIN_ID: 1
    },
    testnet: {
        // RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        // CHAIN_ID: 5
        // RPC_URL: "https://rpc.sepolia.org",
        RPC_URL: "https://sepolia.infura.io/v3/48b7b4cf9a7b4b5ca79c2413f2f0de2e",
        CHAIN_ID: 11155111
    }
}

const ETH_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xCC5123dfa565D6B88Ab58105Ec53a0a3be6Bf931",
    ProjectDetailAddress: "0xa01c47244B5E71F77FfD6b060a85AaA6Ed99B482",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    YOCAddress: "0x91a4776e0fC6Af4C2631A45e34e6063Bf110A8B2",
    USDCAddress: "0xe919f5706E87e14E54dDbd86A05b604eCEE0cAC3",
    YOCSwapFactoryAddress: "0xAa79257672e6Bb7eA88822566e44B8f00785572f",
    YOCSwapRouterAddress: "0xcDEF69aF04107ce9fc85aAF1C48F4d99AD2244E8",
    YOCFarmAddress: "0xe9687327602C0F598eC91e1309c2caf9eef0f1E2",
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
    ProjectManagerAddress: "0xDe64243a7bec3F50367C335F9eCcD9930cd5D51A",
    ProjectDetailAddress: "0x2b52A36AE5ff8b98a0Bceef22c01F67C0a9cc1DB",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x153f3fb29f5AaBE7c3FD8627f207DD8A8a358b5E",
    USDCAddress: "0xf6a1811d7839BADeDe4EEb05303c897deC25cFc0",
    YOCSwapFactoryAddress: "0x9b61EbF28Dd2D6f950dFCbBEb2f0E7A5a2257BA0",
    YOCSwapRouterAddress: "0xC3981b82aB10B0a63F2dc59e359d014f4B5804cF",
    YOCFarmAddress: "0xe4Bd8C3dd834F12acCA269B8E81708e60584597F",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}