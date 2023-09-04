import React, { ReactNode } from 'react'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, sepolia, bsc, bscTestnet } from "wagmi/chains"
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
    [process.env.NET_WORK == "ETH" ? sepolia : bscTestnet],
    // [alchemyProvider({ apiKey: 'yourAlchemyApiKey' }), publicProvider()],
    [publicProvider()],
)

// Set up wagmi config
const config = createConfig({
    autoConnect: false,
    connectors: [
        new MetaMaskConnector({ chains }),
        // new CoinbaseWalletConnector({
        //     chains,
        //     options: {
        //         appName: 'wagmi',
        //     },
        // }),
        // new WalletConnectConnector({
        //     chains,
        //     options: {
        //         projectId: '...',
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
    </WagmiConfig>
}

export default WalletWagmiProvider;