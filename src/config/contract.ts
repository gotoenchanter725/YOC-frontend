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
    ProjectManagerAddress: "0x003F3Aa4CA6faA5518C1E938430E4308fCD77255",
    ProjectDetailAddress: "0x50e63304436B5b417cd909a55EAD3B29D4969aFb",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    USDCAddress: "0x7A48A177d4C3cF6e2f5b06b70E4Cb732c910c482",
    YOCAddress: "0x199361BF6c9c6CCD960eb47D2fc400f8fD42D13e",
    YOCSwapFactoryAddress: "0x05d3F326d2DffCd9F8C21F781B882C5a16DbEbD3",
    YOCSwapRouterAddress: "0x201f24DbAa44Ab23cDC9D7488AFf3D6526671527",
    YOCFarmAddress: "0x8Cae5b8b3E1b7f41e472B8e6559241ec0E165FC8",
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
    ProjectManagerAddress: "0xc263f50d949C5C3df3452c74b18c790481cA4D70",
    ProjectDetailAddress: "0x04Ab64A6479EA7b0817FFC8753401C2144fc76bA",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x116Ca60ACCCf9dd0b892046D549e7A1Ed4f7dbaA",
    USDCAddress: "0xc03Fa8445d32258FC2BF5fB31033089B324F727e",
    YOCSwapFactoryAddress: "0xD948A6FE7D109EB16CD48b5d3907f30e456A9f8b",
    YOCSwapRouterAddress: "0xeDFd6e4F2F4F14D82af295174570A4eC4EC864b1",
    YOCFarmAddress: "0x5e519Ba6576719072639CfdDd802bf6891Cd7dd8",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}