import { useMemo } from 'react';

const useNetwork = () => {
    const network = process.env.NET_WORK;

    const explorer = useMemo(() => {
        var rpc = "";
        if (process.env.env == 'development') {
            if (process.env.NET_WORK == 'ETH') return "https://goerli.etherscan.io/";
            else return "https://testnet.bscscan.com/"
        } else {
            if (process.env.NET_WORK == 'ETH') return "https://etherscan.io/";
            else return "https://bscscan.com/"
        }
    }, [network])

    const rpcUrl = useMemo(() => {
        var rpc = "";
        if (process.env.env == 'development') {
            if (process.env.NET_WORK == 'ETH') return "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
            else return ""
        } else {
            if (process.env.NET_WORK == 'ETH') return "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
            else return ""
        }
    }, [network])

    return { network, explorer, rpcUrl };
}

export default useNetwork;