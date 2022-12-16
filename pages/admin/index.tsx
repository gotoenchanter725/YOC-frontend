import type { NextPage } from 'next';
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from '../../src/components/common/Navbar';
import Footer from '../../src/components/common/Footer';
import Modal from '../../src/components/widgets/Modal';
import { BsFillPlusSquareFill } from "react-icons/bs"

import CreateProjectContent from '../../src/components/admin/createProject';
import Card from '../../src/components/widgets/Card';
import { Contract, ethers } from "ethers";
import {
    USDCToken,
    Project,
    AdminWalletAddress
} from '../../src/constants/contracts';

const AdminPage: NextPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [admin, setAdmin] = useState<boolean>(false);

    const { projects, account, signer } = useSelector((state: any) => state.data);

    useEffect(() => {

        if (account == undefined) {
            setAdmin(false);
            return;
        }

        if (AdminWalletAddress?.toUpperCase() != account?.toUpperCase()) {
            setAdmin(false);
            alert("Connected Wallet is not Admin Wallet.");
            return;
        }

        setAdmin(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    const showCreatePage = () => {
        setShowModal(true);
    }
    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, [showModal]);

    // deposit function
    const depositAction = async (poolAddress: any, investAddress: any, amount: any, investDecimal: any) => {
        try {
            if (account == undefined) {
                alert("Please connect to the Metamask!");
                return;
            }
            const ProjectContractInstance = new Contract(poolAddress, Project.abi, signer);
            const investTokenInstance = new Contract(investAddress, USDCToken.abi, signer);

            let investAmount = ethers.utils.parseUnits(amount, investDecimal);
            let approve_investToken = await investTokenInstance.approve(poolAddress, investAmount);
            await approve_investToken.wait();

            let participate = await ProjectContractInstance.makeDepositProfit(investAmount);
            await participate.wait();

            alert("Deposit Success!");
        } catch (ex) {
            console.log("make depost error: ", ex)
        }
    }

    return <div>
        <Navbar />
        {
            admin ?
                <div className="container admin_page">
                    <div>
                        <p className="create_project_btn" onClick={showCreatePage}>
                            <BsFillPlusSquareFill />
                            Create New Project
                        </p>
                        <div id="modal-root"></div>

                        <Modal
                            show={showModal}
                            onClose={handleCloseModal}
                            title="Create New Project"
                        >
                            <div className="modal_content">
                                <CreateProjectContent handleClose={handleCloseModal} />
                            </div>
                        </Modal>
                    </div>
                    <div className='project-list open-projects'>
                        <p className="title">Open Projects</p>
                        <div className="card-list">
                            {
                                projects.map((item: any, index: number) => {
                                    if (item.endDate >= Date.now() && item.currentStatus < 70) {
                                        return (
                                            <Card key={`card- + ${index}`} item={item} admin={admin} status="open" />
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className='project-list open-projects'>
                        <p className="title">Ongoing Projects</p>
                        <div className="card-list">
                            {
                                projects.map((item: any, index: number) => {
                                    if (item.currentStatus >= 70) {
                                        return (
                                            <Card key={`card- + ${index}`} item={item} depositAction={depositAction} admin={admin} status="ongoing" />
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className='project-list close-projects'>
                        <p className="title">Closed Projects</p>
                        <div className="card-list">
                            {
                                projects.map((item: any, index: number) => {
                                    if (item.endDate < Date.now() && item.currentStatus < 70) {
                                        return (
                                            <Card key={`card- + ${index}`} item={item} admin={admin} status="close" />
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div> :
                <></>
        }
        <Footer />
    </div>
}

export default AdminPage
