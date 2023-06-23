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
    ProjectManagerAddress: "0xB5Aa747B65D096485e328DBcCDa070db5ac3F109",
    ProjectDetailAddress: "0x97854F3cf1c22c18AbF9c20048BB22819bF08A8c",
    WETH: "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92",
    YOCAddress: "0xD350843a6068E6A1C0208930a9Df5355a0B32D07",
    USDCAddress: "0xDc74f48d94E255D72cCdA0dB197F274d33F33fc3",
    YOCSwapFactoryAddress: "0x2f2dF29C58093B90034d2cAdEBF44c03F9Cd385f",
    YOCSwapRouterAddress: "0x27Ea08Ff593D34f8ade2d4f428f4AbcB23D4B39f",
    YOCFarmAddress: "0xC83920dB5750c84DE99e1b4D5e5623003f2751a7",
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
    ProjectManagerAddress: "0x289B167f4Eb1d9C5c6017Eb9c1D87B8Db999904C",
    ProjectDetailAddress: "0x1A89837504DA72f08594aC9C568beC5AE865a982",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x447663e0D3624d052dcC182e4ee984eBB98f1AEC",
    USDCAddress: "0x0C686357C798FF5af7D41e1A4A4A2DC99c1Deafb",
    YOCSwapFactoryAddress: "0x6B5E8B5b0E326206532aee505d6952E09e079fFa",
    YOCSwapRouterAddress: "0x63121d56E1C5579B23F0aF842BDDe8EC3FAC4E80",
    YOCFarmAddress: "0x27930526058d4F6b07fabb59B1DA76E8F441E687",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}