import { USDCToken, WETH, YOC } from "./contracts";
import { CONTRACT_ADDRESS } from "../config/contract";

export interface tokenInterface {
    image: string,
    name: string,
    symbol: string,
    address: string,
    decimals: number,
    chainId?: number,
    isYoc?: boolean
}
export const MAIN_TOKENS: Array<tokenInterface> = [
    {
        "chainId": 5,
        "address": WETH,
        "name": process.env.NET_WORK == "ETH" ? "Ether" : "Binance Coin",
        "symbol": process.env.NET_WORK == "ETH" ? "ETH" : "BNB",
        "decimals": 18,
        "image": `/images/coins/${process.env.NET_WORK == "ETH" ? "ETH" : "BNB"}.png`
    }
]

export const TEST_TOKENS: Array<tokenInterface> = [
    {
        "chainId": 5,
        "address": WETH,
        "name": process.env.NET_WORK == "ETH" ? "Ether" : "Binance Coin",
        "symbol": process.env.NET_WORK == "ETH" ? "ETH" : "BNB",
        "decimals": 18,
        "image": `/images/coins/${process.env.NET_WORK == "ETH" ? "ETH" : "BNB"}.png`
    }
];

export const TOKENS: tokenInterface[] = (() => {
    return process.env.env == 'development' ? TEST_TOKENS : MAIN_TOKENS;
})();

export const ALL_TOKENS: Array<tokenInterface> = [];