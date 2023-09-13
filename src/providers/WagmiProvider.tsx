import React, { ReactNode } from 'react'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { mainnet, sepolia, bsc, bscTestnet } from "wagmi/chains"
import { providers } from 'ethers';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import WalletModal from '../components/common/WalletModal'

import { NETWORK } from 'src/config/contract';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
    [process.env.NET_WORK == "ETH" ? sepolia : bscTestnet],
    // [alchemyProvider({ apiKey: process.env.ALCHEMY_KEY + "" }),],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: NETWORK.RPC_URL,
                webSocket: NETWORK.RPC_URL,
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