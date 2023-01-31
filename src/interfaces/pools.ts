import { Contract } from 'ethers';

export interface PoolInterface {
    address?: string;
    token0?: string;
    token1?: string;
    liquidity?: number;
    balance?: number;
    lpAmount?: number;
    allocPoint?: number;
    loading?: boolean;
    earned?: number;
    APR?: number;
    totalShare?: number, 
    approve?: boolean, 
    pairId?: number, 
    decimal?: number, 
    symbol?: string,
    PairContract?: Contract, 
    token0Contract?: Contract, 
    token1Contract?: Contract, 
};

export interface PairOpenInterface {
    address: string;
    toggle: boolean;
}

export interface StakeInterface {
    pId?: number, 
    address?: string;
    stakingContract?: Contract, 
    decimal?: number;
    name?: string;
    symbol?: string;
    amount?: number;
    loading?: boolean;
    APR?: number;
    earned?: number;
    approve?: boolean;
    pairId?: number;
    totalLiquidity?: number;
    lastBlock?: number;
    userInfo?: any;
    stakeDecimal?: number;
    tokenAddress?: string;
    tokenContact?: Contract, 
    balance?: number;
    isYoc?: boolean;
    usdcAmount?: number;
};