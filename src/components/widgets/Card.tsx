import React, { FC, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Contract, ethers } from "ethers";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import { BsFillTrashFill } from "react-icons/bs";
import ModalV2 from "./Modalv2";
import AdminVotingContent from "./AdminVotingContent";
import UserVotingContent from "./UserVotingContent";
import UserVotingResult from "./UserVotingResultModal";
import { Project, ProjectDetail, TokenTemplate, YOC, YUSD } from "../../constants/contracts";
import { VotingQueryInterface, VotingResultInterface } from "../../interfaces/voting";
import axios from "axios";
import VotingHistory from "./VotingHistoryModalContent";

import useLoading from "@hooks/useLoading";
import useAlert from "@hooks/useAlert";
import useNetwork from "@hooks/useNetwork";
import { convertWeiToEth } from "utils/unit";
import useAccount from "@hooks/useAccount";
import useProject from "@hooks/useFund";
import useCurrency from "@hooks/useCurrency";

interface Props {
    item?: any;
    poolAddress?: any;
    buyAction?: any;
    refundAction?: any;
    claimAction?: any;
    depositAction?: any;
    harvestAction?: any;
    provider?: any;
    status: string;
    admin?: boolean;
}

interface detailProjectInterface {
    shareToken: string,
    shareTokenDecimals: number,
    shareTokenSellAmount: number,
}

interface detailTokenInterface {
    contract?: Contract,
    symbol: string,
    decimals: number
}

const Card: FC<Props> = ({ item, buyAction, refundAction, claimAction, depositAction, harvestAction, admin, status }) => {
    const { account, provider } = useAccount();
    const { loadingStart, loadingEnd } = useLoading();
    const { updateProjectInfoByAddress } = useProject();
    const { alertShow } = useAlert();
    const { explorer, network, scan } = useNetwork();

    const [showBuyTokenModal, setShowBuyTokenModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showVotingModal, setShowVotingModal] = useState(false);
    const [showVotingResultModal, setShowVotingResultModal] = useState(false);
    const [showVotingHistoryModal, setShowVotingHistoryModal] = useState(false);
    const [tokenAmount, setTokenAmount] = useState("");
    const [usdAmount, setUsdAmount] = useState("");
    const [votingQueryDetail, setvotingQueryDetail] = useState<VotingQueryInterface>({});
    const [userVotingDetail, setUserVotingDetail] = useState<{}>({});
    const [votingResult, setVotingResult] = useState<VotingResultInterface[]>([]);
    const [currentUserAnswer, setCurrentUserAnswer] = useState<Number>();
    const [currentUserIsBet, setCurrentUserIsBet] = useState(false);
    const [currentUserBalance, setcurrentUserBalance] = useState('');
    const [votingResponse, setVotingRsponse] = useState<VotingQueryInterface[]>([]);
    const [detailProject, setDetailProject] = useState<detailProjectInterface>();
    const [load, setLoad] = useState(false);
    const [investContract, setInvestContract] = useState<detailTokenInterface>();
    const [shareContract, setShareContract] = useState<detailTokenInterface>();
    const [projectDetailContract, setProjectDetailContract] = useState<Contract>();
    const [projectStatus, setProjectStatus] = useState("");
    const { getCurrencyDetail } = useCurrency();

    useEffect(() => {
        (async () => {
            if (item.investToken && provider) {
                if (status == 'my') {
                    if (item.endDate >= Date.now() && item.currentStatus < item.ongoingPercent) setProjectStatus("Fundraising");
                    else if (item.currentStatus >= item.ongoingPercent) setProjectStatus("Ongoing");
                    else setProjectStatus("Closed");
                } else {
                    setProjectStatus(status);
                }
                let detailContract = new Contract(
                    ProjectDetail.address,
                    ProjectDetail.abi,
                    provider
                )
                setProjectDetailContract(detailContract);
                setInvestContract({
                    symbol: "YUSD",
                    decimals: YUSD.decimals
                })
                setShareContract({
                    symbol: item.shareSymbol,
                    decimals: item.shareDecimal
                })
                if (item.vote.loading == 2) {
                    setVotingRsponse(item.vote.data);
                }
            }
        })();
    }, [item, provider, account])

    useEffect(() => {
        // if (item && provider && account && investContract && shareContract) {
        //     try {
        //         // const projecContract = item.projectContract as Contract;
        //         const projecContract = new Contract(item.poolAddress, Project.abi, WebSocketProvider);
        //         projecContract.on('Participated', (address, amount1, amount2, user) => {
        //             updateProjectInfoByAddress(address);

        //             if (user == account) {
        //                 let realInvestAmount = convertWeiToEth(amount1, investContract ? investContract.decimals : 16)
        //                 let realShareAmount = convertWeiToEth(amount2, shareContract ? shareContract.decimals : 16)
        //                 alertShow({
        //                     content: `Participated ${realShareAmount} ${shareContract?.symbol}, ${realInvestAmount} ${investContract?.symbol} Successfully`,
        //                     status: 'success'
        //                 })
        //             }
        //         });

        //         projecContract.on('Refund', (address, amount1, amount2, user) => {
        //             updateProjectInfoByAddress(address);

        //             if (user == account) {
        //                 let realInvestAmount = convertWeiToEth(amount1, investContract ? investContract.decimals : 16)
        //                 let realShareAmount = convertWeiToEth(amount2, shareContract ? shareContract.decimals : 16)
        //                 alertShow({
        //                     content: `Refund ${realShareAmount} ${shareContract?.symbol}, ${realInvestAmount} ${investContract?.symbol} Successfully`,
        //                     status: 'success'
        //                 })
        //             }
        //         });

        //         projecContract.on('Claimed', (address, amount, user) => {
        //             updateProjectInfoByAddress(address);

        //             if (user == account) {
        //                 let realAmount = convertWeiToEth(amount, investContract ? investContract.decimals : 16)
        //                 alertShow({
        //                     content: `Dividend Claimed ${realAmount} ${investContract?.symbol} Successfully`,
        //                     status: 'success'
        //                 })
        //             }
        //         });

        //         projecContract.on('ProfitDeposited', (address, amount, user) => {
        //             updateProjectInfoByAddress(address);

        //             if (user == account) {
        //                 let realAmount = convertWeiToEth(amount, investContract ? investContract.decimals : 16)
        //                 alertShow({
        //                     content: `Deposit ${realAmount} ${investContract?.symbol} Successfully`,
        //                     status: 'success'
        //                 })
        //             }
        //         });

        //         if (item.vote.loading == 2) {
        //             setVotingRsponse(
        //                 [
        //                     ...item.vote.data
        //                 ]
        //             )
        //         }
        //     } catch (ex) {
        //         console.log("event listen error: ", ex);
        //     }
        // }
    }, [item, account, provider, investContract, shareContract]);

    const getVotingInfo = useCallback(() => {
        loadingStart();
        let votingQuery = votingResponse.find((item: any) => ((new Date() >= new Date(item.startDate)) && (new Date() <= new Date(item.endDate))));
        console.log('getVotingInfo')
        if (item && projectDetailContract) {
            if (votingQuery) {
                // There is an ongoing voting poll
                setvotingQueryDetail(votingQuery);
                if (admin) {
                    alertShow({
                        content: "There is an ongoing Voting Poll.",
                        status: 'failed'
                    })
                    loadingEnd()
                } else {
                    if (account) {
                        axios.get(process.env.API_ADDRESS + `/voting/projectTitle/${item.name}/accountAddress/${account}`).then(async (res) => {
                            let data = res.data.userVotingStatus;
                            if (data?.VotingDetails?.length) {
                                // This user already voted
                                setUserVotingDetail({ ...data.VotingDetails[0] });
                            } else {
                                setUserVotingDetail({});
                                let shareTokenAddress = item.shareToken;
                                const totalYTEST_temp = Number(item.totalYTEST)
                                let balanceInfo = await projectDetailContract.getTokenInfo(shareTokenAddress, [account]);
                                let balance = (Number(ethers.utils.formatUnits(balanceInfo[0].ownedBalance, item.shareDecimal)) / totalYTEST_temp * 100).toFixed(2)
                                setcurrentUserBalance(balance);
                            }
                            setShowVotingModal(true);
                            loadingEnd()
                        });
                    }
                }
            } else if (votingResponse && votingResponse.length && !admin) {
                console.log(votingResponse);
                let votingQuery = votingResponse[0];
                setvotingQueryDetail(votingQuery);
                // get voting result
                axios.get(process.env.API_ADDRESS + `/voting/queryId/${votingQuery.id}`).then(async (res) => {
                    let userAddressArr = res.data.votingResult.map((i: any) => i.userAddress);
                    if (userAddressArr.length && item) {
                        let shareTokenAddress = item.shareToken;
                        let balanceInfo = await projectDetailContract.getTokenInfo(shareTokenAddress, userAddressArr);
                        let temp = userAddressArr.map((elem: string) => {
                            let result = {
                                userAddress: elem,
                                balance: Number(ethers.utils.formatUnits(balanceInfo.find((balanceItem: any) => balanceItem.owner === elem).ownedBalance, item.shareDecimal)),
                                state: res.data.votingResult.find((votingInfo: any) => votingInfo.userAddress === elem).votingState
                            }
                            if (elem == account) {
                                setCurrentUserAnswer(result.state);
                            }
                            return result;
                        });
                        let result = res.data.votingResult[0].VotingQuery.answerStr.split(',').map((item: string, index: number) => {
                            let sum = temp.filter((tempItem: any) => tempItem.state == index).reduce((prev: any, curr: any) => prev + curr.balance, 0);
                            return { answer: item, sum: sum }
                        });
                        setVotingResult(result);
                    } else {
                        let result: any = String(votingQuery.answerStr).split(',').map((item: string, index: number) => {
                            return { answer: item, sum: 0 }
                        });
                        setVotingResult(result)
                    }
                    setShowVotingResultModal(true);
                    loadingEnd()
                });
            } else {
                setvotingQueryDetail({});
                setUserVotingDetail({});
                setVotingResult([])
                if (admin) {
                    setShowVotingModal(true);
                } else {
                    alertShow({
                        content: "There is no any ongoing Voting Poll.",
                        status: 'failed'
                    })
                    // getVotingInfo();
                }
                loadingEnd()
            }
        }
    }, [item, votingResponse, admin, projectDetailContract]);

    const inputTokenAmount: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        (e.target as HTMLInputElement).value;
        let amount = Number((e.target as HTMLInputElement).value) || 0;
        setTokenAmount(String(amount));
        setUsdAmount(String((amount / item.tokenPrice).toFixed(2)));
    };
    const setMaxUsdAmountValue = () => {
        let availableTokenTotalPrice = ((item.totalYTEST - (item.currentStatus * item.totalYTEST / 100)) / item.tokenPrice).toFixed(2);
        let maxValue = Number(availableTokenTotalPrice) < Number(item.investTokenBalance) ? availableTokenTotalPrice : item.investTokenBalance;
        setUsdAmount(maxValue.toString());
        setTokenAmount(((+maxValue * item.tokenPrice).toFixed(2)).toString());
    }
    const setMaxTokenAmountValue = () => {
        let maxValue = (item.totalYTEST - (item.currentStatus * item.totalYTEST / 100)).toFixed(2);
        setTokenAmount(maxValue.toString());
        setUsdAmount(((+maxValue / item.tokenPrice).toFixed(2)).toString());
    }

    const inputUSDAmount: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        let amount = Number((e.target as HTMLInputElement).value) || 0;
        setUsdAmount(String(amount));
        setTokenAmount(String((amount * item.tokenPrice).toFixed(2)));
    };

    const refundHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        refundAction(item.poolAddress, item.tokenPrice, item.shareToken, item.investDecimal, item.shareDecimal, item.shareTokenAllowance);
    }

    const claimHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        claimAction(item.poolAddress)
    }

    const addToken = async () => {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: item.shareToken, // The address that the token is at.
                    symbol: item.name, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: item.shareDecimal, // The number of decimals in the token
                    image: item.logoSrc, // A string url of the token logo
                },
            },
        });
    }

    const buyHandler = () => {
        if (projectStatus == "Fundraising") {
            setShowBuyTokenModal(true)
        } else {
            location.href = "/trade"

        }
    }

    const investHarvestHandler = () => {
        harvestAction(item.poolAddress)
    }

    const votingHistoryModalHandle = () => {
        selectHistoryItem(0)
    }

    const selectHistoryItem = useCallback(async (index: Number) => {
        if (!votingResponse[Number(index)]) return;
        let votingQuery = votingResponse[Number(index)];
        setvotingQueryDetail(votingQuery);
        setLoad(false)
        loadingStart();
        if (item && projectDetailContract) {
            await axios.get(process.env.API_ADDRESS + `/voting/queryId/${votingQuery.id}`).then(async (res) => {
                let userAddressArr = res.data.votingResult.map((elem: VotingResultInterface) => elem.userAddress);
                setCurrentUserIsBet(false);
                if (userAddressArr.length && item) {
                    let shareTokenAddress = item.shareToken;
                    let balanceInfo = await projectDetailContract.getTokenInfo(shareTokenAddress, userAddressArr);
                    setCurrentUserAnswer(-1);
                    let temp = userAddressArr.map((elem: string) => {
                        let result = {
                            userAddress: elem,
                            balance: Number(ethers.utils.formatUnits(balanceInfo.find((balanceItem: any) => balanceItem.owner === elem).ownedBalance, item.shareDecimal)),
                            state: res.data.votingResult.find((votingInfo: any) => votingInfo.userAddress === elem).votingState
                        }
                        if (elem == account) {
                            setCurrentUserAnswer(result.state);
                            setCurrentUserIsBet(true);
                        }
                        return result;
                    });
                    let result = res.data.votingResult[0].VotingQuery.answerStr.split(',').map((item: string, index: number) => {
                        let sum = temp.filter((tempItem: any) => tempItem.state == index).reduce((prev: any, curr: any) => prev + curr.balance, 0);
                        return { answer: item, sum: sum }
                    });
                    setVotingResult(result)
                    setLoad(true)
                    loadingEnd();
                } else {
                    let result: any = String(votingQuery.answerStr).split(',').map((elem: string, index: number) => {
                        return { answer: elem, sum: 0 }
                    });
                    setVotingResult(result)
                    setLoad(true)
                    loadingEnd();
                }
            });

            setShowVotingHistoryModal(true)
        }
    }, [item, projectDetailContract]);

    // const deleteProjectHandle = async (item: any) => {
    //     console.log(item.poolAddress);
    // }

    const pauseTradeHandle = () => {

    }

    const cancelOrders = () => {

    }

    const removeOrders = () => {

    }

    const makeProjectTradeHandle = () => {

    }

    const updateMultiplier = () => {

    }

    const contentElement = useMemo(() => {
        let temp;
        if (projectStatus == 'Fundraising') {
            temp = <>
                <a href={item.projectURL} target="_blank" rel="noreferrer">Go to project page</a>
                <a href={`${explorer}/token/${item.shareToken}#balances`} target="_blank" rel="noreferrer">Go to {scan} to Token Address</a>
                <p>Break Even: Aprox. {item.ROI} months</p>
                <p>Category: {item.category}</p>
                <p>End Date: {(new Date(item.endDate)).toLocaleDateString()}</p>

                <p>Invest & Earn Multiplier: {item.multiplier}</p>
                <p>APR: Aprox. {item.APR}%</p>
                <p>Total Tokens: {item.shareTokenTotalSupply}</p>
                <a href="" target="_blank">Dividend History</a>
            </>
        } else if (projectStatus == 'Ongoing') {
            temp = <>
                <a href={item.projectURL} target="_blank" rel="noreferrer">Go to project page</a>
                <a href={`${explorer}/token/${item.shareToken}#balances`} target="_blank" rel="noreferrer">Go to {scan} to Token Address</a>
                <p>Break Even: Aprox. {item.ROI} months</p>
                <p>Category: {item.category}</p>
                <p>End Date: {(new Date(item.endDate)).toLocaleDateString()}</p>

                <p>Total Tokens: {item.shareTokenTotalSupply}</p>
                <a href="" target="_blank">Dividend History</a>
            </>
        } else if (projectStatus == 'close') {
            temp = <>
                <a href={item.projectURL} target="_blank" rel="noreferrer">Go to project page</a>
                <a href={`${explorer}/token/${item.shareToken}#balances`} target="_blank" rel="noreferrer">Go to {scan} to Token Address</a>
                <p>Break Even: Aprox. {item.ROI} months</p>
                <p>Category: {item.category}</p>
                <p>End Date: {(new Date(item.endDate)).toLocaleDateString()}</p>

                <p>Total Tokens: {item.shareTokenTotalSupply}</p>
            </>
        }
        return temp;
    }, [admin, item, projectStatus]);

    const btnGroupElement = useMemo(() => {
        let temp;
        if (projectStatus == 'Fundraising') {
            temp = <div className="btn-group">
                {
                    admin ? <>
                        <Button text="Update Multiplier" onClick={updateMultiplier} />
                    </> : <>
                        <Button text="Buy Token" onClick={buyHandler} />
                        <Button text="Add Token" onClick={() => addToken()} />
                        <div className="invest-wrap flex flex-col items-end">
                            <p>{`Invest & Earn: ${0} ${YOC.symbol}${network == "ETH" ? 'e' : 'b'}`}</p>
                            <p>{`Invest & Earn Value: $${0}`}</p>
                        </div>
                    </>
                }
            </div>
        } else if (projectStatus == 'Ongoing') {
            temp = <div className="btn-group">
                {
                    admin ?
                        <>
                            <Button text="Update Multiplier" onClick={updateMultiplier} />
                            <Button text="Deposit Profit" onClick={() => setShowDepositModal(true)} />
                            <Button text="Cancel Orders" onClick={cancelOrders} />
                            <Button text="Pause Trade" onClick={pauseTradeHandle} />
                            <Button text="Remove Orders" onClick={removeOrders} />
                        </>
                        :
                        <>
                            <Button text="Buy Token" onClick={buyHandler} />
                            <div className="claim-wrap flex flex-col items-end">
                                <p>{`Claim amount: ${(item.claimAmount || 0).toFixed(2)} YUSD`}</p>
                                <Button disabled={!(item.claimAmount > 0 && !item.claimable)} text="Claim Dividend" onClick={claimHandler} />
                            </div>
                            <Button text="Add Token" onClick={() => addToken()} />
                            <div className="invest-wrap flex flex-col items-end">
                                <p>{`Invest & Earn: ${item.investEarnAmount} ${YOC.symbol}${network == "ETH" ? 'e' : 'b'}`}</p>
                                <p>{`Invest & Earn Value: $${0}`}</p>
                                {
                                    item.investEarnAmount ?
                                        <Button text="Invest & Earn Harvest" onClick={investHarvestHandler} />
                                        : ""
                                }
                            </div>
                        </>
                }
            </div>
        } else if (projectStatus == 'Closed') {
            temp = <>
                {
                    admin ? <>
                        <Button text="Update Multiplier" onClick={updateMultiplier} />
                        <Button text="Go to secondary" onClick={makeProjectTradeHandle} />
                    </> :
                        <>
                            <Button className={"mt-1"} text={"Refund"} disabled={Number(item.shareTokenBalance) == 0} onClick={refundHandler} />
                            <div className="invest-wrap flex flex-col items-end">
                                <p>{`Invest & Earn: ${item.investEarnAmount} ${YOC.symbol}${network == "ETH" ? 'e' : 'b'}`}</p>
                                <p>{`Invest & Earn Value: $${0}`}</p>
                                {
                                    item.investEarnAmount ?
                                        <Button text="Invest & Earn Harvest" onClick={investHarvestHandler} />
                                        : ""
                                }
                            </div>
                        </>
                }
            </>
        }
        return temp;
    }, [admin, item, projectStatus]);

    const statusElement = useMemo(() => {
        let temp;
        if (projectStatus == 'Fundraising') {
            temp = <>
                <p>Soft Cap: {item.ongoingPercent}%</p>
                <p>Status: {item.ongoingPercent < item.currentStatus ? "Over" : "Under"} Soft Cap</p>
            </>
        } else if (projectStatus == 'Ongoing') {
            temp = <>
                <p>Soft Cap: {item.ongoingPercent}%</p>
                <p>Status: {item.detail && item.detail.data.status ? item.detail.data.status : ""}</p>
            </>
        } else if (projectStatus == 'close') {
            temp = <>
                <p>Soft Cap: {item.ongoingPercent}%</p>
                <p>Status: {item.detail && item.detail.data.status ? item.detail.data.status : ""}</p>
            </>
        }
        return temp;
    }, [admin, item, projectStatus]);

    const votingElement = useMemo(() => {
        return <>
            {
                projectStatus == 'Ongoing' && !votingResponse.length && admin ? <Button className="mt-1" text="Create Voting" onClick={() => getVotingInfo()}></Button> : ''
            }
            {
                (projectStatus == 'Ongoing' && votingResponse && votingResponse.length) ? <Button className="mt-1" text={(new Date(String(votingResponse[0].endDate)).getTime() < new Date().getTime()) && admin ? "Create Voting" : "Voting Poll"} disabled={(new Date(String(votingResponse[0].endDate)).getTime() < new Date().getTime()) && !admin} onClick={() => getVotingInfo()}></Button> : ''
            }
            {
                (projectStatus == 'Ongoing') ?
                    <Button
                        className="mt-1"
                        disabled={!Boolean(votingResponse && votingResponse.length)}
                        text="Voting History"
                        onClick={() => votingHistoryModalHandle()} />
                    : ""
            }
        </>
    }, [votingResponse, admin, projectStatus]);

    return <div className="app-card">
        <div className="w-full card-header">
            <div className="d-flex justify-between align-center">
                <img className="w-[38px] h-[38px] rounded-full" src={item.logoSrc} alt="logo" />
                <p className="project-name">{item.name}</p>
                <div className="token-price !text-xs !px-2 !py-1 rounded text-white border border-border-primary">1 USD = {item.tokenPrice} {item.name}</div>
                {/* <button onClick={() => deleteProjectHandle(item)} className='p-2 rounded bg-btn-primary text-white ml-2'><BsFillTrashFill /></button> */}
            </div>
            <p className="explanation">
                {item.explanation}
            </p>
        </div>
        <div className="card-content">
            <div className="d-flex justify-between">
                <p>Total Raise</p>
                <p>Total Amount</p>
            </div>
            <div className="d-flex justify-between items-center my-2">
                <div className="d-flex align-center">
                    <img className="rounded-full w-[26px] h-[26px] mr-2" src="/images/coins/YUSD.png" alt="YUSD logo" />
                    <p>{item.totalRaise.toLocaleString()}</p>
                </div>
                <div className="d-flex align-center">
                    <img className="rounded-full w-[26px] h-[26px] mr-2" src={item.symbolImage} alt="company logo" />
                    <p>{item.totalYTEST.toLocaleString()}</p>
                </div>
            </div>
            <ProgressBar percent={item.currentStatus} />
            <div className="d-flex justify-between mt-1 mb-2">
                <p>{item.currentStatus.toFixed(2)}%</p>
                <p>{(item.currentStatus * item.totalYTEST / 100).toLocaleString()}/{item.totalYTEST.toLocaleString()}</p>
            </div>
            <div className="extra-info">
                <div>
                    {contentElement}
                    {statusElement}
                    {votingElement}
                </div>
                <div>
                    <div className="right-info mb-2">
                        <p>YUSD: {(Number(item.investTokenBalance) || 0).toFixed(2) || 0}</p>
                        <p>{item.name}: {(Number(item.shareTokenBalance) || 0).toFixed(2) || 0}</p>
                    </div>
                    <div className="btn-group">
                        {btnGroupElement}
                    </div>
                </div>
            </div>
        </div>
        <div id="modal-root"></div>

        {/* Buy Token Modal */}
        <ModalV2
            show={showBuyTokenModal}
            onClose={() => setShowBuyTokenModal(false)}
        >
            <div className="modal_content buy_token_modal p-4">
                <p className='text-center text-2xl w-full text-white py-6 font-bold'>How much do you want?</p>
                <div className="input_field">
                    <div className="w-full relative flex items-center justify-between mb-4">
                        <input className="w-[calc(100%_-_60px)] text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" placeholder="0.00" onInput={inputTokenAmount} value={tokenAmount} />
                        <span className="mr-1">{item.name}</span>
                    </div>
                    <div className="d-flex justify-between align-center mb-4">
                        <span>Available: {(item.totalYTEST - (item.currentStatus * item.totalYTEST / 100)).toFixed(2)} </span>
                        <Button className="max-btn !bg-btn-primary" text="Max" onClick={setMaxTokenAmountValue} bgColor="#0c54ad" />
                    </div>
                    <div className="w-full relative flex items-center justify-between mb-4">
                        <input className="w-[calc(100%_-_60px)] text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" placeholder="0.00" onInput={inputUSDAmount} value={usdAmount} />
                        <span className="mr-1">USD</span>
                    </div>
                    <div className="d-flex justify-between align-center mb-4">
                        <span>Available: {item.availableMaxUsdValue}</span>
                        <Button className="max-btn !bg-btn-primary" text="Max" onClick={setMaxUsdAmountValue} bgColor="#0c54ad)" />
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <Button text="Buy Token" onClick={() => { buyAction(usdAmount, item.tokenPrice, item.poolAddress, item.investToken, item.investDecimal, item.shareDecimal, item.investTokenAllowance); setShowBuyTokenModal(false); }} />
                    <Button className="!bg-dark-primary ml-2" text="Cancel" onClick={() => { setShowBuyTokenModal(false); }} />
                </div>
            </div>
        </ModalV2>

        {/* for deposit modal */}
        <ModalV2
            show={showDepositModal}
            onClose={() => setShowDepositModal(false)}
        >
            <div className="modal_content p-4">
                <p className='text-center text-2xl w-full text-white py-4 font-bold'>How much do you want?</p>
                <div className="input_field mb-4">
                    <input className="w-[calc(100%_-_50px)] text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" placeholder="0.00" onInput={inputUSDAmount} value={usdAmount} />
                    <span className="text-right ml-4 text-white">USD</span>
                </div>
                <div className="flex justify-end">
                    <Button className="mr-2" text="Deposit" onClick={() => { depositAction(item.poolAddress, item.investToken, usdAmount, item.investDecimal); setShowDepositModal(false) }} />
                    <Button className="!bg-dark-primary" text="Cancel" onClick={() => { setShowDepositModal(false) }} />
                </div>
            </div>
        </ModalV2>

        {/* for voting modal */}
        <ModalV2
            show={showVotingModal}
            onClose={() => setShowVotingModal(false)}
        >
            <div className="modal_content voting_modal !p-4">
                <div className="d-flex align-center voting_header !border-dark-primary text-white my-4">
                    <img src={item.logoSrc} width={40} height={40} alt="" />
                    <p>{item.name}</p>
                </div>
                {
                    admin ?
                        <AdminVotingContent handleClose={() => setShowVotingModal(false)} projectTitle={item.name} votingQueryDetail={votingQueryDetail} projectDetail={item} />
                        :
                        <UserVotingContent handleClose={() => setShowVotingModal(false)} votingQueryDetail={votingQueryDetail} userVotingDetail={userVotingDetail} currentUserBalance={currentUserBalance} />
                }
            </div>
        </ModalV2>

        {/* for voting result modal */}
        <ModalV2
            show={showVotingResultModal}
            onClose={() => setShowVotingResultModal(false)}
        >
            <div className="modal_content voting_modal !p-4">
                <div className="d-flex align-center voting_header !border-dark-primary text-white my-4">
                    <img src={item.logoSrc} width={40} height={40} alt="" />
                    <p>{item.name}</p>
                </div>
                <UserVotingResult handleClose={() => setShowVotingResultModal(false)} votingQueryDetail={votingQueryDetail} votingResult={votingResult} currentUserAnswer={currentUserAnswer} />
            </div>
        </ModalV2>

        <ModalV2
            show={showVotingHistoryModal}
            onClose={() => setShowVotingHistoryModal(false)}
        >
            <div className="flex flex-col text-white p-2">
                <h2 className="text-3xl text-center py-4">{item.name} Voting History</h2>
                <VotingHistory
                    votingResponse={votingResponse}
                    votingResult={votingResult}
                    votingQueryDetail={votingQueryDetail}
                    item={item}
                    currentUserAnswer={currentUserAnswer}
                    currentUserIsBet={currentUserIsBet}
                    load={load}
                    selectHistoryItem={(i: Number) => selectHistoryItem(i)}
                    show={showVotingHistoryModal}
                />
            </div>
        </ModalV2>
    </div>;
}

export default Card;