import Link from 'next/link';
import { FC, useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import { BsFillPlusSquareFill, BsFillTrashFill, BsPauseCircleFill, BsFillPlayCircleFill } from "react-icons/bs"
import { FcCancel, FcApproval, FcLink } from "react-icons/fc";
import { AiFillEdit } from "react-icons/ai";

import Modal from '@components/widgets/Modalv2';
import useAccount from '@hooks/useAccount';
import SimpleLoading from '@components/widgets/SimpleLoading';

import { CurrencyDataInterface } from '../../src/interfaces/currency';
import unknowLogo from "../../public/images/coins/Unknow.png";

import { useAdmin, useNetwork, useAlert, useLoading } from '@hooks/index';


type Props = {
    children: React.ReactNode
}

const AdminCurrency: FC<Props> = (props) => {
    const { account } = useAccount();
    const isAdmin = useAdmin();
    const { explorer } = useNetwork();
    const { alertShow } = useAlert();
    const { loadingStart, loadingEnd } = useLoading();

    const [loadData, setLoadData] = useState(false);
    const [allCurrencies, setAllCurrencies] = useState<CurrencyDataInterface[]>();
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [reload, setReload] = useState(0);
    const [modalType, setModalType] = useState('add');
    const [confirmModalType, setConfirmModalType] = useState('add');
    const [confirmModalTitle, setConfirmModalTitle] = useState('');
    const [selectedItem, setSelectedItem] = useState<CurrencyDataInterface>();

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [decimals, setDecimal] = useState('');
    const [contract, setContract] = useState('');

    useEffect(() => {
        if (account && isAdmin) {
            (async () => {
                setLoadData(true);
                let res = await axios.get(process.env.API_ADDRESS + `/admin/currency/all?account=${account}`);
                setLoadData(false);
                if (res && res.data) {
                    setAllCurrencies(res.data.currencies);
                }
            })();
        }
    }, [setAllCurrencies, account, reload, isAdmin])

    const currencies = useMemo(() => {
        return allCurrencies?.filter((item: any) => {
            for (const key in item) {
                if (Object.prototype.hasOwnProperty.call(item, key)) {
                    const element = item[key];
                    if (String(element).toLowerCase().indexOf(search.toLowerCase()) != -1) return 1;
                }
            }
            return 0;
        })
    }, [allCurrencies, search]);

    const addCurrencyHandleUI = () => {
        setName('');
        setSymbol('');
        setImage('');
        setDescription('');
        setDecimal('');
        setContract('');
        setModalType('add');
        setShowModal(true);
    }

    const addCurrencyHandle = async () => {
        if (!(name && symbol && +decimals && contract)) {
            alertShow({ content: 'Please input the all field!', status: 'failed' });
            return;
        }
        let data = {
            account,
            name,
            symbol,
            image,
            decimals,
            description,
            address: contract
        };
        loadingStart();
        var res = await axios.post(process.env.API_ADDRESS + '/admin/currency/add', data);
        loadingEnd();
        if (res && res.data) {
            setShowModal(false);
            setReload(reload + 1);
        }
    }

    const editCurrencyHandleUI = (item: any) => {
        setName(item.name);
        setSymbol(item.symbol);
        setImage(item.image);
        setDescription(item.description);
        setDecimal(item.decimals);
        setContract(item.address);
        setModalType('edit');
        setShowModal(true);
        setSelectedItem(item);
    }

    const editCurrencyHandle = async (item: any) => {
        if (!(name && symbol && +decimals && contract)) {
            alertShow({ content: 'Please input the all field!', status: 'failed' });
            return;
        }
        let data = {
            account,
            ...item,
            name,
            image,
            symbol,
            decimals,
            description,
            address: contract,
        };
        loadingStart();
        var res = await axios.post(process.env.API_ADDRESS + '/admin/currency/update', data);
        loadingEnd();
        if (res && res.data) {
            setShowModal(false);
            setReload(reload + 1);
        }
    }

    const stateCurrencyHandleUI = (item: any) => {
        setSelectedItem(item);
        setConfirmModalTitle('Are you sure you want to change the status of this currency?');
        setShowConfirmModal(true);
        setConfirmModalType('state');
    }
    const stateCurrencyHandle = async (item: any) => {
        let data = {
            account,
            ...item,
            isActive: !item.isActive
        };
        loadingStart();
        var res = await axios.post(process.env.API_ADDRESS + '/admin/currency/state', data);
        loadingEnd();
        if (res && res.data) {
            setShowConfirmModal(false);
            setReload(reload + 1);
        }
    }

    const deleteCurrencyHandleUI = (item: any) => {
        setSelectedItem(item);
        setConfirmModalTitle('Are you sure you want to delete this currency?');
        setShowConfirmModal(true);
        setConfirmModalType('delete');
    }
    const deleteCurrencyHandle = async (item: any) => {
        loadingStart();
        var res = await axios.delete(process.env.API_ADDRESS + `/admin/currency/delete?account=${account}&id=${item.id}`);
        loadingEnd();
        if (res && res.data) {
            setShowConfirmModal(false);
            setReload(reload + 1);
        }
    }

    return <div className="w-full px-6 py-12">
        <div className='w-full flex-col'>
            <h2 className='text-3xl text-white mb-6'>Currency</h2>
            <div className='w-full flex justify-between mb-6'>
                <div className="relative w-[400px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input value={search} onChange={(e: any) => { setSearch(e.target.value) }} type="search" id="default-search" className="block w-full px-4 py-2 pl-10 text-sm border border-btn-primary rounded bg-transparent placeholder-gray-400 text-white focus:ring-btn-primary focus:border-btn-primary" placeholder="Search the currency" required />
                </div>
                <button className='text-lg text-white text-center flex justify-center items-center bg-btn-primary cursor-pointer px-4 py-2 rounded' onClick={() => addCurrencyHandleUI()} >
                    <BsFillPlusSquareFill className='mr-2' />
                    Create New Currency
                </button>
            </div>

            <div className='w-full overflow-auto'>
                <table className='min-w-full text-white border border-[#373a40]'>
                    <thead>
                        <tr className='bg-[#1a1b1e] border-b border-[#373a40]'>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'><span>No</span></td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'><span>Logo</span></td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'><span>Name</span></td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'><span>Symbol</span></td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'><span>Description</span></td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'><span>Decimal</span></td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'>Created On</td>
                            <td className='px-4 py-2 font-bold text-lg text-center border-r border-[#373a40] max-w-[100px]'><span>Contract</span></td>
                            <td className='px-4 py-2 font-bold text-lg border-r border-[#373a40]'><span>State</span></td>
                            <td className='px-4 py-2 font-bold text-lg text-center max-w-[90px]'><span>Actions</span></td>
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
                                :
                                (
                                    currencies?.length ?
                                        currencies.filter(((item: any) => {
                                            return true;
                                        })).map((item: any, index: number) => {
                                            return <tr className={`border-t border-[#373a40] ${index % 2 === 0 ? 'bg-[#25262b]' : ''} font-extralight`} key={'row-' + index}>
                                                <td className='p-4 border-r border-[#373a40]'>{index + 1}</td>
                                                <td className='p-4 border-r border-[#373a40]'><div className='w-full flex justify-center'><img width={36} src={item.image ? item.image : unknowLogo} alt='logo' /></div></td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.name}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.symbol}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.description}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.decimals}</td>
                                                <td className='p-4 border-r border-[#373a40]'>{item.createdAt}</td>
                                                <td className='p-4 border-r border-[#373a40]'>
                                                    <div className='w-full flex justify-center text-xl'>
                                                        <Link href={`${explorer}/address/${item.address}`} target={'_blank'}>
                                                            <FcLink className='cursor-pointer' />
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className='p-4 border-r border-[#373a40]'><div className='w-full flex justify-center text-xl'>{item.isActive ? <FcApproval /> : <FcCancel />}</div></td>
                                                <td className=''>
                                                    <div className='flex justify-center px-2'>
                                                        <button onClick={() => deleteCurrencyHandleUI(item)} className='p-2 rounded bg-btn-primary mr-2'><BsFillTrashFill /></button>
                                                        <button onClick={() => editCurrencyHandleUI(item)} className='p-2 rounded bg-btn-primary mr-2'><AiFillEdit /></button>
                                                        {
                                                            item.isActive === true ?
                                                                <button onClick={() => stateCurrencyHandleUI(item)} className='p-2 rounded bg-btn-primary '><BsPauseCircleFill /></button>
                                                                :
                                                                <button onClick={() => stateCurrencyHandleUI(item)} className='p-2 rounded bg-btn-primary '><BsFillPlayCircleFill /></button>
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        }) :
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

            <Modal show={showModal} onClose={() => { setShowModal(false) }}>
                <div className='w-full bg-bg-pattern px-6 py-12'>
                    <h2 className='text-2xl text-white mb-6'>Add Currency Currency</h2>
                    <div className='grid grid-cols-2 gap-6 mb-2'>
                        <div className='flex flex-col'>
                            <label className='text-white mb-2'>Name <span className='text-[#DD6F60]'>*</span></label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className='w-full text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2' placeholder='Ethereum' />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-white mb-2'>Symbol <span className='text-[#DD6F60]'>*</span></label>
                            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} className='text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2' placeholder='ETH' />
                        </div>
                    </div>
                    <div className='flex flex-col mb-2'>
                        <label className='text-white mb-2'>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none' placeholder=''>

                        </textarea>
                    </div>
                    <div className='flex flex-col mb-2'>
                        <label className='text-white mb-2'>Image</label>
                        <div className='flex items-center'>
                            <input value={image} onChange={(e) => setImage(e.target.value)} className='w-full text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2 outline-none' placeholder='' />
                            <div className='w-[40px] rounded-full overflow-hidden ml-2 relative'>
                                <img className='w-full aspect-[1/1]' src={"/images/coins/unknow.png"} alt='logo' />
                                <img className='absolute left-0 top-0 w-full aspect-[1/1]' src={image} alt='' />
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-6 mb-2'>
                        <div className='flex flex-col'>
                            <label className='text-white mb-2'>Decimal <span className='text-[#DD6F60]'>*</span></label>
                            <input value={decimals} onChange={(e) => setDecimal(e.target.value)} className='w-full text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2' placeholder='18' />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-white mb-2'>Contract Address <span className='text-[#DD6F60]'>*</span></label>
                            <input value={contract} onChange={(e) => setContract(e.target.value)} className='text-white rounded border border-[#FFFFFF22] bg-transparent bg-primary-pattern px-4 py-2' placeholder='0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6' />
                        </div>
                    </div>
                    <div className="flex justify-between gap-6 mt-6">
                        <button className="w-[120px] font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => { setShowModal(false) }}>Cancel</button>
                        <button onClick={() => { modalType === 'add' ? addCurrencyHandle() : editCurrencyHandle(selectedItem) }} className="w-[120px] font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2">{modalType === 'add' ? 'Add' : 'Edit'}</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showConfirmModal} onClose={() => { setShowConfirmModal(false) }}>
                <div className='w-full bg-bg-pattern p-8'>
                    <h2 className='text-xl text-center text-white mb-6'>{confirmModalTitle}</h2>
                    <div className="flex justify-between gap-6 mt-6">
                        <button className="w-[120px] font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => { setShowConfirmModal(false) }}>Cancel</button>
                        <button onClick={() => { confirmModalType === 'delete' ? deleteCurrencyHandle(selectedItem) : stateCurrencyHandle(selectedItem) }} className="w-[120px] font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2">{confirmModalType === 'delete' ? 'Delete' : ((selectedItem && selectedItem.isActive) ? 'Disable' : 'Enable')}</button>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
};

export default AdminCurrency;