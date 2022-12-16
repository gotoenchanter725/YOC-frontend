import React, { FC, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Contract, ethers } from "ethers";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import Modal from "./Modal";
import ModalV2 from "./Modalv2";
import AdminVotingContent from "./AdminVotingContent";
import UserVotingContent from "./UserVotingContent";
import UserVotingResult from "./UserVotingResultModal";
import { Project, ProjectDetail } from "../../constants/contracts";
import { loading_end, loading_start, updateProjectInfo } from "../../../store/actions";
import { VotingQueryInterface, VotingResultInterface } from "../../interfaces/voting";
import axios from "axios";
import VotingHistory from "./VotingHistoryModalContent";

interface Props {
    item?: any;
    poolAddress?: any;
    buyAction?: any;
    refundAction?: any;
    claimAction?: any;
    depositAction?: any;
    provider?: any;
    status?: string;
    admin?: boolean;
}

interface detailProjectInterface {
    shareToken: string, 
    shareTokenDecimals: number, 
    shareTokenSellAmount: number, 
}

const Card: FC<Props> = ({ item, buyAction, refundAction, claimAction, depositAction, admin, status }) => {
    const dispatch = useDispatch();
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
    const [votingResult, setVotingResult] = useState<VotingResultInterface[]>([{}]);
    const [currentUserAnswer, setcurrentUserAnswer] = useState();
    const [currentUserBalance, setcurrentUserBalance] = useState('');
    const [votingResponse, setVotingRsponse] = useState<VotingQueryInterface[]>([{}]);
    const [detailProject, setDetailProject] = useState<detailProjectInterface>();
    const [load, setLoad] = useState(false);
    const [refund, setRefund] = useState<any>();

    useEffect(() => {
        if (rpc_provider && account) {
            try {
                const projectDetail = new Contract(item.poolAddress, Project.abi, rpc_provider);
                projectDetail.on('Participated', (address, amount1, amount2) => {
                    dispatch(updateProjectInfo(projects, address, account) as any);
                });

                projectDetail.on('Refund', (address, amount1, amount2) => {
                    dispatch(updateProjectInfo(projects, address, account) as any);
                });

                projectDetail.on('claimed', (address, amount) => {
                    dispatch(updateProjectInfo(projects, address, account) as any);
                })

                projectDetail.on('profitDeposited', (address, amount) => {
                    dispatch(updateProjectInfo(projects, address, account) as any);
                });

                (async () => {
                    console.log('ok')
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
    }, [account, rpc_provider]);

    const getVotingInfo = () => {
        dispatch(loading_start() as any);
        let votingQuery = votingResponse.find((item: any) => ((new Date() >= new Date(item.startDate)) && (new Date() <= new Date(item.endDate))));
        if (votingQuery) {
            // There is an ongoing voting poll
            setvotingQueryDetail(votingQuery);
            if (admin) {
                alert('There is an ongoing Voting Poll.');
                dispatch(loading_end() as any);
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
                    });
                }
                setShowVotingModal(true);
                dispatch(loading_end() as any);
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
                            setcurrentUserAnswer(result.state);
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
                dispatch(loading_end() as any);
            });
        } else {
            setvotingQueryDetail({});
            setUserVotingDetail({});
            setVotingResult([])
            if (admin) {
                setShowVotingModal(true);
            } else {
                alert('There is no any ongoing Voting Poll');
                // getVotingInfo();
            }
            dispatch(loading_end() as any);
        }
    }

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
        refundAction(item.poolAddress, item.tokenPrice, item.shareToken, item.investDecimal, item.shareDecimal)
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
                        setcurrentUserAnswer(result.state);
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

    let btnGroup;
    if (status == 'open') {
        btnGroup = admin ?
            <div className="btn-group">
            </div> :
            <div className="btn-group">
                <Button text="Buy Token" onClick={openBuyTokenModal} />
                <Button text="Add Token" onClick={() => addToken()} />
            </div>
    } else if (status == 'ongoing') {
        btnGroup = admin ?
            <div className="btn-group">
                <Button text="Deposit Profit" onClick={() => setShowDepositModal(true)} />
            </div> :
            <div className="btn-group">
                {item.currentStatus < 100 ? <Button text="Buy Token" onClick={openBuyTokenModal} /> : ''}
                <div>
                    <p>{`claim amount: ${(item.claimAmount || 0).toFixed(2)} USDC`}</p>
                </div>
                <Button className={item.claimAmount > 0 && !item.claimable ? "" : "disabled"} text="Claim Dividend" onClick={claimHandler} />
                <Button text="Add Token" onClick={() => addToken()} />
            </div>
    } else {
        btnGroup = <Button className={refund ? "" : "disabled"} text="Refund" onClick={refundHandler} />
    }
    return (<div className="app-card">
        <div className="d-flex justify-between align-center">
            <img src={item.logoSrc} width={40} height={30} alt="" />
            <p className="project-name">{item.name}</p>
            <div className="token-price">1 USD = {item.tokenPrice} {item.name}</div>
        </div>
        <p className="explanation">
            {item.explanation}
        </p>
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
                <a href={`https://testnet.bscscan.com/token/${item.shareToken}#balances`} target="_blank" rel="noreferrer">Go to xscan to Token Address</a>
                <p>ROI: Aprox. {item.ROI} months</p>
                <p>APR: Aprox. {item.APR}%</p>
                <p>Category: {item.category}</p>
                <p>End Date: {(new Date(item.endDate)).toLocaleDateString()}</p>
                {/* {
                    status == 'ongoing' ? <a className="open_vote_btn" onClick={() => getVotingInfo()}>Voting Poll</a> : ''
                } */}
                {
                    (status == 'ongoing' && votingResponse.length && (new Date(String(votingResponse[0].endDate)).getTime() >= new Date().getTime())) ? <a className="open_vote_btn" onClick={() => getVotingInfo()}>Voting Poll</a> : ''
                }
                {
                    (status == 'ongoing' && votingResponse.length) ?
                        <a className="open_vote_btn" onClick={() => votingHistoryModalHandle()}>Voting History</a>
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
        <div id="modal-root"></div>

        {/* Buy Token Modal */}
        <Modal
            show={showBuyTokenModal}
            onClose={() => setShowBuyTokenModal(false)}
            title="How much do you want?"
        >
            <div className="modal_content buy_token_modal">
                <div className="input_field">
                    <div className="input_control">
                        <input className="token_amount" placeholder="0.00" onInput={inputTokenAmount} value={tokenAmount} />
                        <span>{item.name}</span>
                    </div>
                    <div className="d-flex justify-between align-center">
                        <span>Available: {(item.totalYTEST - (item.currentStatus * item.totalYTEST / 100)).toFixed(2)} </span>
                        <Button className="max-btn" text="Max" onClick={setMaxTokenAmountValue} bgColor="#0c54ad" />
                    </div>
                    <div className="input_control">
                        <input className="usd_amount" placeholder="0.00" onInput={inputUSDAmount} value={usdAmount} />
                        <span>USD</span>
                    </div>
                    <div className="d-flex justify-between align-center mb-5">
                        <span>Available: {item.availableMaxUsdValue}</span>
                        <Button className="max-btn" text="Max" onClick={setMaxUsdAmountValue} bgColor="#0c54ad)" />
                    </div>
                </div>
                <Button text="Buy Token" onClick={() => { buyAction(usdAmount, item.tokenPrice, item.poolAddress, item.investToken, item.investDecimal, item.shareDecimal); setShowBuyTokenModal(false); }} />
            </div>
        </Modal>

        {/* for deposit modal */}
        <Modal
            show={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            title="How much do you want?"
        >
            <div className="modal_content">
                <div className="input_field">
                    <div className="input_control">
                        <input className="usd_amount" placeholder="0.00" onInput={inputUSDAmount} value={usdAmount} />
                        <span>USD</span>
                    </div>
                </div>
                <Button text="Deposit" onClick={() => { depositAction(item.poolAddress, item.investToken, usdAmount, item.investDecimal); setShowDepositModal(false) }} />
            </div>
        </Modal>

        {/* for voting modal */}
        <Modal
            show={showVotingModal}
            onClose={() => setShowVotingModal(false)}
            title=""
        >
            <div className="modal_content voting_modal">
                <div className="d-flex align-center voting_header">
                    <img src={item.logoSrc} width={40} height={40} alt="" />
                    <p>{item.name}</p>
                </div>
                {
                    admin ?
                        <AdminVotingContent handleClose={() => setShowVotingModal(false)} projectTitle={item.name} votingQueryDetail={votingQueryDetail} />
                        :
                        <UserVotingContent handleClose={() => setShowVotingModal(false)} votingQueryDetail={votingQueryDetail} userVotingDetail={userVotingDetail} currentUserBalance={currentUserBalance} />
                }
            </div>
        </Modal>

        {/* for voting result modal */}
        <Modal
            show={showVotingResultModal}
            onClose={() => setShowVotingResultModal(false)}
            title=""
        >
            <div className="modal_content voting_modal">
                <div className="d-flex align-center voting_header">
                    <img src={item.logoSrc} width={40} height={40} alt="" />
                    <p>{item.name}</p>
                </div>
                <UserVotingResult handleClose={() => setShowVotingResultModal(false)} votingQueryDetail={votingQueryDetail} votingResult={votingResult} currentUserAnswer={currentUserAnswer} />
            </div>
        </Modal>

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
                    load={load}
                    selectHistoryItem={(i: Number) => selectHistoryItem(i)}
                    show={showVotingHistoryModal}
                />
            </div>
        </ModalV2>
    </div>);

}

export default Card;