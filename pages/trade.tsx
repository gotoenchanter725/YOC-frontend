import React, { FC, useEffect, useState } from "react";
import Modal from "@components/widgets/Modalv2";
import MintSection from "@components/sections/Mint";
import TradeProjectSection from "@components/sections/TradeProject";
import TradeMyOrderSection from "@components/sections/TradeMyOrder";
import useAccount from "@hooks/useAccount";
import axios from "../utils/axios";

const Trade: FC = () => {
    const [tabId, setTabId] = useState('project');
    const [isMintShow, setIsMintShow] = useState(false);
    const { YUSDBalance, account } = useAccount();
    const [YUSDInOrder, setYUSDInOrder] = useState(0);

    useEffect(() => {
        if (account) {
            console.log('here');
            axios.get(`/trade/tradeYUSDByAddress?address=${account}`)
                .then((response) => {
                    console.log(response);
                    let data = response.data;
                    setYUSDInOrder(Number(data.value));
                }).catch(err => {
                    console.log(err);
                })
        }
    }, [account])

    return <div className="container">
        <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center">
                <div className={`cursor-pointer border-b border-solid ${tabId == 'project' ? 'border-secondary text-white' : 'border-transparent text-gray-400'}`} onClick={() => setTabId('project')}>
                    <p className="py-2 px-4">Project tokens</p>
                </div>
                <div className={`cursor-pointer border-b border-solid ${tabId == 'myorder' ? 'border-secondary text-white' : 'border-transparent text-gray-400'}`} onClick={() => setTabId('myorder')}>
                    <p className="py-2 px-4">My Orders</p>
                </div>
            </div>

            <div className="bg-[#4b4d4d] px-2 py-1 flex items-center rounded text-sm">
                <p className="mr-2">Your YUSD</p>
                <div className="bg-body-primary px-2 py-1">
                    <p className="leading-none text-lg mb-2">Total: {YUSDBalance + YUSDInOrder}</p>
                    <div className="flex items-center mr-3">
                        <p className="leading-none">Wallet: {YUSDBalance}</p>
                        <p className="leading-none pl-2">In Order: {YUSDInOrder}</p>
                    </div>
                </div>
                <button onClick={() => { setIsMintShow(true) }} className="ml-2 text-sm rounded p-2 leading-none bg-btn-primary">Mint YUSD</button>
            </div>
        </div>

        <div className="w-full">
            {
                tabId == 'project' ? <TradeProjectSection /> : <TradeMyOrderSection />
            }
        </div>

        <Modal size="small" layer={100} show={isMintShow} onClose={() => setIsMintShow(false)}>
            <div className="p-6">
                <MintSection></MintSection>
            </div>
        </Modal>
    </div>
}

export default Trade;