import { USDCToken, YOC } from "./contracts";

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
        "name": process.env.NET_WORK == "ETH" ? "Ether" : "Binance Coin",
        "symbol": process.env.NET_WORK == "ETH" ? "ETH" : "BNB",
        "decimals": 18,
        "logoURI": `/images/coins/${process.env.NET_WORK == "ETH" ? "ETH" : "BNB"}.png`
    }
]

export const ETH_TEST_TOKENS: Array<tokenInterface> = [
    {
        "chainId": 5,
        "address": "ETH",
        "name": process.env.NET_WORK == "ETH" ? "Ether" : "Binance Coin",
        "symbol": process.env.NET_WORK == "ETH" ? "ETH" : "BNB",
        "decimals": 18,
        "logoURI": `/images/coins/${process.env.NET_WORK == "ETH" ? "ETH" : "BNB"}.png`
    }, {
        "chainId": 5,
        "address": USDCToken.address,
        "name": USDCToken.name,
        "symbol": USDCToken.symbol,
        "decimals": USDCToken.decimals,
        "logoURI": "./images/coins/USDC.png"
    }, {
        "chainId": 5,
        "address": YOC.address,
        "name": YOC.name,
        "symbol": YOC.symbol,
        "decimals": YOC.decimals,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": process.env.YOC1 + '',
        "name": "YOC1",
        "symbol": "YOC1",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": process.env.YOC2 + '',
        "name": "YOC2",
        "symbol": "YOC2",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": process.env.YOC3 + '',
        "name": "YOC3",
        "symbol": "YOC3",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": process.env.YOC4 + '',
        "name": "YOC4",
        "symbol": "YOC4",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": process.env.YOC5 + '',
        "name": "YOC5",
        "symbol": "YOC5",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }
];

export const TOKENS: tokenInterface[] = (() => {
    return process.env.env == 'development' ? ETH_TEST_TOKENS : ETH_TOKENS;
})();

export const ALL_TOKENS: Array<tokenInterface> = [];