import React, { FC, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Contract, BigNumber, constants, utils } from 'ethers';

import SideMenuBar from '@components/widgets/SideMenuBar';
import SimpleLoading from "@components/widgets/SimpleLoading";
import Modal from '@components/widgets/Modalv2';

import { TokenTemplate, YOCSwapRouter, YOCSwapFactory, WETH } from "../../src/constants/contracts";
import { useWallet, useAccount, useLoading, useAlert, useUserLiquidity } from '@hooks/index';

const Liquidity: FC = () => {
    const { account, rpc_provider } = useAccount();
    const { connectWallet } = useWallet();
    const { liquidities: pools, isLoading, error } = useUserLiquidity();
    const [liquidityToggle, setLiquidityToggle] = useState<Number[]>([]);
    const [confirmDeposit, setConfirmDeposit] = useState(false);

    const swapContract = useMemo(() => {
        return new Contract(
            YOCSwapRouter.address,
            YOCSwapRouter.abi,
            rpc_provider
        )
    }, [YOCSwapRouter, rpc_provider]);

    useEffect(() => {
        setLiquidityToggle([...new Array(pools.length).map(item => 0)]);
    }, [account, pools.length])

    const togglePoolHandle = (index: number) => {
        let rst: any[] = liquidityToggle.map((item: any, i: number) => {
            return i === index ? !item : item;
        });

        setLiquidityToggle([...rst]);
    }

    return (
        <div className='relative'>
            <img className='absolute left-0 top-[10vh] h-[85vh]' src='/images/bg-effect-image.png' alt='effect' />
            <div className='container !py-0 mx-auto min-h-[450px]'>
                <div className='swap-container relative min-w-full min-h-full'>
                    <div className='absolute left-0 top-0 w-full h-full -z-[10]'>
                        <div className='absolute right-0 -top-[250px] w-[350px] h-[650px] opacity-25 bg-tr-gradient bg-blend-color-dodge'></div>
                    </div>
                    <div className='w-full h-full flex justify-end items-start z-[20]'>
                        <div className='flex flex-col  bg-bg-pattern rounded shadow-big w-[400px] mt-[100px] mr-[5vw]'>
                            <div className='px-3 py-6'>
                                <h3 className='relative text-2xl font-semibold text-primary text-center'>
                                    Your Liquidity
                                    <div className='absolute right-0 top-0'>
                                        <img className='h-[35px]' src='/images/swap-header.png' alt='swap' />
                                    </div>
                                </h3>
                                <p className='text-dark-secondary mt-4 text-center'>Remove liquidity to receive tokens back</p>
                            </div>
                            <div className='relative px-3 py-6 bg-primary-pattern border border-[#ffffff28] rounded -mx-[1px]'>
                                {
                                    !account ? <p className='text-center'>Connect to a wallet to view your liquidity.</p> : (
                                        <div>
                                            <div>
                                                {
                                                    isLoading ?
                                                        <div className='w-full flex items-center justify-center'>
                                                            <SimpleLoading className='w-[30px]' />
                                                        </div>
                                                        :
                                                        !pools.length ?
                                                            <p className='text-dark-secondary my-3 text-center'>No liquidity found.</p>
                                                            :
                                                            (
                                                                pools.map((item: any, index) => {

                                                                    let percentage = 0;
                                                                    if (item && item.item && item.item.liquidity && item.item.liquidity.amount) {
                                                                        percentage = item.LPBalance / item.item.liquidity.amount
                                                                    }

                                                                    return <div key={'liquidity-' + index} className={`p-3 bg-[#1e231de6] rounded mb-2 transition-all overflow-hidden ${liquidityToggle[index] ? 'h-[210px]' : 'h-[50px]'}`}>
                                                                        <div className='flex justify-between items-center'>
                                                                            <div className='flex justify-between items-center'>
                                                                                <img className='w-6 mr-2' src={item.currency0.image} alt="" />
                                                                                <img className='w-6 mr-2' src={item.currency1.image} alt="" />
                                                                                <p className='text-lg font-bold'>{item.currency0.symbol}/{item.currency1.symbol}</p>
                                                                            </div>
                                                                            <img className={`transition cursor-pointer ${liquidityToggle[index] ? 'rotate-[180deg]' : ''}`} src="/images/drop-down.png" alt="" onClick={() => togglePoolHandle(index)} />
                                                                        </div>

                                                                        <div className='w-full'>
                                                                            <div className='flex justify-between items-center mt-2'>
                                                                                <span>{item.currency0.symbol}</span>
                                                                                <span>{percentage * item.item.liquidity.amount0}</span>
                                                                            </div>
                                                                            <div className='flex justify-between items-center mt-2'>
                                                                                <span>{item.currency1.symbol}</span>
                                                                                <span>{percentage * item.item.liquidity.amount1}</span>
                                                                            </div>
                                                                            <div className='flex justify-between items-center mt-2'>
                                                                                <span>Share of pool</span>
                                                                                <span>{percentage * 100}%</span>
                                                                            </div>
                                                                            <button className='bg-btn-primary w-full mt-4 py-2 text-xl rounded-lg shadow-btn-primary z-[100] disabled:bg-btn-disable'>Remove liquidity</button>
                                                                        </div>
                                                                    </div>
                                                                })
                                                            )
                                                }
                                            </div>
                                            <div className='flex flex-col items-center justify-center'>
                                                <p className='text-dark-secondary mb-2.5 text-center'>Don't see a pair you joined?</p>
                                                <Link href={'/liquidity/find'}><a className='w-full rounded text-center mx-4 bg-transparent px-6 py-3 text-lg leading-none border border-btn-primary'>Find other LP tokens</a></Link>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='px-3 py-4'>
                                {
                                    account ?
                                        <Link href={'/liquidity/add'}><a><button className='bg-btn-primary w-full py-5 my-5 text-3xl rounded-lg shadow-btn-primary z-[100] disabled:bg-btn-disable'>Add liquidity</button></a></Link>
                                        :
                                        <button className='bg-btn-primary w-full py-5 my-5 text-3xl rounded-lg shadow-btn-primary' onClick={() => connectWallet()}>Connect Wallet</button>
                                }
                            </div>
                        </div>
                        <SideMenuBar />
                    </div>
                </div>
            </div>

            <Modal size='small' show={confirmDeposit} onClose={() => { setConfirmDeposit(false) }}>
                <div className='w-full flex flex-col justify-around items-center py-8 px-12 text-white'>
                </div>
            </Modal>
        </div>
    )
}

export default Liquidity;