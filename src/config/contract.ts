const ETH_NETWORK = {
    mainnet: {
        RPC_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        CHAIN_ID: 1
    },
    testnet: {
        // RPC_URL: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        // CHAIN_ID: 5
        RPC_URL: "https://rpc2.sepolia.org",
        CHAIN_ID: 11155111
    }
}

const ETH_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xff146D09e2DA3BE5D8A70540f2B37f2985D3036A",
    ProjectDetailAddress: "0x0268CA1760c4bd5381A4F29FCEB1dAf216D7d953",
    WETH: "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92",
    YOCAddress: "0xc3A7794e8D8EF3044D5f26717D5cddf92e974aA6",
    USDCAddress: "0xD154F367e399111d0A23D45C3b5298F8af1F5a2f",
    YOCSwapFactoryAddress: "0xc422802f753134DEaCDf7307d062739458DF7008",
    YOCSwapRouterAddress: "0x147B3e9aB8a9AAb6Ce2c662095A8D5384aFAb05b",
    YOCFarmAddress: "0x461767aFED254b66120a9A3269e470A6C3513216",
}

const BNB_NETWORK = {
    mainnet: {
        RPC_URL: "https://bsc-dataseed1.binance.org/",
        CHAIN_ID: 56
    },
    testnet: {
        RPC_URL: "https://data-seed-prebsc-2-s1.binance.org:8545/",
        CHAIN_ID: 97
    }
}

const BNB_CONTRACT_ADDRESS = {
    AdminWalletAddress: "0x5141383723037FBd3818dAEcb7d4C5DF1Dc8c6B1",
    ProjectManagerAddress: "0xf2bbF00c3e914c496364B759517Ac97D40b47242",
    ProjectDetailAddress: "0x45D78a311E3AE92e5e6e1624DA59d1D5936fF292",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x792c6d34993256273bBd180B386671e6690AEE86",
    USDCAddress: "0x44DDa416F8C40435443AfCbf355FAb280084CC9A",
    YOCSwapFactoryAddress: "0xBd96dfDEc3f65C3c43157438B83726c1d1ecb266",
    YOCSwapRouterAddress: "0xB9A3ec6867640CbA430F1349eA1ec7C1d72450C4",
    YOCFarmAddress: "0x6302AFf32e4C90c55e31c2DDc716025a234198f9",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}