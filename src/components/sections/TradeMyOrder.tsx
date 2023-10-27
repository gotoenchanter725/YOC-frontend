import { FC, useEffect, useMemo, useState } from "react";
import { Contract } from "ethers";
import { useDispatch, useSelector } from "react-redux";

import TradeTransactionSection from "./TradeTransaction";
import Modal from "@components/widgets/Modalv2";
import NoData from "@components/widgets/NoData";
import useAccount from "@hooks/useAccount";
import axiosInstance from "utils/axios";
import { errorMyOrder, retireveingMyOrder, updateMyOrder } from "store/actions";
import { ProjectTrade } from "src/constants/contracts";

type props = {
}

const TradeMyOrderSection: FC<props> = ({ }) => {
    const dispatch = useDispatch();
    const { account, YUSDBalance, rpc_provider, signer } = useAccount();
    const [myOrders, myOrderLoading, myOrderError] = useSelector((state: any) => {
        return [
            state.trade.myOrders.data,
            state.trade.myOrders.loading,
            state.trade.myOrders.error,
        ]
    });
    const [orderId, setOrderId] = useState("-1");
    const projectTradeContract = useMemo(() => new Contract(
        ProjectTrade.address,
        ProjectTrade.abi,
        signer
    ), [signer]);

    useEffect(() => {
        if (account) {
            dispatch(retireveingMyOrder() as any);
            axiosInstance.get(`/trade/tradeOrdersByAddress?address=${account}`)
                .then((response) => {
                    let data: [] = response.data.data;
                    // dispatch(updateMyOrder(data) as any);
                    dispatch(updateMyOrder([1, 2, 3, 4, 5]) as any);
                }).catch((error) => {
                    console.log('error while getting projects info', error)
                    dispatch(errorMyOrder() as any);
                })
        }
    }, [account])

    const cancelHandle = (order: any) => {

    }

    return <>
        <table className="w-full text-sm">
            <tr className="border-b border-[#4b4d4d] border-solid">
                <th><div className="px-2 py-2">Date</div></th>
                <th><div>Order No</div></th>
                <th><div>Project</div></th>
                <th><div>Order Type</div></th>
                <th><div>Average</div></th>
                <th><div>Price</div></th>
                <th><div>Execute</div></th>
                <th><div>Amount</div></th>
                <th><div>Total</div></th>
                <th><div>Order Placed On</div></th>
                <th><div>Order Status</div></th>
                <th><div>Actions</div></th>
            </tr>

            {
                myOrderLoading == 1 ? <>
                    {
                        [1, 2, 3, 4, 5, 6].map((item: any, index: number, arr: any[]) => {
                            return <tr key={`myorder-row-${index}`} className={`bg-[#112923] ${index != arr.length - 1 ? 'border-b border-solid border-[#4b4d4d]' : ''}`}>
                                <td className="p-2.5"><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div className="flex items-center justify-center">
                                    <div className="bg-gray-200 mr-2 w-4 h-4 rounded-full animate-pulse"></div>
                                    <div className="bg-gray-200 w-16 h-4 rounded animate-pulse"></div>
                                </div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td>
                                    <div className="flex items-center justify-around">
                                        <div className="bg-gray-200 w-12 h-4 rounded animate-pulse"></div>
                                    </div>
                                </td>
                            </tr>
                        })
                    }
                </> : <>
                    {
                        myOrders.length ? <>
                            {
                                myOrders.map((item: any, index: number, arr: any[]) => {
                                    return <tr
                                        key={`myorder-row-${index}`}
                                        className={`bg-[#112923] cursor-pointer ${index != arr.length - 1 ? 'border-t border-solid border-[#4b4d4d]' : ''}`}
                                        onClick={() => setOrderId("1")}
                                    >
                                        <td className="p-2.5"><div><p className="items-center">2023-10-16 15:12:08</p></div></td>
                                        <td><div><p className="text-center">161122</p></div></td>
                                        <td className="p-2.5">
                                            <div className="flex items-center justify-center">
                                                <img src="/images/coins/ETH.png" className="w-5 h-5 mr-2" />
                                                <p>TEST</p>
                                            </div>
                                        </td>
                                        <td><div><p className="text-center">10.05</p></div></td>
                                        <td><div><p className="text-center">10.05</p></div></td>
                                        <td><div><p className="text-center">10.05</p></div></td>
                                        <td><div><p className="text-center">0.19%</p></div></td>
                                        <td><div><p className="text-center">1000</p></div></td>
                                        <td><div><p className="text-center text-status-plus">BUY</p></div></td>
                                        <td><div><p className="text-center"></p></div></td>
                                        <td><div><p className="text-center">Partial Fill</p></div></td>
                                        <td>
                                            <div className="flex items-center justify-around">
                                                <button onClick={() => cancelHandle(item)} className="bg-btn-primary text-white px-2 py-1 leading-none">Cancel</button>
                                            </div>
                                        </td>
                                    </tr>
                                })
                            }
                        </> : <tr>
                            <td colSpan={13} className="h-[200px]">
                                <NoData />
                            </td>
                        </tr>
                    }
                </>
            }
        </table>

        <Modal size="md" show={orderId != "-1"} onClose={() => { setOrderId("-1") }}>
            <TradeTransactionSection orderId={orderId} />
        </Modal>
    </>
}

export default TradeMyOrderSection;