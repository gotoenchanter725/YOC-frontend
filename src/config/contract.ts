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
    ProjectManagerAddress: "0x8DF8caa97987df60eead659D1226137d1f06Fd39",
    ProjectDetailAddress: "0xf520e12Df547ef2E14953c99581A9046805538e8",
    WETH: "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92",
    YOCAddress: "0x30F6Dd5780e4108b8ACFbcAB6AE15588faF074cd",
    USDCAddress: "0x500bdA7d9c1371cA11fe5e82e12C9fe1A520A8f1",
    YOCSwapFactoryAddress: "0x1cca0012b19115B9ACF3e7cFd4595408a0E5F59B",
    YOCSwapRouterAddress: "0x02B26E37F259Da1f7c4706E942fc4037291FD586",
    YOCFarmAddress: "0x56dF2fE823F007bb829506066B45588a53982EA2",
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