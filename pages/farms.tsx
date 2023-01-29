import React, { FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Contract, constants } from 'ethers';
const { MaxUint256, AddressZero, Zero } = constants;

import Footer from "../src/components/common/FooterV2";
import Navbar from "../src/components/common/Navbar";
import Modal from "../src/components/widgets/Modalv2";

import { YOCFarm, YOCSwapRouter, YOCPair, TokenTemplate, YOC, USDCToken } from "../src/constants/contracts";
import { rpc_provider_basic } from '../utils/rpc_provider';
import { PoolInterface, PairOpenInterface } from "../src/interfaces/pools";
import { alert_show, loading_end, loading_start, walletConnect } from "../store/actions";
import { convertEthToWei, convertRate, convertWeiToEth } from "../utils/unit";
import { WALLET_CONNECT } from "../store/types";

const Farm: FC = () => {
    const dispatch = useDispatch();
    const { provider, signer, account, rpc_provider } = useSelector((state: any) => state.data);
    const [sortBy, setSortBy] = useState('');
    const [searchText, setSearchText] = useState('');
    const [pairsOpen, setPairsOpen] = useState<PairOpenInterface[]>([]);
    const [pairs, setPairs] = useState<PoolInterface[]>([]);
    const [selectPair, setSelectPair] = useState<PoolInterface>();
    const [stakeLpModalShow, setStakeLpModalShow] = useState(false);
    const [unstakeLpModalShow, setUnstakeLpModalShow] = useState(false);
    const [stakeLpAmount, setStakeLpAmount] = useState(0);
    const [unstakeLpAmount, setUnstakeLpAmount] = useState(0);
    const [stakeLpMax, setStakeLpMax] = useState(false);
    const [unstakeLpMax, setUnstakeLpMax] = useState(false);
    const [enableModalShow, setEnableModalShow] = useState(false);
    const [farmContract] = useState(new Contract(
        YOCFarm.address,
        YOCFarm.abi,
        rpc_provider_basic
    ));
    const [swapContract] = useState(new Contract(
        YOCSwapRouter.address,
        YOCSwapRouter.abi,
        rpc_provider_basic
    ));

    useEffect(() => {
        dispatch(loading_start() as any);
        (async () => {
            let pools: PoolInterface[] = [];
            for (let i = 0; i < YOCFarm.pools.length; i++) {
                pools.push({
                    loading: true
                })
            }
            setPairs(pools);

            for (let index = 0; index < YOCFarm.pools.length; index++) {
                const item = pools[index];
                const pId = YOCFarm.pools[index];
                const lpTokenAddress = await farmContract.lpToken(pId);
                const poolInfo = await farmContract.poolInfo(pId);
                let PairContract = new Contract(
                    lpTokenAddress,
                    YOCPair.abi,
                    rpc_provider_basic
                )
                const decimal = await PairContract.decimals();
                const symbol = await PairContract.symbol();
                const liquidity = convertWeiToEth(await PairContract.totalSupply(), decimal);
                // console.log(decimal, symbol, liquidity)
                let balance, allowance, earned, lpAmount;
                if (account) {
                    earned = convertWeiToEth(String(await farmContract.pendingYOC(pId, account)), Number(YOC.decimals));
                    balance = convertWeiToEth(String(await PairContract.balanceOf(account)), Number(decimal));
                    // console.log(PairContract, balance);
                    allowance = await PairContract.allowance(account, YOCFarm.address);
                    let userInfo = await farmContract.userInfo(pId, account);
                    lpAmount = userInfo ? convertWeiToEth(String(userInfo[0]), Number(decimal)) : 0;
                };
                let token0Address = await PairContract.token0();
                let token1Address = await PairContract.token1();
                let token0 = new Contract(
                    token0Address,
                    TokenTemplate.abi,
                    rpc_provider_basic
                );
                let token0Symbol = await token0.symbol();
                let token0Decimal = await token0.decimals();
                let token1 = new Contract(
                    token1Address,
                    TokenTemplate.abi,
                    rpc_provider_basic
                );
                let token1Symbol = await token1.symbol();
                let token1Decimal = await token1.decimals();


                // APR
                const totalAlloc = await farmContract.totalAllocPoint();
                const alloc = poolInfo.allocPoint;
                // console.log(alloc, Number(alloc) / Number(totalAlloc) * 20 * 60 * 60 * 24 * 365);
                let yearYocUSDRes = Number(convertWeiToEth((await swapContract.getAmountsOut(
                    convertEthToWei(String(Number(Number(alloc) / Number(totalAlloc) * 20 * 60 * 60 * 24 * 365).toFixed(YOC.decimals)), YOC.decimals),
                    [
                        YOC.address,
                        USDCToken.address
                    ]
                ))[1], USDCToken.decimals));
                console.log(liquidity, token0Decimal, token1Decimal);
                console.log('YOC: ', yearYocUSDRes);
                let LPTotalUSDRes = 0;
                if (token0Address != USDCToken.address) {
                    LPTotalUSDRes = Number(convertWeiToEth((await swapContract.getAmountsOut(
                        convertEthToWei(liquidity, token0Decimal),
                        [
                            token0Address,
                            USDCToken.address
                        ]
                    ))[1], USDCToken.decimals));
                } else {
                    LPTotalUSDRes = Number(liquidity)
                }
                console.log('TOKEN: ', LPTotalUSDRes);
                if (token1Address != USDCToken.address) {
                    LPTotalUSDRes += Number(convertWeiToEth((await swapContract.getAmountsOut(
                        convertEthToWei(liquidity, token1Decimal),
                        [
                            token1Address,
                            USDCToken.address
                        ]
                    ))[1], USDCToken.decimals));
                } else {
                    LPTotalUSDRes += Number(liquidity)
                }
                console.log('TOKEN: ', LPTotalUSDRes);
                const APR = Number(yearYocUSDRes / LPTotalUSDRes * 100);


                pools[index] = {
                    ...item,
                    address: lpTokenAddress,
                    decimal: decimal,
                    symbol: symbol,
                    balance: balance ? Number(balance) : 0,
                    lpAmount: lpAmount ? Number(lpAmount) : 0,
                    token0: token0Symbol,
                    token1: token1Symbol,
                    liquidity: Number(liquidity),
                    allocPoint: Number(poolInfo.allocPoint),
                    earned: earned ? Number(earned) : 0,
                    APR: APR,
                    approve: Number(allowance) ? true : false,
                    loading: false,
                    pairId: pId,
                };
                setPairs(pools);
            }
        })();
        dispatch(loading_end() as any);
    }, [account])

    const togglePairOpenHandle = (pairInfo: any) => {
        if (pairInfo.loading) return;
        let newPairOpen: PairOpenInterface[] = [];
        for (let i = 0; i < pairs.length; i++) {
            newPairOpen.push({
                address: "" + (pairs[i].address),
                toggle: pairsOpen[i] ? pairsOpen[i].toggle : false
            });
        }
        setPairsOpen(newPairOpen.map((item) => {
            return (item.address == pairInfo.address) ? {
                ...item,
                toggle: !item.toggle
            } : item;
        }));
    }

    const enableModalHandle = (pair: PoolInterface) => {
        setSelectPair(pair)
        setEnableModalShow(true);
    }

    const enableHandle = async () => {
        dispatch(loading_start() as any);
        try {
            const pair = selectPair;
            let PairContract = new Contract(
                pair?.address + '',
                YOCPair.abi,
                signer
            )
            const tx = await PairContract.approve(YOCFarm.address, MaxUint256);
            await tx.wait();
            setPairs(pairs.map(item => item.address == pair?.address ? { ...item, approve: true } : item));
            setEnableModalShow(false);
            dispatch(loading_end() as any);
        } catch (err) {
            dispatch(loading_end() as any);
        }
    }

    const stakeLPModalHandle = (pair: PoolInterface) => {
        setSelectPair(pair);
        setStakeLpModalShow(true);
    }

    const unstakeModalHandle = (pair: PoolInterface) => {
        setSelectPair(pair);
        setUnstakeLpModalShow(true);
    }

    const setMaxStakeLpAmountHandle = () => {
        setStakeLpAmount((selectPair && Boolean(selectPair.balance)) ? Number(selectPair.balance) : 0);
        setStakeLpMax(true);
    }

    const setMaxUnstakeAmountHandle = () => {
        setUnstakeLpAmount((selectPair && Boolean(selectPair.lpAmount)) ? Number(selectPair.lpAmount) : 0);
        setUnstakeLpMax(true);
    }

    const stakeLPHandle = async (pair: PoolInterface) => {
        if (!stakeLpAmount) {
            dispatch(alert_show({ content: 'Please input the stakeLP amount exactly', status: 'error' }) as any)
            return;
        }
        dispatch(loading_start() as any);
        try {
            let PairContract = new Contract(
                YOCFarm.address,
                YOCFarm.abi,
                signer
            )
            console.log(stakeLpAmount);
            const tx = await PairContract.deposit(pair.pairId, convertEthToWei(String(stakeLpAmount), Number(selectPair?.decimal)), {
                gasLimit: 3000000
            });
            await tx.wait();
            setPairs(pairs.map(item => item.address == pair?.address ? { ...item, lpAmount: Number(item.lpAmount) + stakeLpAmount, balance: Number(item.balance) - stakeLpAmount } : item));
            setStakeLpModalShow(false);
            dispatch(loading_end() as any);
        } catch (err) {
            console.log(err);
            dispatch(loading_end() as any);
        }
    }

    const unstakeLPHandle = async (pair: PoolInterface) => {
        if (!unstakeLpAmount) {
            dispatch(alert_show({ content: 'Please input the unstakeLP amount exactly', status: 'error' }) as any)
            return;
        }
        dispatch(loading_start() as any);
        try {
            let PairContract = new Contract(
                YOCFarm.address,
                YOCFarm.abi,
                signer
            )
            console.log(unstakeLpAmount);
            const tx = await PairContract.withdraw(pair.pairId, convertEthToWei(String(unstakeLpAmount), Number(selectPair?.decimal)), {
                gasLimit: 3000000
            });
            await tx.wait();
            setPairs(pairs.map(item => item.address == pair?.address ? { ...item, lpAmount: Number(item.lpAmount) - unstakeLpAmount, balance: Number(item.balance) + unstakeLpAmount } : item));
            setUnstakeLpModalShow(false);
            dispatch(loading_end() as any);
        } catch (err) {
            console.log(err);
            dispatch(loading_end() as any);
        }
    }

    const harvestHandle = async (pair: PoolInterface) => {
        dispatch(loading_start() as any);
        try {
            let PairContract = new Contract(
                YOCFarm.address,
                YOCFarm.abi,
                signer
            )
            const tx = await PairContract.withdraw(pair.pairId, 0, {
                gasLimit: 3000000
            });
            await tx.wait();
            setPairs(pairs.map(item => item.address == pair?.address ? { ...item, earned: 0, balance: Number(item.balance) + Number(item.earned) } : item));
            let YOCContract = new Contract(
                YOC.address,
                TokenTemplate.abi,
                rpc_provider_basic
            )
            let balance = Number(convertWeiToEth(await YOCContract.balanceOf(account), 18));
            dispatch({
                type: WALLET_CONNECT,
                payload: {
                    balance: balance,
                }
            })
            dispatch(loading_end() as any);
        } catch (err) {
            console.log(err);
            dispatch(loading_end() as any);
        }
    }

    return <div>
        <Navbar />
        <div className="container mx-auto">
            <div className=" bg-bg-pattern p-4">
                <div className="py-4 px-8 bg-primary-pattern flex flex-col items-end">
                    <h3 className="w-full text-left font-semibold text-xl mb-4">YOC Liquidity Mining</h3>
                    <p className="w-full text-left text-base mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tortor felis nulla sit. Pretium fusce nisi, rutrum semper quam a amet a.
                        Elit a venenatis mattis massa sodales nec tellus. Nisl velit vel est, a mattis facilisi. </p>
                    <button className="px-4 py-2 mb-4 rounded flex items-center border-1 border-solid border-secondary">
                        <span className="text-sm mr-2">Read More...</span>
                        <img className="w-[20px]" src='./images/prev.png' alt='more' />
                    </button>
                </div>

                <div className="">
                    <div className="mt-6">
                        <div className="flex justify-between items-center py-4">
                            <h3 className="font-semibold text-xl">Participating Pools</h3>
                            <h3 className="font-semibold text-xl">The Rewards Never Ends</h3>
                        </div>
                        <div className="text-base text-primary flex items-center">
                            <div className="flex border border-solid overflow-hidden h-[40px] border-secondary rounded-full mr-4">
                                <div className="cursor-pointer w-[100px] text-center px-4 py-1.5 bg-[#a4a2a878] rounded-full">Live</div>
                                <div className="cursor-pointer w-[100px] text-center px-4 py-1.5">Finished</div>
                            </div>
                            <select className="px-4 py-1 h-[40px] mr-4 flex bg-transparent border border-solid overflow-hidden border-secondary rounded" value={sortBy} onChange={(e: React.FormEvent) => setSortBy((e.target as any).value)}>
                                <option className="p-2 bg-dark-primary" value={''}>Sortby</option>
                                <option className="p-2 bg-dark-primary" value={'earned'}>Earned</option>
                                <option className="p-2 bg-dark-primary" value={'apr'}>APR</option>
                                <option className="p-2 bg-dark-primary" value={'liquidity'}>Liquidity</option>
                                <option className="p-2 bg-dark-primary" value={'multiplier'}>Multiplier</option>
                            </select>
                            <div className="h-[40px] rounded flex items-center border-1 border-solid border-secondary">
                                <input className="pl-2 py-1 bg-transparent" placeholder="Search Forms"
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <img className="w-[20px] mx-2" src="./images/search-status.png" alt="search" />
                            </div>
                        </div>
                    </div>

                    {
                        pairs.sort((a: any, b: any) => {
                            if (sortBy == "") {
                                return 0;
                            } else if (sortBy == 'earned') {
                                return b.earned - a.earned;
                            } else if (sortBy == 'apr') {
                                return 0;
                            } else if (sortBy == 'liquidity') {
                                return b.liquidity - a.liquidity;
                            } else {
                                return b.allocPoint - a.allocPoint;
                            }
                        }).filter(item => {
                            if (item.address?.indexOf(searchText) != -1
                                || item.token0?.indexOf(searchText) != -1
                                || item.token1?.indexOf(searchText) != -1
                                || String(item.allocPoint)?.indexOf(searchText) != -1
                                || String(item.liquidity)?.indexOf(searchText) != -1
                                || String(item.earned)?.indexOf(searchText) != -1
                                || String(item.APR)?.indexOf(searchText) != -1) return true;
                        }).map((item, index) => {
                            return (
                                <div key={index + "_"}>
                                    <div className="mt-4 p-4 flex justify-between items-center bg-row-pattern cursor-pointer"
                                        onClick={() => togglePairOpenHandle(item)}
                                    >
                                        <div className="flex items-center w-[calc(100%_-_50px)]">
                                            <div className="w-[48px] h-[48px] mr-4">
                                                <img className="w-full h-full" src="/images/pair.png" alt="pair" />
                                            </div>
                                            <div className="w-[120px] mr-4">
                                                {
                                                    item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
                                                        <p className="h-[24px] w-[80px] bg-gray-200 rounded-full"></p>
                                                        &nbsp;/&nbsp;
                                                        <p className="h-[24px] w-[80px] bg-gray-200 rounded-full"></p>
                                                    </div> :
                                                        (`${item.token0} / ${item.token1}`)
                                                }
                                            </div>
                                            <div className=" mr-8">
                                                {
                                                    item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
                                                        <p className="h-[22px] w-[70px] bg-gray-200 rounded-full"></p>
                                                    </div> :
                                                        <button className="flex items-center rounded-full border-[1px] border-solid border-secondary bg-[#a4a2a878] px-1.5 py-1 text-primary">
                                                            <img className="h-[16px] mr-1" src="/images/verify.png" alt="verify" />
                                                            <span className="leading-[1] text-sm pr-2">Core</span>
                                                        </button>
                                                }
                                            </div>
                                            <div className="min-w-[120px] w-[16%] mr-4">
                                                <div className="mb-2">Earned</div>
                                                {
                                                    item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
                                                        <p className="h-3 bg-gray-200 rounded-full w-12"></p>
                                                    </div> :
                                                        <p className="text-[#C7C7C7]">{item.earned ? item.earned.toFixed(3) : 0}</p>
                                                }
                                            </div>
                                            <div className="min-w-[120px] w-[16%] mr-4">
                                                <div className="mb-2">APR</div>
                                                {

                                                    item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
                                                        <p className="h-3 bg-gray-200 rounded-full w-12"></p>
                                                    </div> :
                                                        <p className="text-[#C7C7C7]">{item.APR ? item.APR.toFixed(2) : 0}%</p>
                                                }
                                            </div>
                                            <div className="min-w-[120px] w-[16%] mr-4">
                                                <div className="mb-2">Liquidity</div>
                                                {

                                                    item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
                                                        <p className="h-3 bg-gray-200 rounded-full w-12"></p>
                                                    </div> :
                                                        <p className="text-[#C7C7C7]">{item.liquidity ? item.liquidity.toFixed(3) : 0}</p>
                                                }
                                            </div>
                                            <div className="min-w-[120px] w-[16%] mr-4">
                                                <div className="mb-2">Multiplier</div>
                                                {

                                                    item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
                                                        <p className="h-3 bg-gray-200 rounded-full w-12"></p>
                                                    </div> :
                                                        <p className="text-[#C7C7C7]">{item.allocPoint ? item.allocPoint : item.allocPoint} x</p>
                                                }
                                            </div>
                                        </div>
                                        <button onClick={() => togglePairOpenHandle(item)}>
                                            <img className={`w-[24px] transition-all ${(pairsOpen && pairsOpen.find(i => i.address == item.address) && pairsOpen.find(i => i.address == item.address)?.toggle) ? '' : 'rotate-180'}`} src="/images/arrow-up.png" alt="arrow-up" />
                                        </button>
                                    </div>

                                    <div className={`flex overflow-hidden transition-all ${(pairsOpen && pairsOpen.find(i => i.address == item.address) && pairsOpen.find(i => i.address == item.address)?.toggle) ? 'pt-4 h-[124px]' : 'h-0'}`} >
                                        <div className="w-[160px] text-secondary flex flex-col justify-center">
                                            <a className="mb-2" href={`/liquidity`}>Get LP</a>
                                            <a className="mb-2" href={`https://goerli.etherscan.io/address/${YOCFarm.address}`} >Contract Details</a>
                                            <a href={`https://goerli.etherscan.io/address/${item?.address}`}>Pair Info</a>
                                        </div>
                                        <div className="h-[110px] px-4 py-4 ml-2 bg-normal-pattern w-[calc(50%_-_60px)] flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">Earned</h3>
                                                <p className="leading-4">{item.earned ? item.earned : 0}</p>
                                            </div>
                                            <div className="flex justify-end">
                                                <button className="flex h-[36px] items-center rounded-full border-[1px] border-solid border-secondary bg-btn-primary px-3 py-1 text-primary disabled:bg-btn-disable disabled:border-[#0f5856]" disabled={!account || !item.approve || !item.earned}
                                                    onClick={() => harvestHandle(item)}
                                                >
                                                    Harvest
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-[110px] px-4 py-4 ml-2 bg-normal-pattern w-[calc(50%_-_60px)] flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {
                                                        account ? (
                                                            `${item.symbol}`
                                                        ) : (
                                                            "Start Farming"
                                                        )
                                                    }
                                                </h3>
                                            </div>
                                            <div className="flex justify-end">
                                                {
                                                    account ?
                                                        (
                                                            item.approve ?
                                                                (
                                                                    item.lpAmount ? (
                                                                        <div className="w-full h-full flex items-center justify-between">
                                                                            <span className="font-semibold">{item.lpAmount ? item.lpAmount : 0}</span>
                                                                            <div className="flex items-center">
                                                                                <button className="border border-border-primary rounded-lg p-2.5 mr-2" onClick={() => unstakeModalHandle(item)}>
                                                                                    <svg viewBox="0 0 24 24" color="primary" width="14px" xmlns="http://www.w3.org/2000/svg" className="text-border-primary"><path fill="currentColor" d="M18 13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z"></path></svg>
                                                                                </button>
                                                                                <button className="border border-border-primary rounded-lg p-2.5" onClick={() => stakeLPModalHandle(item)}>
                                                                                    <svg viewBox="0 0 24 24" color="primary" width="14px" xmlns="http://www.w3.org/2000/svg" className="text-border-primary"><path fill="currentColor" d="M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z"></path></svg>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <button className="h-[36px] rounded text-sm w-[120px] bg-btn-primary shadow-btn-primary px-4 py-1.5 text-primary"
                                                                            onClick={() => stakeLPModalHandle(item)}
                                                                        >
                                                                            Stake LP
                                                                        </button>
                                                                    )
                                                                )
                                                                :
                                                                <button className="h-[36px] rounded text-sm w-[120px] bg-btn-primary shadow-btn-primary px-4 py-1.5 text-primary"
                                                                    onClick={() => enableModalHandle(item)}
                                                                >
                                                                    Enable
                                                                </button>
                                                        )
                                                        :
                                                        <button className="h-[36px] rounded text-sm w-[160px] bg-btn-secondary shadow-btn-secondary px-4 py-1.5 text-primary"
                                                            onClick={() => {
                                                                dispatch(walletConnect() as any);
                                                            }}
                                                        >
                                                            Connect Wallet
                                                        </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        pairs.sort((a: any, b: any) => {
                            if (sortBy == "") {
                                return 0;
                            } else if (sortBy == 'earned') {
                                return b.earned - a.earned;
                            } else if (sortBy == 'apr') {
                                return 0;
                            } else if (sortBy == 'liquidity') {
                                return b.liquidity - a.liquidity;
                            } else {
                                return b.allocPoint - a.allocPoint;
                            }
                        }).filter(item => {
                            if (item.address?.indexOf(searchText) != -1
                                || item.token0?.indexOf(searchText) != -1
                                || item.token1?.indexOf(searchText) != -1
                                || String(item.allocPoint)?.indexOf(searchText) != -1
                                || String(item.liquidity)?.indexOf(searchText) != -1
                                || String(item.earned)?.indexOf(searchText) != -1
                                || String(item.APR)?.indexOf(searchText) != -1) return true;
                        }).length == 0 ? (
                            <div className="mt-4 p-4 flex justify-between items-center bg-row-pattern">
                                <p className="">There is not pools</p>
                            </div>
                        ) : ""
                    }
                </div>

                <div className="flex items-center justify-center my-4">
                    <img className="w-[20px]" src="./images/prev.png" alt="prev" />
                    <span className="px-2 text-lg">Page {1} of {1}</span>
                    <img className="w-[20px]" src="./images/next.png" alt="next" />
                </div>
            </div>
        </div>
        <Footer emptyLogo={true} />

        <Modal size="small" show={enableModalShow} onClose={() => setEnableModalShow(false)}>
            <div className="p-6 pt-8 text-primary">
                <p className="text-lg py-4">Allow <span className="text-secondary">yoc.com</span> to spend your {selectPair?.token0 + "/" + selectPair?.token1}?</p>
                <p className="mb-6 text-sm leading-7">Do you trust this site? By granting this permission, you’re
                    allowing to withdraw your {selectPair?.token0 + "/" + selectPair?.token1}
                    and automate transaction for you.</p>
                {/* <hr className="bg-white mb-4" /> */}

                {/* <div className="flex flex-col w-full mb-4 py-2">
                    <div className="flex justify-between items-center font-semibold mb-4">
                        <span>Transaction Fee</span>
                        <span>{0.17} USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>A fee is associated with this request.</span>
                        <span>{0.0023}</span>
                    </div>
                </div> */}

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => enableHandle()}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setEnableModalShow(false)}>Reject</button>
                </div>
            </div>
        </Modal>

        <Modal size="small" show={stakeLpModalShow} onClose={() => setStakeLpModalShow(false)}>
            <div className="p-6 pt-8 flex flex-col text-primary">
                <h3 className="font-semibold text-xl mb-6">Stake LP Tokens</h3>
                <div className="flex justify-between mb-4">
                    <div className="w-[calc(100%_-_180px)]">
                        <p className="mb-4">Stake</p>
                        <input className="w-full px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={stakeLpAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setStakeLpAmount(Number(e.target.value)); setStakeLpMax(false); }} />
                    </div>
                    <div className="w-[160px]">
                        <p className="mb-4">Balance: {(selectPair && selectPair.balance) ? Number(selectPair.balance).toFixed(6) : 0}</p>
                        <button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxStakeLpAmountHandle()}>MAX</button>
                    </div>
                </div>
                <p className="mb-4">{`${selectPair?.token0} & ${selectPair?.token1}`}</p>
                <a className="text-secondary mb-6" href={`https://goerli.etherscan.io/address/${selectPair?.address}`}>Get LP</a>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => stakeLPHandle(selectPair as PoolInterface)}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setStakeLpModalShow(false)}>Reject</button>
                </div>
            </div>
        </Modal>

        <Modal size="small" show={unstakeLpModalShow} onClose={() => setUnstakeLpModalShow(false)}>
            <div className="p-6 pt-8 flex flex-col text-primary">
                <h3 className="font-semibold text-xl mb-6">Unstake LP Tokens</h3>
                <div className="flex justify-between mb-4">
                    <div className="w-[calc(100%_-_180px)]">
                        <p className="mb-4">Unstake</p>
                        <input className="w-full px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={unstakeLpAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUnstakeLpAmount(Number(e.target.value)); setUnstakeLpMax(false); }} />
                    </div>
                    <div className="w-[160px]">
                        <p className="mb-4">Balance: {(selectPair && selectPair.lpAmount) ? selectPair.lpAmount.toFixed(6) : 0}</p>
                        <button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxUnstakeAmountHandle()}>MAX</button>
                    </div>
                </div>
                <p className="mb-4">{`${selectPair?.token0} & ${selectPair?.token1}`}</p>
                <a className="text-secondary mb-6" href={`https://goerli.etherscan.io/address/${selectPair?.address}`}>Get LP</a>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => unstakeLPHandle(selectPair as PoolInterface)}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setUnstakeLpModalShow(false)}>Reject</button>
                </div>
            </div>
        </Modal>
    </div >
}

export default Farm;