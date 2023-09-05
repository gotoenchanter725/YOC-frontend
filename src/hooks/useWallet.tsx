import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount as useWagmiAccount, useConnect, useDisconnect } from 'wagmi'

import useAccount from "./useAccount";
import { WALLET_UPDATE } from "../../store/types";
import ethers, { Contract } from "ethers";
import { TokenTemplate, YOC } from "../constants/contracts";
import { rpc_provider_basic } from "../../utils/rpc_provider";
import { convertWeiToEth } from "../../utils/unit";

const useWallet = () => {
    const dispatch = useDispatch();
    const { address, connector, isConnected } = useWagmiAccount()
    const { disconnect } = useDisconnect()
    const { account } = useAccount();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

    const connectWallet = useCallback(async () => {
        if (!isConnected && connectors.length) {
            connect({ connector: connectors[0] });
        }
    }, [isConnected, connect, connectors, error, isLoading, pendingConnector])

    const disconnectWallet = useCallback(() => {
        if (isConnected) {
            disconnect();
        }
    }, [isConnected])

    const showWalletModal = () => {
        dispatch({
            type: "WALLET_MODAL_SHOW",
            payload: {
                showWalletModal: true
            }
        })
    }

    const hideWalletModal = () => {
        dispatch({
            type: "WALLET_MODAL_HIDE",
            payload: {
                showWalletModal: false
            }
        })
    }

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

    return { connectWallet, disconnectWallet, updateWalletBalance, showWalletModal, hideWalletModal };
}

export default useWallet;