import React, { useState, useCallback, useEffect } from "react";
import type { NextPage } from 'next';
import { BsFillPlusSquareFill } from "react-icons/bs"
import { Contract, ethers } from "ethers";

import CreateProjectContent from '@components/admin/createProject';
import Card from '@components/widgets/Card';
import Modal from '@components/widgets/Modalv2';
import {
    YUSD,
    Project
} from '../../src/constants/contracts';

import { useAdmin, useAccount, useAlert, useLoading } from '@hooks/index';
import useProject from "@hooks/useFund";
import { convertWeiToEth } from "utils/unit";
import NoData from "@components/widgets/NoData";
import useServer from "@hooks/useServer";

const AdminPage: NextPage = () => {
    const [showModal, setShowModal] = useState(false);
    const admin = useAdmin();
    const { account, signer, provider } = useAccount();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const [step, setStep] = useState("fundraising");
    const [noDateFlag, setNoDataFlag] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const { projects: fundProjects, retireveProjectsDetails, loading, error } = useProject();
    const { time, getTime } = useServer();

    useEffect(() => {
        (async () => {
            if (provider && account) {
                console.log("FUNDS", account)
                await retireveProjectsDetails()
            }
        })()
    }, [provider, account])

    const showCreatePage = () => {
        setShowModal(true);
    }
    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, [showModal]);

    // deposit function
    const depositAction = useCallback(async (poolAddress: any, investAddress: any, amount: any, investDecimal: any) => {
        try {
            if (account == undefined) {
                alertShow({
                    status: 'failed',
                    content: 'Please connect to the Metamask!'
                })
                return;
            }
            loadingStart();
            const ProjectContractInstance = new Contract(poolAddress, Project.abi, signer);
            const investTokenInstance = new Contract(investAddress, YUSD.abi, signer);

            let investAmount = ethers.utils.parseUnits(amount, investDecimal);
            let approve_investToken = await investTokenInstance.approve(poolAddress, investAmount, {
                gasLimit: 300000
            });
            await approve_investToken.wait();

            ProjectContractInstance.on("ProfitDeposited", (projectAddress, amount, userAddress) => {
                let realAmount = convertWeiToEth(amount, YUSD.decimals);
                if (projectAddress == poolAddress) {
                    alertShow({
                        status: 'success',
                        content: `Deposit ${realAmount} USDC Success!`
                    })
                    loadingEnd();
                }
            });
            await ProjectContractInstance.makeDepositProfit(investAmount, {
                gasLimit: 300000
            });
        } catch (ex) {
            console.log("make depost error: ", ex)
            loadingEnd();
        }
    }, [signer]);

    // add invest token to Metamask
    const addToken = async () => {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: YUSD.address, // The address that the token is at.
                    symbol: YUSD.symbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: YUSD.decimals, // The number of decimals in the token
                    image: YUSD.logo, // A string url of the token logo
                },
            },
        });
    }

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

    useEffect(() => {
        getTime();
    }, [])

    return <div className="w-full admin_page px-6 py-12">
        <h2 className='text-3xl text-white mb-6'>Projects</h2>

        <div>
            <div className='flex justify-end mb-6'>
                <button className="text-white text-center flex justify-center items-center bg-btn-primary cursor-pointer px-4 py-2 rounded mr-2" onClick={showCreatePage}>
                    <BsFillPlusSquareFill className='mr-2' />
                    Create New Project
                </button>
                <button className="text-white text-center flex justify-center items-center bg-btn-primary cursor-pointer px-4 py-2 rounded" onClick={addToken}>
                    <BsFillPlusSquareFill className="mr-2" />
                    Add Invest Token
                </button>
            </div>
            <div id="modal-root"></div>

            <Modal
                show={showModal}
                onClose={handleCloseModal}
                size="md"
            >
                <div className="max-h-[640px] overflow-auto p-2 scroll-smooth scrollbar-w-1.5 scrollbar-thin scrollbar-thumb-dark-primary scrollbar-track-transparent scrollbar-corner-transparent scrollbar-thumb-rounded-full scrollbar-track-p-2">
                    <CreateProjectContent handleClose={handleCloseModal} />
                </div>
            </Modal>
        </div>

        <div className="flex items-center my-6">
            <div className={`bg-primary-pattern ${step == "Fundraising" ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-3 px-5 mr-4 text-base text-white font-medium`} onClick={() => { setStep("Fundraising") }}>Open Projects</div>
            <div className={`bg-primary-pattern ${step == "Ongoing" ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-3 px-5 mr-4 text-base text-white font-medium`} onClick={() => { setStep("Ongoing") }}>Ongoing Projects</div>
            <div className={`bg-primary-pattern ${step == "Closed" ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-3 px-5 mr-4 text-base text-white font-medium`} onClick={() => { setStep("Closed") }}>Closed Projects</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {
                projects.map((item: any, index: number) => {
                    return <Card
                        key={`card-${index}`}
                        item={item}
                        depositAction={depositAction}
                        status={step}
                        admin={true}
                    />
                })
            }
        </div>
        {
            (noDateFlag) ? <NoData className="!h-48 !text-white" text="There is no project" /> : null
        }
    </div>
}

export default AdminPage
