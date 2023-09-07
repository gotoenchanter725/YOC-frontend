// import { useSelector } from "react-redux";
import { useAccount as useWagmiAccount } from 'wagmi';
import { fetchBalance } from '@wagmi/core'
import { rpc_provider_basic } from '../../utils/rpc_provider';
import { getEthersProvider, getEthersSigner } from "utils/ethers";
import { useEffect, useState } from "react";
import { convertWeiToEth } from "../../utils/unit";
import { YOC, YUSD } from 'src/constants/contracts';

const useAccount = () => {
    // const { account, balance, provider, signer } = useSelector((state: any) => state.data);
    const { address, connector, isConnected } = useWagmiAccount();
    const [YOCBalance, setYOCBalance] = useState(0); // YOC
    const [ETHBalance, setETHBalance] = useState(0); // ETH
    const [YUSDBalance, setYUSDBalance] = useState(0); // YUSD
    const [provider, setProvider] = useState();
    const [signer, setSigner] = useState();
    const account = address;
    useEffect(() => {
        (async () => {
            let t_signer = await getEthersSigner();
            setSigner(t_signer as any);
            let t_provider = getEthersProvider();
            setProvider(t_provider as any);
        })();
    }, [address])
    useEffect(() => {
        (async () => {
            if (address) {
                setYOCBalance(await getYOCBalance());
                setETHBalance(await getETHBalance());
                setYUSDBalance(await getYUSDBalance());
            }
        })();
    }, [address])

    useEffect(() => {
        if (!isConnected) {
            setETHBalance(0);
            setYOCBalance(0);
            setYUSDBalance(0);
        }
    }, [isConnected])

    const getETHBalance = async () => {
        let rst = await fetchBalance({
            address: address as `0x${string}`,
            formatUnits: 'ether'
        });
        return Number(rst.formatted);
    }
    const getYOCBalance = async () => {
        let rst = await fetchBalance({
            address: address as `0x${string}`,
            token: YOC.address as `0x${string}`
        });
        return Number(convertWeiToEth(rst.value, YOC.decimals));
    }
    const getYUSDBalance = async () => {
        let rst = await fetchBalance({
            address: address as `0x${string}`,
            token: YUSD.address as `0x${string}`
        });
        return Number(convertWeiToEth(rst.value, YUSD.decimals));
    }

    return { account, YOCBalance, YUSDBalance, ETHBalance, getETHBalance, provider, signer, rpc_provider: rpc_provider_basic };
}

export default useAccount;