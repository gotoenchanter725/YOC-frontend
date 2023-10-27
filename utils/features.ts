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
        case '1M':
            time = 1000 * 60 * 60 * 24 * 30 * 3;
            break;
        case '1Y':
            time = 1000 * 60 * 60 * 24 * 30 * 12;
            break;
        case '1Y':
            time = 1000 * 60 * 60 * 24 * 30 * 12 * 3;
            break;
        default:
            time = 1000 * 60 * 60 * 24 * 30 * 12 * 2000;
            break;
    }
    return time;
}

export const multiplyNumbers = (arr: any[]) => {
    let val = 1;
    for (let i = 0; i < arr.length; i ++) {
        if (isNaN(Number(arr[i]))) return 0;
        val *= arr[i];
    }
    return val;
}