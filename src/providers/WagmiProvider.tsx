import React, { ReactNode } from 'react'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { mainnet, bsc } from "wagmi/chains"
import { sepolia, bscTestnet } from 'src/constants/chains'

import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import WalletModal from '../components/common/WalletModal'

import { NETWORK } from 'src/config/contract';


const { chains, publicClient, webSocketPublicClient } = configureChains(
    [process.env.NET_WORK == "ETH" ? (process.env.env == 'development' ? sepolia : mainnet) : (process.env.env == 'development' ? bscTestnet : bsc)],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: NETWORK.https,
                webSocket: NETWORK.wss,
            }),
        })
    ],
)

// Set up wagmi config
const config = createConfig({
    autoConnect: false,
    connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: 'wagmi',
            },
        }),
        // new WalletConnectConnector({
        //     chains,
        //     options: {
        //         projectId: '4213fdcfab447f99026c5ef69111d2e6',
        //     },
        // }),
        // new InjectedConnector({
        //     chains,
        //     options: {
        //         name: 'Injected',
        //         shimDisconnect: true,
        //     },
        // }),
    ],
    publicClient,
    webSocketPublicClient,
})

interface LayoutProps {
    children: ReactNode;
}

const WalletWagmiProvider = ({ children }: LayoutProps) => {
    return <WagmiConfig config={config}>
        {children}
        <WalletModal />
    </WagmiConfig>
}

export default WalletWagmiProvider;