import { useState, useEffect } from 'react';
import axios from 'axios';
import useNetwork from '@hooks/useNetwork';

const BurnSection = () => {
    const { network, native, YOC } = useNetwork();

    return <div className="text-dark-primary">
        <h3 className='text-xl text-white mb-2'>Burn YUSD tokens</h3>
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
        <p className='mb-4 text-sm italic'>75% {network} and 25% {YOC}</p>

        <div className="yusd-selector rounded-lg border border-border-primary mb-4">
            <div className="w-full flex justify-between items-center bg-primary-pattern border-b border-border-primary px-3">
                <input className='bg-transparent text-white py-2' placeholder="Enter YUSD amout to burn" defaultValue={0} />
                <span className='font-semibold'>YUSD</span>
            </div>
            <div className="yusd-details text-sm px-3 py-2 flex items-end justify-between">
                <div>
                    <p>Composition:</p>
                    <p>75% {network}: {35.3773} Tokens</p>
                    <p>25% {YOC}: {6250.00} Tokens</p>
                </div>
                <div>
                    <p className='text-right'>{native} Price: {2.12} USD</p>
                    <p className='text-right'>{YOC} Price: {0.004} USD</p>
                </div>
            </div>
        </div>

        <div>Approx: <span className='text-dark-secondary'>{47.1698} {network}</span></div>
        <div>Account balance: <span className='text-dark-secondary'>{0} YUSD</span></div>
        <div className='w-full flex justify-between items-center mb-4'>
            <p>Account balance: <span>{91.01} {native}</span></p>
            <button className='text-white p-2 leading-none bg-btn-primary rounded shadow-btn-primary'>Max</button>
        </div>
        <div className="w-full flex justify-center">
            <button className='bg-btn-primary text-white w-full py-5 text-3xl rounded-lg shadow-btn-primary'>Burn</button>
        </div>
    </div>
}

export default BurnSection;