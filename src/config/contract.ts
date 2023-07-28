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
    ProjectManagerAddress: "0xBbBA0F891c3E8Fee4ff55E63501ceA2F10A3F804",
    ProjectDetailAddress: "0x15e90295FB04Ff94db4e225910f6F6b0FcDbfe4C",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    YOCAddress: "0x0D83e4481AB606ff91AbBB1b8eE17E4b0516dEC5",
    USDCAddress: "0xf70Ba5e0918a160523b335F0Fe089a1708630698",
    YOCSwapFactoryAddress: "0x5Adf8346E72F00eb61dD4DfA1d3f2692188A414e",
    YOCSwapRouterAddress: "0x8B6C3AB9207f3ea9824E4D952a381Ca00D49080D",
    YOCFarmAddress: "0x010C4bB37841BEe837abA90960f56BDB2ecCc6db",
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