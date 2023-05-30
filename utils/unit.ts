import { ethers } from "ethers";
import BigNumber from 'bignumber.js';

export const convertEthToWei = function (eth: string, decimals: number) {
    return ethers.utils.parseUnits(String(Number(eth).toFixed(decimals)), decimals);
}

export const convertWeiToEth = function (wei: any, decimals: number) {
    return ethers.utils.formatUnits(wei, decimals);
}

export const convertRate = function (in_: any, out_: any) {
    if (in_ == 0 && out_ == 0) {
        return 0;
    } else if (in_ != 0 && out_ == 0) {
        return 0;
    } else {
        return in_ / out_;
    }
}

export const showBigNumber = (v: any) => {
    const number = new BigNumber(v);
    const formattedNumber = number.toFormat(3, BigNumber.ROUND_DOWN, {
        decimalSeparator: ',',
        groupSeparator: '.',
    }).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    return formattedNumber;
}