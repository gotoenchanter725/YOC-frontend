import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Contract, ethers, constants } from "ethers";
const { MaxUint256 } = constants;
import {
    USDCToken,
    Project,
    TokenTemplate,
    AdminWalletAddress
} from "../src/constants/contracts";
import Card from "@components/widgets/Card";
import ShowMoreIcon from "@components/widgets/ShowMoreIcon";
import { projectInfos } from "../store/actions";

import useLoading from "@hooks/useLoading";
import useAlert from "@hooks/useAlert";
import useAccount from "@hooks/useAccount";
import useProject from "@hooks/useFund";
import NoData from "@components/widgets/NoData";

const Fund: FC = () => {
    const [step, setStep] = useState(0);
    const dispatch = useDispatch();
    const { provider, signer, account, rpc_provider } = useAccount();
    const { projects, retireveProjectsDetails, loading, error } = useProject()
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const [showMoreFlag, setShowMoreFlag] = useState(false);
    const [noDateFlag, setNoDataFlag] = useState(false);

    // for project 1 buy function
    const buyToken = useCallback(async (amount: any, tokenPrice: any, poolAddress: string, investAddress: string, investDecimal: any, shareDecimal: any, investAllowance: any = 0) => {
        if (account == undefined) {
            alertShow({
                status: 'failed',
                content: 'Please connect to the Metamask!'
            })
            return;
        } else if (account == AdminWalletAddress) {
            alertShow({
                status: 'failed',
                content: 'Admin can\'t buy token!'
            })
            return;
        }
        const ProjectContractInstance = new Contract(poolAddress, Project.abi, signer);
        let investAmount = Number(ethers.utils.parseUnits(amount, investDecimal));
        let shareAmount = Number(ethers.utils.parseUnits((amount * tokenPrice).toFixed(2), shareDecimal)); // N
        console.log(shareAmount, amount, investAllowance);
        try {
            loadingStart();

            if (amount > +investAllowance) {
                const investTokenInstance = new Contract(investAddress, USDCToken.abi, signer);
                let approve_investToken = await investTokenInstance.approve(poolAddress, shareAmount, {
                    gasLimit: 300000
                });
                await approve_investToken.wait();
            }

            let participate = await ProjectContractInstance.participate(investAmount, shareAmount, {
                gasLimit: 300000
            });
            await participate.wait();
            loadingEnd();

        } catch (ex) {
            loadingEnd();
            console.log("buy token error: ", ex)
        }
    }, [signer]);

    // for project 1 refund function
    const refund = useCallback(async (poolAddress: string, tokenPrice: any, shareAddress: string, investDecimal: any, shareDecimal: any, stakeAllowance: any) => {
        if (account == undefined) {
            alertShow({
                status: 'failed',
                content: 'Please connect to the Metamask!'
            })
            return;
        }
        const ProjectContractInstance = new Contract(poolAddress, Project.abi, signer);
        const shareTokenInstance = new Contract(shareAddress, TokenTemplate.abi, signer);

        let shareAmount = await shareTokenInstance.balanceOf(account);
        let shareAmountToEth = Number(ethers.utils.formatUnits(shareAmount, shareDecimal));
        if (shareAmountToEth == 0) {
            alertShow({
                status: 'failed',
                content: 'Your balance is zero!'
            })
            return
        }

        try {
            let investAmount = ethers.utils.parseUnits((shareAmountToEth / tokenPrice).toString(), investDecimal)

            loadingStart();
            if (shareAmount > stakeAllowance) {
                let approve_ytest = await shareTokenInstance.approve(poolAddress, shareAmount, {
                    gasLimit: 300000
                });
                await approve_ytest.wait();
            }

            let refund = await ProjectContractInstance.refund(shareAmount, investAmount, {
                gasLimit: 300000
            });
            await refund.wait();
            loadingEnd();
        } catch (ex) {
            loadingEnd();
        }
    }, [signer]);

    // claim function
    const claim = useCallback(async (poolAddress: string) => {
        if (account == undefined) {
            alertShow({
                status: 'failed',
                content: 'Please connect to the Metamask!'
            })
            return;
        }
        const ProjectContractInstance = new Contract(poolAddress, Project.abi, signer);
        try {
            loadingStart();
            let claim = await ProjectContractInstance.claim({
                gasLimit: 300000
            });
            await claim.wait();
            loadingEnd();
        } catch (ex) {
            loadingEnd();
        }
    }, [signer]);

    useEffect(() => {
        if (loading == 0) loadingStart();
        else if (loading == 2) loadingEnd();
    }, [loading])

    useEffect(() => {
        (async () => {
            if (rpc_provider && account && loading == 0) {
                console.log("FUNDS", account)
                await retireveProjectsDetails();
                // console.log("funds-project")
            }
        })()
    }, [rpc_provider, account, loading])

    useEffect(() => {
        if (step == 0 && projects.filter((item: any) => (item && item.endDate >= Date.now() && item.currentStatus < item.ongoingPercent)).length == 0) setNoDataFlag(true);
        else if (step == 1 && projects.filter((item: any) => (item && item.currentStatus >= item.ongoingPercent)).length == 0) setNoDataFlag(true);
        else if (step == 2 && projects.filter((item: any) => (item && item.endDate < Date.now() && item.currentStatus < item.ongoingPercent)).length == 0) setNoDataFlag(true);
        else if (step == 3 && projects.filter((item: any) => item && item.joinState).length == 0) setNoDataFlag(true);
        else setNoDataFlag(false);
    }, [projects, step]);

    return <>
        <div className="container">
            <div className="flex justify-between items-center py-8">
                <p className="leading-[1.5] w-[55%] lg:w-[50%] text-xl lg:text-4xl font-semibold">
                    Welcome to the new investment world where you can be part of Your Own Company
                </p>
                <img className="hidden lg:block w-[45%] h-full" src="/images/fund-bg.png" />
                <img className="block lg:hidden w-[40%] h-full" src="/images/fund-bg-mobile.png" />
            </div>
            <div className="flex justify-between items-center my-6">
                <div className="flex">
                    <div className={`bg-primary-pattern text-center ${step == 0 ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-2 lg:py-4 px-6 lg:px-10 mr-2 lg:mr-4 text-base lg:text-xl text-white font-medium`} onClick={() => { setStep(0) }}>Open Projects</div>
                    <div className={`bg-primary-pattern text-center ${step == 1 ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-2 lg:py-4 px-6 lg:px-10 mr-2 lg:mr-4 text-base lg:text-xl text-white font-medium`} onClick={() => { setStep(1) }}>Ongoing Projects</div>
                    <div className={`bg-primary-pattern text-center ${step == 2 ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-2 lg:py-4 px-6 lg:px-10 mr-2 lg:mr-4 text-base lg:text-xl text-white font-medium`} onClick={() => { setStep(2) }}>Closed Projects</div>
                    <div className={`bg-primary-pattern text-center ${step == 3 ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-2 lg:py-4 px-6 lg:px-10 mr-2 lg:mr-4 text-base lg:text-xl text-white font-medium`} onClick={() => { setStep(3) }}>My Projects</div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {
                    step == 0 ?
                        projects.filter((item: any) => (item && item.endDate >= Date.now() && item.currentStatus < item.ongoingPercent)).map((item: any, index: number) => {
                            return (
                                <Card key={`card- + ${index}`} item={item} poolAddress={item} buyAction={buyToken} provider={rpc_provider} status="open" />
                            )
                        }) :
                        step == 1 ?
                            projects.filter((item: any) => (item && item.currentStatus >= item.ongoingPercent)).map((item: any, index: number) => {
                                return (
                                    <Card key={`card- + ${index}`} item={item} poolAddress={item} buyAction={buyToken} claimAction={claim} provider={rpc_provider} status="ongoing" />
                                )
                            }) :
                            step == 2 ?
                                projects.filter((item: any) => (item && item.endDate < Date.now() && item.currentStatus < item.ongoingPercent)).map((item: any, index: number) => {
                                    return (
                                        <Card key={`card- + ${index}`} item={item} poolAddress={item} refundAction={refund} provider={rpc_provider} status="close" />
                                    )
                                }) : ""
                }
                {
                    step == 3 ?
                        projects.filter((item: any) => item && item.joinState).map((item: any, index: number) => {
                            return (
                                <Card key={`card- + ${index}`} item={item} poolAddress={item} buyAction={buyToken} claimAction={claim} refundAction={refund} provider={rpc_provider} status="my" />
                            )
                        })
                        : ""
                }
            </div>
            {
                noDateFlag && loading == 2 ? <NoData className="h-48" text="There is no project" /> : null
            }
            {
                showMoreFlag ? <ShowMoreIcon text="Show More" /> : null
            }
        </div>
    </>
}

export default Fund;