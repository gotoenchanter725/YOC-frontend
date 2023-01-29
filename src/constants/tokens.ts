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
        "address": USDCToken.address,
        "name": "USDC",
        "symbol": "USDC",
        "decimals": USDCToken.decimals,
        "logoURI": "./images/coins/USDC.png"
    }, {
        "chainId": 5,
        "address": YOC.address,
        "name": "YOC",
        "symbol": "YOC",
        "decimals": YOC.decimals,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0xd6e7650D75a73C1d41d3F02289825872419D760B",
        "name": "YOC1",
        "symbol": "YOC1",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0x573d5466F80CceDd11a3c1416343f5f1bD3EdB81",
        "name": "YOC2",
        "symbol": "YOC2",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0x503ef8A56AF4e8cdB0Deb6591700AD831b8E5B8c",
        "name": "YOC3",
        "symbol": "YOC3",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0x0371ffF077Ebe945e66161a3A764BCa633f6F024",
        "name": "YOC4",
        "symbol": "YOC4",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0xB008e62d77f42643AC3f0fc9Ee7c00bC94D29EcE",
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