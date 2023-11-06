export const delay = function (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const convertPeriodToMiliSecond = function (period: string) {
    let time = 1000 * 60 * 60 * 24;
    switch (period) {
        case '1D':
            time = 1000 * 60 * 60 * 24;
            break;
        case '1W':
            time = 1000 * 60 * 60 * 24 * 7;
            break;
        case '1M':
            time = 1000 * 60 * 60 * 24 * 30;
            break;
        case '3M':
            time = 1000 * 60 * 60 * 24 * 30 * 3;
            break;
        case '1Y':
            time = 1000 * 60 * 60 * 24 * 30 * 12;
            break;
        default:
            time = 1000 * 60 * 60 * 24 * 30 * 12 * 2000;
            break;
    }
    return time;
}

export const convertPeriodShortToFull = function (period: string) {
    let full = "1 Day";
    switch (period) {
        case '1D':
            full = "1 Day";
            break;
        case '1W':
            full = "1 Week";
            break;
        case '1M':
            full = "1 Month";
            break;
        case '3M':
            full = "3 Month";
            break;
        case '1Y':
            full = "1 Year";
            break;
        default:
            full = "1 Day";
            break;
    }
    return full;
}

export const multiplyNumbers = (arr: any[]) => {
    let val = 1;
    for (let i = 0; i < arr.length; i ++) {
        if (isNaN(Number(arr[i]))) return 0;
        val *= arr[i];
    }
    return val;
}