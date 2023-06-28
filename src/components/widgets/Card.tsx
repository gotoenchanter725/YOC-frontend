import React, { FC, useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Contract, ethers } from "ethers";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import { BsFillTrashFill } from "react-icons/bs";
import ModalV2 from "./Modalv2";
import AdminVotingContent from "./AdminVotingContent";
import UserVotingContent from "./UserVotingContent";
import UserVotingResult from "./UserVotingResultModal";
import { Project, ProjectDetail, TokenTemplate, USDCToken } from "../../constants/contracts";
import { loading_end, loading_start, updateProjectInfo } from "../../../store/actions";
import { VotingQueryInterface, VotingResultInterface } from "../../interfaces/voting";
import axios from "axios";
import VotingHistory from "./VotingHistoryModalContent";

import useLoading from "@hooks/useLoading";
import useAlert from "@hooks/useAlert";
import useNetwork from "@hooks/useNetwork";
import { convertWeiToEth } from "utils/unit";

interface Props {
    item?: any;
    poolAddress?: any;
    buyAction?: any;
    refundAction?: any;
    claimAction?: any;
    depositAction?: any;
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
    contract: Contract,
    symbol: string,
    decimals: number
}

const Card: FC<Props> = ({ item, buyAction, refundAction, claimAction, depositAction, admin, status }) => {
    const dispatch = useDispatch();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const { explorer } = useNetwork();
    const { projects, account, rpc_provider } = useSelector((state: any) => state.data);
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
    const [projectStatus, setProjectStatus] = useState("");

    useEffect(() => {
        (async () => {
            if (item.investToken && rpc_provider) {
                if (status == 'my') {
                    if (item.endDate >= Date.now() && item.currentStatus < item.ongoingPercent) setProjectStatus("open");
                    else if (item.currentStatus >= item.ongoingPercent) setProjectStatus("ongoing");
                    else setProjectStatus("close");
                } else {
                    setProjectStatus(status);
                }
                const investToken = new Contract(item.investToken, USDCToken.abi, rpc_provider);
                const investTokenSymbol = await investToken.symbol();
                const investTokenDecimals = await investToken.decimals();
                setInvestContract({
                    contract: investToken,
                    symbol: investTokenSymbol,
                    decimals: investTokenDecimals
                })

                const shareToken = new Contract(item.shareToken, TokenTemplate.abi, rpc_provider);
                const shareTokenSymbol = await shareToken.symbol();
                const shareTokenDecimals = await shareToken.decimals();
                setShareContract({
                    contract: shareToken,
                    symbol: shareTokenSymbol,
                    decimals: shareTokenDecimals
                })
            }
        })();
    }, [item, rpc_provider, account])

    useEffect(() => {
        if (rpc_provider && account && investContract && shareContract) {
            try {
                const projectDetail = new Contract(item.poolAddress, Project.abi, rpc_provider);
                projectDetail.on('Participated', (address, amount1, amount2, user) => {
                    dispatch(updateProjectInfo(projects, address, account) as any);

                    if (user == account) {
                        let realInvestAmount = convertWeiToEth(amount1, investContract ? investContract.decimals : 16)
                        let realShareAmount = convertWeiToEth(amount2, shareContract ? shareContract.decimals : 16)
                        alertShow({
                            content: `Participated ${realShareAmount} ${shareContract?.symbol}, ${realInvestAmount} ${investContract?.symbol} Successfully`,
                            status: 'success'
                        })
                    }
                });

                projectDetail.on('Refund', (address, amount1, amount2, user) => {
                    dispatch(updateProjectInfo(projects, address, account) as any);

                    if (user == account) {
                        let realInvestAmount = convertWeiToEth(amount1, investContract ? investContract.decimals : 16)
                        let realShareAmount = convertWeiToEth(amount2, shareContract ? shareContract.decimals : 16)
                        alertShow({
                            content: `Refund ${realShareAmount} ${shareContract?.symbol}, ${realInvestAmount} ${investContract?.symbol} Successfully`,
                            status: 'success'
                        })
                    }
                });

                projectDetail.on('Claimed', (address, amount, user) => {
                    dispatch(updateProjectInfo(projects, address, account) as any);

                    if (user == account) {
                        let realAmount = convertWeiToEth(amount, investContract ? investContract.decimals : 16)
                        alertShow({
                            content: `Dividend Claimed ${realAmount} ${investContract?.symbol} Successfully`,
                            status: 'success'
                        })
                    }
                })

                projectDetail.on('ProfitDeposited', (address, amount, user) => {
                    dispatch(updateProjectInfo(projects, address, account) as any);

                    if (user == account) {
                        let realAmount = convertWeiToEth(amount, investContract ? investContract.decimals : 16)
                        alertShow({
                            content: `Deposit ${realAmount} ${investContract?.symbol} Successfully`,
                            status: 'success'
                        })
                    }
                });

                (async () => {
                    axios.get(process.env.API_ADDRESS + `/voting/projectTitle/${item.name}`).then(res => {
                        let rst = res.data.votingQueryDetail;
                        rst = rst.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((item: any) => new Date(item.endDate).getTime() > new Date().getTime() ? { ...item, ongoing: true } : { ...item, ongoing: false })
                        setVotingRsponse(rst);
                    });

                    const detailContract = new Contract(ProjectDetail.address || '', ProjectDetail.abi, rpc_provider);
                    if (account) setDetailProject(await detailContract.getProjectDetails(item.poolAddress, account))
                })();

            } catch (ex) {
                console.log("event listen error: ", ex);
            }
        }
    }, [account, rpc_provider, investContract, shareContract]);

    const getVotingInfo = useCallback(() => {
        loadingStart();
        let votingQuery = votingResponse.find((item: any) => ((new Date() >= new Date(item.startDate)) && (new Date() <= new Date(item.endDate))));
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
                            const detailContract = new Contract(ProjectDetail.address || '', ProjectDetail.abi, rpc_provider);
                            let detailProject = await detailContract.getProjectDetails(item.poolAddress, account);
                            let shareTokenAddress = detailProject.shareToken;
                            const shareDecimal_temp = Number(ethers.utils.formatUnits(detailProject.shareTokenDecimals, 0));
                            const totalYTEST_temp = Number(ethers.utils.formatUnits(detailProject.shareTokenSellAmount, shareDecimal_temp))
                            let balanceInfo = await detailContract.getTokenInfo(shareTokenAddress, [account]);
                            let balance = (Number(ethers.utils.formatUnits(balanceInfo[0].ownedBalance, detailProject.shareTokenDecimals)) / totalYTEST_temp * 100).toFixed(2)
                            console.log(balanceInfo)
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
                let userAddressArr = res.data.votingResult.map((item: any) => item.userAddress);
                if (userAddressArr.length && detailProject) {

                    const detailContract = new Contract(ProjectDetail.address || '', ProjectDetail.abi, rpc_provider);
                    let shareTokenAddress = detailProject.shareToken;
                    let balanceInfo = await detailContract.getTokenInfo(shareTokenAddress, userAddressArr);
                    let temp = userAddressArr.map((item: string) => {
                        let result = {
                            userAddress: item,
                            balance: Number(ethers.utils.formatUnits(balanceInfo.find((balanceItem: any) => balanceItem.owner === item).ownedBalance, detailProject.shareTokenDecimals)),
                            state: res.data.votingResult.find((votingInfo: any) => votingInfo.userAddress === item).votingState
                        }
                        if (item == account) {
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
    }, [votingResponse, admin]);

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

    const openBuyTokenModal = () => {
        setShowBuyTokenModal(true)
    }

    const votingHistoryModalHandle = () => {
        selectHistoryItem(0)
    }

    const selectHistoryItem = async (item: Number) => {
        if (!votingResponse[Number(item)]) return;
        let votingQuery = votingResponse[Number(item)];
        setvotingQueryDetail(votingQuery);
        setLoad(false)
        dispatch(loading_start() as any)
        await axios.get(process.env.API_ADDRESS + `/voting/queryId/${votingQuery.id}`).then(async (res) => {
            let userAddressArr = res.data.votingResult.map((item: VotingResultInterface) => item.userAddress);
            setCurrentUserIsBet(false);
            if (userAddressArr.length && detailProject) {
                const detailContract = new Contract(ProjectDetail.address || '', ProjectDetail.abi, rpc_provider);
                let shareTokenAddress = detailProject.shareToken;
                let balanceInfo = await detailContract.getTokenInfo(shareTokenAddress, userAddressArr);
                setCurrentUserAnswer(-1);
                let temp = userAddressArr.map((item: string) => {
                    let result = {
                        userAddress: item,
                        balance: Number(ethers.utils.formatUnits(balanceInfo.find((balanceItem: any) => balanceItem.owner === item).ownedBalance, detailProject.shareTokenDecimals)),
                        state: res.data.votingResult.find((votingInfo: any) => votingInfo.userAddress === item).votingState
                    }
                    if (item == account) {
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
                dispatch(loading_end() as any)
            } else {
                let result: any = String(votingQuery.answerStr).split(',').map((item: string, index: number) => {
                    return { answer: item, sum: 0 }
                });
                setVotingResult(result)
                setLoad(true)
                dispatch(loading_end() as any)
            }
        });

        setShowVotingHistoryModal(true)
    }

    // const deleteProjectHandle = async (item: any) => {
    //     console.log(item.poolAddress);
    // }

    let btnGroup;
    if (projectStatus == 'open') {
        btnGroup = admin ?
            <div className="btn-group">
            </div> :
            <div className="btn-group">
                <Button text="Buy Token" onClick={openBuyTokenModal} />
                <Button text="Add Token" onClick={() => addToken()} />
            </div>
    } else if (projectStatus == 'ongoing') {
        btnGroup = admin ?
            <div className="btn-group">
                <Button text="Deposit Profit" onClick={() => setShowDepositModal(true)} />
            </div> :
            <div className="btn-group">
                {item.currentStatus < 100 ? <Button text="Buy Token" onClick={openBuyTokenModal} /> : ''}
                <div>
                    <p>{`claim amount: ${(item.claimAmount || 0).toFixed(2)} USDC`}</p>
                </div>
                <Button disabled={!(item.claimAmount > 0 && !item.claimable)} text="Claim Dividend" onClick={claimHandler} />
                <Button text="Add Token" onClick={() => addToken()} />
            </div>
    } else if (projectStatus == 'close') {
        btnGroup = <Button className={"mt-1"} text={"Refund"} disabled={item.shareTokenBalance == 0} onClick={refundHandler} />
    }
    return (<div className="app-card">
        <div className="w-full card-header">
            <div className="d-flex justify-between align-center">
                <img src={item.logoSrc} width={40} height={30} alt="" />
                <p className="project-name">{item.name}</p>
                <div className="token-price">1 USD = {item.tokenPrice} {item.name}</div>
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
            <div className="d-flex justify-between" style={{ marginBottom: '5px' }}>
                <div className="d-flex align-center" style={{ gap: '5px' }}>
                    <img src="/images/usd.png" width={35} height={35} alt="" />
                    <p>{item.totalRaise.toLocaleString()}</p>
                </div>
                <div className="d-flex align-center" style={{ gap: '5px' }}>
                    <img src={item.symbolImage} width={35} height={35} alt="" />
                    <p>{item.totalYTEST.toLocaleString()}</p>
                </div>
            </div>
            <ProgressBar percent={item.currentStatus} />
            <div className="d-flex justify-between" style={{ margin: '5px 0 10px' }}>
                <p>{item.currentStatus.toFixed(2)}%</p>
                <p>{(item.currentStatus * item.totalYTEST / 100).toLocaleString()}/{item.totalYTEST.toLocaleString(

                )}</p>
            </div>
            <div className="extra-info">
                <div>
                    <a href={item.projectURL} target="_blank" rel="noreferrer">Go to project page</a>
                    <a href={`${explorer}/token/${item.shareToken}#balances`} target="_blank" rel="noreferrer">Go to xscan to Token Address</a>
                    <p>ROI: Aprox. {item.ROI} months</p>
                    <p>APR: Aprox. {item.APR}%</p>
                    <p>Category: {item.category}</p>
                    <p>End Date: {(new Date(item.endDate)).toLocaleDateString()}</p>
                    {
                        projectStatus == 'ongoing' && !votingResponse.length && admin ? <Button className="mt-1" text="Create Voting" onClick={() => getVotingInfo()}></Button> : ''
                    }
                    {
                        (projectStatus == 'ongoing' && votingResponse && votingResponse.length) ? <Button className="mt-1" text={(new Date(String(votingResponse[0].endDate)).getTime() < new Date().getTime()) && admin ? "Create Voting" : "Voting Poll"} disabled={(new Date(String(votingResponse[0].endDate)).getTime() < new Date().getTime()) && !admin} onClick={() => getVotingInfo()}></Button> : ''
                    }
                    {
                        (projectStatus == 'ongoing' && votingResponse && votingResponse.length) ?
                            <Button className="mt-1" text="Voting History" onClick={() => votingHistoryModalHandle()}></Button>
                            : ""
                    }
                </div>
                <div>
                    <div className="right-info m-b-1">
                        <p>USDC: {(Number(item.investTokenBalance) || 0).toFixed(2) || 0}</p>
                        <p>{item.name}: {(Number(item.shareTokenBalance) || 0).toFixed(2) || 0}</p>
                    </div>
                    <div className="btn-group">
                        {btnGroup}
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
    </div>);

}

export default Card;