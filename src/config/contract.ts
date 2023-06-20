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
    ProjectManagerAddress: "0x6FFe2e2Ac8c454C071eC84221f6BA1B1777Fbdb9",
    ProjectDetailAddress: "0xCA9bcaB8e39aA360049f51c638FC5ED053a36D7A",
    WETH: "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92",
    YOCAddress: "0xB23A4a64C24c76f15C9c5cAc4894E165a0DEd3f1",
    USDCAddress: "0x6B34EF77366E1DcB2ABDbFFB7DF31f58911D0Ef3",
    YOCSwapFactoryAddress: "0xc1B049007Bd2a0f47aa55e63f8ca23d37543a502",
    YOCSwapRouterAddress: "0xAAF850d90E36088053B1FE064fe2a0332F4c7Da5",
    YOCFarmAddress: "0x6C1F32c33c7c7858230C85d433b63c4B2d299Af7",
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