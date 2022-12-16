export interface tokenInterface {
    logoURI: string,
    name: string,
    symbol: string,
    address: string, 
    decimals: number,
    chainId?: number, 
}
export const ETH_TOKENS: Array<tokenInterface> = [
    {
        "chainId": 5,
        "address": "ETH",
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18,
        "logoURI": "https://ethereum-optimism.github.io/data/ETH/logo.svg"
    }
]

export const ETH_TEST_TOKENS: Array<tokenInterface> = [
    {
        "chainId": 5,
        "address": "ETH",
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18,
        "logoURI": "https://ethereum-optimism.github.io/data/ETH/logo.svg"
    }, {
        "chainId": 5,
        "address": "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
        "name": "USD Coin",
        "symbol": "USDC",
        "decimals": 6,
        "logoURI": "https://ethereum-optimism.github.io/data/USDC/logo.png"
    }, {
        "chainId": 5,
        "address": "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49",
        "name": "Tether USD",
        "symbol": "USDT",
        "decimals": 6,
        "logoURI": "https://ethereum-optimism.github.io/data/USDT/logo.png"
    }, {
        "chainId": 5,
        "address": "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
        "name": "Wrapped BTC",
        "symbol": "WBTC",
        "decimals": 8,
        "logoURI": "https://ethereum-optimism.github.io/data/WBTC/logo.svg"
    }, {
        "chainId": 5,
        "address": "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
        "name": "Dai Stablecoin",
        "symbol": "DAI",
        "decimals": 18,
        "logoURI": "https://ethereum-optimism.github.io/data/DAI/logo.svg"
    }
];

export const TOKENS: tokenInterface[] = (() => {
    return process.env.env == 'development' ? ETH_TEST_TOKENS : ETH_TOKENS;
})();