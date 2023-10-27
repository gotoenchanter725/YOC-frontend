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
    if (Number(v) == 0) return "0";
    const number = new BigNumber(v);
    const formattedNumber = number.toFormat(3, BigNumber.ROUND_DOWN, {
        decimalSeparator: '.',
        groupSeparator: ',',
    }).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

    return formattedNumber;
}

export const isValidEthAddress = (address: string) => {
    if (!address.startsWith('0x') || address.length !== 42) {
        return false; // Address should start with '0x' and have a length of 42
    }

    const lowerCaseAddress = address.toLowerCase();

    for (let i = 2; i < 42; i++) {
        const charCode = lowerCaseAddress.charCodeAt(i);

        if (
            !(charCode >= 48 && charCode <= 57) && // 0-9
            !(charCode >= 97 && charCode <= 102) // a-f
        ) {
            return false; // Address should contain only alphanumeric characters from range 0-9 and a-f
        }
    }

    return true; // Address is valid
}