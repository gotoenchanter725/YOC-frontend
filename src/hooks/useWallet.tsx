import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import useAccount from "./useAccount";
import { walletConnect, walletDisconnect } from "../../store/actions";
import { WALLET_UPDATE } from "../../store/types";
import { Contract } from "ethers";
import { TokenTemplate, YOC } from "../constants/contracts";
import { rpc_provider_basic } from "../../utils/rpc_provider";
import { convertWeiToEth } from "../../utils/unit";

const useWallet = () => {
    const dispatch = useDispatch();
    const { account } = useAccount();

    const connectWallet = useCallback(() => {
        if (!account) {
            dispatch(walletConnect() as any);
        }
    }, [account])

    const disconnectWallet = useCallback(() => {
        if (account) {
            dispatch(walletDisconnect() as any);
        }
    }, [account])

    const updateWalletBalance = useCallback(async () => {
        try {
            console.log(YOC.address, YOC.abi)
            let YOCContract = new Contract(
                YOC.address,
                YOC.abi,
                rpc_provider_basic
            )
            let balance = Number(convertWeiToEth(await YOCContract.balanceOf(account), YOC.decimals));
            dispatch({
                type: WALLET_UPDATE,
                payload: {
                    balance: balance,
                }
            })
        } catch (err) {
            console.log(err);
        }
    }, [YOC, account]);

    return { connectWallet, disconnectWallet, updateWalletBalance };
}

export default useWallet;