import Link from 'next/link';
import React, { FC, useState, useEffect, useMemo } from 'react';
import { mathExact } from 'math-exact';
import { MdArrowBack } from "react-icons/md";
import { Contract, BigNumber, constants, utils } from 'ethers';
const { MaxUint256, AddressZero, Zero } = constants;
import axios from 'axios';

import SideMenuBar from '@components/widgets/SideMenuBar';
import TokenComponent from '@components/widgets/TokenComponent';
import SimpleLoading from "@components/widgets/SimpleLoading";
import Modal from '@components/widgets/Modalv2';

import { TOKENS, tokenInterface } from '../../src/constants/tokens';
import { TokenTemplate, YOCSwapRouter, YOCSwapFactory, WETH } from "../../src/constants/contracts";
import { rpc_provider_basic } from '../../utils/rpc_provider';
import { convertEthToWei, convertRate, convertWeiToEth } from "../../utils/unit";

import { useWallet, useAccount, useLoading, useAlert } from '@hooks/index';

const tempMaxValue = 99999999999;
const txRunLimitTime = 1000 * 60 * 5; // 5 min

const Liquidity: FC = () => {
    const { account, provider, signer, rpc_provider } = useAccount();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const { connectWallet } = useWallet();
    const [typeIn, setTypeIn] = useState<tokenInterface>(TOKENS[0] as tokenInterface);
    const [typeOut, setTypeOut] = useState<tokenInterface>();
    const [amountIn, setAmountIn] = useState(0);
    const [amountOut, setAmountOut] = useState(0);
    const [myBalanceIn, setMyBalanceIn] = useState(0);
    const [myBalanceOut, setMyBalanceOut] = useState(0);
    const [allowanceIn, setAllowanceIn] = useState(0);
    const [allowanceOut, setAllowanceOut] = useState(0);
    const [pendingLiquidity, setPendingLiquidity] = useState(false);
    const [pendingApproveIn, setPendingApproveIn] = useState(false);
    const [pendingApproveOut, setPendingApproveOut] = useState(false);
    const [confirmDeposit, setConfirmDeposit] = useState(false);
    const [rate, setRate] = useState(0);
    const YOCSwapContract = useMemo(() => {
        return new Contract(
            YOCSwapRouter.address,
            YOCSwapRouter.abi,
            signer
        )
        }, [signer]);
    const [YOCSwapFactoryContract] = useState(new Contract(
        YOCSwapFactory.address,
        YOCSwapFactory.abi,
        signer
    ));

    useEffect(() => {
        if (provider && account) {
            setTypeInHandle(TOKENS[0])
        }
    }, [provider, account])

    const calculateRate = async (in_: tokenInterface, out_: tokenInterface) => {
        if (!(in_ && out_)) return 0;
        try {
            // let res = await YOCSwapContract.getExpectLiquidityAmount(in_.address, out_.address, convertEthToWei('1', in_.decimals));
            // let rate = convertWeiToEth(res, out_.decimals);
            let res = await axios.get(process.env.API_ADDRESS + '/liquidity/rate?' + `in=${in_.address}&out=${out_.address}`);
            if (res && res.data) {
                let rate = 0;
                if (res.data.rate) {
                    rate = res.data.rate ? +1 / res.data.rate : 0;
                }
                setRate(rate);
                return rate;
            }
        } catch (error) {
            console.dir(error);
            return 0;
        }
    }

    const checkAllowance = async (token: tokenInterface) => {
        if (!token) return false;
        let tokenContract = new Contract(
            token.address,
            TokenTemplate.abi,
            rpc_provider_basic
        );
        let approveAmount = convertWeiToEth((await tokenContract.allowance(account, YOCSwapRouter.address)), token.decimals);
        // let approveAmount = await tokenContract.allowance(account, YOCSwapRouter.address);
        console.log(approveAmount);
        return approveAmount;
    }

    const setAmountInHandle = (v: number) => {
        setAmountIn(v);
        if (+rate) setAmountOut(mathExact('Multiply', +v, +rate));
    }

    const setAmountOutHandle = (v: number) => {
        setAmountOut(v)
        if (+rate) setAmountIn(mathExact('Divide', +v, +rate));
    }

    const setTypeInHandle = async (v: tokenInterface) => {
        loadingStart();
        try {
            setAllowanceIn(tempMaxValue);
            setTypeIn(v);
            let r = await calculateRate(v, typeOut as tokenInterface);
            if (r) setAmountIn(mathExact('Divide', +amountOut, +r));
            if (v.address == WETH) {
                let balance = await provider.getBalance(account);
                setMyBalanceIn(+convertWeiToEth(balance, v.decimals));
            } else {
                const contract = new Contract(
                    v.address,
                    TokenTemplate.abi,
                    rpc_provider
                );

                let balance = await contract.balanceOf(account);
                setMyBalanceIn(+convertWeiToEth(balance, v.decimals));

                let allowAmount = await checkAllowance(v);
                setAllowanceIn(Number(allowAmount));
            }
            loadingEnd();
        } catch (error) {
            console.dir(error);
            loadingEnd();
        }
    }

    const setTypeOutHandle = async (v: tokenInterface) => {
        loadingStart();
        try {
            setAllowanceOut(tempMaxValue);
            setTypeOut(v);
            let r = await calculateRate(typeIn, v);
            if (r) setAmountOut(mathExact('Multiply', +amountIn, +r));
            if (v.address == WETH) {
                let balance = await provider.getBalance(account);
                setMyBalanceOut(+convertWeiToEth(balance, v.decimals));
            } else {
                const contract = new Contract(
                    v.address,
                    TokenTemplate.abi,
                    rpc_provider
                );
                let balance = await contract.balanceOf(account);
                setMyBalanceOut(+convertWeiToEth(balance, v.decimals));

                let allowAmount = await checkAllowance(v);
                setAllowanceOut(Number(allowAmount));
            }
            loadingEnd();
        } catch (error) {
            console.dir(error);
            loadingEnd();
        }
    }

    const approveHandle = async (token: tokenInterface, type: string) => {
        let tokenContract = new Contract(
            token.address,
            TokenTemplate.abi,
            signer
        );

        try {
            let amount = 0;
            if (type == "in") {
                setPendingApproveIn(true);
                amount = tempMaxValue;
            } else {
                setPendingApproveOut(true);
                amount = tempMaxValue;
            }
            let tx = await tokenContract.approve(YOCSwapRouter.address, MaxUint256);
            const receipt = await tx.wait();
            console.log(receipt.events)
            if (type == "in") {
                setPendingApproveIn(false);
                setAllowanceIn(amount);
            } else {
                setPendingApproveOut(false);
                setAllowanceOut(amount);
            }
        } catch (err) {
            if (type == "in") {
                setPendingApproveIn(false);
            } else {
                setPendingApproveOut(false);
            }
        }
    }

    const addLiquidity = async () => {
        try {
            if (typeIn && typeOut) {
                setPendingLiquidity(true);
                let tx;
                if (typeIn.address == WETH) {
                    console.log(typeOut.address);
                    console.log(convertEthToWei(String('1'), 18));
                    console.log(convertEthToWei(String(Number(+amountIn).toFixed(typeIn.decimals)), typeIn.decimals));
                    console.log(convertEthToWei(String(Number(+amountOut).toFixed(typeOut.decimals)), typeOut.decimals));
                    tx = await YOCSwapContract.addLiquidityETH(
                        typeOut.address,
                        convertEthToWei(String(Number(+amountOut).toFixed(typeOut.decimals)), typeOut.decimals),
                        '0',
                        '0',
                        account,
                        MaxUint256,
                        // MaxUint256, 
                        {
                            value: convertEthToWei(String(Number(+amountIn).toFixed(typeIn.decimals)), typeIn.decimals),
                            gasLimit: 850000
                        }
                    );
                } else if (typeOut.address == WETH) {
                    tx = await YOCSwapContract.addLiquidityETH(
                        typeIn.address,
                        convertEthToWei(String(Number(+amountIn).toFixed(typeIn.decimals)), typeIn.decimals),
                        '0',
                        '0',
                        account,
                        MaxUint256,
                        // MaxUint256, 
                        {
                            value: convertEthToWei(String(Number(+amountOut).toFixed(typeOut.decimals)), typeOut.decimals),
                            gasLimit: 850000
                        }
                    );
                } else {
                    tx = await YOCSwapContract.addLiquidity(
                        typeIn.address,
                        typeOut.address,
                        convertEthToWei(String(Number(+amountIn).toFixed(typeIn.decimals)), typeIn.decimals),
                        convertEthToWei(String(Number(+amountOut).toFixed(typeOut.decimals)), typeOut.decimals),
                        '0',
                        '0',
                        account,
                        MaxUint256,
                        // MaxUint256, 
                        {
                            gasLimit: 1850000
                        }
                    );
                }
                const receipt = await tx.wait();
                setMyBalanceIn(+mathExact('Subtract', +myBalanceIn, +amountIn));
                setMyBalanceOut(+mathExact('Subtract', +myBalanceOut, +amountOut));
                setPendingLiquidity(false);
                setConfirmDeposit(false)
                setRate(amountIn / amountOut);
                alertShow({ content: 'Add Liquidity Successfully!', status: 'success' });
            }
        } catch (error: any) {
            console.dir(error)
            if (error.code == "UNPREDICTABLE_GAS_LIMIT") alertShow({ content: 'Insufficient B amount', status: 'error' });
            setPendingLiquidity(false);
            setConfirmDeposit(false)
        }
    }

    const changeTokenEach = () => {
        const tempType = typeIn;
        setTypeIn(typeOut as tokenInterface);
        setTypeOut(tempType as tokenInterface);

        const tempBalance = myBalanceIn;
        setMyBalanceIn(myBalanceOut);
        setMyBalanceOut(tempBalance);

        const tempAmount = amountIn;
        setAmountIn(amountOut);
        setAmountOut(tempAmount);

        if (rate) setRate(1 / rate);

        const tempAllowance = allowanceIn;
        setAllowanceIn(allowanceOut);
        setAllowanceOut(tempAllowance);

        const tempPendingApprove = pendingApproveIn;
        setPendingApproveIn(pendingApproveOut);
        setPendingApproveOut(tempPendingApprove);
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
                                    Liquidity
                                    <div className='absolute right-0 top-0'>
                                        <img className='h-[35px]' src='/images/swap-header.png' alt='swap' />
                                    </div>
                                </h3>
                                <p className='text-dark-secondary mt-4 text-center'>Lorum Ipsum deposit stir</p>
                            </div>
                            <div className='relative px-3 py-6 bg-primary-pattern border border-[#ffffff28] rounded -mx-[1px]'>
                                <div className='flex flex-col justify-between'>
                                    <label className='mb-2' htmlFor='first'>Input</label>
                                    <TokenComponent type={typeIn} setType={(v) => setTypeInHandle(v)} amount={amountIn} setAmount={(v) => setAmountInHandle(v)} ignoreValue={typeOut} disabled={!Boolean(account)} />
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center py-3'>
                                        <label className='text-sm mr-2'>Balance:</label>
                                        <span className='text-sm text-[#8B8B8B]'>{myBalanceIn}</span>
                                    </div>
                                    <div className='flex items-center'>
                                        {
                                            pendingApproveIn ?
                                                <SimpleLoading className="w-[20px]" />
                                                : (
                                                    ((!allowanceIn && (typeIn && typeIn.address != WETH)) || allowanceIn < amountIn) ?
                                                        <button className='bg-btn-primary px- w-full px-2 text-sm rounded shadow-btn-primary' onClick={() => approveHandle(typeIn, 'in')}>approve</button>
                                                        : ""
                                                )
                                        }
                                    </div>
                                </div>
                                <div className='absolute z-[1] left-1/2 aspect-[1/1] -bottom-[calc(16px_+_0.5rem)] -translate-x-1/2 cursor-pointer'><img src='/images/swap.png' alt="swap" width={40} height={40} onClick={() => changeTokenEach()} /></div>
                            </div>
                            <div className='relative -z-0 px-3 pt-6 pb-4 mt-1 bg-secondary-pattern border border-[#ffffff28] rounded -mx-[1px]'>
                                <div className='flex flex-col justify-between'>
                                    <label className='mb-2' htmlFor='second'>Input</label>
                                    <TokenComponent type={typeOut} setType={(v) => setTypeOutHandle(v)} amount={amountOut} setAmount={(v) => setAmountOutHandle(v)} ignoreValue={typeIn} disabled={!Boolean(account)} />
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center py-3'>
                                        <label className='text-sm mr-2'>Balance:</label>
                                        <span className='text-sm text-[#8B8B8B]'>{myBalanceOut}</span>
                                    </div>
                                    <div className='flex items-center'>
                                        {
                                            pendingApproveOut ?
                                                <SimpleLoading className="w-[20px]" />
                                                : (
                                                    ((!allowanceOut && (typeOut && typeOut.address != WETH)) || allowanceOut < amountOut) ?
                                                        <button className='bg-btn-primary px- w-full px-2 text-sm rounded shadow-btn-primary' onClick={() => approveHandle(typeOut as tokenInterface, 'out')}>approve</button>
                                                        : ""
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='px-3 py-4'>
                                {/* <div className='flex justify-between items-center'>
                                    <p className='text-primary text-lg font-semibold'>LP Tokens</p>
                                    <span className='text-secondary text-md'>{Number(rate).toFixed(2)}</span>
                                </div> */}
                                {
                                    pendingLiquidity ?
                                        <button className='bg-btn-primary w-full flex justify-around items-center py-5 my-10 text-3xl rounded-lg shadow-btn-primary z-[100]' ><SimpleLoading className='w-[36px] h-[36px]' /></button>
                                        : (account ?
                                            <button className='bg-btn-primary w-full py-5 my-10 text-3xl rounded-lg shadow-btn-primary z-[100] disabled:bg-btn-disable' disabled={(allowanceIn < amountIn || allowanceOut < amountOut || !+amountIn || amountIn > myBalanceIn || !+amountOut || amountOut > myBalanceOut) as boolean} onClick={() => setConfirmDeposit(true)}>Add liquidity</button>
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

            <Modal size='small' show={confirmDeposit} onClose={() => { setConfirmDeposit(false) }}>
                <div className='w-full flex flex-col justify-around items-center py-8 px-12 text-white'>
                    <p className='text-base font-semibold w-full mb-2'>{typeIn?.symbol}/{typeOut?.symbol} Tokens</p>
                    <h2 className='text-3xl font-semibold w-full py-3 mb-6 leading-8 border-b-2 border-solid border-white'>
                        {/* {"232.09"} */}
                    </h2>
                    <div className='mb-8 w-full'>
                        <div className='w-full flex justify-between items-center mb-2'>
                            <p className='text-lg font-semibold '>{typeIn?.symbol} Deposited</p>
                            <p className='text-lg font-semibold'>{amountIn}</p>
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <p className='text-lg font-semibold '>{typeOut?.symbol} Deposited</p>
                            <p className='text-lg font-semibold'>{amountOut}</p>
                        </div>
                    </div>
                    <div className='flex flex-col w-full justify-between'>
                        <span className='text-lg mb-2'>Rates</span>
                        <div className='flex flex-col w-full min-w-[200px]'>
                            <div className='flex justify-between'>
                                <div className='w-[70px] flex justify-between'>
                                    <span>{"1"} {typeIn?.symbol}</span>
                                    <span>=</span>
                                </div>
                                <span className='text-ellipsis'>{Number(+(rate ? rate : convertRate(amountOut, amountIn))).toFixed(typeOut ? typeOut.decimals : 16)} {typeOut?.symbol}</span>
                            </div>
                            <div className='flex justify-between'>
                                <div className='w-[70px] flex justify-between'>
                                    <span>{"1"} {typeOut?.symbol}</span>
                                    <span>=</span>
                                </div>
                                <span className='text-ellipsis'>{Number(+rate ? mathExact('Divide', 1, +rate) : convertRate(amountIn, amountOut)).toFixed(typeIn ? typeIn.decimals : 16)} {typeIn?.symbol}</span>
                            </div>
                        </div>
                    </div>
                    {
                        pendingLiquidity ?
                            <button className='bg-btn-primary max-w-[350px] w-full flex items-center justify-around py-4 mt-6 text-3xl rounded-lg shadow-btn-primary z-[100]' ><SimpleLoading className='w-[36px] h-[36px]' /></button>
                            :
                            <button className='bg-btn-primary max-w-[350px] w-full py-4 mt-6 text-3xl rounded-lg shadow-btn-primary' onClick={() => addLiquidity()}>Confirm Deposit</button>
                    }
                </div>
            </Modal>
        </div>
    )
}

export default Liquidity;