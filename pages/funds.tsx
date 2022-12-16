import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsFillPlusSquareFill } from "react-icons/bs";
import { Contract, ethers } from "ethers";
import {
    USDCToken,
    Project,
    TokenTemplate, 
    AdminWalletAddress
} from "../src/constants/contracts";
import Footer from "../src/components/common/Footer";
import Navbar from "../src/components/common/Navbar";
import Card from "../src/components/widgets/Card";
import ShowMoreIcon from "../src/components/widgets/ShowMoreIcon";
import { projectInfos } from "../store/actions";


const Fund: FC = () => {
    const dispatch = useDispatch();

    const { projects, signer, account, rpc_provider } = useSelector((state: any) => state.data);

    const [loading, setLoading] = useState(false);

    const [showMoreFlag, setShowMoreFlag] = useState(false);

    // for project 1 buy function
    const buyToken = async (amount: any, tokenPrice: any, poolAddress: string, investAddress: string, investDecimal: any, shareDecimal: any) => {
        if (account == undefined) {
            alert("Please connect to the Metamask!");
            return;
        } else if (account == AdminWalletAddress) {
            console.log("Admin can't buy token");
            return;
        }
        const ProjectContractInstance = new Contract(poolAddress, Project.abi, signer);
        const investTokenInstance = new Contract(investAddress, USDCToken.abi, signer);
        let investAmount = ethers.utils.parseUnits(amount, investDecimal);
        let shareAmount = ethers.utils.parseUnits((amount * tokenPrice).toFixed(2), shareDecimal);
        try {
            let approve_investToken = await investTokenInstance.approve(poolAddress, investAmount);
            setLoading(true);
            await approve_investToken.wait();

            let participate = await ProjectContractInstance.participate(investAmount, shareAmount);
            await participate.wait();
            setLoading(false);

        } catch (ex) {
            setLoading(false);
            console.log("buy token error: ", ex)
        }
    }

    // for project 1 refund function
    const refund = async (poolAddress: string, tokenPrice: any, shareAddress: string, investDecimal: any, shareDecimal: any) => {
        if (account == undefined) {
            alert("Please connect to the Metamask!");
            return;
        }
        const ProjectContractInstance = new Contract(poolAddress, Project.abi, signer);
        const shareTokenInstance = new Contract(shareAddress, TokenTemplate.abi, signer);

        let shareAmount = await shareTokenInstance.balanceOf(account);
        let shareAmountToEth = Number(ethers.utils.formatUnits(shareAmount, shareDecimal));
        if (shareAmountToEth == 0) {
            alert(`Your balance is zero!`);
            return
        }

        try {
            let investAmount = ethers.utils.parseUnits((shareAmountToEth / tokenPrice).toString(), investDecimal)

            let approve_ytest = await shareTokenInstance.approve(poolAddress, shareAmount);
            setLoading(true);
            await approve_ytest.wait();

            let refund = await ProjectContractInstance.refund(shareAmount, investAmount);
            await refund.wait();
            setLoading(false);
        } catch (ex) {
            setLoading(false);
        }
    }

    // claim function
    const claim = async (poolAddress: string) => {
        if (account == undefined) {
            alert("Please connect to the Metamask!");
            return;
        }
        const ProjectContractInstance = new Contract(poolAddress, Project.abi, signer);
        try {
            setLoading(true);
            let claim = await ProjectContractInstance.claim();
            await claim.wait();
            setLoading(false);
        } catch (ex) {
            setLoading(false);
        }
    }

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
        if (account && rpc_provider) {
            dispatch(projectInfos(account, rpc_provider) as any)
        }
    }, [account, dispatch, rpc_provider])

    return <div>
        <Navbar />
        <div className="container">
            <p className="title">
                Welcome to the new investment world where you can be part of Your Own Company
            </p>
            <p className="add_token_btn" onClick={addToken}>
                <BsFillPlusSquareFill />
                Add Invest Token
            </p>
            <div className="project-list open-projects">
                <p className="title">Open Projects</p>
                <div className="card-list">
                    {
                        projects.filter((item: any) => item.endDate >= Date.now() && item.currentStatus < 70).map((item: any, index: number) => {
                            return (
                                <Card key={`card- + ${index}`} item={item} poolAddress={item} buyAction={buyToken} provider={rpc_provider} status="open" />
                            )
                        })
                    }
                </div>
            </div>
            <div className="project-list ongoing-projects">
                <p className="title">Ongoing Projects</p>
                <div className="card-list">
                    {
                        projects.filter((item: any) => item.currentStatus >= 70).map((item: any, index: number) => {
                            return (
                                <Card key={`card- + ${index}`} item={item} poolAddress={item} buyAction={buyToken} claimAction={claim} provider={rpc_provider} status="ongoing" />
                            )
                        })
                    }
                </div>
            </div>
            <div className="project-list close-projects">
                <p className="title">Closed Projects</p>
                <div className="card-list">
                    {
                        projects.filter((item: any) => item.endDate < Date.now() && item.currentStatus < 70).map((item: any, index: number) => {
                            return (
                                <Card key={`card- + ${index}`} item={item} poolAddress={item} refundAction={refund} provider={rpc_provider} status="close" />
                            )
                        })
                    }
                </div>
            </div>
            {
                showMoreFlag ? <ShowMoreIcon text="Show More" /> : null
            }
        </div>
        <Footer />
    </div>
}

export default Fund;