import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Contract, ethers, constants } from "ethers";
import {
    Project,
    TokenTemplate,
    AdminWalletAddress,
    YUSD
} from "../src/constants/contracts";
import Card from "@components/widgets/Card";

import useLoading from "@hooks/useLoading";
import useAlert from "@hooks/useAlert";
import useAccount from "@hooks/useAccount";
import useProject from "@hooks/useFund";
import useServer from "@hooks/useServer";
import NoData from "@components/widgets/NoData";
import useCurrency from "@hooks/useCurrency";

const Fund: FC = () => {
    const { provider, signer, account } = useAccount();
    const { projects: fundProjects, retireveProjectsDetails, loading, error } = useProject()
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const [step, setStep] = useState("Fundraising");
    const [noDateFlag, setNoDataFlag] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [frequencyTime, setFrequencyTime] = useState(2);
    const { time, getTime } = useServer();
    const [clearInstance, setClearInstance] = useState<any>(null);
    const isInitialRender = useRef(true);
    const { currencyRetireve } = useCurrency();

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
        console.log(shareAmount, amount, investAllowance, tokenPrice);
        try {
            loadingStart();

            if (amount > +investAllowance) {
                const investTokenInstance = new Contract(investAddress, YUSD.abi, signer);
                let approve_investToken = await investTokenInstance.approve(poolAddress, investAmount, {
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

    // invest & earn harvest
    const harvest = useCallback(async (poolAddress: string) => {
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
            let harvestTx = await ProjectContractInstance.claimInvestEarn({
                gasLimit: 300000
            });
            await harvestTx.wait();
            loadingEnd();
        } catch (ex) {
            loadingEnd();
        }
    }, [signer]);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        getTime();
        if (clearInstance) {
            clearInterval(clearInstance)
        }
        let clearInstanceTemp = setInterval(() => {
            retireveProjectsDetails();
            getTime();
            console.log('test', frequencyTime);
        }, frequencyTime * 60 * 1000)
        setClearInstance(clearInstanceTemp);
    }, [frequencyTime])

    useEffect(() => {
        if (loading == 0) loadingStart();
        else if (loading == 2) loadingEnd();
    }, [loading])

    useEffect(() => {
        (async () => {
            if (provider && account && loading == 0) {
                console.log("FUNDS", account)
                await retireveProjectsDetails();
                // console.log("funds-project")
            }
        })()
    }, [provider, account, loading])

    useEffect(() => {
        currencyRetireve();
    }, [])

    useEffect(() => {
        let temp = [];
        if (step == "Fundraising") {
            temp = [
                ...fundProjects.filter((item: any) => (item && Number(item.endDate) >= time.time && item.currentStatus < 100))
            ]
            setProjects([...temp]);
        } else if (step == "Ongoing") {
            temp = [
                ...fundProjects.filter((item: any) => (item && Number(item.currentStatus) == 100 && Number(item.endDate) >= time.time))
            ]
            setProjects([...temp]);
        } else if (step == "My") {
            temp = [
                ...fundProjects.filter((item: any) => item && (item.joinState || Number(item.shareTokenBalance)))
            ]
            setProjects([...temp]);
        } else if (step == "Closed") {
            temp = [
                ...fundProjects.filter((item: any) => (item && Number(item.endDate) < time.time))
            ]
            setProjects([...temp]);
        }
        if (temp.length) setNoDataFlag(false);
        else setNoDataFlag(true);
    }, [fundProjects, step, time]);

    return <>
        <div className="container">
            <div className="flex justify-between items-center py-8">
                <p className="leading-[1.5] w-[55%] lg:w-[50%] text-xl lg:text-4xl font-semibold">
                    Welcome to the new investment world where you can be part of Your Own Company
                </p>
                <img className="hidden lg:block w-[45%] h-full" src="/images/fund-bg.png" />
                <img className="block lg:hidden w-[40%] h-full" src="/images/fund-bg-mobile.png" />
            </div>
            <div className="">
                <div className="w-full my-6">
                    <div className="flex mb-4">
                        <div className={`bg-primary-pattern text-center ${step == "Fundraising" ? 'bg-secondary-pattern shadow-btn-primary' : ''} whitespace-nowrap transition-all hover:bg-secondary-pattern hover:shadow-btn-primary cursor-pointer rounded py-2 lg:py-4 px-6 lg:px-10 mr-2 lg:mr-4 text-base lg:text-xl text-white font-medium`}
                            onClick={() => { setStep("Fundraising") }}>Fundraising Projects</div>
                        <div className={`bg-primary-pattern text-center ${step == "Ongoing" ? 'bg-secondary-pattern shadow-btn-primary' : ''} whitespace-nowrap transition-all hover:bg-secondary-pattern hover:shadow-btn-primary cursor-pointer rounded py-2 lg:py-4 px-6 lg:px-10 mr-2 lg:mr-4 text-base lg:text-xl text-white font-medium`}
                            onClick={() => { setStep("Ongoing") }}>Ongoing Projects</div>
                        {
                            account ?
                                <div className={`bg-primary-pattern text-center ${step == "My" ? 'bg-secondary-pattern shadow-btn-primary' : ''} whitespace-nowrap transition-all hover:bg-secondary-pattern hover:shadow-btn-primary cursor-pointer rounded py-2 lg:py-4 px-6 lg:px-10 mr-2 lg:mr-4 text-base lg:text-xl text-white font-medium`}
                                    onClick={() => { setStep("My") }}>My Projects</div>
                                : ""
                        }
                    </div>
                    <div className="">
                        <p className="text-dark-secondary mb-2.5">Project Refresh Frequency</p>
                        <div className="flex justify-start">
                            <div className="flex items-center rounded-sm">
                                <div className={`${frequencyTime == 2 ? "bg-btn-primary" : "bg-body-primary"} text-white text-md cursor-pointer leading-none border border-border-primary p-2.5`}
                                    onClick={() => setFrequencyTime(2)}>2 Min</div>
                                <div className={`${frequencyTime == 5 ? "bg-btn-primary" : "bg-body-primary"} text-white text-md cursor-pointer leading-none border border-border-primary p-2.5 -ml-[1px]`}
                                    onClick={() => setFrequencyTime(5)}>5 Min</div>
                                <div className={`${frequencyTime == 10 ? "bg-btn-primary" : "bg-body-primary"} text-white text-md cursor-pointer leading-none border border-border-primary p-2.5 -ml-[1px]`}
                                    onClick={() => setFrequencyTime(10)}>10 Min</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {
                            projects.map((item: any, index: number) => {
                                return <Card
                                    key={`card-${index}`}
                                    item={item}
                                    buyAction={buyToken}
                                    claimAction={claim}
                                    refundAction={refund}
                                    harvestAction={harvest}
                                    status={step}
                                />
                            })
                        }
                    </div>
                    {
                        (noDateFlag) ? <NoData className="!h-48" text="There is no project" /> : null
                    }
                </div>
                <div className="flex items-center justify-end">
                    <div className={`text-center underline ${step == "Closed" ? 'text-white' : 'text-dark-secondary'} cursor-pointer p-2 text-base lg:text-xl font-medium`} onClick={() => { setStep("Closed") }}>Closed Projects</div>

                </div>
            </div>
        </div>
    </>
}

export default Fund;