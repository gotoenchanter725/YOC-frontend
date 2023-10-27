import { Chain } from 'wagmi'

const bscTestnet: Chain = {
    id: 97,
    name: "Binance Smart Chain Testnet",
    network: "bsc-testnet",
    nativeCurrency: {
        decimals: 18,
        name: "BNB",
        symbol: "tBNB",
    },
    rpcUrls: {
        default: {
            http: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
        },
        public: {
            http: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
        },
    },
    blockExplorers: {
        etherscan: {
            name: "BscScan",
            url: "https://testnet.bscscan.com",
        },
        default: {
            name: "BscScan",
            url: "https://testnet.bscscan.com",
        },
    },
    contracts: {
        multicall3: {
            address: "0xca11bde05977b3631167028862be2a173976ca11",
            blockCreated: 17422483,
        },
    }
}

const sepolia: Chain = {
    id: 11155111,
    name: 'Sepolia',
    network: 'Sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'Sepolia Ether',
        symbol: 'SEP',
    },
    rpcUrls: {
        public: { http: ['https://rpc.ankr.com/eth_sepolia'] },
        default: { http: ['https://rpc.ankr.com/eth_sepolia'] },
    },
    blockExplorers: {
        etherscan: {
            name: "Etherscan",
            url: "https://sepolia.etherscan.io",
        },
        default: {
            name: "Etherscan",
            url: "https://sepolia.etherscan.io",
        }
    },
    contracts: {
        multicall3: {
            address: "0xca11bde05977b3631167028862be2a173976ca11",
            blockCreated: 6507670
        },
    },
}

export {
    bscTestnet,
    sepolia
}