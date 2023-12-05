import NoData from "@components/widgets/NoData";
import useMyOrder from "@hooks/useMyOrder";
import React, { FC, useEffect, useState } from "react";
import axiosInstance from "utils/axios";
import { convertDateToFullString } from "utils/date";

type propsType = {
    orderId: string
}

const TradeTransactionSection: FC<propsType> = ({ orderId = "" }) => {
    const [orderDetail, setOrderDetail] = useState<any>();
    const { myOrders, loading: myOrderLoading } = useMyOrder();
    const [loading, setLoading] = useState(0);

    useEffect(() => {
        if (orderId != "-1") {
            setLoading(1);
            console.log(orderId);
            let order = myOrders.find((item: any) => item.orderId == orderId);
            setOrderDetail({
                ...order
            });
            console.log(order);
            setLoading(2);
            // axiosInstance.get(`/trade/allTransactionByOrderId?orderId=${orderId}`)
            //     .then((response) => {
            //         console.log(response);
            //         let data = response.data.data;
            //         setOrderDetail([...data]);
            //         setLoading(2);
            //     }).catch(err => {
            //         // console.log(err);
            //         setLoading(2);
            //         setOrderDetail([
            //             {
            //                 transactionId: "",
            //                 amount: 100,
            //                 ptokenAddress: "0xAAAAA",
            //                 price: "10.5",
            //                 buyOrderId: "10",
            //                 sellOrderId: "10",
            //             }, {
            //                 transactionId: "",
            //                 amount: 100,
            //                 ptokenAddress: "0xAAAAA",
            //                 price: "10.5",
            //                 buyOrderId: "10",
            //                 sellOrderId: "10",
            //             }, {
            //                 transactionId: "",
            //                 amount: 100,
            //                 ptokenAddress: "0xAAAAA",
            //                 price: "10.5",
            //                 buyOrderId: "10",
            //                 sellOrderId: "10",
            //             }, {
            //                 transactionId: "",
            //                 amount: 100,
            //                 ptokenAddress: "0xAAAAA",
            //                 price: "10.5",
            //                 buyOrderId: "10",
            //                 sellOrderId: "10",
            //             },
            //         ]);
            //     });
        }
    }, [orderId, myOrders, loading])

    return <div className="w-full px-4 py-4">
        <div className="flex items-center font-light my-3">
            <div className="flex items-center mr-4">
                <div className="mr-2">Order No: </div>
                <div className="font-semibold">{orderId}</div>
            </div>
            <div className="flex items-center mr-2">
                <div className="mr-2">Time Updated: </div>
                <div className="font-semibold">{orderDetail ? convertDateToFullString(new Date(orderDetail.updatedAt)) : ""}</div>
            </div>
        </div>
        <table className="w-full text-sm border border-solid border-[#4b4d4d]">
            <tr>
                <th><div className="px-2 py-2">Date</div></th>
                <th><div>Trading price</div></th>
                <th><div>Executed</div></th>
                <th><div>Transaction Fee</div></th>
                <th><div>Total</div></th>
            </tr>

            {
                (myOrderLoading != 2 || loading != 2) ? <>
                    {
                        [0, 1, 2, 3, 4].map((item: any, index: number) => {
                            return <tr key={`transaction-${index}`} className="bg-[#101a2c] border-t border-solid border-[#4b4d4d]">
                                <td className="p-2.5"><div><div className="w-[140px] bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div className="flex items-center justify-center"><div className="w-[100px] bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div className="flex items-center justify-center"><div className="w-[100px] bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div className="flex items-center justify-center"><div className="w-[100px] bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                <td><div className="flex items-center justify-center"><div className="w-[100px] bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                            </tr>
                        })
                    }
                </>
                    : <>
                        {
                            (orderDetail && orderDetail.transactions && orderDetail.transactions.length) ? <>
                                {
                                    orderDetail.transactions.map((item: any, index: number) => {
                                        return <tr key={`transaction-${index}`} className="bg-[#101a2c] border-t border-solid border-[#4b4d4d]">
                                            <td className="p-2.5"><div><p className="items-center">{convertDateToFullString(new Date(item.createdAt))}</p></div></td>
                                            <td><div><p className="text-center">{Number(item.price).toFixed(4)}</p></div></td>
                                            <td><div><p className="text-center">{item.amount}</p></div></td>
                                            <td><div><p className="text-center">0.19%</p></div></td>
                                            <td><div><p className="text-center">{Number(item.price) * Number(item.amount)}</p></div></td>
                                        </tr>
                                    })
                                }
                            </> : <tr>
                                <td colSpan={5} className="h-[200px]">
                                    <NoData />
                                </td>
                            </tr>
                        }
                    </>
            }
        </table>
    </div>
}

export default TradeTransactionSection;