import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useAccount as useWagmiAccount } from 'wagmi';
import { fetchBalance } from '@wagmi/core'
import { getEthersProvider, getEthersSigner, WebSocketProvider, JsonRpcProvider } from "utils/ethers";
import { convertWeiToEth } from "../../utils/unit";
import { YOC, YUSD } from 'src/constants/contracts';

const useAccount = () => {
    const { address, connector, isConnected } = useWagmiAccount();
    const [YOCBalance, setYOCBalance] = useState(0); // YOC
    const [ETHBalance, setETHBalance] = useState(0); // ETH
    const [YUSDBalance, setYUSDBalance] = useState(0); // YUSD
    // const [provider, setProvider] = useState();
    const [signer, setSigner] = useState();
    const account = address;
    useEffect(() => {
        (async () => {
            let t_signer = await getEthersSigner();
            setSigner(t_signer as any);
            // let t_provider = getEthersProvider(); 
            // let t_provider = WebSocketProvider
            // setProvider(WebSocketProvider as any);
        })();
    }, [address])
    useEffect(() => {
        (async () => {
            if (address) {
                await updateYOCBalance();
                await updateETHBalance();
                await updateYUSDBalance();
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

    const updateYUSDBalance = async () => {
        setYUSDBalance(await getYUSDBalance());
    }

    const updateETHBalance = async () => {
        setETHBalance(await getETHBalance());
    }

    const updateYOCBalance = async () => {
        setYOCBalance(await getYOCBalance());
    }

    return { account, YOCBalance, YUSDBalance, ETHBalance, updateYOCBalance, updateYUSDBalance, updateETHBalance, getETHBalance, provider: JsonRpcProvider, signer, JsonRpcProvider, WebSocketProvider };
}

export default useAccount;