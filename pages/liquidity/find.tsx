import React, { FC, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import SideMenuBar from '@components/widgets/SideMenuBar';
import TokenComponent from '@components/widgets/TokenComponent';
import SimpleLoading from "@components/widgets/SimpleLoading";

import { TOKENS, tokenInterface } from '../../src/constants/tokens';

import { useWallet, useAccount, useLoading, useAlert } from '@hooks/index';

const Liquidity: FC = () => {
    const { account } = useAccount();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const { connectWallet } = useWallet();
    const [typeIn, setTypeIn] = useState<tokenInterface>(TOKENS[0] as tokenInterface);
    const [typeOut, setTypeOut] = useState<tokenInterface>();
    const [pendingLiquidity, setPendingLiquidity] = useState(false);

    useEffect(() => {
        if (account) {
            setTypeInHandle(TOKENS[0])
        }
    }, [account])

    const importPoolAvaliable = useMemo(() => {
        if (typeIn.address && typeOut?.address && account) return true;
        return false;
    }, [typeIn, typeOut, account]);

    const setTypeInHandle = async (v: tokenInterface) => {
        loadingStart();
        try {
            setTypeIn(v);
            loadingEnd();
        } catch (error) {
            console.dir(error);
            loadingEnd();
        }
    }

    const setTypeOutHandle = async (v: tokenInterface) => {
        loadingStart();
        try {
            setTypeOut(v);
            loadingEnd();
        } catch (error) {
            console.dir(error);
            loadingEnd();
        }
    }

    const importPoolHandle = async () => {
        try {
            if (typeIn && typeOut) {
                setPendingLiquidity(true);
                let importPoolResponse = await axios.post(process.env.API_ADDRESS + '/liquidity/import', {
                    account,
                    currency0: typeIn.address,
                    currency1: typeOut.address
                });
                setPendingLiquidity(false);
                if (importPoolResponse.status == 200) {
                    alertShow({ content: 'Import Liquidity Successfully!', status: 'success' });
                } else if (importPoolResponse.status == 204) {
                    console.log(importPoolResponse);
                    alertShow({ content: "The pool doesn't exist!", status: 'failed' });
                }
            }
        } catch (error: any) {
            console.dir(error)
            alertShow({ content: "The pool doesn't exist!", status: 'success' });
            setPendingLiquidity(false);
        }
    }

    const changeTokenEach = () => {
        const tempType = typeIn;
        setTypeIn(typeOut as tokenInterface);
        setTypeOut(tempType as tokenInterface);
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
                            <div className='px-3 pb-6 pt-8'>
                                <h3 className='relative text-2xl font-semibold text-primary text-center'>
                                    {/* <Link href={'/liquidity'}>
                                        <MdArrowBack className='cursor-pointer absolute left-0 top-0' />
                                    </Link> */}
                                    Import Liquidity
                                    <div className='absolute right-0 top-0'>
                                        <img className='h-[35px]' src='/images/swap-header.png' alt='swap' />
                                    </div>
                                </h3>
                                <p className='text-dark-secondary mt-4 text-center'>Lorum Ipsum deposit stir</p>
                            </div>
                            <div className='relative px-3 py-6 bg-primary-pattern border border-[#ffffff28] rounded -mx-[1px]'>
                                <div className='flex flex-col justify-between'>
                                    <TokenComponent type={typeIn} setType={(v) => setTypeInHandle(v)} ignoreValue={typeOut} disabled={!Boolean(account)} />
                                </div>
                                <div className='absolute z-[1] left-1/2 aspect-[1/1] -bottom-[calc(16px_+_0.5rem)] -translate-x-1/2 cursor-pointer'><img src='/images/swap.png' alt="swap" width={40} height={40} onClick={() => changeTokenEach()} /></div>
                            </div>
                            <div className='relative -z-0 px-3 pt-6 pb-4 mt-1 bg-secondary-pattern border border-[#ffffff28] rounded -mx-[1px]'>
                                <div className='flex flex-col justify-between'>
                                    <TokenComponent type={typeOut} setType={(v) => setTypeOutHandle(v)} ignoreValue={typeIn} disabled={!Boolean(account)} />
                                </div>
                            </div>
                            <div className='px-3 py-4'>
                                {
                                    pendingLiquidity ?
                                        <button className='bg-btn-primary w-full flex justify-around items-center py-5 my-10 text-3xl rounded-lg shadow-btn-primary z-[100]' ><SimpleLoading className='w-[36px] h-[36px]' /></button>
                                        : (account ?
                                            <button className='bg-btn-primary w-full py-5 my-10 text-3xl rounded-lg shadow-btn-primary z-[100] disabled:bg-btn-disable' disabled={!importPoolAvaliable} onClick={() => importPoolHandle()}>Import pool</button>
                                            :
                                            <button className='bg-btn-primary w-full py-5 my-10 text-3xl rounded-lg shadow-btn-primary' onClick={() => connectWallet()}>Connect Wallet</button>
                                        )
                                }
                            </div>
                        </div>
                        <SideMenuBar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Liquidity;