import React, { FC, useEffect, useState, useMemo } from "react";
import dynamic from 'next/dynamic';
import { BsArrowUp } from "react-icons/bs";
import { Contract, constants } from "ethers";

import CInput from "@components/widgets/CInput";
import Period from "@components/widgets/Period";
import ProgressInput from "@components/widgets/ProgressInput";
import ProjectSelector from "@components/widgets/ProjectSelector";
import Modal from "@components/widgets/Modalv2";
import NoData from "@components/widgets/NoData";
import MintSection from "./Mint";
const ProjectPriceChart = dynamic(() => import('./ProjectPriceChart'), { ssr: false });
const { MaxUint256 } = constants;

import useAccount from "@hooks/useAccount";
import { convertEthToWei, convertWeiToEth, isValidEthAddress, showBigNumber } from "utils/unit";
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
    const { projects: tradeProjects, loading: tradeProjectLoading, projectRetireve } = useTradeProject();
    const { projects: fundProjects, loading: fundProjectLoading, updateProjectInfoByAddress } = useFundProject();
    const [isMintShow, setIsMintShow] = useState(false);
    const [buyOrders, setBuyOrders] = useState<any[]>([]);
    const [sellOrders, setSellOrders] = useState<any[]>([]);
    const [loadingProjectDetail, setLoadingProjectDetail] = useState(0); // 0: not loading, 1: loading, 2: done
    const [prices, setPrices] = useState<any[]>([]);
    const [latestPrice, setLatestPrice] = useState(0);
    const [comparedPtokedAddress, setComparedPtokedAddress] = useState('');
    const [comparedPrices, setComparedPrices] = useState<any[]>([]);
    const [tradeProjectDetail, setTradeProjectDetail] = useState<any>();
    const [fundProjectDetail, setFundProjectDetail] = useState<any>();
    const [period, setPeriod] = useState("1D");
    const [percentageOfBuy, setPercentageOfBuy] = useState(0);
    const [percentageOfSell, setPercentageOfSell] = useState(0);
    const [variation, setVariation] = useState(0);
    const [valume, setValume] = useState(0);
    const [reloading, setReloading] = useState(1);

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
        if (isValidEthAddress(ptokenAddress) && reloading) {
            console.log("isValidEthAddress", ptokenAddress)
            // retireve the project detailed data using ptokenAddress
            setLoadingProjectDetail(1);
            axiosInstance.get(`/trade/projectDetailByPtokenAddress?ptokenAddress=${ptokenAddress}`)
                .then((response) => {
                    let data = response.data.data;
                    // setPrices([
                    //     ...data.pricesFor1d.data.map((item: any) => {
                    //         return {
                    //             ...item,
                    //             date: +new Date(item.date)
                    //         }
                    //     })
                    // ])
                    setLatestPrice(Number(data.latestPrice));
                    setLoadingProjectDetail(2);
                    setSellOrders([...data.orders.filter((item: any) => item.isCancelled == false && item.isBuy == false).sort((a: any, b: any) => Number(b.price) - Number(a.price))]);
                    setBuyOrders([...data.orders.filter((item: any) => item.isCancelled == false && item.isBuy == true).sort((a: any, b: any) => Number(b.price) - Number(a.price))]);
                }).catch(err => {
                    console.log(err);
                    setLoadingProjectDetail(2);
                })
        }
    }, [ptokenAddress, reloading])

    useEffect(() => {
        if (ptokenAddress != "-1" && tradeProjectLoading == 2 && reloading) {
            let detail = tradeProjects.find((item: any) => item.data.ptokenAddress == ptokenAddress);
            setTradeProjectDetail(detail);
        }
    }, [ptokenAddress, tradeProjects, tradeProjectLoading, reloading])

    useEffect(() => {
        if (ptokenAddress != "-1") {
            let detail = fundProjects.find((item: any) => item.shareToken == ptokenAddress);
            setFundProjectDetail(detail);
            console.log('fundProjectDetail', detail);
        }
    }, [ptokenAddress, account, JSON.stringify(fundProjects), fundProjectLoading, reloading])

    useEffect(() => {
        if (period && ptokenAddress != "-1" && reloading) {
            let time = convertPeriodToMiliSecond(period);
            if (isValidEthAddress(ptokenAddress)) {
                axiosInstance.get(`/trade/pricesByPtokenAddress?ptokenAddress=${ptokenAddress}&period=${time}`)
                    .then((response) => {
                        let data = response.data.data;
                        let filteredData = [...data.map((item: any) => { return { ...item, date: +new Date(item.date) } })]
                        setPrices([...filteredData])
                        let first = filteredData[0].value, last = filteredData[filteredData.length - 1].value;
                        if (first == 0) setVariation(0);
                        else setVariation((last - first) / first * 100);
                    }).catch((err) => {
                        console.log(err);
                    })
                axiosInstance.get(`/trade/variationByPtokenAddressAndPeriod?ptokenAddress=${ptokenAddress}&period=${time}`)
                    .then((response) => {
                        let data = response.data;
                        setValume(data.value);
                    }).catch((err) => {
                        console.log(err);
                    })
            }
        }
    }, [period, ptokenAddress, reloading])

    const buyHandle = async () => {
        loadingStart();
        try {
            let finalYUSDAmount = multiplyNumbers([multiplyNumbers([priceForBuy * amountForBuy]), 1.0019]);
            if (finalYUSDAmount == 0) {
                alertShow({
                    content: `Please input Price and Amount exactly`,
                    status: 'failed'
                })
                throw "invalid input";
            }
            if (finalYUSDAmount > YUSDBalance) {
                alertShow({
                    content: `You have insufficient YUSD amount`,
                    status: 'failed'
                })
                throw "insufficient amount";
            }
            let allowanceAmount = Number(convertWeiToEth(await YUSDContract.allowance(account, ProjectTrade.address), YUSD.decimals));
            if (allowanceAmount < finalYUSDAmount) {
                let approveTx = await YUSDContract.approve(
                    ProjectTrade.address,
                    MaxUint256,
                    {
                        gasLimit: 300000
                    }
                );
                await approveTx.wait();
            }
            projectTradeContract.on('OrderCreated', (ptoken, userAddress, orderId, amount, price, isBuy) => {
                if (ptokenAddress == ptoken && userAddress == account) {
                    console.log("OrderCreated:", ptoken, userAddress, orderId, amount, isBuy);
                    alertShow({
                        content: `The ${isBuy == true ? 'Buy' : 'Sell'} order created successfully`,
                        text: `Price: ${convertWeiToEth(price, YUSD.decimals)} YUSD, Amount: ${convertWeiToEth(amount, tradeProjectDetail.data.ptokenDecimals)}`,
                        status: 'success'
                    });
                    loadingEnd();
                    setTimeout(() => {
                        setReloading(reloading + 1);
                        projectRetireve(String(account))
                        updateProjectInfoByAddress(String(fundProjectDetail.poolAddress));
                        loadingEnd();
                    }, 800);
                }
            })
            let buyTx = await projectTradeContract.buy(
                ptokenAddress,
                convertEthToWei(String(amountForBuy), fundProjectDetail.shareDecimal),
                convertEthToWei(String(priceForBuy), YUSD.decimals),
                {
                    gasLimit: 700000
                }
            )
            await buyTx.wait();
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
                });
                throw "invalid input";
            }
            if (amountForSell > fundProjectDetail.shareTokenBalance) {
                alertShow({
                    content: `You have insufficient YUSD amount`,
                    status: 'failed'
                })
                throw "insufficient amount";
            }
            const PTokenContract = new Contract(
                ptokenAddress,
                TokenTemplate.abi,
                signer
            )
            let allowanceAmount = Number(convertWeiToEth(await PTokenContract.allowance(account, ProjectTrade.address), fundProjectDetail.shareDecimal));
            if (allowanceAmount < finalYUSDAmount) {
                let approveTx = await PTokenContract.approve(
                    ProjectTrade.address,
                    MaxUint256,
                    {
                        gasLimit: 300000
                    }
                );
                await approveTx.wait();
            }
            projectTradeContract.on('OrderCreated', (ptoken, userAddress, orderId, amount, price, isBuy) => {
                if (ptokenAddress == ptoken && userAddress == account) {
                    console.log("OrderCreated:", ptoken, userAddress, orderId, amount, isBuy);
                    alertShow({
                        content: `The ${isBuy == true ? 'Buy' : 'Sell'} order created successfully`,
                        text: `Price: ${convertWeiToEth(price, YUSD.decimals)} YUSD, Amount: ${convertWeiToEth(amount, tradeProjectDetail.data.ptokenDecimals)}`,
                        status: 'success'
                    });
                    let backupPtokenAddress = ptokenAddress;
                    setTimeout(async () => {
                        setReloading(reloading + 1);
                        projectRetireve(String(account))
                        updateProjectInfoByAddress(String(fundProjectDetail.poolAddress));
                        loadingEnd();
                    }, 800)
                }
            })
            let sellTx = await projectTradeContract.sell(
                ptokenAddress,
                convertEthToWei(String(amountForSell), fundProjectDetail.shareDecimal),
                convertEthToWei(String(priceForSell), YUSD.decimals),
                {
                    gasLimit: 2000000
                }
            )
            await sellTx.wait();
        } catch (err) {
            loadingEnd();
            console.log(err);
        }
    }

    useEffect(() => {
        if (comparedPtokedAddress) {
            let time = convertPeriodToMiliSecond(period);
            axiosInstance.get(`/trade/pricesByPtokenAddress?ptokenAddress=${comparedPtokedAddress}&period=${time}`)
                .then((response) => {
                    let data = response.data.data;
                    setComparedPrices([...data.map((item: any) => { return { ...item, date: +new Date(item.date) } })])
                }).catch((err) => {
                    console.log(err);
                })
        }
    }, [comparedPtokedAddress, tradeProjects])

    return <>
        <div className="w-full text-sm p-2">
            <div className="flex justify-around">
                <div className="flex items-center text-xl">
                    <div>TRADE</div>
                    <ProjectSelector ptokenAddress={ptokenAddress} setPtokenAddress={(v: string) => setPtokenAddress(v)} />
                </div>
            </div>

            <p className="py-2">You have {fundProjectDetail ? fundProjectDetail.shareTokenBalance : "0"} {tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""} in your wallet, {tradeProjectDetail ? tradeProjectDetail.inOrder : "0.0"} in Order</p>
            <div className="w-full h-[calc(100vh_-_300px)] overflow-x-hidden overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-[#FFFFFF33] scrollbar-track-[#FFFFFF33]">
                <div className="w-full flex items-stretch pr-2">
                    <div className="min-w-[320px] w-1/4 h-full p-4 rounded border-2 border-solid border-border-secondary bg-[#00000025]">
                        <h3 className="italic text-md mb-2">Market</h3>
                        <div className="w-full">
                            <div className="flex items-center text-[#bdbdbd]">
                                <div className="w-1/3 text-center py-1.5">Price({YUSD.symbol})</div>
                                <div className="w-1/3 text-center py-1.5">Amount({tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""})</div>
                                <div className="w-1/3 text-center py-1.5">Total({YUSD.symbol})</div>
                            </div>
                            <div className="min-h-[calc(50vh_-_300px)] h-full">
                                {
                                    loadingProjectDetail == 1 ? <>
                                        {
                                            [1, 2, 3, 4, 5].map((item, index: number) => {
                                                return <div key={`sell-order-${index}`} className="flex items-center border-t border-solid border-[#bdbdbd]">
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
                                                    sellOrders.filter(item => Number(item.remainingAmount) != 0 && Number(item.isCancelled) == 0).map((item, index) => {
                                                        return <div key={`sell-order-${index}`} className="flex items-center border-t border-solid border-[#bdbdbd]">
                                                            <div className={`w-1/3 p-2 text-status-minus text-center`}>{item.price}</div>
                                                            <div className="w-1/3 p-2 text-center">{item.remainingAmount}</div>
                                                            <div className="w-1/3 p-2 text-center">{(Number(item.price) * Number(item.remainingAmount)).toFixed(2)}</div>
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
                            <div className="flex items-center text-md my-2.5">{Number(latestPrice).toFixed(2)} YUSD <BsArrowUp className="ml-2 text-status-plus" /></div>
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
                                            buyOrders.length ? <>
                                                {
                                                    buyOrders.filter(item => Number(item.remainingAmount) != 0 && Number(item.isCancelled) == 0).map((item, index) => {
                                                        return <div key={`buy-order-${index}`} className="flex items-center border-t border-solid border-[#bdbdbd]">
                                                            <div className={`w-1/3 p-2 text-status-plus text-center`}>{item.price}</div>
                                                            <div className="w-1/3 p-2 text-center">{item.remainingAmount}</div>
                                                            <div className="w-1/3 p-2 text-center">{(Number(item.price) * Number(item.remainingAmount)).toFixed(2)}</div>
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
                                        <div className="flex items-center mt-2"><p>{convertPeriodShortToFull(period)} variation:</p> <p className="italic ml-2">{Number(variation).toFixed(2)}%</p></div>
                                    </div>
                                    <div className="ml-12 flex items-center">
                                        <div>Compare:</div>
                                        <ProjectSelector ptokenAddress={comparedPtokedAddress} setPtokenAddress={(v: string) => setComparedPtokedAddress(v)} exceptAddress={ptokenAddress} />
                                    </div>
                                </div>
                                <div id="priceChart" className="chart-section mb-2">
                                    <ProjectPriceChart data={prices} comparedData={comparedPrices} />
                                </div>
                                <div className=" mb-2">
                                    <div className="flex items-center"><p>{tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""} </p> <p className="italic ml-2">Trade Valume:</p></div>
                                    <div className="flex items-center"><p>{convertPeriodShortToFull(period)} variation:</p><p className="ml-2 italic">{showBigNumber(valume, 2)}</p></div>
                                </div>
                                <div className="chart-section">
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-between">
                            <div className="w-[calc(50%_-_20px)] max-w-[500px] p-4 rounded border-2 border-solid border-border-secondary bg-[#00000025]">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex flex-col">
                                        <h2 className="text-lg">Buy {tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""}</h2>
                                        <p>Avbl: {YUSDBalance} YUSD</p>
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

                            <div className="w-[calc(50%_-_20px)] max-w-[500px] p-4 rounded border-2 border-solid border-border-secondary bg-[#00000025]">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex flex-col">
                                        <h2 className="text-lg">Sell {tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""}</h2>
                                        <p>Avbl: {fundProjectDetail ? fundProjectDetail.shareTokenBalance : ""} {tradeProjectDetail ? tradeProjectDetail.data.projectTitle : ""}</p>
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