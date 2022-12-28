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
    , {
        "chainId": 5,
        "address": "0xBeb52076066726A3E357aa014b69648721909B9D",
        "name": "YOC1 FoundersCoin",
        "symbol": "YOC1",
        "decimals": 18,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0xC882255736ea35701CB1D8c633398A15E5302b66",
        "name": "YOC2 FoundersCoin",
        "symbol": "YOC2",
        "decimals": 18,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0x02Cf6E3cB97987d7577ffa41FaEE0733fEA49940",
        "name": "YOC3 FoundersCoin",
        "symbol": "YOC3",
        "decimals": 18,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0xF6aB3f0A07F77Dc2bf93EaA85d9F9a85D7eA2BCA",
        "name": "YOC4 FoundersCoin",
        "symbol": "YOC4",
        "decimals": 16,
        "logoURI": "./images/coin.png"
    }, {
        "chainId": 5,
        "address": "0xb078feD64184515Cea3b2ab6935E85dC2e559C56",
        "name": "YOC5 FoundersCoin",
        "symbol": "YOC5",
        "decimals": 16,
        "logoURI": "./images/coin.png"
    }
];

export const TOKENS: tokenInterface[] = (() => {
    return process.env.env == 'development' ? ETH_TEST_TOKENS : ETH_TOKENS;
})();