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
    ProjectManagerAddress: "0xd40B633bCdc897ab6997D221A0d9101FF9198520",
    ProjectDetailAddress: "0x0ee4D6412DE0c3D78eA7eAD67afC7B2Db88A9Fb1",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    YOCAddress: "0x362c9DEEfB71631b5e412544979dA47E52172947",
    USDCAddress: "0x70Cd0334b3DDcE662C157BF49cDD4c5c6d37a8ed",
    YOCSwapFactoryAddress: "0xbca225358cD235CF68Bf81af62c9d6cc6c45A6d9",
    YOCSwapRouterAddress: "0x251cc04Dc18C45d32A06B41c46828d4386670f6F",
    YOCFarmAddress: "0x4db570e9Ff5229F4490fe7e9b3EA7A9A43bf625e",
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