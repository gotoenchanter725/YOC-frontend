import React, { FC, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Contract, BigNumber, constants, utils } from 'ethers';
const { MaxUint256, AddressZero, Zero } = constants;

import SideMenuBar from '@components/widgets/SideMenuBar';
import SimpleLoading from "@components/widgets/SimpleLoading";
import Modal from '@components/widgets/Modalv2';

import { TokenTemplate, YOCSwapRouter, YOCSwapFactory, WETH, YOCPair } from "../../src/constants/contracts";
import { useWallet, useAccount, useLoading, useAlert, useUserLiquidity, useNetwork, useCurrency } from '@hooks/index';
import { convertEthToWei, convertWeiToEth } from 'utils/unit';

const txRunLimitTime = 1000 * 60 * 5; // 5 min

const Liquidity: FC = () => {
    const { account, signer } = useAccount();
    const { connectWallet } = useWallet();
    const { explorer } = useNetwork();
    const { alertShow } = useAlert();
    const { loadingStart, loadingEnd } = useLoading();
    const { getCurrencyDetail } = useCurrency(); 
    const { liquidities: pools, loadLiquidityPools, isLoading } = useUserLiquidity();
    const [liquidityToggle, setLiquidityToggle] = useState<Number[]>([]);
    const [removeLiquidityModel, setRemoveLiquidityModel] = useState(false);
    const [LpAmount, setLpAmount] = useState("0");
    const [selectPool, setSelectPool] = useState<any>();

    const swapContract = useMemo(() => {
        return new Contract(
            YOCSwapRouter.address,
            YOCSwapRouter.abi,
            signer
        )
    }, [YOCSwapRouter, signer]);

    useEffect(() => {
        setLiquidityToggle([...new Array(pools.length).map(item => 0)]);
    }, [account, pools.length])

    const togglePoolHandle = (index: number) => {
        let rst: any[] = liquidityToggle.map((item: any, i: number) => {
            return i === index ? !item : item;
        });

        setLiquidityToggle([...rst]);
    }

    const openRemoveLiquidityModel = (pool: any) => {
        setRemoveLiquidityModel(true);
        setSelectPool(pool);
    }

    const setMaxLpAmountHandle = async () => {
        if (selectPool) {
            setLpAmount(selectPool.LPBalance);
        }
    }

    const removeLiquidityHandle = async () => {
        try {
            loadingStart();
            swapContract.on('RemoveLiquidity', (addresses, amounts) => {
                // token0, token1, pair, userAddress
                // amount0, amount1, lp
                // if (amounts[3] == account) {
                    let currency0 = getCurrencyDetail(addresses[0]);
                    let currency1 = getCurrencyDetail(addresses[1]);
                    let realAmount0 = convertWeiToEth(amounts[0], currency0.decimals);
                    let realAmount1 = convertWeiToEth(amounts[1], currency1.decimals);
                    alertShow({
                        status: "success", 
                        content: `Remove liquidity Successfully!`, 
                        text: `Sent ${currency0.symbol}: ${realAmount0} ${currency1.symbol}: ${realAmount1}`
                    })
                // }
            })
            let tx;
            if (selectPool.currency0.address == WETH) {
                tx = await swapContract.removeLiquidityETH(
                    selectPool.currency1.address,
                    convertEthToWei(LpAmount, 18),
                    0,
                    0,
                    account,
                    Date.now() + txRunLimitTime + '',
                    {
                        gasLimit: 300000
                    }
                )
            } else if (selectPool.currency1.address == WETH) {
                tx = await swapContract.removeLiquidityETH(
                    selectPool.currency0.address,
                    convertEthToWei(LpAmount, 18),
                    0,
                    0,
                    account,
                    Date.now() + txRunLimitTime + '',
                    {
                        gasLimit: 300000
                    }
                )
            } else {
                tx = await swapContract.removeLiquidity(
                    selectPool.currency0.address,
                    selectPool.currency1.address,
                    convertEthToWei(LpAmount, 18),
                    0,
                    0,
                    account,
                    Date.now() + txRunLimitTime + '',
                    {
                        gasLimit: 202166
                    }
                )
            }
            await tx.wait();
            loadLiquidityPools();
            loadingEnd();
            setRemoveLiquidityModel(false);
        } catch (error) {
            console.log(error);
            loadingEnd();
        }
    }

    const approveHandle = async () => {
        if (selectPool) {
            try {
                loadingStart();
                const pairContract = new Contract(selectPool.item.liquidity.pairAddress, YOCPair.abi, signer);
                let tx = await pairContract.approve(YOCSwapRouter.address, MaxUint256, {
                    gasLimit: 30000
                });
                const MaxAllowanceAmount = convertWeiToEth(MaxUint256, 18);
                let tmpPool = selectPool;
                tmpPool.allowance = MaxAllowanceAmount;
                setSelectPool(tmpPool);
                await tx.wait();
                loadingEnd();
                alertShow({
                    status: "success",
                    content: "Approve Successfully!"
                })
            } catch (err) {
                loadingEnd();
            }
        }
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
                                                                            <button className='bg-btn-primary w-full mt-4 py-2 text-xl rounded-lg shadow-btn-primary z-[100] disabled:bg-btn-disable' onClick={() => openRemoveLiquidityModel(item)}>Remove liquidity</button>
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

            <Modal size='small' show={removeLiquidityModel} onClose={() => { setRemoveLiquidityModel(false) }}>
                <div className="p-6 pt-8 flex flex-col text-primary">
                    <h3 className="font-semibold text-xl mb-6">Remove Liquidity</h3>
                    <div className="flex flex-col justify-between mb-4">
                        <div className="flex justify-between item-center mb-4">
                            <p className="">{`${selectPool && selectPool.currency0 && selectPool.currency0.symbol}/${selectPool && selectPool.currency1 && selectPool.currency1.symbol} LP`}</p>
                            <p className="">Balance: {selectPool && selectPool.LPBalance}</p>
                        </div>
                        <div className="flex justify-between item-center">
                            <input className="w-full mr-4 px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={LpAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLpAmount(e.target.value)} />
                            <button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxLpAmountHandle()}>MAX</button>
                        </div>
                    </div>
                    <a className="text-secondary mb-6" href={`${explorer}/address/${selectPool?.item.liquidity.pairAddress}`}>Get LP</a>

                    <div className="flex justify-between">
                        {
                            selectPool && +selectPool.allowance ? (
                                <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => removeLiquidityHandle()}>Confirm</button>
                            ) : (
                                <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => approveHandle()}>Approve</button>
                            )
                        }
                        <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setRemoveLiquidityModel(false)}>Reject</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Liquidity;