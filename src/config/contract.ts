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
    ProjectManagerAddress: "0xCC8ded2f05E38A275429FafC80E3D1092e7E8F09",
    ProjectDetailAddress: "0x6eACfB16D3c93EA7A59EAb3c9B0E6c659647BD43",
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    YOCAddress: "0xf749aEC5b2969B7851ec1075De547C30994C45F4",
    USDCAddress: "0x447B0d27ed8379c2376F356E154C610819d9afF1",
    YOCSwapFactoryAddress: "0x24C823753583E7221968B24eF0CAf1BCf4a4946f",
    YOCSwapRouterAddress: "0x5472EE84bC1e01D6c938E0771FBdAa12668B0053",
    YOCFarmAddress: "0xC4C1EfDBe6B234EE1256A282d28AE9b9595b6bc7",
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