export interface CurrencyDataInterface {
    id: number,
    name: string,
    symbol: string,
    description: string,
    image: string,
    address: string,
    decimals: number,
    price: number, 
    isDelete: boolean, 
    isActive: boolean, 
    createdAt: string,
    updatedAt?: string,
    disable?: boolean
};

export interface LiquidityDataInterface {
    id: number,
    poolId: string,
    pairAddress: string,
    pairDecimals: number,
    pairSymbol: string,
    isYoc: boolean, 
    token0: number, 
    currency0: CurrencyDataInterface, 
    token1: number, 
    currency1: CurrencyDataInterface, 
    isActive: boolean, 
    createdAt: string,
    updatedAt?: string,
    disable?: boolean
}