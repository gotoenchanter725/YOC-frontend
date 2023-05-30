import { useSelector } from "react-redux";

import { rpc_provider_basic } from '../../utils/rpc_provider';

const useAccount = () => {
    const { account, balance, provider, signer } = useSelector((state: any) => state.data);

    return { account, balance, provider, signer, rpc_provider: rpc_provider_basic };
}

export default useAccount;