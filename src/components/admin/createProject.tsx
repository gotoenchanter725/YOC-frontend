import React, { FC, useRef, useState, useEffect } from "react";
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { useDispatch, useSelector } from "react-redux";
import { Contract, ethers } from "ethers";
import axios from "axios";

import Button from "../widgets/Button";
import { ProjectManager } from "../../constants/contracts";
import { addNewProject } from "../../../store/actions";
let client: IPFSHTTPClient | undefined;

const projectId: string = "2ElEf722K2XXys4wa0SkMsbHByw";
const projectSecret: string = "2557e5c74008f3d847e3c5ba9ccddb59";
const authorization: string = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString('base64');

type Props = {
    handleClose: () => void;
}

const CreateProjectContent: FC<Props> = ({ handleClose }) => {
    const dispatch = useDispatch();
    const { projects, account, signer, rpc_provider } = useSelector((state: any) => state.data);
    const tokenIconRef = useRef<HTMLInputElement>(null);
    const tokenSymbolRef = useRef<HTMLInputElement>(null);

    const [tokenIconImage, setTokenIconImage] = useState<string>("");
    const [tokenSymbolImage, setTokenSymbolImage] = useState<string>("");

    const [tokenIPFSIconImage, setTokenIPFSIconImage] = useState<string>("");
    const [tokenIPFSSymbolImage, setTokenIPFSSymbolImage] = useState<string>("");

    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [decimal, setDecimal] = useState<string>("");
    const [roi, setRoi] = useState<string>("");
    const [apr, setApr] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [total, setTotal] = useState<string>("");
    const [sellPercent, setSellPercent] = useState<string>("");
    const [sellAmount, setShowAmount] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [tokenAddr, setTokenAddr] = useState<string>("");
    const [tokenWallet, setTokenWallet] = useState<string>("");
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
                alert("Please connect to the Metamask!");
                return;
            }

            if (!title || !desc || !category || !decimal || !roi || !apr || !startDate || !endDate || !tokenIconImage || !tokenSymbolImage || !total || !sellPercent || !tokenWallet || +price < 0) {
                alert("Please input correct data");
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

            let createProject = await ProjectManagerContract.createProject(
                `${title} Token`,
                title,
                ethers.utils.parseUnits(total, decimal),
                ethers.utils.parseUnits(decimal, 0),
                ethers.utils.parseUnits(((Number(total) * Number(sellPercent)) / 100).toFixed(2), decimal),
                [title, desc, category, projectWebsite, iconUrl, symbolUrl],
                [ethers.utils.parseUnits(price, 3), ethers.utils.parseUnits(roi, 0), ethers.utils.parseUnits(apr, 0), ethers.utils.parseUnits(startDate, 0), ethers.utils.parseUnits(endDate, 0)],
                tokenWallet,
                { gasLimit: 5000000 }
            );

            await createProject.wait();

            setCreatingProject(false);
            let data = {
                projectTitle: title, iconUrl
            }
            axios.post(process.env.API_ADDRESS + '/project/create', data).then(res => {
                console.log(res);
            });
            alert("Project Create Success!");
            console.log(createProject);

        } catch (ex) {
            console.log("create project error: ", ex)
        }
    };

    useEffect(() => {
        if (rpc_provider) {
            const ProjectManagerContract = new Contract(ProjectManager.address, ProjectManager.abi, rpc_provider);
            ProjectManagerContract.on('DeployedNewProject', (owner: any, contractAddr: any, tokenAddr: any) => {
                if (owner == account) {
                    setTokenAddr(tokenAddr);
                }
    
                dispatch(addNewProject(projects, contractAddr, account) as any);
            })
        }
    }, [rpc_provider]);

    const cancelProject = () => {
        handleClose();
        console.log("cancel Action");
    }

    useEffect(() => {
        try {
            setShowAmount(((Number(total) * Number(sellPercent)) / 100).toString());
        } catch (ex) {

        }
    }, [total, sellPercent])

    return <div className="new_project_modal">
        {
            creatingProject ? (
                <div className="create_loading-spin">
                    <img className="loading-icon" src="/images/loading-icon.gif" alt="loading" />
                </div>
            ) : ''
        }
        <div className="new_project_container px-2">
            <div className='input_field left_input_field'>
                <div className="input_control title">
                    <label htmlFor="">Title</label>
                    <input className="px-2 py-1.5 rounded outline-none" type="text" onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="input_control description">
                    <label htmlFor="">Description</label>
                    <textarea className="px-2 py-1.5 rounded" rows={5} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className="input_control category">
                    <label htmlFor="">Category</label>
                    <input className="px-2 py-1.5 rounded" type="text" onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="input_control decimal">
                    <label htmlFor="">Decimals</label>
                    <input className="px-2 py-1.5 rounded" type="number" onChange={(e) => setDecimal(e.target.value)} />
                </div>
                <div className="input_control ROI">
                    <label htmlFor="">ROI</label>
                    <input className="px-2 py-1.5 rounded" type="number" onChange={(e) => setRoi(e.target.value)} />
                </div>
                <div className="input_control APR">
                    <label htmlFor="">APR</label>
                    <input className="px-2 py-1.5 rounded" type="number" onChange={(e) => setApr(e.target.value)} />
                </div>
                <div className="input_control start_date">
                    <label htmlFor="">Start Date</label>
                    <input className="px-2 py-1.5 rounded" type="date" onChange={(e) => setStartDate(new Date(e.target.value).getTime().toString())} />
                </div>
                <div className="input_control end_date">
                    <label htmlFor="">End Date</label>
                    <input className="px-2 py-1.5 rounded" type="date" onChange={(e) => setEndDate(new Date(e.target.value).getTime().toString())} />
                </div>
            </div>
            <div className='input_field right_input_field'>
                <div className='d-flex justify-between'>
                    <div className="input_control add_icon">
                        <label htmlFor="">Token Icon</label>
                        <input className="icon_file" type="file" ref={tokenIconRef} onChange={handleTokenIconSelect} />
                        {tokenIconImage ?
                            <img className='icon_image' src={tokenIconImage} onClick={addIcon} alt="ADD ICON" /> :
                            <div className='icon_image' onClick={addIcon}><span>ADD ICON</span></div>
                        }
                    </div>
                    <div className="input_control add_symbol">
                        <label htmlFor="">Token Symbol</label>
                        <input className="symbol_file" type="file" ref={tokenSymbolRef} onChange={handleTokenSymbolSelect} />
                        {tokenSymbolImage ?
                            <img className='symbol_image' src={tokenSymbolImage} onClick={addSymbol} alt="ADD SYMBOL" /> :
                            <div className='symbol_image' onClick={addSymbol}><span>ADD SYMBOL</span></div>
                        }
                    </div>

                </div>
                <div className='d-flex supply_sold'>
                    <div className="input_control total_supply">
                        <label htmlFor="">Total Supply of Tokens</label>
                        <input className="px-2 py-1.5 rounded" type="number" onChange={(e) => setTotal(e.target.value)} />
                    </div>
                    <div className="input_control percent_sold">
                        <label htmlFor="">Percentage of Tokens to be sold</label>
                        <input className="!w-[130px] px-2 py-1.5" type="number" min={0} max={100} onChange={(e) => setSellPercent(e.target.value)} />
                        <span className="text-2xl">%</span>
                    </div>
                </div>
                <div className='d-flex amount_price'>
                    <div className="input_control price sold_amount">
                        <label htmlFor="">Amount of tokens to be sold</label>
                        <input className="px-2 py-1.5 rounded" type="text" defaultValue={sellAmount} />
                    </div>
                    <div className="input_control price">
                        <label htmlFor="">Price (Tokens for 1 USDC)</label>
                        <input className="px-2 py-1.5 rounded" type="number" onChange={(e) => setPrice(e.target.value)} />
                    </div>

                </div>
                <div className="input_control address">
                    <label htmlFor="">Token Address</label>
                    <input className="px-2 py-1.5 rounded" type="text" defaultValue={tokenAddr} />
                </div>
                <div className="input_control wallet">
                    <label htmlFor="">Invest Token Address</label>
                    <input className="px-2 py-1.5 rounded" type="text" onChange={(e) => setTokenWallet(e.target.value)} />
                </div>
                <div className="input_control website">
                    <label htmlFor="">Project website</label>
                    <input className="px-2 py-1.5 rounded" type="text" onChange={(e) => setProjectWebsite(e.target.value)} />
                </div>
            </div>
        </div>
        <div className='flex justify-end px-2 !my-4'>
            <Button className="!bg-[#176cb9] !rounded mr-2" text='Create' bgColor='#00e500' onClick={createProject} />
            <Button className="!bg-[#2d332ece] !rounded" text='Cancel' bgColor='#d3cbcb' onClick={cancelProject} />
        </div>
    </div>
}

export default CreateProjectContent;
