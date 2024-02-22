import React, { FC, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BigNumber, Contract, ethers } from "ethers";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import { BsFillTrashFill } from "react-icons/bs";
import ModalV2 from "./Modalv2";
import AdminVotingContent from "./AdminVotingContent";
import UserVotingContent from "./UserVotingContent";
import UserVotingResult from "./UserVotingResultModal";
import { Project, ProjectDetail, ProjectTrade, TokenTemplate, YOC, YUSD } from "../../constants/contracts";
import { VotingQueryInterface, VotingResultInterface } from "../../interfaces/voting";
import axios from "axios";
import VotingHistory from "./VotingHistoryModalContent";

import useLoading from "@hooks/useLoading";
import useAlert from "@hooks/useAlert";
import useNetwork from "@hooks/useNetwork";
import useAccount from "@hooks/useAccount";
import useProject from "@hooks/useFund";
import useCurrency from "@hooks/useCurrency";
import axiosInstance from "utils/axios";
import MintSection from "@components/sections/Mint";
import useAdmin from "@hooks/useAdmin";
import { convertWeiToEth } from "utils/unit";

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

const yocAmountYear = 4.5 * 60 * 24 * 365 * 20;

const Card: FC<Props> = ({ item, buyAction, refundAction, claimAction, depositAction, harvestAction, admin, status }) => {
    const { account, provider, signer } = useAccount();
    const { loadingStart, loadingEnd } = useLoading();
    const { updateProjectInfoByAddress } = useProject();
    const { alertShow } = useAlert();
    const { explorer, network, scan } = useNetwork();
    const isAdmin = useAdmin();

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
    const { getYOCDetail, getYUSDDetail } = useCurrency();
    const [multiplier, setMultiplier] = useState("");
    const [showUpdateMultiplierModal, setShowUpdateMultiplierModal] = useState(false);
    const [isMintShow, setIsMintShow] = useState(false);

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
                    symbol: YUSD.symbol,
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
        //         // const projectContract = item.projectContract as Contract;
        //         const projectContract = new Contract(item.poolAddress, Project.abi, WebSocketProvider);
        //         projectContract.on('Participated', (address, amount1, amount2, user) => {
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

        //         projectContract.on('Refund', (address, amount1, amount2, user) => {
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

        //         projectContract.on('Claimed', (address, amount, user) => {
        //             updateProjectInfoByAddress(address);

        //             if (user == account) {
        //                 let realAmount = convertWeiToEth(amount, investContract ? investContract.decimals : 16)
        //                 alertShow({
        //                     content: `Dividend Claimed ${realAmount} ${investContract?.symbol} Successfully`,
        //                     status: 'success'
        //                 })
        //             }
        //         });

        //         projectContract.on('ProfitDeposited', (address, amount, user) => {
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

    const inputTokenAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(Number(e.target.value))) {
            setTokenAmount(String(e.target.value));
            let amount = Number((e.target as HTMLInputElement).value);
            setUsdAmount(String((amount / item.tokenPrice).toFixed(2)));
        }
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

    const inputUSDAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(Number(e.target.value))) {
            setUsdAmount(String(e.target.value));
            let amount = Number((e.target as HTMLInputElement).value);
            setTokenAmount(String((amount * item.tokenPrice).toFixed(2)));
        }
    };

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

    const buyTokenActionHandle = useCallback(async () => {
        if (account == undefined) {
            alertShow({
                status: 'failed',
                content: 'Please connect to the Metamask!'
            })
            return;
        } else if (isAdmin) {
            alertShow({
                status: 'failed',
                content: 'Admin can\'t buy token!'
            })
            return;
        }
        const ProjectContractInstance = new Contract(item.poolAddress, Project.abi, signer);
        let investAmount = Number(ethers.utils.parseUnits(usdAmount, item.investDecimal));
        let shareAmount = Number(ethers.utils.parseUnits(tokenAmount, item.shareDecimal)); // N
        try {
            loadingStart();

            if (+usdAmount > +item.investTokenAllowance) {
                const investTokenInstance = new Contract(item.investToken, YUSD.abi, signer);
                let approve_investToken = await investTokenInstance.approve(item.poolAddress, investAmount, {
                    gasLimit: 300000
                });
                await approve_investToken.wait();
            }

            let gasLimit = 300000;
            try {
                let participateEstimate = await ProjectContractInstance.estimateGas.participate(investAmount, shareAmount);
                gasLimit = +participateEstimate.mul(150).div(100);
            } catch (error) {
                console.log('gaslimit', error);
            }

            let participateTx = await ProjectContractInstance.participate(investAmount, shareAmount, {
                gasLimit: gasLimit
            });
            const eventlistencer = (address: string, amount1: BigNumber, amount2: BigNumber, user: string) => {
                console.log("Participated", address, amount1, amount2, user);
                if (user == account) {
                    let realInvestAmount = convertWeiToEth(amount1, investContract ? investContract.decimals : 16)
                    let realShareAmount = convertWeiToEth(amount2, shareContract ? shareContract.decimals : 16)
                    alertShow({
                        content: `Participated ${realShareAmount} ${shareContract?.symbol}, ${realInvestAmount} ${investContract?.symbol} Successfully`,
                        status: 'success'
                    })
                }
                updateProjectInfoByAddress(address);
                loadingEnd();
                ProjectContractInstance.removeListener("Participated", eventlistencer);
            }
            ProjectContractInstance.on('Participated', eventlistencer)

            await participateTx.wait();
            loadingEnd();

        } catch (ex) {
            loadingEnd();
            console.log("buy token error: ", ex)
        }
    }, [item, signer]);

    const depositActionHandle = useCallback(async () => {
        try {
            if (account == undefined) {
                alertShow({
                    status: 'failed',
                    content: 'Please connect to the Metamask!'
                })
                return;
            }
            loadingStart();
            const ProjectContractInstance = new Contract(item.poolAddress, Project.abi, signer);
            const investTokenInstance = new Contract(item.investToken, YUSD.abi, signer);

            let investAmount = ethers.utils.parseUnits(usdAmount, item.investDecimal);
            let investTokenApproveTx = await investTokenInstance.approve(item.poolAddress, investAmount, {
                gasLimit: 300000
            });
            await investTokenApproveTx.wait();

            let depositProfitTx = await ProjectContractInstance.makeDepositProfit(investAmount, {
                gasLimit: 300000
            });
            const eventlistencer = (projectAddress: string, amount: BigNumber, user: string) => {
                if (user == account) {
                    let realAmount = convertWeiToEth(amount, investContract ? investContract.decimals : 16)
                    alertShow({
                        content: `Deposit ${realAmount} ${investContract?.symbol} Successfully`,
                        status: 'success'
                    })
                }
                updateProjectInfoByAddress(projectAddress);
                ProjectContractInstance.removeListener("ProfitDeposited", eventlistencer);
                loadingEnd();
            }
            ProjectContractInstance.on("ProfitDeposited", eventlistencer);

            await depositProfitTx.wait();
            loadingEnd();
        } catch (ex) {
            console.log("make depost error: ", ex)
            loadingEnd();
        }
    }, [item, signer]);

    const refundActionHandle = useCallback(async () => {
        // refundAction(item.poolAddress, item.tokenPrice, item.shareToken, item.investDecimal, item.shareDecimal, item.shareTokenAllowance);
        if (account == undefined) {
            alertShow({
                status: 'failed',
                content: 'Please connect to the Metamask!'
            })
            return;
        }
        const ProjectContractInstance = new Contract(item.poolAddress, Project.abi, signer);
        const shareTokenInstance = new Contract(item.shareToken, TokenTemplate.abi, signer);

        let shareAmount = await shareTokenInstance.balanceOf(account);
        let shareAmountToEth = Number(ethers.utils.formatUnits(shareAmount, item.shareDecimal));
        if (shareAmountToEth == 0) {
            alertShow({
                status: 'failed',
                content: 'Your balance is zero!'
            })
            return
        }

        try {
            let investAmount = ethers.utils.parseUnits((shareAmountToEth / item.tokenPrice).toString(), item.investDecimal)

            loadingStart();
            if (+shareAmount > +item.shareTokenAllowance) {
                let approve_ytest = await shareTokenInstance.approve(item.poolAddress, shareAmount, {
                    gasLimit: 300000
                });
                await approve_ytest.wait();
            }

            let refundTx = await ProjectContractInstance.refund(shareAmount, investAmount, {
                gasLimit: 300000
            });

            const eventlistencer = (address: string, amount1: BigNumber, amount2: BigNumber, user: string) => {
                updateProjectInfoByAddress(address);

                if (user == account) {
                    let realInvestAmount = convertWeiToEth(amount1, investContract ? investContract.decimals : 16)
                    let realShareAmount = convertWeiToEth(amount2, shareContract ? shareContract.decimals : 16)
                    alertShow({
                        content: `Refund ${realShareAmount} ${shareContract?.symbol}, ${realInvestAmount} ${investContract?.symbol} Successfully`,
                        status: 'success'
                    })
                }
                ProjectContractInstance.removeListener('Refund', eventlistencer);
                loadingEnd();
            }
            ProjectContractInstance.on('Refund', eventlistencer);
            await refundTx.wait();
            loadingEnd();
        } catch (ex) {
            loadingEnd();
        }
    }, [item, signer]);

    const claimActionHandle = useCallback(async () => {
        // claimAction(item.poolAddress)
        if (account == undefined) {
            alertShow({
                status: 'failed',
                content: 'Please connect to the Metamask!'
            })
            return;
        }
        const ProjectContractInstance = new Contract(item.poolAddress, Project.abi, signer);
        try {
            loadingStart();
            let claimTx = await ProjectContractInstance.claim({
                gasLimit: 300000
            });
            const eventlistencer = (address: string, amount: BigNumber, user: string) => {
                updateProjectInfoByAddress(address);

                if (user == account) {
                    let realAmount = convertWeiToEth(amount, investContract ? investContract.decimals : 16)
                    alertShow({
                        content: `Dividend Claimed ${realAmount} ${investContract?.symbol} Successfully`,
                        status: 'success'
                    })
                }
                ProjectContractInstance.removeListener('Claimed', eventlistencer);
                loadingEnd();
            }
            ProjectContractInstance.on('Claimed', eventlistencer);
            await claimTx.wait();
            loadingEnd();
        } catch (ex) {
            loadingEnd();
        }
    }, [item, signer]);

    const harvestActionHandle = useCallback(async () => {
        // harvestAction(item.poolAddress);
        if (account == undefined) {
            alertShow({
                status: 'failed',
                content: 'Please connect to the Metamask!'
            })
            return;
        }
        const ProjectContractInstance = new Contract(item.poolAddress, Project.abi, signer);
        try {
            loadingStart();
            let harvestTx = await ProjectContractInstance.claimInvestEarn({
                gasLimit: 300000
            });

            const eventlistencer = (address: string, yocAmount: BigNumber, user: string) => {
                updateProjectInfoByAddress(address);

                if (user == account) {
                    let realAmount = convertWeiToEth(yocAmount, YOC.decimals)
                    alertShow({
                        content: `Claimed ${realAmount} ${YOC?.symbol} Successfully`,
                        status: 'success'
                    })
                }
                ProjectContractInstance.removeListener('ClaimInvestEarn', eventlistencer);
                loadingEnd();
            }
            ProjectContractInstance.on('ClaimInvestEarn', eventlistencer);

            await harvestTx.wait();
            loadingEnd();
        } catch (ex) {
            loadingEnd();
        }
    }, [item, signer]);

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

    const pauseTradeHandle = async () => {
        try {
            loadingStart();
            const ProjectTradeContract = new Contract(ProjectTrade.address, ProjectTrade.abi, signer);
            let pauseTradeTx;
            if (item.tradePaused) {
                pauseTradeTx = await ProjectTradeContract.unpause(item.shareToken, {
                    gasLimit: 68676
                });
            } else {
                pauseTradeTx = await ProjectTradeContract.pause(item.shareToken, {
                    gasLimit: 68676
                });
            }

            const eventlistencer = (ptokenAddress: string, paused: boolean) => {
                console.log("Pause", ptokenAddress, paused);

                if (!paused) {
                    alertShow({
                        content: "The project has resumed successfully",
                        status: 'success'
                    });
                } else {
                    alertShow({
                        content: "The project has paused successfully",
                        status: 'success'
                    });
                }
                updateProjectInfoByAddress(ptokenAddress);
                loadingEnd();
                ProjectTradeContract.removeListener("Pause", eventlistencer);
            }
            ProjectTradeContract.on('Pause', eventlistencer)
            await pauseTradeTx.wait();
        } catch (error) {
            loadingEnd();
            console.log("Pause/Resume Trade Project Error: ", error)
        }
    }

    const cancelOrders = async () => {
        try {
            loadingStart();
            const ProjectTradeContract = new Contract(ProjectTrade.address, ProjectTrade.abi, signer);
            let cancelOrdersTx = await ProjectTradeContract.cancelOrders(item.shareToken);

            const eventlistencer = (ptokenAddress: string) => {
                console.log("CancelAllOrders", ptokenAddress);

                alertShow({
                    content: "All orders of the project have cancelled successfully",
                    status: 'success'
                });

                updateProjectInfoByAddress(ptokenAddress);
                loadingEnd();
                ProjectTradeContract.removeListener("CancelAllOrders", eventlistencer);
            }
            ProjectTradeContract.on('CancelAllOrders', eventlistencer)
            await cancelOrdersTx.wait();
        } catch (error) {
            loadingEnd();
            console.log("Cancel All Orders Error: ", error)
        }
    }

    const removeOrders = async () => {
        try {
            loadingStart();
            const ProjectTradeContract = new Contract(ProjectTrade.address, ProjectTrade.abi, signer);
            let remvoeOrdersTx = await ProjectTradeContract.removeOrders(item.shareToken);

            const eventlistencer = (ptokenAddress: string) => {
                console.log("RemoveAllOrders", ptokenAddress);

                alertShow({
                    content: "All orders of the project have removed successfully",
                    status: 'success'
                });

                updateProjectInfoByAddress(ptokenAddress);
                loadingEnd();
                ProjectTradeContract.removeListener("RemoveAllOrders", eventlistencer);
            }
            ProjectTradeContract.on('RemoveAllOrders', eventlistencer)
            await remvoeOrdersTx.wait();
        } catch (error) {
            loadingEnd();
            console.log("Remove All Orders Error: ", error)
        }
    }

    const makeProjectTradeHandle = async () => {
        try {
            loadingStart();
            const projectContract = new Contract(item.poolAddress, Project.abi, signer);
            const manualMoveTradeTx = await projectContract.manualMoveTrade();
            await manualMoveTradeTx.wait();

            updateProjectInfoByAddress(item.poolAddress);
            alertShow({
                content: "The project has moved to secondary marketplace successfully",
                status: 'success'
            });
        } catch (error) {
            loadingEnd();
            console.log("Remove All Orders Error: ", error)
        }
    }

    const handleOpenUpdateMultiplierModel = () => {
        setMultiplier(item.multiplier);
        setShowUpdateMultiplierModal(true);
    }
    const updateMultiplier = async () => {
        try {
            loadingStart();
            const res = await axiosInstance.post('/project/updateMultiplier', {
                multiplier: multiplier,
                projectAddress: item.poolAddress,
                pId: ''
            });
            if (res && res.data) {
                updateProjectInfoByAddress(item.poolAddress);
                alertShow({
                    content: "Multiplier updated successfully",
                    status: 'success'
                });
                setShowUpdateMultiplierModal(false);
                loadingEnd();
            }
        } catch (error) {
            loadingEnd();
            setShowUpdateMultiplierModal(false);
            console.log("Update multiplier: ", error)
        }
    }

    const investEarnUSDAmount = useMemo(() => {
        let YOCDetail = getYOCDetail();
        if (YOCDetail) {
            return (item.investEarnAmount * Number(YOCDetail.price)).toFixed(2);
        } else {
            return 0
        }
    }, [getYOCDetail, item]);

    const APR = useMemo(() => {
        let YOCDetail = getYOCDetail(), YUSDDetail = getYUSDDetail();
        if (YOCDetail && YUSDDetail) {
            return 100 * yocAmountYear * Number(YOCDetail.price) / (item.totalRaise * Number(YUSDDetail.price));
        }
        return 0;
    }, [item, getYOCDetail, getYUSDDetail])

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
                <p>APR: Aprox. {APR.toFixed(2)}%</p>
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
                        <Button text="Update Multiplier" onClick={() => handleOpenUpdateMultiplierModel()} />
                    </> : <>
                        <Button text="Buy Token" onClick={buyHandler} />
                        <Button text="Add Token" onClick={() => addToken()} />
                        <div className="invest-wrap flex flex-col items-end">
                            <p className="whitespace-nowrap">{`Invest & Earn: ${Number(item.investEarnAmount).toFixed(2)} ${YOC.symbol}${network == "ETH" ? 'e' : 'b'}`}</p>
                            <p className="whitespace-nowrap">{`Invest & Earn Value: $${investEarnUSDAmount}`}</p>
                        </div>
                    </>
                }
            </div>
        } else if (projectStatus == 'Ongoing') {
            temp = <div className="btn-group">
                {
                    admin ?
                        <>
                            {/* <Button text="Update Multiplier" onClick={() => handleOpenUpdateMultiplierModel()} /> */}
                            <Button text="Deposit Profit" onClick={() => setShowDepositModal(true)} />
                            <Button text="Cancel Orders" onClick={cancelOrders} />
                            <Button text={`${item.tradePaused ? 'Resume' : 'Pause'} Trade`} onClick={pauseTradeHandle} />
                            <Button text="Remove Orders" onClick={removeOrders} />
                        </>
                        :
                        <>
                            <Button text="Buy Token" onClick={buyHandler} />
                            <div className="claim-wrap flex flex-col items-end">
                                <p>{`Claim amount: ${(item.claimAmount || 0).toFixed(2)} YUSD`}</p>
                                <Button disabled={!(item.claimAmount > 0 && !item.claimable)} text="Claim Dividend" onClick={claimActionHandle} />
                            </div>
                            <Button text="Add Token" onClick={() => addToken()} />
                            {
                                !item.investEarnClaimable ?
                                    <div className="invest-wrap flex flex-col items-end">
                                        <p className="whitespace-nowrap">{`Invest & Earn: ${Number(item.investEarnAmount).toFixed(2)} ${YOC.symbol}${network == "ETH" ? 'e' : 'b'}`}</p>
                                        <p className="whitespace-nowrap">{`Invest & Earn Value: $${investEarnUSDAmount}`}</p>
                                        {
                                            +item.investEarnAmount ?
                                                <Button text="Invest & Earn Harvest" onClick={harvestActionHandle} />
                                                : ""
                                        }
                                    </div> : ""
                            }
                        </>
                }
            </div>
        } else if (projectStatus == 'Closed') {
            temp = <>
                {
                    admin ? <>
                        {/* <Button text="Update Multiplier" onClick={() => handleOpenUpdateMultiplierModel()} /> */}
                        <Button text="Go to secondary" onClick={makeProjectTradeHandle} />
                    </> :
                        <>
                            <Button className={"mt-1"} text={"Refund"} disabled={Number(item.shareTokenBalance) == 0} onClick={refundActionHandle} />
                            {
                                !item.investEarnClaimable ?
                                    <div className="invest-wrap flex flex-col items-end">
                                        <p className="whitespace-nowrap">{`Invest & Earn: ${Number(item.investEarnAmount).toFixed(2)} ${YOC.symbol}${network == "ETH" ? 'e' : 'b'}`}</p>
                                        <p className="whitespace-nowrap">{`Invest & Earn Value: $${investEarnUSDAmount}`}</p>
                                        {
                                            +item.investEarnAmount ?
                                                <Button text="Invest & Earn Harvest" onClick={harvestActionHandle} />
                                                : ""
                                        }
                                    </div> : ""
                            }
                        </>
                }
            </>
        }
        return temp;
    }, [admin, item, projectStatus, investEarnUSDAmount]);

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
                <div className="token-price !text-sm !px-2 !py-1 rounded text-white border border-border-primary">1 {YUSD.symbol} = {item.tokenPrice} {item.name}</div>
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
            <div className="extra-info text-sm leading-[130%]">
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
                <p className='text-center text-2xl w-full text-white py-6 font-bold'>Buy {item.name} tokens</p>
                <div className='flex items-center mb-2'>
                    <p className="whitespace-nowrap">Selling price: 1 YUSD = {item.tokenPrice} {item.name}</p>
                    <div className='group relative'>
                        <img className='ml-2 w-[14px] h-[14px]' src='/images/question.png' />
                        <div className='hidden group-hover:block not-italic text-white absolute z-10 left-2 top-3.5 w-[300px] p-2 z-100 backdrop-blur-md bg-[#041b298c] rounded shadow-btn-primary'>
                            Project Tokens can only be bought with YUSD, YOC's stable coin.<br />
                            If you do not yet have any YUSD, just click on "Mint YUSD" below and go through the next steps.<br />
                            Be aware that the investment will be locked during the fundraising phase.
                        </div>
                    </div>
                </div>
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
                        <span className="mr-1">{YUSD.symbol}</span>
                    </div>
                    <div className="d-flex justify-between align-center mb-4">
                        <span>Available: {item.availableMaxUsdValue}</span>
                        <div className="flex">
                            <Button className="max-btn !bg-btn-primary mr-2" text="Mint YUSD" onClick={() => setIsMintShow(true)} bgColor="#0c54ad)" />
                            <Button className="max-btn !bg-btn-primary" text="Max" onClick={setMaxUsdAmountValue} bgColor="#0c54ad)" />
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <Button text="Buy Token" onClick={() => { buyTokenActionHandle(); setShowBuyTokenModal(false); }} />
                    <Button className="bg-btn-disable ml-2" text="Cancel" onClick={() => { setShowBuyTokenModal(false); }} />
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
                <div className="flex items-center justify-betweeninput_field mb-4">
                    <input className="w-[calc(100%_-_50px)] text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" placeholder="0.00" onInput={inputUSDAmount} value={usdAmount} />
                    <span className="text-right ml-4 text-white">{YUSD.symbol}</span>
                </div>
                <div className="flex justify-end">
                    <Button className="mr-2" text="Deposit" onClick={() => { depositActionHandle(); setShowDepositModal(false) }} />
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


        {/* Update Multiplier Modal */}
        <ModalV2
            show={showUpdateMultiplierModal}
            onClose={() => setShowUpdateMultiplierModal(false)}
        >
            <div className="modal_content p-4">
                <p className='text-center text-2xl w-full text-white py-4 font-bold'>How much do you want?</p>
                <div className="input_field mb-4">
                    <input className="w-full text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" placeholder="10" onInput={(e: any) => setMultiplier(e.target.value)} value={multiplier} />
                </div>
                <div className="flex justify-end">
                    <Button className="mr-2" text="Update" onClick={() => { updateMultiplier(); }} />
                    <Button className="!bg-dark-primary" text="Cancel" onClick={() => { setShowUpdateMultiplierModal(false) }} />
                </div>
            </div>
        </ModalV2>


        <ModalV2 size="tiny" layer={100} show={isMintShow} onClose={() => setIsMintShow(false)}>
            <div className="p-6 pt-10">
                <MintSection />
            </div>
        </ModalV2>
    </div>;
}

export default Card;