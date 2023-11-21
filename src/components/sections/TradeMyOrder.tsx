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
import { convertDateToFullString } from "utils/date";
import useLoading from "@hooks/useLoading";
import useMyOrder from "@hooks/useMyOrder";
import useAlert from "@hooks/useAlert";

type props = {
}

const TradeMyOrderSection: FC<props> = ({ }) => {
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const { myOrders, loading: myOrderLoading, orderRetireve } = useMyOrder();
    const { account, signer } = useAccount();
    const [orderId, setOrderId] = useState("-1");
    const projectTradeContract = useMemo(() => new Contract(
        ProjectTrade.address,
        ProjectTrade.abi,
        signer
    ), [signer]);

    useEffect(() => {
        if (account) {
            orderRetireve();
        }
    }, [account])

    const filterOrderTypeDOM = (isBuy: Boolean = true) => {
        return <span className={isBuy ? "text-status-plus" : "text-status-minus"}>
            {isBuy ? "Buy" : "Sell"}
        </span>
    }

    const cancelHandle = async (event: React.MouseEvent<HTMLButtonElement>, order: any) => {
        event.stopPropagation();
        try {
            loadingStart();
            const eventlistencer = (_ptoken: string, _orderId: string) => {
                if (order.ptokenAddress == _ptoken && order.orderId == _orderId) {
                    loadingEnd();
                    alertShow({ content: `The order is caneled successfully`, status: 'success' });
                    orderRetireve();
                }
                projectTradeContract.removeListener("CancelOrder", eventlistencer);
            }
            projectTradeContract.on("CancelOrder", eventlistencer);
            let cancelTx = await projectTradeContract.cancelOrder(order.ptokenAddress, order.orderId);
            await cancelTx.wait();
        } catch (error) {
            loadingEnd();
            console.log(error);
        }
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
                                        onClick={() => setOrderId(item.orderId)}
                                    >
                                        <td className="p-2.5"><div><p className="items-center">{convertDateToFullString(new Date(item.createdAt))}</p></div></td>
                                        <td><div><p className="text-center">{item.orderId}</p></div></td>
                                        <td className="p-2.5">
                                            <div className="flex items-center justify-center">
                                                <img src={item.project.iconUrl} className="w-5 h-5 mr-2" />
                                                <p>{item.project.projectTitle}</p>
                                            </div>
                                        </td>
                                        <td><div><p className="text-center">{filterOrderTypeDOM(item.isBuy)}</p></div></td>
                                        <td><div><p className="text-center">{item.averagePrice}</p></div></td>
                                        <td><div><p className="text-center">{item.price}</p></div></td>
                                        <td><div><p className="text-center">{Number((Number(item.totalAmount) - Number(item.remainingAmount)) / Number(item.totalAmount) * 100).toFixed(2)}%</p></div></td>
                                        <td><div><p className="text-center">{item.totalAmount}</p></div></td>
                                        <td><div><p className="text-center"></p></div></td>
                                        <td><div>
                                            <div className="flex items-center">
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${Number(item.remainingAmount) == 0 ? 'bg-status-active' : (item.isCancelled ? 'bg-status-disable' : 'bg-status-warning')}`} />
                                                <p>{Number(item.remainingAmount) == 0 ? 'Filled' : (item.isCancelled ? 'Canceled' : 'Partially Filled')}</p>
                                            </div>
                                        </div></td>
                                        <td>
                                            <div className="flex items-center justify-around">
                                                {
                                                    item.isCancelled ? <></> :
                                                        <button onClick={(e) => cancelHandle(e, item)} className="bg-btn-primary text-white px-2 py-1 leading-none">Cancel</button>
                                                }
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