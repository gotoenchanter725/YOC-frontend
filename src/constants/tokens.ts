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
        "address": "0x5fb8fBeeFcEd7DFE2C6bA21754EA764aFdE8fe9f",
        "name": "YOC1",
        "symbol": "YOC1",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0x6572a96eE12eCf3fDbE92eB2a05f768e40d74080",
        "name": "YOC2",
        "symbol": "YOC2",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0x19ff1dA431B6D723561D8E45002234573E64c655",
        "name": "YOC3",
        "symbol": "YOC3",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0x6Fb3eAD94e597B75b0Cf2D9d11275Bcb499c9FBC",
        "name": "YOC4",
        "symbol": "YOC4",
        "decimals": 8,
        "logoURI": "./images/coins/YOC.png"
    }, {
        "chainId": 5,
        "address": "0x6c9DE6074fc06d8924789d242A7037e48c682C10",
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