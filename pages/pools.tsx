import React, { FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Contract, constants } from 'ethers';
const { MaxUint256, AddressZero, Zero } = constants;

import Footer from "../src/components/common/FooterV2";
import Navbar from "../src/components/common/Navbar";
import Modal from "../src/components/widgets/Modalv2";

import { YOCFarm, YOCSwapRouter, TokenTemplate, YOC, YOCPool, USDCToken } from "../src/constants/contracts";
import { TOKENS } from "../src/constants/tokens";
import { rpc_provider_basic } from '../utils/rpc_provider';
import { PairOpenInterface, StakeInterface } from "../src/interfaces/pools";
import { alert_show, loading_end, loading_start, walletConnect } from "../store/actions";
import { convertEthToWei, convertRate, convertWeiToEth } from "../utils/unit";

const Pools: FC = () => {
    const [after1second, setAfter1second] = useState(false);  // flag that checks if the 1 second is passed from when the page is loaded.
    const dispatch = useDispatch();
    const { provider, signer, account, rpc_provider } = useSelector((state: any) => state.data);
    const [sortBy, setSortBy] = useState('');
    const [searchText, setSearchText] = useState('');
    const [pairsOpen, setPairsOpen] = useState<PairOpenInterface[]>([]);
    const [pairs, setPairs] = useState<StakeInterface[]>([]);
    const [selectPair, setSelectPair] = useState<StakeInterface>();
    const [stakeModalShow, setStakeModalShow] = useState(false);
    const [unstakeModalShow, setUnstakeModalShow] = useState(false);
    const [stakeAmount, setStakeAmount] = useState(0);
    const [unstakeAmount, setUnstakeAmount] = useState(0);
    const [stakeMax, setStakeMax] = useState(false);
    const [unstakeMax, setUnstakeMax] = useState(false);
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
        (async () => {
            if (after1second) {
                dispatch(loading_start() as any);
                if (account) {
                    console.log("Account!");

                    const res: any = await getPools();
                    if (res.data.pools.length == pairs.length) {
                        await updatePools()
                    } else {
                        await checkPools();
                    }
                } else {
                    console.log("No Account!");

                    const res: any = await getPools();
                    if (res.data.pools.length == pairs.length) {
                        setPairs([...pairs.map((item: any) => {
                            return {
                                ...item,

                                balance: 0,
                                approve: 0,
                                earned: 0,
                                amount: 0,
                                usdcAmount: 0,
                            }
                        })])
                    } else {
                        await checkPools();
                    }
                }
                dispatch(loading_end() as any);
            }
        })()
    }, [account, after1second])

    const getPools = async () => {
        try {
            const res: any = await axios.get(process.env.API_ADDRESS + `/staking/pools`)
            return res;
        } catch (err) {
            return "Error";
        }
    }

    const checkPools = async () => {
        console.log("Check Pools");

        try {
            let pools: StakeInterface[] = [], poolsData: any = [];
            const res: any = await getPools();
            poolsData = res.data.pools;
            for (let i = 0; i < poolsData.length; i++) {
                pools.push({
                    loading: true
                })
            }

            setPairs(pools);
            const totalAlloc = await farmContract.totalAllocPoint();

            for (let index = 0; index < poolsData.length; index++) {
                const item: any = pools[index];
                const stakingContract = new Contract(
                    poolsData[index].address,
                    (poolsData[index].isYoc ? YOCPool.abi : YOCPool.TokenABI),
                    rpc_provider_basic
                )

                const tokenAddress = poolsData[index].tokenAddress;
                const tokenContact = new Contract(
                    tokenAddress,
                    TokenTemplate.abi,
                    rpc_provider_basic
                );
                const symbol = poolsData[index].tokenSymbol;
                const stakeDecimal = poolsData[index].tokenDecimals;
                const poolID = poolsData[index].poolId;
                const alloc = poolsData[index].allocPoint;

                let totalLiquidity, APR;
                {
                    totalLiquidity = convertWeiToEth(await tokenContact.balanceOf(poolsData[index].address), stakeDecimal);
                    let yearYocUSDRes = Number(convertWeiToEth((await swapContract.getAmountsOut(
                        convertEthToWei(String(Number(Number(alloc) / Number(totalAlloc) * 20 * 60 * 60 * 24 * 365).toFixed(16)), YOC.decimals),
                        [
                            YOC.address,
                            USDCToken.address
                        ]
                    ))[1], USDCToken.decimals));
                    let stakedTotalUSDRes = 0;
                    if (tokenAddress != USDCToken.address && Number(totalLiquidity)) {
                        stakedTotalUSDRes = Number(convertWeiToEth((await swapContract.getAmountsOut(
                            convertEthToWei(totalLiquidity, stakeDecimal),
                            [
                                tokenAddress,
                                USDCToken.address
                            ]
                        ))[1], USDCToken.decimals));
                    } else {
                        stakedTotalUSDRes = Number(totalLiquidity)
                    }
                    console.log('YOC: ', yearYocUSDRes);
                    console.log('TOKEN: ', stakedTotalUSDRes);
                    APR = stakedTotalUSDRes ? Number(yearYocUSDRes / stakedTotalUSDRes * 100) : 0;
                }

                let balance, userInfo: any, approve = '', amount, earned = 0, usdcAmount = 0;
                if (account) {
                    balance = convertWeiToEth(await tokenContact.balanceOf(account), Number(stakeDecimal));
                    approve = convertWeiToEth(await tokenContact.allowance(account, poolsData[index].address), Number(stakeDecimal));
                    userInfo = await stakingContract.userInfo(account);
                    if (poolsData[index].isYoc) {
                        const totalReward = convertWeiToEth(await stakingContract.calculateTotalPendingYOCRewards(), YOC.decimals);
                        const totalShare = await stakingContract.totalShares();
                        amount = convertWeiToEth(String(userInfo.shares), Number(stakeDecimal));

                        if (Number(totalShare)) earned = Number(userInfo.shares) / Number(totalShare) * Number(totalReward);
                    } else {
                        amount = convertWeiToEth(String(userInfo.amount), Number(stakeDecimal));
                        if (userInfo) {
                            const pending = await stakingContract.pendingReward(account);
                            if (pending) earned = Number(convertWeiToEth(pending, YOC.decimals));
                        }
                    }

                    if (earned) {
                        let res = await swapContract.getAmountsOut(
                            convertEthToWei(String(earned), YOC.decimals),
                            [
                                YOC.address,
                                USDCToken.address
                            ]
                        );
                        usdcAmount = Number(convertWeiToEth(res[1], USDCToken.decimals));
                    }
                }

                pools[index] = {
                    ...item,
                    pId: poolID,
                    address: poolsData[index].address,
                    tokenAddress: tokenAddress,
                    stakingContract: stakingContract,
                    tokenContact: tokenContact,
                    symbol: symbol,
                    stakeDecimal: stakeDecimal,
                    totalLiquidity: totalLiquidity,
                    loading: false,
                    isYoc: poolsData[index].isYoc,
                    APR: APR,

                    balance: balance ? Number(balance) : 0,
                    userInfo: userInfo,
                    approve: approve,
                    earned: earned,
                    amount: amount ? Number(amount) : 0,
                    usdcAmount: usdcAmount,
                }
                setPairs([...pools]);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updatePools = async () => {
        console.log("Update Pools");

        try {
            let pools: StakeInterface[] = [...pairs.map((item) => {
                return {
                    ...item,
                    loading: true,
                }
            })];

            setPairs([...pools]);

            for (let index = 0; index < pairs.length; index++) {
                const item: any = pools[index];
                const stakingContract = new Contract(
                    item.address + '',
                    (item.isYoc ? YOCPool.abi : YOCPool.TokenABI),
                    rpc_provider_basic
                )

                const tokenAddress = item.tokenAddress;
                const tokenContact = new Contract(
                    tokenAddress + '',
                    TokenTemplate.abi,
                    rpc_provider_basic
                );
                const stakeDecimal = item.stakeDecimal;

                let balance, userInfo: any, approve = '', amount, earned = 0, usdcAmount = 0;
                if (account) {
                    balance = convertWeiToEth(await tokenContact.balanceOf(account), Number(stakeDecimal));
                    approve = convertWeiToEth(await tokenContact.allowance(account, item.address), Number(stakeDecimal));
                    userInfo = await stakingContract.userInfo(account);
                    if (item.isYoc) {
                        const totalReward = convertWeiToEth(await stakingContract.calculateTotalPendingYOCRewards(), YOC.decimals);
                        const totalShare = await stakingContract.totalShares();
                        amount = convertWeiToEth(String(userInfo.shares), Number(stakeDecimal));

                        if (Number(totalShare)) earned = Number(userInfo.shares) / Number(totalShare) * Number(totalReward);
                    } else {
                        amount = convertWeiToEth(String(userInfo.amount), Number(stakeDecimal));
                        if (userInfo) {
                            const pending = await stakingContract.pendingReward(account);
                            if (pending) earned = Number(convertWeiToEth(pending, YOC.decimals));
                        }
                    }

                    if (earned) {
                        let res = await swapContract.getAmountsOut(
                            convertEthToWei(String(earned), YOC.decimals),
                            [
                                YOC.address,
                                USDCToken.address
                            ]
                        );
                        usdcAmount = Number(convertWeiToEth(res[1], USDCToken.decimals));
                    }
                }

                pools[index] = {
                    ...item,
                    loading: false,

                    balance: balance ? Number(balance) : 0,
                    userInfo: userInfo,
                    approve: approve,
                    earned: earned,
                    amount: amount ? Number(amount) : 0,
                    usdcAmount: usdcAmount,
                }
                setPairs([...pools]);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        console.log(pairs);
    }, [pairs])

    useEffect(() => {
        setTimeout(() => {
            setAfter1second(true);
            console.log("After 1 second")
        }, 3000)
    }, [])

    const togglePairOpenHandle = (pairInfo: any) => {
        if (pairInfo.loading) return;
        let newPairOpen = [];
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

    const enableModalHandle = (pair: StakeInterface) => {
        setSelectPair(pair)
        setEnableModalShow(true);
    }

    const enableHandle = async () => {
        dispatch(loading_start() as any);
        try {
            const pair = selectPair;
            let tokenContract = new Contract(
                pair?.tokenAddress + '',
                TokenTemplate.abi,
                signer
            )
            const tx = await tokenContract.approve(String(pair?.address), MaxUint256);
            await tx.wait();
            setPairs(pairs.map(item => item.address == pair?.address ? { ...item, approve: true } : item));
            setEnableModalShow(false);
            dispatch(loading_end() as any);
        } catch (err) {
            dispatch(loading_end() as any);
        }
    }

    const stakeModalHandle = (pair: StakeInterface) => {
        setSelectPair(pair);
        setStakeModalShow(true);
    }

    const unstakeModalHandle = (pair: StakeInterface) => {
        setSelectPair(pair);
        setUnstakeModalShow(true);
    }

    const setMaxStakeAmountHandle = () => {
        setStakeAmount((selectPair && Boolean(selectPair.balance)) ? Number(selectPair.balance) : 0);
        setStakeMax(true);
    }

    const setMaxUnstakeAmountHandle = () => {
        setUnstakeAmount((selectPair && Boolean(selectPair.amount)) ? Number(selectPair.amount) : 0);
        setUnstakeMax(true);
    }

    const stakeHandle = async (pair: StakeInterface) => {
        if (!stakeAmount) {
            dispatch(alert_show({ content: 'Please input the stake amount exactly', status: 'error' }) as any)
            return;
        }
        dispatch(loading_start() as any);
        console.log(pair, stakeAmount);
        try {
            let stakeContract = new Contract(
                String(pair.address),
                YOCPool.abi,
                signer
            )
            const tx = await stakeContract.deposit(convertEthToWei(String(stakeAmount), Number(selectPair?.stakeDecimal)), {
                gasLimit: 3000000
            });
            await tx.wait();
            setPairs(pairs.map(item => item.address == pair?.address ? { ...item, amount: Number(item.amount) + stakeAmount, balance: Number(item.balance) - stakeAmount } : item));
            setStakeModalShow(false);
            dispatch(loading_end() as any);
        } catch (err) {
            console.dir(err);
            dispatch(loading_end() as any);
        }
    }

    const unstakeHandle = async (pair: StakeInterface) => {
        if (!unstakeAmount) {
            dispatch(alert_show({ content: 'Please input the unstake amount exactly', status: 'error' }) as any)
            return;
        }
        dispatch(loading_start() as any);
        try {
            let stakeContract = new Contract(
                String(pair.address),
                YOCPool.abi,
                signer
            )
            const tx = await stakeContract.withdraw(convertEthToWei(String(unstakeAmount), Number(selectPair?.stakeDecimal)), {
                gasLimit: 3000000
            });
            await tx.wait();
            setPairs(pairs.map(item => item.address == pair?.address ? { ...item, amount: Number(item.amount) - unstakeAmount, balance: Number(item.balance) + unstakeAmount } : item));
            setUnstakeModalShow(false);
            dispatch(loading_end() as any);
        } catch (err) {
            dispatch(loading_end() as any);
        }
    }

    const harvestHandle = async (pair: StakeInterface) => {
        dispatch(loading_start() as any);
        try {
            let stakeContract = new Contract(
                String(pair.address),
                YOCPool.abi,
                signer
            )
            const tx = await stakeContract.withdraw(0, {
                gasLimit: 3000000
            });
            await tx.wait();
            setPairs(pairs.map(item => item.address == pair?.address ? { ...item, earned: 0, balance: Number(item.balance) + Number(item.earned) } : item));
            dispatch(loading_end() as any);
        } catch (err) {
            dispatch(loading_end() as any);
        }
    }

    const getImage = (pair: StakeInterface) => {
        const token = TOKENS.find((item: any) => item.address == pair.tokenAddress);
        return token ? token.logoURI : './images/coins/Unknow.png';
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
                                <option className="p-2 bg-dark-primary" value={'liquidity'}>Total Liquidity</option>
                                {/* <option className="p-2 bg-dark-primary" value={'block'}>Latest Blocks</option> */}
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
                                return b.totalLiquidity - a.totalLiquidity;
                            } else {
                                return 0;
                            }
                        }).filter(item => {
                            if (item.address?.indexOf(searchText) != -1
                                || item.symbol?.indexOf(searchText) != -1
                                || String(item.totalLiquidity)?.indexOf(searchText) != -1
                                || String(item.APR)?.indexOf(searchText) != -1) return true;
                        }).map((item, index) => {
                            return (
                                <div key={index + "_"}>
                                    <div className="mt-4 p-4 flex justify-between items-center bg-row-pattern cursor-pointer"
                                        onClick={() => togglePairOpenHandle(item)}
                                    >
                                        <div className="flex items-start w-[calc(100%_-_50px)]">
                                            <div className="w-[26%] min-w-[150px] flex items-center">
                                                <div className="min-w-[48px] h-[48px] mr-4 relative">
                                                    {
                                                        item.loading ? (
                                                            <>
                                                                <div role="status" className="w-full h-full animate-pulse flex flex-col justify-center">
                                                                    <p className="w-full h-full bg-gray-200 rounded-full"></p>
                                                                    <p className="w-[22px] h-[22px] absolute bottom-0 right-0 rounded-full bg-gray-400"></p>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <img className="w-full h-full" src={getImage(item)} alt="pair" />
                                                                <div className="w-[22px] h-[22px] absolute bottom-0 right-0 rounded-full">
                                                                    <img className="w-w-full h-full" alt="YOC" src="./images/coin.png" />
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                                <div className="w-[100%] flex flex-col mr-4">
                                                    {
                                                        item.loading ?
                                                            <div role="status" className="max-w-sm animate-pulse flex flex-col justify-center">
                                                                <p className="w-[80px] h-[14px] mb-2 bg-gray-200 rounded-full"></p>
                                                                <p className="w-[80px] h-[10px] text-sm bg-gray-200 rounded-full"></p>
                                                            </div> :
                                                            <>
                                                                <div className="mb-2">Stake {item.symbol}</div>
                                                                <p className="text-[#C7C7C7]">{"YOC"}</p>
                                                            </>
                                                    }
                                                </div>
                                            </div>
                                            <div className="w-[25%] min-w-[120px] flex flex-col mr-4">
                                                <div className="mb-2">YOC Earned</div>
                                                {
                                                    item.loading ?
                                                        <div role="status" className="max-w-sm animate-pulse flex flex-col">
                                                            <p className="w-[50px] h-[12px] mb-1 text-sm bg-gray-200 rounded-full"></p>
                                                            <p className="w-[50px] h-[10px] text-xs bg-gray-200 rounded-full"></p>
                                                        </div> :
                                                        <>
                                                            <p className="text-dark-primary text-sm">{item.earned ? item.earned : '0'}</p>
                                                            <span className="text-dark-primary text-xs">{item.usdcAmount ? item.usdcAmount : ""} USD</span>
                                                        </>
                                                }
                                            </div>
                                            <div className="w-[25%] min-w-[120px] mr-4">
                                                <div className="mb-2">Total staked</div>
                                                {
                                                    item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
                                                        <p className="h-3 bg-gray-200 rounded-full w-12"></p>
                                                    </div> :
                                                        <p className="text-[#C7C7C7]">{item.totalLiquidity ? Number(item.totalLiquidity) : 0} {item.isYoc ? "YOC" : item.symbol}</p>
                                                }
                                            </div>
                                            <div className="w-[25%] mr-4">
                                                <div className="mb-2">APR</div>
                                                {

                                                    item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
                                                        <p className="h-3 bg-gray-200 rounded-full w-12"></p>
                                                    </div> :
                                                        <p className="text-[#C7C7C7]">{item.APR ? item.APR.toFixed(2) : 0}%</p>
                                                }
                                            </div>
                                        </div>
                                        <button onClick={() => togglePairOpenHandle(item)}>
                                            <img className={`w-[24px] transition-all ${(pairsOpen && pairsOpen.find(i => i.address == item.address) && pairsOpen.find(i => i.address == item.address)?.toggle) ? '' : 'rotate-180'}`} src="/images/arrow-up.png" alt="arrow-up" />
                                        </button>
                                    </div>

                                    <div className={`flex justify-between overflow-hidden transition-all ${(pairsOpen && pairsOpen.find(i => i.address == item.address) && pairsOpen.find(i => i.address == item.address)?.toggle) ? 'pt-4 h-[124px]' : 'h-0'}`} >
                                        <div className="w-[160px] text-secondary flex flex-col justify-center">
                                            <a className="mb-2" href={`/swap`}>Get Staked Token</a>
                                            <a className="mb-2" href={`https://goerli.etherscan.io/address/${item.address}`} >Contract Details</a>
                                        </div>
                                        {
                                            !item.isYoc ? (
                                                <div className="h-[110px] px-4 py-4 ml-2 bg-normal-pattern w-[calc(50%_-_60px)] flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-2">YOC Earned</h3>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p className="leading-4">{item.earned ? Number(item.earned) : 0}</p>
                                                        <button className="flex h-[36px] items-center rounded-full border-[1px] border-solid border-secondary bg-btn-primary px-3 py-1 text-primary disabled:bg-btn-disable disabled:border-[#0f5856]"
                                                            disabled={!account || !item.approve || !item.earned}
                                                            onClick={() => harvestHandle(item)}
                                                        >
                                                            Harvest
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : ""
                                        }
                                        <div className="h-[110px] px-4 py-4 ml-2 bg-normal-pattern w-[calc(50%_-_90px)] flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {
                                                        account ? (
                                                            `${item.symbol} staked ${(item.userInfo && item.amount) ? Number(item.amount) : 0}`
                                                        ) : (
                                                            "Start Staking"
                                                        )
                                                    }
                                                </h3>
                                            </div>
                                            <div className="flex justify-end">
                                                {
                                                    account ?
                                                        (
                                                            Number(item.approve) ?
                                                                (
                                                                    item.amount ? (
                                                                        <div className="w-full h-full flex items-center justify-between">
                                                                            <span className="font-semibold">{item.amount ? Number(item.amount).toFixed(6) : 0}</span>
                                                                            <div className="flex items-center">
                                                                                <button className="border border-border-primary rounded-lg p-2.5 mr-2" onClick={() => unstakeModalHandle(item)}>
                                                                                    <svg viewBox="0 0 24 24" color="primary" width="14px" xmlns="http://www.w3.org/2000/svg" className="text-border-primary"><path fill="currentColor" d="M18 13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z"></path></svg>
                                                                                </button>
                                                                                <button className="border border-border-primary rounded-lg p-2.5" onClick={() => stakeModalHandle(item)}>
                                                                                    <svg viewBox="0 0 24 24" color="primary" width="14px" xmlns="http://www.w3.org/2000/svg" className="text-border-primary"><path fill="currentColor" d="M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z"></path></svg>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <button className="h-[36px] rounded text-sm w-[120px] bg-btn-primary shadow-btn-primary px-4 py-1.5 text-primary"
                                                                            onClick={() => stakeModalHandle(item)}
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
                                return b.totalLiquidity - a.totalLiquidity;
                            } else {
                                return 0;
                            }
                        }).filter(item => {
                            if (item.address?.indexOf(searchText) != -1
                                || item.symbol?.indexOf(searchText) != -1
                                || String(item.totalLiquidity)?.indexOf(searchText) != -1
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
                <p className="text-lg py-4">Allow <span className="text-secondary">yoc.com</span> to spend your {selectPair?.symbol}?</p>
                <p className="mb-4 text-sm leading-7">Do you trust this site? By granting this permission, you’re
                    allowing to withdraw your {selectPair?.symbol}&nbsp;
                    and automate transaction for you.</p>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => enableHandle()}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setEnableModalShow(false)}>Reject</button>
                </div>
            </div>
        </Modal>

        <Modal size="small" show={stakeModalShow} onClose={() => setStakeModalShow(false)}>
            <div className="p-6 pt-8 flex flex-col text-primary">
                <h3 className="font-semibold text-xl mb-6">Stake {selectPair?.symbol} Tokens</h3>
                <div className="flex items-stretch justify-between mb-4">
                    <div className="flex flex-col justify-between w-[calc(100%_-_180px)]">
                        <p className="mb-4">Stake</p>
                        <input className="w-full px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={stakeAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setStakeAmount(Number(e.target.value)); setStakeMax(false); }} />
                    </div>
                    <div className="flex flex-col justify-between w-[160px]">
                        <p className="mb-4">Balance: {(selectPair && selectPair.balance) ? selectPair.balance : 0}</p>
                        <button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxStakeAmountHandle()}>MAX</button>
                    </div>
                </div>
                <a className="text-secondary mb-6" href={`/swap`}>Get {selectPair?.symbol}</a>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => stakeHandle(selectPair as StakeInterface)}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setStakeModalShow(false)}>Reject</button>
                </div>
            </div>
        </Modal>

        <Modal size="small" show={unstakeModalShow} onClose={() => setUnstakeModalShow(false)}>
            <div className="p-6 pt-8 flex flex-col text-primary">
                <h3 className="font-semibold text-xl mb-6">Unstake {selectPair?.symbol} Tokens</h3>
                <div className="flex items-stretch justify-between mb-4">
                    <div className="flex flex-col justify-between w-[calc(100%_-_180px)]">
                        <p className="mb-4">Unstake</p>
                        <input className="w-full px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={unstakeAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUnstakeAmount(Number(e.target.value)); setUnstakeMax(false); }} />
                    </div>
                    <div className="flex flex-col justify-between w-[160px]">
                        <p className="mb-4">Balance: {(selectPair && selectPair.amount) ? Number(selectPair.amount).toFixed(6) : 0}</p>
                        <button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxUnstakeAmountHandle()}>MAX</button>
                    </div>
                </div>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => unstakeHandle(selectPair as StakeInterface)}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setUnstakeModalShow(false)}>Reject</button>
                </div>
            </div>
        </Modal>
    </div >
}

export default Pools;