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
    ProjectManagerAddress: "0x01B988BB14577aDA2021dad44d0Ef1bE723e8258",
    ProjectDetailAddress: "0xFf5c6937f9b0e8E188fcabADa1C32717a8B127e2",
    WETH: "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92",
    YOCAddress: "0x1b021bA3983F6A80Bb6ad1F0B80009459C153b37",
    USDCAddress: "0xfF70cCf26dDbcC7F09D9C0642F6bCac34678f3CA",
    YOCSwapFactoryAddress: "0xA3B46dfD2E0b774c7004fD459839B7834aa02444",
    YOCSwapRouterAddress: "0x55b2bc77CcdBC2b056008a2bC600F6DcC62a24E3",
    YOCFarmAddress: "0xBA0EF0E71214a803F371b5B3F1E44dDA2B0B8E16",
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
    ProjectManagerAddress: "0xd37573B004A26bdc678C50cA56f1EDE157eb9339",
    ProjectDetailAddress: "0xe4A4a973412eC04FD3325b564e5F7172286c577b",
    WETH: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    YOCAddress: "0x971B57E27B01c5Ed3076B43001cE153f38E91E8c",
    USDCAddress: "0x9F4bDEeb51b8aC3c6EcBa43Ceaeb9C070c7F4e9e",
    YOCSwapFactoryAddress: "0x7A6089063e4264Cc6fE10aEBdE42078247DB12E4",
    YOCSwapRouterAddress: "0x027dB82bE6dc5457C907425ec2430414073D9c46",
    YOCFarmAddress: "0x18F7fb60b29a6aE6d63822fa25aa457a90bBB8F3",
}

const NETWORK = process.env.NET_WORK === "ETH" ? ETH_NETWORK : BNB_NETWORK;
const CONTRACT_ADDRESS = process.env.NET_WORK === "ETH" ? ETH_CONTRACT_ADDRESS : BNB_CONTRACT_ADDRESS;

export {
    NETWORK,
    CONTRACT_ADDRESS
}