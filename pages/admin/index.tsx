import React, { useState, useCallback, useEffect } from "react";
import type { NextPage } from 'next';
import { BsFillPlusSquareFill } from "react-icons/bs"
import { Contract, ethers } from "ethers";

import CreateProjectContent from '@components/admin/createProject';
import Card from '@components/widgets/Card';
import Modal from '@components/widgets/Modalv2';
import {
    USDCToken,
    Project
} from '../../src/constants/contracts';

import { useAdmin, useAccount, useAlert, useLoading } from '@hooks/index';
import useProject from "@hooks/useFund";
import { convertWeiToEth } from "utils/unit";

const AdminPage: NextPage = () => {
    const [step, setStep] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const admin = useAdmin();
    const { account, signer, rpc_provider } = useAccount();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const { projects, retireveProjectsDetails, loading } = useProject()

    useEffect(() => {
        (async () => {
            if (rpc_provider && account) {
                console.log("FUNDS", account)
                await retireveProjectsDetails()
            }
        })()
    }, [rpc_provider, account])

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
            const investTokenInstance = new Contract(investAddress, USDCToken.abi, signer);

            let investAmount = ethers.utils.parseUnits(amount, investDecimal);
            let approve_investToken = await investTokenInstance.approve(poolAddress, investAmount, {
                gasLimit: 300000
            });
            await approve_investToken.wait();

            ProjectContractInstance.on("ProfitDeposited", (projectAddress, amount, userAddress) => {
                let realAmount = convertWeiToEth(amount, USDCToken.decimals);
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
                    address: USDCToken.address, // The address that the token is at.
                    symbol: 'USDC', // A ticker symbol or shorthand, up to 5 chars.
                    decimals: '6', // The number of decimals in the token
                    // image: 'https://otaris.io/png/otaris_logo.png', // A string url of the token logo
                },
            },
        });
    }

    useEffect(() => {
        console.log(projects);
    }, [projects])

    return <div className="w-full admin_page px-6 py-12">
        <h2 className='text-3xl text-white mb-6'>Projects</h2>

        <div>
            <div className='flex justify-end mb-6'>
                <button className="text-lg text-white text-center flex justify-center items-center bg-btn-primary cursor-pointer px-4 py-2 rounded mr-2" onClick={showCreatePage}>
                    <BsFillPlusSquareFill className='mr-2' />
                    Create New Project
                </button>
                <button className="text-lg text-white text-center flex justify-center items-center bg-btn-primary cursor-pointer px-4 py-2 rounded" onClick={addToken}>
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
            <div className={`bg-primary-pattern ${step == 0 ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-4 px-10 mr-4 text-xl text-white font-medium`} onClick={() => { setStep(0) }}>Open Projects</div>
            <div className={`bg-primary-pattern ${step == 1 ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-4 px-10 mr-4 text-xl text-white font-medium`} onClick={() => { setStep(1) }}>Ongoing Projects</div>
            <div className={`bg-primary-pattern ${step == 2 ? 'bg-secondary-pattern shadow-btn-primary' : ''} cursor-pointer rounded py-4 px-10 mr-4 text-xl text-white font-medium`} onClick={() => { setStep(2) }}>Closed Projects</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {
                step == 0 ?
                    projects.map((item: any, index: number) => {
                        if (item && item.endDate >= Date.now() && item.currentStatus < item.ongoingPercent) {
                            return (
                                <Card key={`card- + ${index}`} item={item} admin={admin} status="open" />
                            )
                        }
                    }) :
                    step == 1 ?
                        projects.map((item: any, index: number) => {
                            if (item && item.currentStatus >= item.ongoingPercent) {
                                return (
                                    <Card key={`card- + ${index}`} item={item} depositAction={depositAction} admin={admin} status="ongoing" />
                                )
                            }
                        }) :
                        projects.map((item: any, index: number) => {
                            if (item && item.endDate < Date.now() && item.currentStatus < item.ongoingPercent) {
                                return (
                                    <Card key={`card- + ${index}`} item={item} admin={admin} status="close" />
                                )
                            }
                        })
            }
        </div>
    </div>
}

export default AdminPage
