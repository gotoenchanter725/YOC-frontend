export const ETH_TOKENS = {
    "ETH": {
        logoURI: "./images/coins/ETH.png",
        name: 'Ether',
        symbol: "ETH",
        address: "ETH"
    },
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
        logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        name: 'Wrapped Ether',
        symbol: "WETH",
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
        logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        name: 'USDCoin',
        symbol: "USDC",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
        logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        name: 'Tether USD',
        symbol: "USDT",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    }
}

export const ETH_TEST_TOKENS = {
    "ETH": {
        logoURI: "./images/coins/ETH.png",
        name: 'Ether',
        symbol: "ETH",
        address: "ETH"
    },
    '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6': {
        logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        name: 'Wrapped Ether',
        symbol: "WETH",
        address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
    },
    "0x07865c6E87B9F70255377e024ace6630C1Eaa37F": {
        "chainId": 5,
        "address": "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
        "name": "USD Coin",
        "symbol": "USDC",
        "decimals": 6,
        "logoURI": "https://ethereum-optimism.github.io/data/USDC/logo.png",
        "extensions": {
            "optimismBridgeAddress": "0x636Af16bf2f682dD3109e60102b8E1A089FedAa8"
        }
    },
    '0xe802376580c10fe23f027e1e19ed9d54d4c9311e': {
        "chainId": 5,
        "address": "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49",
        "name": "Tether USD",
        "symbol": "USDT",
        "decimals": 6,
        "logoURI": "https://ethereum-optimism.github.io/data/USDT/logo.png",
        "extensions": {
            "optimismBridgeAddress": "0x636Af16bf2f682dD3109e60102b8E1A089FedAa8"
        }
    },
    '0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05': {
        logoURI: "https://static.optimism.io/data/WBTC/logo.svg",
        name: 'Wrapped BTC',
        symbol: "WBTC",
        address: "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05"
    },
    '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844': {
        "chainId": 5,
        "address": "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
        "name": "Dai Stablecoin",
        "symbol": "DAI",
        "decimals": 18,
        "logoURI": "https://ethereum-optimism.github.io/data/DAI/logo.svg",
        "extensions": {
            "optimismBridgeAddress": "0x05a388Db09C2D44ec0b00Ee188cD42365c42Df23"
        }
    },
}

export const TOKENS = (() => {
    return process.env.env == 'development' ? ETH_TEST_TOKENS : ETH_TOKENS;
})();

export interface tokenInterface {
    logoURI: string,
    name: string,
    symbole: string,
    address: string
}