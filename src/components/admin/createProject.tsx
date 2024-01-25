import React, { FC, useRef, useState, useEffect, useCallback } from "react";
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { Contract, ethers } from "ethers";
import axios from "axios";

import Button from "../widgets/Button";
import { ProjectManager, ProjectTrade, YUSD } from "../../constants/contracts";
import useAccount from "@hooks/useAccount";
import useLoading from "@hooks/useLoading";
import useAlert from "@hooks/useAlert";
import useProject from "@hooks/useFund";
let client: IPFSHTTPClient | undefined;

const projectId: string = "2ElEf722K2XXys4wa0SkMsbHByw";
const projectSecret: string = "2557e5c74008f3d847e3c5ba9ccddb59";
const authorization: string = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString('base64');

type Props = {
    handleClose: () => void;
}

const CreateProjectContent: FC<Props> = ({ handleClose }) => {
    const { account, signer, provider } = useAccount();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert()
    const { updateProjectInfoByAddress } = useProject();

    const tokenIconRef = useRef<HTMLInputElement>(null);
    const tokenSymbolRef = useRef<HTMLInputElement>(null);

    const [tokenIconImage, setTokenIconImage] = useState<string>("");
    const [tokenSymbolImage, setTokenSymbolImage] = useState<string>("");

    const [tokenIPFSIconImage, setTokenIPFSIconImage] = useState<string>("");
    const [tokenIPFSSymbolImage, setTokenIPFSSymbolImage] = useState<string>("");

    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [decimals, setDecimal] = useState<string>("");
    const [roi, setRoi] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [total, setTotal] = useState<string>("");
    const [sellPercent, setSellPercent] = useState<string>("");
    const [ongoingPercent, setOngoingPercent] = useState<string>("70");
    const [sellAmount, setShowAmount] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [multiplier, setMultiplier] = useState<string>("");
    const [projectAddress, setProjectAddress] = useState<string>(String(account));
    const [projectWebsite, setProjectWebsite] = useState<string>("");

    const [creatingProject, setCreatingProject] = useState(false);

    const addIcon = () => {
        tokenIconRef.current?.click();
    };
    const addSymbol = () => {
        tokenSymbolRef.current?.click();
    };

    const handleTokenIconSelect = (e: any) => {
        let reader = new FileReader();
        let files = e.target.files;
        reader.onload = async () => {
            setTokenIconImage(reader.result as string);
        }
        setTokenIPFSIconImage(files[0]);
        if (files.length) reader.readAsDataURL(files[0]);
    }
    const handleTokenSymbolSelect = (e: any) => {
        let reader = new FileReader();
        let files = e.target.files;
        reader.onload = async () => {
            setTokenSymbolImage(reader.result as string);
        }
        setTokenIPFSSymbolImage(files[0]);
        if (files.length) reader.readAsDataURL(files[0]);
    }

    const createProject = async () => {
        try {
            if (!account) {
                alertShow({
                    status: 'failed',
                    content: 'Please connect to the Metamask!'
                })
                return;
            }

            if (!title || !desc || !category || !decimals || !roi || !startDate || !endDate || !tokenIconImage || !tokenSymbolImage || !total || !sellPercent || +price < 0 || !ongoingPercent || !multiplier || !projectAddress) {
                alertShow({
                    status: 'failed',
                    content: 'Please input correct data'
                })
                return;
            }

            setCreatingProject(true);
            client = create({
                url: "https://ipfs.infura.io:5001/api/v0",
                headers: {
                    authorization,
                },
            });

            const icon = await client.add(tokenIPFSIconImage);
            const iconUrl = `https://infura-ipfs.io/ipfs/${icon.path}`;

            const symbol = await client.add(tokenIPFSSymbolImage);
            const symbolUrl = `https://infura-ipfs.io/ipfs/${symbol.path}`;

            const ProjectManagerContract = new Contract(ProjectManager.address, ProjectManager.abi, signer);

            const gasPrice = await provider.getGasPrice();
            let createProjectEstimate = await ProjectManagerContract.estimateGas.createProject(
                `${title} Token`,
                title,
                ethers.utils.parseUnits(total, decimals),
                ethers.utils.parseUnits(decimals, 0),
                ethers.utils.parseUnits(((Number(total) * Number(sellPercent)) / 100).toFixed(2), decimals),
                [title, desc, category, projectWebsite, iconUrl, symbolUrl],
                [ethers.utils.parseUnits(price, 3), ethers.utils.parseUnits(roi, 0), ethers.utils.parseUnits(startDate, 0), ethers.utils.parseUnits(endDate, 0), ongoingPercent, multiplier],
                [YUSD.address, projectAddress]
            );
            const gasLimit = createProjectEstimate.mul(120).div(100);
            console.log(+gasPrice / 10 ** 18, +gasLimit, +gasPrice * +gasLimit / 10 ** 18);
            const createProjectTransaction = await ProjectManagerContract.createProject(
                `${title} Token`,
                title,
                ethers.utils.parseUnits(total, decimals),
                ethers.utils.parseUnits(decimals, 0),
                ethers.utils.parseUnits(((Number(total) * Number(sellPercent)) / 100).toFixed(2), decimals),
                [title, desc, category, projectWebsite, iconUrl, symbolUrl],
                [ethers.utils.parseUnits(price, 3), ethers.utils.parseUnits(roi, 0), ethers.utils.parseUnits(startDate, 0), ethers.utils.parseUnits(endDate, 0), ongoingPercent, multiplier],
                [YUSD.address, projectAddress],
                { gasLimit: gasLimit, gasPrice: gasPrice } // Set the gas limit here
            );
            const createProjectReceipt = await createProjectTransaction.wait();
            console.log(createProjectReceipt);
            setCreatingProject(false);

            loadingStart();
            const eventlistencer = async (owner: any, contractAddr: any, tokenAddr: any) => {
                console.log("DeployedNewProject", owner, account, contractAddr, tokenAddr);
                if (owner == account) {
                    let data = {
                        projectTitle: title,
                        iconUrl: iconUrl,
                        ptokenAddress: tokenAddr,
                        address: contractAddr,
                        decimals,
                        totalSupply: total,
                        sellAmount: ((Number(total) * Number(sellPercent)) / 100).toFixed(2),
                        price: price,
                        endDate: endDate,
                        multiplier: multiplier,
                        projectAddress: projectAddress
                    }
                    try {
                        let respons = await axios.post(process.env.API_ADDRESS + '/project/create', data);
                        console.log(respons);
                    } catch (error) {
                        console.log(error)
                    }

                    alertShow({
                        status: 'success',
                        content: 'Project Create Success!'
                    })
                    updateProjectInfoByAddress(contractAddr);
                    loadingEnd();
                    ProjectManagerContract.removeListener("DeployedNewProject", eventlistencer);
                }
            }
            ProjectManagerContract.on('DeployedNewProject', eventlistencer);

        } catch (ex) {
            loadingEnd();
            console.log("create project error: ", ex)
        }
    };

    const cancelProject = () => {
        handleClose();
        console.log("cancel Action");
    }

    useEffect(() => {
        try {
            console.log(total, sellPercent);
            setShowAmount(((Number(total) * Number(sellPercent)) / 100).toString());
        } catch (ex) {

        }
    }, [total, sellPercent])

    return <div className="new_project_modal">
        {
            creatingProject ? (
                <div className="create_loading-spin !bg-[#ffffff1e]">
                    <img className="loading-icon w-8" src="/images/simple-loading3.gif" alt="loading" />
                </div>
            ) : ''
        }
        <div className="new_project_container px-4 gap-2">
            <div className='input_field left_input_field'>
                <div className="input_control title">
                    <label htmlFor="">Title</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="input_control description">
                    <label htmlFor="">Description</label>
                    <textarea className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className="input_control category">
                    <label htmlFor="">Category</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2" type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="input_control decimals">
                    <label htmlFor="">Decimals</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2" type="number" value={decimals} onChange={(e) => setDecimal(e.target.value)} />
                </div>
                <div className="input_control Breakeven">
                    <label htmlFor="">Breakeven</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2" type="number" value={roi} onChange={(e) => setRoi(e.target.value)} />
                </div>
                <div className="input_control start_date">
                    <label htmlFor="">Start Date</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2" type="date" onChange={(e) => setStartDate(new Date(e.target.value).getTime().toString())} />
                </div>
                <div className="input_control end_date">
                    <label htmlFor="">End Date</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2" type="date" onChange={(e) => setEndDate(new Date(e.target.value).getTime().toString())} />
                </div>
            </div>
            <div className='input_field right_input_field'>
                <div className='d-flex'>
                    <div className="input_control add_icon mr-4">
                        <label htmlFor="">Token Icon</label>
                        <input className="icon_file" type="file" ref={tokenIconRef} onChange={handleTokenIconSelect} />
                        {tokenIconImage ?
                            <img className='icon_image' src={tokenIconImage} onClick={addIcon} alt="ADD ICON" /> :
                            <div className='icon_image rounded border border-[#FFFFFF22] text-white !bg-transparent bg-primary-pattern' onClick={addIcon}><span className="text-white">ADD ICON</span></div>
                        }
                    </div>
                    <div className="input_control add_symbol">
                        <label htmlFor="">Token Symbol</label>
                        <input className="symbol_file" type="file" ref={tokenSymbolRef} onChange={handleTokenSymbolSelect} />
                        {tokenSymbolImage ?
                            <img className='symbol_image' src={tokenSymbolImage} onClick={addSymbol} alt="ADD SYMBOL" /> :
                            <div className='symbol_image rounded border border-[#FFFFFF22] text-white !bg-transparent bg-primary-pattern' onClick={addSymbol}><span className="text-white">ADD SYMBOL</span></div>
                        }
                    </div>

                </div>
                <div className='d-flex gap-4 supply_sold'>
                    <div className="input_control total_supply">
                        <label htmlFor="">Total Supply of Tokens</label>
                        <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
                    </div>
                    <div className="input_control percent_sold">
                        <label htmlFor="">Percentage of Tokens to be sold</label>
                        <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="number" min={0} max={100} placeholder='70%' value={sellPercent} onChange={(e) => setSellPercent(e.target.value)} />
                    </div>
                </div>
                <div className='d-flex gap-4 amount_price'>
                    <div className="input_control price sold_amount">
                        <label htmlFor="">Amount of tokens to be sold</label>
                        <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="text" value={sellAmount} onChange={(e) => { }} />
                    </div>
                    <div className="input_control price">
                        <label htmlFor="">Price (Tokens for 1 {YUSD.symbol})</label>
                        <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                </div>
                <div className="input_control wallet">
                    <label htmlFor="">Ongoing Percentage</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="number" min={0} max={100} placeholder='70%' value={ongoingPercent} onChange={(e) => setOngoingPercent(e.target.value)} />
                </div>
                <div className="input_control wallet">
                    <label htmlFor="">Multiplier</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="number" min={0} max={100} placeholder='10' value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
                </div>
                <div className="input_control address">
                    <label htmlFor="">Project Wallet</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="text" value={projectAddress} onChange={(e) => setProjectAddress(e.target.value)} />
                </div>
                <div className="input_control website">
                    <label htmlFor="">Project website</label>
                    <input className="text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none" type="text" value={projectWebsite} onChange={(e) => setProjectWebsite(e.target.value)} />
                </div>
            </div>
        </div>
        <div className='flex justify-end p-4'>
            <Button className="!bg-btn-primary !rounded mr-2" text='Create' bgColor='#00e500' onClick={createProject} />
            <Button className="!bg-btn-primary disabled !rounded" text='Cancel' bgColor='#d3cbcb' onClick={cancelProject} />
        </div>
    </div>
}

export default CreateProjectContent;
