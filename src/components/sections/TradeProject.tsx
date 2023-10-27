import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "utils/axios";
import { retireveingProject, updateProject, errorProject } from "store/actions";
import NoData from "@components/widgets/NoData";
import Modal from "@components/widgets/Modalv2";
import TradeProjectDetail from "./TradeProjectDetail";

type props = {
}

const TradeProjectSection: FC<props> = ({ }) => {
    const [projects, projectLoading, projectError] = useSelector((state: any) => {
        return [
            state.trade.projects.data,
            state.trade.projects.loading,
            state.trade.projects.error,
        ]
    });
    const dispatch = useDispatch();
    const [pToken, setPToken] = useState("-1");

    useEffect(() => {
        dispatch(retireveingProject() as any);
        axiosInstance.get('/trade/tradeProjects')
            .then((response) => {
                let data: [] = response.data.data;
                // dispatch(updateProject(data) as any);
                dispatch(updateProject([1, 2, 3, 4, 5, 6]) as any);
            }).catch((error) => {
                console.log('error while getting projects info', error)
                dispatch(errorProject() as any);
            })
    }, [])

    return <>
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-[#4b4d4d] border-solid">
                    <th>
                        <div className="flex items-center justify-around">
                            <div className="flex items-center">
                                <label htmlFor="onlyyou">Only your tokens</label>
                                <input id="onlyyou" className="ml-2" type="checkbox" />
                            </div>
                        </div>
                    </th>
                    <th colSpan={5} className="border-b-2 border-solid border-secondary">
                        <div className="px-3 py-2">Your Balance</div>
                    </th>
                    <th className="w-[20px]"></th>
                    <th colSpan={5} className="border-b-2 border-solid border-secondary">
                        <div className="px-3 py-2">Market Information</div>
                    </th>
                    <th className="w-[20px]"></th>
                    <th className="border-b-2 border-solid border-secondary"></th>
                </tr>
                <tr className="border-b border-[#4b4d4d] border-solid">
                    <th><div className="px-2 py-2">Project</div></th>
                    <th><div>Total</div></th>
                    <th><div>Wallet</div></th>
                    <th><div>In Order</div></th>
                    <th><div>Available</div></th>
                    <th>
                        <div>Value</div>
                        <p>(YUSD)</p>
                    </th>
                    <th></th>
                    <th>
                        <div>Price</div>
                        <p>(YUSD)</p>
                    </th>
                    <th><div>24h</div></th>
                    <th><div>7d</div></th>
                    <th>
                        <div>24th Volume</div>
                        <p>(YUSD)</p>
                    </th>
                    <th>
                        <div>MKt Cap</div>
                        <p>(YUSD)</p>
                    </th>
                    <th></th>
                    <th><div>Trade</div></th>
                </tr>
            </thead>

            <tbody>
                {
                    projectLoading == 1 ? <>
                        {
                            [0, 0, 0, 0, 0, 0].map((item: any, index: number, arr) => {
                                return <tr key={`project-row-${index}`} className={`bg-[#112923] ${index != arr.length - 1 ? 'border-b border-solid border-[#4b4d4d]' : ''}`}>
                                    <td className="p-2.5">
                                        <div className="flex items-center">
                                            <div className="bg-gray-200 mr-2 w-4 h-4 rounded-full animate-pulse"></div>
                                            <div className="bg-gray-200 w-16 h-4 rounded animate-pulse"></div>
                                        </div>
                                    </td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div></td>
                                    <td><div></div></td>
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
                            projects.length ? <>
                                {
                                    projects.map((item: any, index: number, arr: any[]) => {
                                        return <tr key={`project-row-${index}`} className={`bg-[#112923] ${index != arr.length - 1 ? 'border-t border-solid border-[#4b4d4d]' : ''}`}>
                                            <td className="p-2.5">
                                                <div className="flex items-center">
                                                    <img src="/images/coins/ETH.png" className="w-5 h-5 mr-2" />
                                                    <p>TEST</p>
                                                </div>
                                            </td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div><p className="text-center">0</p></div></td>
                                            <td><div></div></td>
                                            <td>
                                                <div className="flex items-center justify-around">
                                                    <button className="bg-btn-primary text-white px-2 py-1 leading-none" onClick={() => setPToken("1")}>Trade</button>
                                                </div>
                                            </td>
                                        </tr>
                                    })
                                }
                            </> :
                                <tr>
                                    <td colSpan={14} className="h-[200px] text-center"><NoData /></td>
                                </tr>
                        }
                    </>
                }
            </tbody>
        </table>


        <Modal size="full" show={pToken != "-1"} onClose={() => { setPToken("-1") }}>
            <div className="p-4">
                <TradeProjectDetail ptokenAddress={pToken} />
            </div>
        </Modal>
    </>
}

export default TradeProjectSection;