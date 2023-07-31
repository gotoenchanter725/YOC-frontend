import { useMemo } from 'react';

const useNetwork = () => {
    const network = process.env.NET_WORK;

    const explorer = useMemo(() => {
        var rpc = "";
        if (process.env.env == 'development') {
            // if (process.env.NET_WORK == 'ETH') return "https://goerli.etherscan.io/";
            if (process.env.NET_WORK == 'ETH') return "https://sepolia.etherscan.io/";
            else return "https://testnet.bscscan.com/"
        } else {
            if (process.env.NET_WORK == 'ETH') return "https://etherscan.io/";
            else return "https://bscscan.com/"
        }
    }, [network])

    const rpcUrl = useMemo(() => {
        var rpc = "";
        if (process.env.env == 'development') {
            if (process.env.NET_WORK == 'ETH') return "https://eth-sepolia.g.alchemy.com/v2/9XxUB2Hodsix6mDB_6uE4U-Ap6tg4c5c";
            else return ""
        } else {
            if (process.env.NET_WORK == 'ETH') return "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
            else return ""
        }
    }, [network])

    return { network, explorer, rpcUrl };
}

export default useNetwork;