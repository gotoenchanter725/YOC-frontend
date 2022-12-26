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
    }
    // , {
    //     "chainId": 5,
    //     "address": "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    //     "name": "USD Coin",
    //     "symbol": "USDC",
    //     "decimals": 6,
    //     "logoURI": "https://ethereum-optimism.github.io/data/USDC/logo.png"
    // }, {
    //     "chainId": 5,
    //     "address": "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49",
    //     "name": "Tether USD",
    //     "symbol": "USDT",
    //     "decimals": 6,
    //     "logoURI": "https://ethereum-optimism.github.io/data/USDT/logo.png"
    // }, {
    //     "chainId": 5,
    //     "address": "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
    //     "name": "Wrapped BTC",
    //     "symbol": "WBTC",
    //     "decimals": 8,
    //     "logoURI": "https://ethereum-optimism.github.io/data/WBTC/logo.svg"
    // }, {
    //     "chainId": 5,
    //     "address": "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
    //     "name": "Dai Stablecoin",
    //     "symbol": "DAI",
    //     "decimals": 18,
    //     "logoURI": "https://ethereum-optimism.github.io/data/DAI/logo.svg"
    // }
    , {
        "chainId": 5,
        "address": "0x739216fCf7BeBcc213B1473655904D9e772A6Cac",
        "name": "YOC1 FoundersCoin",
        "symbol": "YOC1",
        "decimals": 6,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0xc9E3B162c0B682513CFb95D6AfC0B19923905E73",
        "name": "YOC2 FoundersCoin",
        "symbol": "YOC2",
        "decimals": 16,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0x340d35ac63289919F020925bd5a28a2fA1345a84",
        "name": "YOC3 FoundersCoin",
        "symbol": "YOC3",
        "decimals": 12,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0xF08d5F20c0caD1bf81985Ab1F21966F0d9cD9E82",
        "name": "YOC4 FoundersCoin",
        "symbol": "YOC4",
        "decimals": 8,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0x5fD457A3A1ac4E825db0432F3952d22e507F4944",
        "name": "YOC5 FoundersCoin",
        "symbol": "YOC5",
        "decimals": 8,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0xfa8B53f1e9E97F76520146721DCBA841233aa76A",
        "name": "YOC6 FoundersCoin",
        "symbol": "YOC6",
        "decimals": 8,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0x328C2F5d6A7f105488fd912074320BcE455Bc362",
        "name": "YOC7 FoundersCoin",
        "symbol": "YOC7",
        "decimals": 8,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0xF8E6Ad99A385585aFDa9Af7e53c5e5Ec604527d1",
        "name": "YOC8 FoundersCoin",
        "symbol": "YOC8",
        "decimals": 8,
        "logoURI": "./images/coin.png"
    }
];

export const TOKENS: tokenInterface[] = (() => {
    return process.env.env == 'development' ? ETH_TEST_TOKENS : ETH_TOKENS;
})();