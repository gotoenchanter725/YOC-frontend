import axios from 'axios';
import { FC, useEffect, useMemo, useState } from 'react'
import { BsFillPlusSquareFill, BsFillTrashFill, BsPauseCircleFill, BsFillPlayCircleFill } from "react-icons/bs"
import { FcCancel, FcApproval } from "react-icons/fc";
import { BiRefresh } from "react-icons/bi";

import Modal from '@components/widgets/Modalv2';
import SimpleLoading from '@components/widgets/SimpleLoading';
import { useAccount, useAdmin, useLoading, useAlert } from '@hooks/index';

import { CurrencyDataInterface } from '../../src/interfaces/currency';
import { YOC, YOCFarm } from 'src/constants/contracts';
import { Contract } from 'ethers';

type Props = {
    children: React.ReactNode
}

const yocAmountYear = 4.5 * 60 * 24 * 365 * 20;

const AdminFarm: FC<Props> = (props) => {
    const { account, provider } = useAccount();
    const isAdmin = useAdmin();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const [farmPools, setFarmPools] = useState<any>([]);
    const [liquidityPools, setLiquidityPools] = useState([])
    const [currencies, setCurrencies] = useState<CurrencyDataInterface[]>([]);
    const [search, setSearch] = useState("");
    const [selectFarmPool, setSelectFarmPool] = useState(0);
    const [allocPoint, setAllocPoint] = useState(0);
    const [reload, setReload] = useState(0);

    const [loadData, setLoadData] = useState(false);
    const [addFarmModel, setAddFarmModel] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalType, setConfirmModalType] = useState('delete');
    const [confirmModalTitle, setConfirmModalTitle] = useState('');
    const [selectedItem, setSelectedItem] = useState<CurrencyDataInterface>();

    const farmContract = useMemo(() => {
        return new Contract(
            YOCFarm.address,
            YOCFarm.abi,
            provider
        )
    }, []);

    useEffect(() => {
        if (!account || !isAdmin || !farmContract) return;

        (async () => {
            let currencyResponse = await axios.get(process.env.API_ADDRESS + `/admin/currency/all?account=${account}`);
            if (currencyResponse && currencyResponse.data && currencyResponse.data.currencies) {
                setCurrencies(currencyResponse.data.currencies.filter((item: any) => item.isActive === true && item.isDelete === false));
            }

            let liquidityResponse = await axios.get(process.env.API_ADDRESS + `/admin/liquidity/all?account=${account}`);
            if (liquidityResponse && liquidityResponse.data && liquidityResponse.data.liquidities) {
                setLiquidityPools(liquidityResponse.data.liquidities);
            }

            const totalAlloc = await farmContract.totalAllocPoint();
            setLoadData(true);
            let farmResponse = await axios.get(process.env.API_ADDRESS + `/admin/farm/all?account=${account}`);
            if (farmResponse && farmResponse.data && farmResponse.data.pools) {
                let data = farmResponse.data.pools.map((item: any, index: number) => {
                    let yocAmountForCurrentPool = yocAmountYear * item.allocPoint / totalAlloc;
                    let yocUSDAmountForCurrentPool = yocAmountForCurrentPool * currencyResponse.data.currencies.find((currency: any) => currency.address === YOC.address).price;

                    let totalLPAmount = item.liquidity.amount;
                    let totalToken0Amount = item.liquidity.amount0;
                    let totalToken1Amount = item.liquidity.amount1;
                    let LPamountCurrentPool = item.totalLPAmount;
                    let usdToken0Amount = LPamountCurrentPool / totalLPAmount * totalToken0Amount * currencyResponse.data.currencies.find((currency: any) => currency.address === item.liquidity.currency0.address).price;
                    let usdToken1Amount = LPamountCurrentPool / totalLPAmount * totalToken1Amount * currencyResponse.data.currencies.find((currency: any) => currency.address === item.liquidity.currency1.address).price;
                    let APR = yocUSDAmountForCurrentPool / (usdToken0Amount + usdToken1Amount);
                    if (Number(item.totalLPAmount) == 0) APR = 0;

                    console.log('yoc:', LPamountCurrentPool, totalLPAmount, yocUSDAmountForCurrentPool);
                    console.log('token0:', totalToken0Amount, usdToken0Amount);
                    console.log('token1:', totalToken1Amount, usdToken1Amount);
                    console.log("\n");

                    return {
                        ...item,
                        APR
                    };
                })
                setFarmPools([...data]);
            }
            setLoadData(false);
        })();
    }, [account, farmContract, reload, isAdmin]);

    const availableFarmPools = useMemo(() => {
        if (!liquidityPools.length || !isAdmin) return [];
        let result = liquidityPools.map((item: any) => {
            let state = farmPools.some((ele: any) => {
                return (ele.liquidity.id == item.id)
            });
            return {
                ...item,
                disable: !item.disable ? state : item.disable,
            }
        });
        return result;
    }, [liquidityPools, farmPools, isAdmin]);

    const addFarmHandle = async () => {
        if (selectFarmPool == -1 || allocPoint <= 0) {
            alertShow({ content: 'Please input the all field!', status: 'failed' });
            return;
        }
        loadingStart();

        let farmDetail: any = liquidityDetail(selectFarmPool);
        let res = await axios.post(process.env.API_ADDRESS + "/admin/farm/add", {
            account: account,
            isYoc: farmDetail.isYoc,
            pairAddress: farmDetail.pairAddress,
            liquidityId: selectFarmPool,
            allocPoint
        })
        setAddFarmModel(false);
        setReload(reload + 1);
        loadingEnd();
    }

    const stateFarmHandleUI = (item: any) => {
        setSelectedItem(item);
        setConfirmModalTitle('Are you sure you want to change the status of this farm pool?');
        setShowConfirmModal(true);
        setConfirmModalType('state');
    }
    const stateFarmHandle = async (item: any) => {
        let data = {
            account,
            ...item,
            isActive: !item.isActive
        };
        loadingStart();
        var res = await axios.post(process.env.API_ADDRESS + '/admin/farm/state', data);
        loadingEnd();
        if (res && res.data) {
            setShowConfirmModal(false);
            setReload(reload + 1);
        }
    }

    const deleteFarmHandleUI = (item: any) => {
        setSelectedItem(item);
        setConfirmModalTitle('Are you sure you want to delete this farm pool?');
        setShowConfirmModal(true);
        setConfirmModalType('delete');
    }
    const deleteFarmHandle = async (item: any) => {
        loadingStart();
        var res = await axios.delete(process.env.API_ADDRESS + `/admin/farm/delete?account=${account}&id=${item.id}`);
        loadingEnd();
        if (res && res.data) {
            setShowConfirmModal(false);
            setReload(reload + 1);
        }
    }

    const liquidityDetail = (id: any) => {
        let result = liquidityPools.find((item: any) => item.id == id);
        if (result) return result;
        return null;
    }

    return <div className="w-full px-6 py-12">
        <div className='w-full flex-col'>
            <h2 className='text-3xl text-white mb-6'>Farm</h2>
            <div className='w-full flex justify-between mb-6'>
                <div className="relative w-[400px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input value={search} onChange={(e: any) => { setSearch(e.target.value) }} type="search" id="default-search" className="block w-full px-4 py-2 pl-10 text-sm border border-btn-primary rounded bg-transparent placeholder-gray-400 text-white focus:ring-btn-primary focus:border-btn-primary" placeholder="Search the pool" required />
                </div>
                <div className='flex'>
                    <button className='text-2xl font-black text-white text-center flex justify-center items-center bg-btn-primary cursor-pointer px-2 py-1 rounded' onClick={() => { setReload(reload + 1) }} >
                        <BiRefresh />
                    </button>
                    <button className='text-lg text-white text-center flex justify-center items-center bg-btn-primary cursor-pointer px-4 py-2 rounded ml-2' onClick={() => { setAddFarmModel(true) }} >
                        <BsFillPlusSquareFill className='mr-2' />
                        Create New Farm
                    </button>
                </div>
            </div>

            <div className='w-full overflow-auto'>
                <table className='min-w-full text-white border border-[#373a40]'>
                    <thead>
                        <tr className='bg-[#1a1b1e] border-b border-[#373a40]'>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>No</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Pool ID</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Token0</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Token1</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Multiplier</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Amount</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>APR</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Created On</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>State</td>
                            <td className='px-4 py-2 font-bold text-lg'>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loadData ?
                                <tr>
                                    <td className='p-4' colSpan={9}>
                                        <div className='w-full flex items-center justify-center'><SimpleLoading className='w-[30px]' /></div>
                                    </td>
                                </tr>
                                : (
                                    farmPools.length ?
                                        farmPools.map((item: any, index: number) => {
                                            return <tr className={`border-t border-[#373a40] ${index % 2 === 0 ? 'bg-[#25262b]' : ''} font-extralight`} key={'row-' + index}>
                                                <td className='p-4 border-r border-[#373a40]'>{index + 1}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.poolId}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.liquidity.currency0.symbol}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.liquidity.currency1.symbol}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.allocPoint}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.totalLPAmount}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.APR ? item.APR : ''}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.createdAt}</td>
                                                <td className='p-4 border-r border-[#373a40]'><div className='w-full flex justify-center text-xl'>{item.isActive ? <FcApproval /> : <FcCancel />}</div></td>
                                                <td className=''>
                                                    <div className='flex justify-center'>
                                                        {/* <button onClick={() => deleteFarmHandleUI(item)} className='p-2 rounded bg-btn-primary mr-2'><BsFillTrashFill /></button> */}
                                                        {
                                                            item.isActive === true ?
                                                                <button onClick={() => stateFarmHandleUI(item)} className='p-2 rounded bg-btn-primary '><BsFillPlayCircleFill /></button>
                                                                :
                                                                <button onClick={() => stateFarmHandleUI(item)} className='p-2 rounded bg-btn-primary '><BsPauseCircleFill /></button>
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        })
                                        :
                                        <tr>
                                            <td className='p-4' colSpan={9}>
                                                <p className='w-full text-center'>There is no data</p>
                                            </td>
                                        </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>

            <Modal show={addFarmModel} onClose={() => { setAddFarmModel(false) }}>
                <div className='w-full bg-bg-pattern px-6 py-12'>
                    <h2 className='text-2xl text-white mb-6'>Add Farm Pool</h2>
                    <div className='flex gap-6 mb-4'>
                        <select className='w-full font-semibold rounded text-primary bg-transparent border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2'
                            onChange={(e) => { setSelectFarmPool(+e.target.value) }}
                        >
                            <option className='p-2 bg-dark-primary' value={''}></option>
                            {
                                availableFarmPools.map((item: any, index: number) => {
                                    return <option key={'first-' + index} disabled={item.disable} className='p-2 bg-dark-primary' value={item.id}>
                                        {item.currency0.symbol} / ({item.currency1.symbol})
                                    </option>
                                })
                            }
                        </select>
                    </div>
                    <div className='flex flex-col mb-6'>
                        <label className='text-white mb-2'>Alloc Point <span className='text-[#DD6F60]'>*</span></label>
                        <input type={'number'} value={allocPoint} onChange={(e: any) => setAllocPoint(e.target.value)} className='text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2' placeholder='' />
                    </div>
                    <div className="flex justify-between gap-6">
                        <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => { setAddFarmModel(false) }}>Cancel</button>
                        <button onClick={() => { addFarmHandle() }} className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2">Add</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showConfirmModal} onClose={() => { setShowConfirmModal(false) }}>
                <div className='w-full bg-bg-pattern p-8'>
                    <h2 className='text-xl text-center text-white mb-6'>{confirmModalTitle}</h2>
                    <div className="flex justify-between gap-6 mt-6">
                        <button className="w-[120px] font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => { setShowConfirmModal(false) }}>Cancel</button>
                        <button onClick={() => { confirmModalType === 'delete' ? deleteFarmHandle(selectedItem) : stateFarmHandle(selectedItem) }} className="w-[120px] font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2">{confirmModalType === 'delete' ? 'Delete' : ((selectedItem && selectedItem.isActive) ? 'Disable' : 'Enable')}</button>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
};

export default AdminFarm;