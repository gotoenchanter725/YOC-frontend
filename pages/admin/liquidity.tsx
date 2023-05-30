import axios from 'axios';
import { FC, useEffect, useMemo, useState } from 'react'
import { BsFillPlusSquareFill, BsFillTrashFill, BsPauseCircleFill, BsFillPlayCircleFill } from "react-icons/bs"
// import { FcCancel, FcApproval } from "react-icons/fc";
import { BiRefresh } from "react-icons/bi";

import Modal from '@components/widgets/Modalv2';
import SimpleLoading from '@components/widgets/SimpleLoading';
import { useAccount, useAdmin, useLoading } from '@hooks/index';

import { CurrencyDataInterface, LiquidityDataInterface } from '../../src/interfaces/currency';
import { YOC } from 'src/constants/contracts';

type Props = {
    children: React.ReactNode
}

const AdminLiquidity: FC<Props> = (props) => {
    const { account } = useAccount();
    const isAdmin = useAdmin();
    const { loadingStart, loadingEnd } = useLoading();
    const [liquidityPools, setLiquidityPools] = useState<LiquidityDataInterface[]>([]);
    const [search, setSearch] = useState("");
    const [token0, setToken0] = useState(0);
    const [token1, setToken1] = useState(0);
    const [currencies, setCurrencies] = useState<CurrencyDataInterface[]>([]);
    const [reload, setReload] = useState(0);

    const [loadData, setLoadData] = useState(false);
    const [addLiquidityModel, setAddLiquidityModel] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalType, setConfirmModalType] = useState('delete');
    const [confirmModalTitle, setConfirmModalTitle] = useState('');
    const [selectedItem, setSelectedItem] = useState<CurrencyDataInterface>();

    useEffect(() => {
        if (!account || !isAdmin) return;

        (async () => {
            setLoadData(true);
            let liquidityResponse = await axios.get(process.env.API_ADDRESS + `/admin/liquidity/all?account=${account}`);
            if (liquidityResponse && liquidityResponse.data && liquidityResponse.data.liquidities) {
                setLiquidityPools(liquidityResponse.data.liquidities.filter((item: any) => item.isDelete === false));
            }

            let currencyResponse = await axios.get(process.env.API_ADDRESS + `/admin/currency/all?account=${account}`);
            if (currencyResponse && currencyResponse.data && currencyResponse.data.currencies) {
                setCurrencies(currencyResponse.data.currencies.filter((item: any) => item.isActive === true && item.isDelete === false));
            }
            setLoadData(false);
        })();
    }, [account, reload, isAdmin]);

    const availableCurrencies = useMemo(() => {
        if (!currencies.length || !isAdmin) return [];
        let result = currencies.map((item: any) => {
            return {
                ...item,
                disable: item.id == token0
            }
        }).map((item: any) => {
            let state = liquidityPools.some((ele: LiquidityDataInterface) => {
                return (ele.currency0.id === token0 && ele.currency1.id === item.id)
                    ||
                    (ele.currency1.id === token0 && ele.currency0.id === item.id)
            });
            return {
                ...item,
                disable: !item.disable ? state : item.disable,
            }
        });
        return result;
    }, [currencies, liquidityPools, token0, isAdmin]);

    useEffect(() => {
        let result = currencies.map((item: any) => {
            return {
                ...item,
                disable: item.id == token1
            }
        }).map((item: any) => {
            let state = liquidityPools.some((ele: LiquidityDataInterface) => {
                return (ele.currency0.id === token1 && ele.currency1.id === item.id)
                    ||
                    (ele.currency1.id === token1 && ele.currency0.id === item.id)
            });
            return {
                ...item,
                disable: !item.disable ? state : item.disable,
            }
        });
        setCurrencies([...result]);
    }, [token1]);

    const addLiquidityHandle = async () => {
        loadingStart();
        let res = await axios.post(process.env.API_ADDRESS + "/admin/liquidity/add", {
            account: account,
            isYoc: isYocCheck(token0) || isYocCheck(token1),
            token0,
            token1
        })
        setAddLiquidityModel(false);
        setReload(reload + 1);
        loadingEnd();
    }

    const stateLiquidityHandleUI = (item: any) => {
        setSelectedItem(item);
        setConfirmModalTitle('Are you sure you want to change the status of this liquidity?');
        setShowConfirmModal(true);
        setConfirmModalType('state');
    }
    const stateLiquidityHandle = async (item: any) => {
        let data = {
            account,
            ...item,
            isActive: !item.isActive
        };
        loadingStart();
        var res = await axios.post(process.env.API_ADDRESS + '/admin/liquidity/state', data);
        loadingEnd();
        if (res && res.data) {
            setShowConfirmModal(false);
            setReload(reload + 1);
        }
    }

    const deleteLiquidityHandleUI = (item: any) => {
        setSelectedItem(item);
        setConfirmModalTitle('Are you sure you want to delete this liquidity?');
        setShowConfirmModal(true);
        setConfirmModalType('delete');
    }
    const deleteLiquidityHandle = async (item: any) => {
        loadingStart();
        var res = await axios.delete(process.env.API_ADDRESS + `/admin/liquidity/delete?account=${account}&id=${item.id}`);
        loadingEnd();
        if (res && res.data) {
            setShowConfirmModal(false);
            setReload(reload + 1);
        }
    }

    const isYocCheck = (id: any) => {
        let result = currencies.find((item: any) => item.id == id && item.address == YOC.address);
        if (result) return true;
        return false;
    }

    return <div className="w-full px-6 py-12">
        <div className='w-full flex-col'>
            <h2 className='text-3xl text-white mb-6'>Liquidity</h2>
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
                    {/* <button className='text-lg text-white text-center flex justify-center items-center bg-btn-primary cursor-pointer px-4 py-2 rounded ml-2' onClick={() => { setAddLiquidityModel(true) }} >
                        <BsFillPlusSquareFill className='mr-2' />
                        Create New Pool
                    </button> */}
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
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Total Amount0</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Total Amount1</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Rate</td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Created On</td>
                            {/* <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>State</td>
                                                    <td className='px-4 py-2 font-bold text-lg'>Actions</td> */}
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
                                    liquidityPools.length ?
                                        liquidityPools.map((item: any, index: number) => {
                                            return <tr className={`border-t border-[#373a40] ${index % 2 === 0 ? 'bg-[#25262b]' : ''} font-extralight`} key={'row-' + index}>
                                                <td className='p-4 border-r border-[#373a40]'>{index + 1}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.id}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.currency0.symbol}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.currency1.symbol}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.amount0} {item.pair0}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.amount1} {item.pair1}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.rate}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.createdAt}</td>
                                                {/* <td className='p-4 border-r border-[#373a40]'><div className='w-full flex justify-center text-xl'>{item.isActive ? <FcApproval /> : <FcCancel />}</div></td> */}
                                                {/* <td className=''>
                                                                    <div className='flex justify-center'>
                                                                        <button onClick={() => deleteLiquidityHandleUI(item)} className='p-2 rounded bg-btn-primary mr-2'><BsFillTrashFill /></button>
                                                                        {
                                                                            item.isActive === true ?
                                                                                <button onClick={() => stateLiquidityHandleUI(item)} className='p-2 rounded bg-btn-primary '><BsFillPlayCircleFill /></button>
                                                                                :
                                                                                <button onClick={() => stateLiquidityHandleUI(item)} className='p-2 rounded bg-btn-primary '><BsPauseCircleFill /></button>
                                                                        }
                                                                    </div>
                                                                </td> */}
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

            <Modal show={addLiquidityModel} onClose={() => { setAddLiquidityModel(false) }}>
                <div className='w-full bg-bg-pattern px-6 py-12'>
                    <h2 className='text-2xl text-white mb-6'>Add Liquidity Pool</h2>
                    <div className='flex gap-6 mb-4'>
                        <select className='w-full font-semibold rounded text-primary bg-transparent border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2'
                            onChange={(e) => { setToken0(+e.target.value) }}
                        >
                            <option className='p-2 bg-dark-primary' value={''}></option>
                            {
                                currencies.map((item: CurrencyDataInterface, index: number) => {
                                    return <option key={'first-' + index} disabled={item.disable} className='p-2 bg-dark-primary' value={item.id}>
                                        {item.name} ({item.symbol})
                                    </option>
                                })
                            }
                        </select>
                        <select className='w-full font-semibold rounded text-primary bg-transparent border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2'
                            onChange={(e) => { setToken1(+e.target.value) }}
                        >
                            <option className='p-2 bg-dark-primary' value={''}></option>
                            {
                                availableCurrencies.map((item: CurrencyDataInterface, index: number) => {
                                    return <option key={'last-' + index} disabled={item.disable} className='p-2 bg-dark-primary' value={item.id}>
                                        {item.name} ({item.symbol})
                                    </option>
                                })
                            }
                        </select>
                    </div>
                    <div className="flex justify-between gap-6">
                        <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => { setAddLiquidityModel(false) }}>Cancel</button>
                        <button onClick={() => { addLiquidityHandle() }} className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2">Add</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showConfirmModal} onClose={() => { setShowConfirmModal(false) }}>
                <div className='w-full bg-bg-pattern p-8'>
                    <h2 className='text-xl text-center text-white mb-6'>{confirmModalTitle}</h2>
                    <div className="flex justify-between gap-6 mt-6">
                        <button className="w-[120px] font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => { setShowConfirmModal(false) }}>Cancel</button>
                        <button onClick={() => { confirmModalType === 'delete' ? deleteLiquidityHandle(selectedItem) : stateLiquidityHandle(selectedItem) }} className="w-[120px] font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2">{confirmModalType === 'delete' ? 'Delete' : ((selectedItem && selectedItem.isActive) ? 'Disable' : 'Enable')}</button>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
};

export default AdminLiquidity;