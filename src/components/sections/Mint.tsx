import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ethers, Contract } from 'ethers';
import useNetwork from '@hooks/useNetwork';
import Modal from '@components/widgets/Modalv2';
import { debounceHook } from 'utils/hook';
import useAccount from '@hooks/useAccount';
import { YUSD } from 'src/constants/contracts';
import useWallet from '@hooks/useWallet';

const MintSection = () => {
    const { provider, ETHBalance, YUSDBalance } = useAccount();
    const { network, YOC, native } = useNetwork();
    const [amount, setAmount] = useState("0");
    const [approx, setApprox] = useState(0);
    const [showMintModalToggle, setShowMintModalToggle] = useState(false);
    // const YUSDContract = useMemo(() => {
    //     return new Contract(
    //         YUSD.address,
    //         YUSD.abi,
    //         provider
    //     );
    // }, [YUSD, provider])
    const amountChangeHandle = (val: string) => {
        setAmount(val);
        debounceHook(async () => {
        })
    }

    const confirmMintHandle = () => {

        setShowMintModalToggle(true);
    }

    return <div className="text-dark-primary">
        <h3 className='text-xl text-white mb-2'>Mint YUSD tokens</h3>
        <p className='mb-2 text-dark-secondary'>Ratio: 1 YUSD = 1 USD</p>
        <div className='flex items-center text-sm italic'>
            <p>YUSD are composed of:</p>
            <div className='group relative'>
                <img className='ml-2 w-[14px] h-[14px]' src='/images/question.png' />
                <div className='hidden group-hover:block not-italic text-white absolute left-2 top-3.5 w-[200px] p-2 z-100 bg-body-primary rounded shadow-btn-primary'>
                    YUSD is composed by 75% of Near and 25% of YOCn, YOC´s government coin.<br />
                    These assets are locked on your YUSD Tokens contract
                </div>
            </div>
        </div>
        <p className='mb-4 text-sm italic'>75% {native} and 25% {YOC}</p>

        <div className="yusd-selector rounded-lg border border-border-primary mb-4">
            <div className="w-full flex justify-between items-center bg-primary-pattern border-b border-border-primary px-3">
                <input className='bg-transparent text-white py-2' placeholder="Enter YUSD amout to mint" value={amount} onChange={(e: any) => amountChangeHandle(e.target.value)} />
                <span className='font-semibold'>YUSD</span>
            </div>
            <div className="yusd-details text-sm px-3 py-2 flex items-end justify-between">
                <div>
                    <p>Composition:</p>
                    <p>75% {native}: {35.3773} Tokens</p>
                    <p>25% {YOC}: {6250.00} Tokens</p>
                </div>
                <div>
                    <p className='text-right'>{network} Price: {2.12} USD</p>
                    <p className='text-right'>{YOC} Price: {0.004} USD</p>
                </div>
            </div>
        </div>

        <div>Approx: <span className='text-dark-secondary'>{approx} {native}</span></div>
        <div>Account balance: <span className='text-dark-secondary'>{YUSDBalance} YUSD</span></div>
        <div className='w-full flex items-center justify-between mb-4'>
            <p>Account balance: <span>{ETHBalance} {native}</span></p>
            <button className='text-white p-2 leading-none bg-btn-primary rounded shadow-btn-primary'>Max</button>
        </div>
        <div className="w-full flex justify-center">
            <button className='bg-btn-primary text-white w-full py-5 text-3xl rounded-lg shadow-btn-primary' onClick={() => confirmMintHandle()}>Mint</button>
        </div>


        <Modal size="small" show={showMintModalToggle} onClose={() => setShowMintModalToggle(false)}>
            <div className="p-6 pt-8 text-primary">
                <p className="text-lg py-4">Allow <span className="text-secondary">yoc.com</span> to spend your?</p>
                <p className="mb-6 text-sm leading-7">Please confirm to initiate this transaction</p>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => { }}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setShowMintModalToggle(false)}>Reject</button>
                </div>
            </div>
        </Modal>
    </div>
}

export default MintSection;