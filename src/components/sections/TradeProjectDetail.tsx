import React, { FC, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic';
import { BsArrowDown } from "react-icons/bs";
import { Contract } from "ethers";

import CInput from "@components/widgets/CInput";
import Period from "@components/widgets/Period";
import ProgressInput from "@components/widgets/ProgressInput";
import ProjectSelector from "@components/widgets/ProjectSelector";
import Modal from "@components/widgets/Modalv2";
import NoData from "@components/widgets/NoData";
import MintSection from "./Mint";
const ProjectPriceChart = dynamic(() => import('./ProjectPriceChart'), { ssr: false });

import useAccount from "@hooks/useAccount";
import { convertEthToWei, isValidEthAddress } from "utils/unit";
import axiosInstance from "utils/axios";
import { convertPeriodShortToFull, convertPeriodToMiliSecond, multiplyNumbers } from "utils/features";
import { ProjectTrade, TokenTemplate, YUSD } from 'src/constants/contracts';
import useAlert from "@hooks/useAlert";
import useTradeProject from "@hooks/useTrade";
import useFundProject from "@hooks/useFund";
import useLoading from "@hooks/useLoading";

type props = {
    ptokenAddress: string,
    setPtokenAddress: (v: string) => void
}
const TradeProjectDetail: FC<props> = ({ ptokenAddress, setPtokenAddress }) => {
    const { alertShow } = useAlert();
    const { loadingStart, loadingEnd } = useLoading();
    const { YUSDBalance, account, signer } = useAccount();
    const { projects: tradeProjects, loading: tradeProjectLoading } = useTradeProject();
    const { projects: fundProjects, loading: fundProjectLoading } = useFundProject();
    const [isMintShow, setIsMintShow] = useState(false);
    const [buyOrders, setBuyOrders] = useState<any[]>([]);
    const [sellOrders, setSellOrders] = useState<any[]>([]);
    const [loadingProjectDetail, setLoadingProjectDetail] = useState(0); // 0: not loading, 1: loading, 2: done
    const [prices, setPrices] = useState<any[]>([]);
    const [comparedPrices, setComparedPrices] = useState<any[]>([]);
    const [tradeProjectDetail, setTradeProjectDetail] = useState<any>();
    const [fundProjectDetail, setFundProjectDetail] = useState<any>();
    const [period, setPeriod] = useState("1D");
    const [percentageOfBuy, setPercentageOfBuy] = useState(0);
    const [percentageOfSell, setPercentageOfSell] = useState(0);

    const [priceForBuy, setPriceForBuy] = useState(0);
    const [priceForSell, setPriceForSell] = useState(0);
    const [amountForBuy, setAmountForBuy] = useState(0);
    const [amountForSell, setAmountForSell] = useState(0);

    const projectTradeContract = useMemo(() => new Contract(
        ProjectTrade.address,
        ProjectTrade.abi,
        signer
    ), [signer]);
    const YUSDContract = useMemo(() => new Contract(
        YUSD.address,
        YUSD.abi,
        signer
    ), [signer]);

    useEffect(() => {
        if (isValidEthAddress(ptokenAddress)) {
            console.log("isValidEthAddress", ptokenAddress)
            // retireve the project detailed data using ptokenAddress
            setLoadingProjectDetail(1);
            axiosInstance.get(`/trade/projectDetailByPtokenAddress?ptokenAddress=${ptokenAddress}`)
                .then((response) => {
                    let data = response.data.data;
                    setPrices([
                        ...data.pricesFor1d.data.map((item: any) => {
                            return {
                                ...item,
                                date: +new Date(item.date)
                            }
                        })
                    ])
                    setLoadingProjectDetail(2);
                    setSellOrders([...[1, 2, 3, 4]]);
                    setBuyOrders([...[1, 2, 3, 4]]);
                }).catch(err => {
                    console.log(err);
                    setLoadingProjectDetail(2);
                })
        }
    }, [ptokenAddress])

    useEffect(() => {
        if (ptokenAddress != "-1" && tradeProjectLoading == 2) {
            let detail = tradeProjects.find((item: any) => item.data.ptokenAddress == ptokenAddress);
            setTradeProjectDetail(detail);
        }
    }, [ptokenAddress, tradeProjects, tradeProjectLoading])

    useEffect(() => {
        if (ptokenAddress != "-1") {
            let detail = fundProjects.find((item: any) => item.shareToken == ptokenAddress);
            setFundProjectDetail(detail);
            console.log(detail);
        }
    }, [ptokenAddress, account, fundProjects, fundProjectLoading])

    useEffect(() => {
        if (period) {
            let time = convertPeriodToMiliSecond(period);
            if (isValidEthAddress(ptokenAddress)) {
                axiosInstance.get(`/trade/pricesByPtokenAddress?ptokenAddress=${ptokenAddress}&period=${time}`)
                    .then((response) => {
                        let data = response.data.data;
                        setPrices([...data.map((item: any) => { return { ...item, date: +new Date(item.date) } })])
                    }).catch((err) => {
                        console.log(err);
                    })
            }
        }
    }, [period])

    const buyHandle = async () => {
        loadingStart();
        try {
            let finalYUSDAmount = multiplyNumbers([multiplyNumbers([priceForBuy * amountForBuy]), 1.0019]);
            if (finalYUSDAmount == 0) {
                alertShow({
                    content: `Please input Price and Amount exactly`,
                    status: 'failed'
                })
                return;
            }
            if (finalYUSDAmount > YUSDBalance) {
                alertShow({
                    content: `You have insufficient YUSD amount`,
                    status: 'failed'
                })
                return;
            }
            alert('here')
            let approveTx = await YUSDContract.approve(
                ProjectTrade.address,
                convertEthToWei(String(finalYUSDAmount), YUSD.decimals),
                {
                    gasLimit: 300000
                }
            );
            await approveTx.wait();
            let buyTx = await projectTradeContract.buy(
                ptokenAddress,
                convertEthToWei(String(amountForBuy), fundProjectDetail.shareDecimal),
                convertEthToWei(String(priceForBuy), YUSD.decimals),
                {
                    gasLimit: 700000
                }
            )
            await buyTx.wait();
            projectTradeContract.on('OrderCreated', (ptoken, userAddress, orderId, amount, isBuy) => {
                console.log("OrderCreated:", ptoken, userAddress, orderId, amount, isBuy);
                loadingEnd();
            })
        } catch (err) {
            loadingEnd();
            console.log(err);
        }
    }
    const sellHandle = async () => {
        loadingStart();
        try {
            let finalYUSDAmount = multiplyNumbers([priceForSell * amountForSell]);
            if (finalYUSDAmount == 0) {
                alertShow({
                    content: `Please input Price and Amount exactly`,
                    status: 'failed'
                })
                return;
            }
            if (amountForSell > fundProjectDetail.shareTokenBalance) {
                alertShow({
                    content: `You have insufficient YUSD amount`,
                    status: 'failed'
                })
                return;
            }
            const PTokenContract = new Contract(
                ptokenAddress,
                TokenTemplate.abi,
                signer
            )
            let approveTx = await PTokenContract.approve(
                ProjectTrade.address,
                convertEthToWei(String(amountForSell), fundProjectDetail.shareDecimal),
                {
                    gasLimit: 300000
                }
            );
            await approveTx.wait();
            let sellTx = await projectTradeContract.sell(
                ptokenAddress,
                convertEthToWei(String(amountForSell), fundProjectDetail.shareDecimal),
                convertEthToWei(String(priceForSell), YUSD.decimals),
                {
                    gasLimit: 2000000
                }
            )
            await sellTx.wait();
            projectTradeContract.on('OrderCreated', (ptoken, userAddress, orderId, amount, isBuy) => {
                console.log("OrderCreated:", ptoken, userAddress, orderId, amount, isBuy);
                loadingEnd();
            })
        } catch (err) {
            loadingEnd();
            console.log(err);
        }
    }

    return <>
        <div className="w-full text-sm p-2">
            <div className="flex justify-around">
                <div className="flex items-center text-xl">
                    <div>TRADE</div>
                    <ProjectSelector ptokenAddress={ptokenAddress} setPtokenAddress={(v: string) => setPtokenAddress(v)} />
                </div>
            </div>

            <p className="py-2">You have {fundProjectDetail ? fundProjectDetail.shareTokenBalance : ""} {tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""} in your wallet, {tradeProjectDetail ? tradeProjectDetail.data.ptokenTradeBalance : "0.0"} in Order, {tradeProjectDetail ? Number(tradeProjectDetail.data.ptokenSellAmount) - Number(tradeProjectDetail.data.ptokenTradeBalance) : "0.0"} available</p>
            <div className="w-full h-[calc(100vh_-_300px)] overflow-x-hidden overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-[#FFFFFF33] scrollbar-track-[#FFFFFF33]">
                <div className="w-full flex items-stretch pr-2">
                    <div className="min-w-[320px] w-1/4 h-full p-4 rounded border-2 border-solid border-border-secondary bg-[#00000025]">
                        <h3 className="italic text-md mb-2">Market</h3>
                        <div className="w-full">
                            <div className="flex items-center text-[#bdbdbd]">
                                <div className="w-1/3 text-center py-1.5">Price({YUSD.symbol})</div>
                                <div className="w-1/3 text-center py-1.5">Amount({tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""})</div>
                                <div className="w-1/3 text-center py-1.5">Price({YUSD.symbol})</div>
                            </div>
                            <div className="min-h-[calc(50vh_-_300px)] h-full">
                                {
                                    loadingProjectDetail == 1 ? <>
                                        {
                                            [1, 2, 3, 4, 5].map((item, index: number) => {
                                                return <div key={`buy-order-${index}`} className="flex items-center border-t border-solid border-[#bdbdbd]">
                                                    <div className="w-1/3 p-2 text-red-500 text-center"><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div>
                                                    <div className="w-1/3 p-2 text-center"><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div>
                                                    <div className="w-1/3 p-2 text-center"><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div>
                                                </div>
                                            })
                                        }
                                    </> : <>
                                        {
                                            buyOrders.length ? <>
                                                {
                                                    buyOrders.map((item, index) => {
                                                        return <div key={`buy-order-${index}`} className="flex items-center border-t border-solid border-[#bdbdbd]">
                                                            <div className="w-1/3 p-2 text-red-500 text-center">0.9000</div>
                                                            <div className="w-1/3 p-2 text-center">1.512</div>
                                                            <div className="w-1/3 p-2 text-center">12.3</div>
                                                        </div>
                                                    })
                                                }
                                            </> : <div className="w-full h-[200px]">
                                                <NoData />
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                            <div className="flex items-center text-md my-2.5">{0.1} YUSD <BsArrowDown className="ml-2 text-status-plus" /></div>
                            <div className="min-h-[calc(50vh_-_180px)] h-full">
                                {
                                    loadingProjectDetail == 1 ? <>
                                        {
                                            [1, 2, 3, 4, 5].map((item, index: number) => {
                                                return <div key={`buy-order-${index}`} className="flex items-center border-t border-solid border-[#bdbdbd]">
                                                    <div className="w-1/3 p-2 text-red-500 text-center"><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div>
                                                    <div className="w-1/3 p-2 text-center"><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div>
                                                    <div className="w-1/3 p-2 text-center"><div className="bg-gray-200 h-4 rounded animate-pulse"></div></div>
                                                </div>
                                            })
                                        }
                                    </> : <>
                                        {
                                            sellOrders.length ? <>
                                                {
                                                    sellOrders.map((item, index) => {
                                                        return <div key={`buy-order-${index}`} className="flex items-center border-t border-solid border-[#bdbdbd]">
                                                            <div className="w-1/3 p-2 text-red-500 text-center">0.9000</div>
                                                            <div className="w-1/3 p-2 text-center">1.512</div>
                                                            <div className="w-1/3 p-2 text-center">12.3</div>
                                                        </div>
                                                    })
                                                }
                                            </> : <div className="w-full h-[200px]">
                                                <NoData />
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-full ml-2">
                        <div className="w-full p-4 rounded border-2 border-solid border-border-secondary bg-[#00000025] mb-2">
                            <div className="flex items-center justify-between">
                                <h3 className="italic text-md mb-2">Evolution</h3>
                                <Period value={period} setValue={(p: string) => { setPeriod(p) }} />
                            </div>
                            <div className="">
                                <div className="flex items-center mb-2">
                                    <div>
                                        <div className="flex items-center"><p>{tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""} </p> <p className="mx-2 italic">Price:</p> {tradeProjectDetail ? tradeProjectDetail.price.value : 0} YUSD</div>
                                        <div className="flex items-center"><p>{convertPeriodShortToFull(period)} variation</p> <p className="italic">{155}%</p></div>
                                    </div>
                                    <div className="ml-12 flex items-center">
                                        <div>Compare:</div>
                                        <ProjectSelector />
                                    </div>
                                </div>
                                <div id="priceChart" className="chart-section mb-2">
                                    <ProjectPriceChart data={prices} />
                                </div>
                                <div className=" mb-2">
                                    <div className="flex items-center"><p>{tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""} </p> <p className="italic">Trade Valume:</p></div>
                                    <div className="flex items-center"><p>{convertPeriodShortToFull(period)} variation</p><p className="ml-2 italic">1,125,254,23456</p></div>
                                </div>
                                <div className="chart-section">
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-between">
                            <div className="w-[calc(50%_-_20px)] p-4 rounded border-2 border-solid border-border-secondary bg-[#00000025]">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex flex-col">
                                        <h2 className="text-lg">Buy {tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""}</h2>
                                        <p>Avbl: 0.00 YUSD</p>
                                    </div>
                                    <button className="bg-btn-primary px-3 py-2 text-sm rounded shadow-btn-primary" onClick={() => { setIsMintShow(true) }}>Mint YUSD</button>
                                </div>
                                <CInput value={priceForBuy} setValue={(v: any) => { setPriceForBuy(v); setPercentageOfBuy(Number(v / YUSDBalance) * 100) }} label="Price" className="mb-2" leftText="YUSD" />
                                <CInput value={amountForBuy} setValue={(v: any) => setAmountForBuy(v)} label="Amount" className="mb-4" leftText={"YTESTE"} />
                                <div className="h-[2px] w-full mb-6 bg-status-plus"></div>
                                <div className="w-full flex items-center justify-between mb-6">
                                    <ProgressInput value={percentageOfBuy} setValue={(v: number) => { setPercentageOfBuy(v); setPriceForBuy(YUSDBalance * v / 100) }} className="w-[calc(100%_-_56px)]" inputClassName="plus" />
                                    <button className="w-[50px] bg-status-plus px-3 py-2 text-sm rounded shadow-btn-primary" onClick={() => { setPercentageOfBuy(100); setPriceForBuy(Number(YUSDBalance)) }}>MAX</button>
                                </div>
                                <CInput value={multiplyNumbers([priceForBuy, amountForBuy])} disabled={true} label="TOTAL" className="" leftText={"YUSD"} />
                                <div className="flex justify-end">
                                    <span>Fee: 0.19%</span>
                                </div>
                                <button className="w-full bg-status-plus px-3 py-2 text-sm rounded shadow-btn-primary" onClick={() => buyHandle()}>Buy {'YTEST'}</button>
                            </div>

                            <div className="w-[calc(50%_-_20px)] p-4 rounded border-2 border-solid border-border-secondary bg-[#00000025]">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex flex-col">
                                        <h2 className="text-lg">Sell {tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""}</h2>
                                        <p>Avbl: 0.00 YUSD</p>
                                    </div>
                                </div>
                                <CInput value={priceForSell} setValue={(v: any) => setPriceForSell(v)} label="Price" className="mb-2" leftText="YUSD" />
                                <CInput value={amountForSell} setValue={(v: any) => { setAmountForSell(v); setPercentageOfSell(v / Number(fundProjectDetail.shareTokenBalance) * 100) }} label="Amount" className="mb-4" leftText={"YTESTE"} />
                                <div className="h-[2px] w-full mb-6 bg-status-minus"></div>
                                <div className="w-full flex items-center justify-between mb-6">
                                    <ProgressInput value={percentageOfSell} setValue={(v: number) => { setPercentageOfSell(v); console.log(fundProjectDetail.shareTokenBalance); setAmountForSell(Number(fundProjectDetail.shareTokenBalance) * (v / 100)) }} className="w-[calc(100%_-_56px)]" inputClassName="minus" />
                                    <button className="w-[50px] bg-status-minus px-3 py-2 text-sm rounded shadow-btn-primary" onClick={() => { setPercentageOfSell(100); setAmountForSell(Number(fundProjectDetail.shareTokenBalance)) }}>MAX</button>
                                </div>
                                <CInput type="text" value={multiplyNumbers([priceForSell, amountForSell])} disabled={true} label="TOTAL" className="" leftText={"YUSD"} />
                                <div className="flex justify-end">
                                    <span>Fee: 0.19%</span>
                                </div>
                                <button className="w-full bg-status-minus px-3 py-2 text-sm rounded shadow-btn-primary" onClick={() => sellHandle()}>Sell {'YTEST'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <Modal size="small" layer={100} show={isMintShow} onClose={() => setIsMintShow(false)}>
            <div className="p-6">
                <MintSection />
            </div>
        </Modal>
    </>
}

export default TradeProjectDetail;