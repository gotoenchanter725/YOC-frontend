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
    ProjectManagerAddress: "0xf17b63C21E9BF42aE60e85cDFaAaD43E0aea8215",
    ProjectDetailAddress: "0x369ccED38f349A61bfea7CC2489999AA065c5667",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x30F6Dd5780e4108b8ACFbcAB6AE15588faF074cd",
    USDCAddress: "0x500bdA7d9c1371cA11fe5e82e12C9fe1A520A8f1",
    YOCSwapFactoryAddress: "0x1cca0012b19115B9ACF3e7cFd4595408a0E5F59B",
    YOCSwapRouterAddress: "0x02B26E37F259Da1f7c4706E942fc4037291FD586",
    YOCFarmAddress: "0x56dF2fE823F007bb829506066B45588a53982EA2",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}