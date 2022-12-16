import { ethers } from "ethers";

export const convertEthToWei = function (eth: string, decimals: number) {
    return ethers.utils.parseUnits(String(Number(eth).toFixed(decimals)), decimals);
}

export const convertWeiToEth = function (wei: any, decimals: number) {
    return ethers.utils.formatUnits(wei, decimals);
}