// import { useSelector } from "react-redux";
import { useAccount as useWagmiAccount } from 'wagmi';
import { fetchBalance } from '@wagmi/core'
import { rpc_provider_basic } from '../../utils/rpc_provider';
import { getEthersProvider, getEthersSigner } from "utils/ethers";
import { useEffect, useState } from "react";
import { convertWeiToEth } from "../../utils/unit";
import { YOC } from 'src/constants/contracts';

const useAccount = () => {
    // const { account, balance, provider, signer } = useSelector((state: any) => state.data);
    const { address, connector, isConnected } = useWagmiAccount();
    const [balance, setBalance] = useState("");
    const [provider, setProvider] = useState();
    const [signer, setSigner] = useState();
    const account = address;
    useEffect(() => {
        (async () => {
            let t_signer = await getEthersSigner();
            setSigner(t_signer as any);
            let t_provider = await getEthersProvider();
            setProvider(t_provider as any);
        })();
    }, [])
    useEffect(() => {
        (async () => {
            if (YOC && address) {
                let rst = await fetchBalance({
                    address: address as `0x${string}`,
                    token: YOC.address as `0x${string}`
                });
                console.log(rst);
                setBalance(convertWeiToEth(rst.value, YOC.decimals));
            }
        })();
    }, [YOC, address])

    useEffect(() => {
        if (!isConnected) setBalance("0");
    }, [isConnected])

    return { account, balance, provider, signer, rpc_provider: rpc_provider_basic };
}

export default useAccount;