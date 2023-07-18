import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios";
import { Contract, constants } from 'ethers';
const { MaxUint256, AddressZero, Zero } = constants;

import Modal from "@components/widgets/Modalv2";

const yocAmountYear = 4.5 * 60 * 24 * 365 * 20;

import { YOCFarm, YOCSwapRouter, YOCPair, TokenTemplate, YOC, USDCToken } from "../src/constants/contracts";
import { PoolInterface, PairOpenInterface } from "../src/interfaces/pools";
import { convertEthToWei, convertRate, convertWeiToEth } from "../utils/unit";
import useAccount from "@hooks/useAccount";
import useLoading from "@hooks/useLoading";
import useAlert from "@hooks/useAlert";
import useWallet from "@hooks/useWallet";
import { CurrencyDataInterface } from "src/interfaces/currency";
import useNetwork from "@hooks/useNetwork";

const Farm: FC = () => {
	const { account, provider, signer, rpc_provider } = useAccount();
	const { loadingStart, loadingEnd } = useLoading();
	const { explorer } = useNetwork();
	const { alertShow } = useAlert();
	const { connectWallet, updateWalletBalance } = useWallet();
	const [farmPools, setFarmPools] = useState<any[]>([]);
	const [currencies, setCurrencies] = useState<CurrencyDataInterface[]>([]);
	const [farmUIToggle, setFarmUIToggle] = useState<Number[]>([]); // default:0, open: 1, loading: 2 
	const [after1second, setAfter1second] = useState(false);  // flag that checks if the 1 second is passed from when the page is loaded.
	const [sortBy, setSortBy] = useState('');
	const [searchText, setSearchText] = useState('');
	const [selectFarmPool, setSelectFarmPool] = useState<any>();
	const [stakeLpModalShow, setStakeLpModalShow] = useState(false);
	const [unstakeLpModalShow, setUnstakeLpModalShow] = useState(false);
	const [stakeLpAmount, setStakeLpAmount] = useState(0);
	const [unstakeLpAmount, setUnstakeLpAmount] = useState(0);
	const [stakeLpMax, setStakeLpMax] = useState(false);
	const [unstakeLpMax, setUnstakeLpMax] = useState(false);
	const [enableModalShow, setEnableModalShow] = useState(false);
	const farmContract = useMemo(() => new Contract(
		YOCFarm.address,
		YOCFarm.abi,
		rpc_provider
	), [YOCFarm, rpc_provider]);

	const checkPools = useCallback(async () => {
		try {
			if (currencies && currencies.length && yocAmountYear && farmContract) {
				console.log("Check Pools", farmContract);
				const totalAlloc = await farmContract.totalAllocPoint();
				let farmResponse = await axios.get(process.env.API_ADDRESS + `/farm/all`);
				if (farmResponse && farmResponse.data && farmResponse.data.pools) {
					let data = [...new Array(farmResponse.data.pools.length).map(item => 0)].map(item => { return { loading: true } });
					for (let i = 0; i < farmResponse.data.pools.length; i++) {
						const item = farmResponse.data.pools[i];
						if (currencies.length) {
							let yocAmountForCurrentPool = yocAmountYear * item.allocPoint / totalAlloc;
							let yocDetail = currencies.find((currency: any) => currency.address === YOC.address);

							if (!yocDetail) return item;
							data[i] = {
								...item,
								loading: true,
							};
							setFarmPools([...data]);
							let yocUSDAmountForCurrentPool = yocAmountForCurrentPool * yocDetail.price;

							let totalLPAmount = item.liquidity.amount;
							let totalToken0Amount = item.liquidity.amount0;
							let totalToken1Amount = item.liquidity.amount1;
							let LPamountCurrentPool = item.totalLPAmount;
							let currency0Detail = getCurrencyDetail(item.liquidity.currency0.address);
							let currency1Detail = getCurrencyDetail(item.liquidity.currency1.address);

							if (!currency0Detail || !currency1Detail) return item;
							let usdToken0Amount = LPamountCurrentPool / totalLPAmount * totalToken0Amount * currency0Detail.price;
							let usdToken1Amount = LPamountCurrentPool / totalLPAmount * totalToken1Amount * currency1Detail.price;
							let APR = (usdToken0Amount + usdToken1Amount) ? yocUSDAmountForCurrentPool / (usdToken0Amount + usdToken1Amount) : 0;
							let totalLiquidity = usdToken0Amount + usdToken1Amount;

							console.log('yoc:', LPamountCurrentPool, totalLPAmount, yocUSDAmountForCurrentPool);
							console.log('token0:', totalToken0Amount, usdToken0Amount);
							console.log('token1:', totalToken1Amount, usdToken1Amount);
							console.log("\n");

							let balance, allowance, earned, lpAmount;
							if (account) {
								let userDetailResponse = await axios.get(process.env.API_ADDRESS + `/farm/user?address=${account}&farmId=${item.id}`);
								let farmUserDetail;
								if (userDetailResponse && userDetailResponse.data) farmUserDetail = userDetailResponse.data.farmData;

								let PairContract = new Contract(
									item.liquidity.pairAddress + '',
									YOCPair.abi,
									rpc_provider
								)
								balance = convertWeiToEth(String(await PairContract.balanceOf(account)), Number(item.liquidity.pairDecimals));
								if (farmUserDetail) {
									allowance = farmUserDetail.allowance ? farmUserDetail.allowance : 0;
									lpAmount = farmUserDetail.amount;
								}

								earned = convertWeiToEth(String(await farmContract.pendingYOC(item.poolId, account)), Number(YOC.decimals));
							};

							data[i] = {
								...item,
								APR,
								totalLiquidity,
								loading: false,

								balance: balance ? Number(balance) : 0,
								lpAmount: lpAmount ? Number(lpAmount) : 0,
								earned: earned ? Number(earned) : 0,
								allowance: allowance,
								approve: Number(allowance) ? true : false
							};
						}
					}
					setFarmPools([...data]);
					console.log(data);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}, [currencies.length, yocAmountYear, account, provider, farmContract]);

	useEffect(() => {
		(async () => {
			let currencyResponse = await axios.get(process.env.API_ADDRESS + `/currency/all?account=${account}`);
			if (currencyResponse && currencyResponse.data && currencyResponse.data.currencies) {
				setCurrencies(currencyResponse.data.currencies.filter((item: any) => item.isActive === true && item.isDelete === false));
			}
		})();

		setTimeout(() => {
			setAfter1second(true);
			console.log("After 1 second")
		}, 1500)
	}, [])

	useEffect(() => {
		(async () => {
			if (after1second) {
				loadingStart();
				await checkPools();
				loadingEnd();
			}
		})()
	}, [account, after1second, checkPools])

	useEffect(() => {
		setFarmUIToggle([...new Array(farmPools.length).map(item => 0)]);
	}, [account, farmPools.length])

	const togglePoolHandle = (index: number, type: string) => {
		let rst: any[] = farmUIToggle.map((item: any, i: number) => {
			return i === index ? (type === 'open' ? (item ? 0 : 1) : (item == 0 ? 2 : 0)) : item;
		});

		setFarmUIToggle([...rst]);
	}

	const enableModalHandle = async (pair: PoolInterface) => {
		setSelectFarmPool(pair)
		setEnableModalShow(true);
	}

	const enableHandle = async () => {
		loadingStart();
		try {
			const pair: any = selectFarmPool;
			let PairContract = new Contract(
				pair.liquidity.pairAddress + '',
				YOCPair.abi,
				signer
			)
			PairContract.on("Approval", async (args) => {
				setFarmPools(farmPools.map((item: any) => item.liquidity.pairAddress == pair.liquidity.pairAddress ? { ...item, approve: true } : item));
				setEnableModalShow(false);
				loadingEnd();
				alertShow({ content: `Approve Successfully`, status: 'success' });

				await axios.post(process.env.API_ADDRESS + "/farm/user/allowance", {
					farmId: pair.id,
					liquidityId: pair.liquidityId,
					address: account,
					balance: convertWeiToEth(MaxUint256, 18)
				})
			})
			await PairContract.approve(YOCFarm.address, MaxUint256, {
				gasLimit: 27000
			});
		} catch (err) {
			loadingEnd();
		}
	}

	const stakeLPModalHandle = (pair: PoolInterface) => {
		setSelectFarmPool(pair);
		setStakeLpModalShow(true);
	}

	const unstakeModalHandle = (pair: PoolInterface) => {
		setSelectFarmPool(pair);
		setUnstakeLpModalShow(true);
	}

	const setMaxStakeLpAmountHandle = () => {
		if (selectFarmPool && Boolean(selectFarmPool.balance)) {
			stakeLpAmountChangleHandle(Number(selectFarmPool.balance) * 1);
		} else {
			stakeLpAmountChangleHandle(0);
		}
		setStakeLpMax(true);
	}

	const setMaxUnstakeAmountHandle = () => {
		if ((selectFarmPool && Boolean(selectFarmPool.lpAmount))) {
			unstakeLpAmountChangleHandle(Number(selectFarmPool.lpAmount) * 1);
		} else {
			unstakeLpAmountChangleHandle(0);
		}
		setUnstakeLpMax(true);
	}

	const stakeLPHandle = async (pair: any) => {
		console.log(stakeLpAmount);
		if (!stakeLpAmount) {
			alertShow({ content: 'Please input the stakeLP amount exactly', status: 'error' });
			return;
		}
		loadingStart();
		try {
			const pair: any = selectFarmPool;
			let PairContract = new Contract(
				pair.liquidity.pairAddress + '',
				YOCPair.abi,
				signer
			)
			let approveTx = await PairContract.approve(YOCFarm.address, convertEthToWei(String(stakeLpAmount), Number(selectFarmPool?.liquidity.pairDecimals)), {
				gasLimit: 27000
			});
			await approveTx.wait();

			let FarmContract = new Contract(
				YOCFarm.address,
				YOCFarm.abi,
				signer
			)
			FarmContract.on('Deposit', (user, pid, amount) => {
				if (user == account) {
					setFarmPools(farmPools.map(item => item.liquidity.pairAddress == pair.liquidity.pairAddress ? { ...item, lpAmount: Number(item.lpAmount) + stakeLpAmount, balance: Number(item.balance) - stakeLpAmount } : item));
					setStakeLpModalShow(false);
					loadingEnd();

					console.log(user, pid, amount);
					alertShow({ content: `Deposit Successfully`, text: `Amount: ${convertWeiToEth(amount, pair.liquidity.pairDecimals)} ${pair.liquidity.pairSymbol}`, status: 'success' });
				}
			})
			await FarmContract.deposit(pair.poolId, convertEthToWei(String(stakeLpAmount), Number(selectFarmPool?.liquidity.pairDecimals)), {
				gasLimit: 200000
			});
		} catch (err) {
			console.log(err);
			loadingEnd();
		}
	}

	const unstakeLPHandle = async (pair: any) => {
		console.log(unstakeLpAmount);
		if (!unstakeLpAmount) {
			alertShow({ content: 'Please input the unstakeLP amount exactly', status: 'error' });
			return;
		}
		loadingStart();
		try {
			let PairContract = new Contract(
				YOCFarm.address,
				YOCFarm.abi,
				signer
			)
			PairContract.on("Withdraw", (user, pid, amount, yocAmount) => {
				if (user == account) {
					setFarmPools([...farmPools.map(item => item.liquidity.pairAddress == pair.liquidity.pairAddress ? { ...item, lpAmount: Number(item.lpAmount) - unstakeLpAmount, balance: Number(item.balance) + unstakeLpAmount } : item)]);
					setUnstakeLpModalShow(false);
					updateWalletBalance();
					loadingEnd();

					console.log(user, pid, amount, yocAmount);
					alertShow({ content: `Withdraw Successfully`, text: `Amount: ${convertWeiToEth(amount, 18)} ${pair.liquidity.pairSymbol}, Yoc: ${convertWeiToEth(yocAmount, YOC.decimals)}`, status: 'success' });
				}
			})
			await PairContract.withdraw(pair.poolId, convertEthToWei(String(unstakeLpAmount), Number(selectFarmPool?.liquidity.pairDecimals)), {
				gasLimit: 200000
			});
		} catch (err) {
			console.log(err);
			loadingEnd();
		}
	}

	const harvestHandle = async (pair: any) => {
		loadingStart();
		try {
			let PairContract = new Contract(
				YOCFarm.address,
				YOCFarm.abi,
				signer
			)
			await PairContract.withdraw(pair.poolId, 0, {
				gasLimit: 200000
			});
			PairContract.on("Withdraw", (user, pid, amount, yocAmount) => {
				setFarmPools([...farmPools.map(item => item.liquidity.pairAddress == pair.liquidity.pairAddress ? { ...item, earned: 0, balance: Number(item.balance) + Number(item.earned) } : item)]);
				loadingEnd();
				updateWalletBalance();
				console.log(user, pid, amount, yocAmount);
				alertShow({ content: 'Harvest Successfully', text: `\n\n Yoc: ${convertWeiToEth(yocAmount, YOC.decimals)}`, status: 'success' });
			});
		} catch (err) {
			console.log(err);
			loadingEnd();
		}
	}

	const getCurrencyDetail = useCallback((address: string) => {
		return currencies.find((currency: any) => currency.address === address);
	}, [currencies]);

	const finalFarmPools = useMemo(() => {
		return farmPools.sort((a: any, b: any) => {
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
		}).filter((item: any) => {
			if (item.loading == true) return true;
			if (item?.liquidity.currency0.symbol.indexOf(searchText) != -1
				|| item?.liquidity.currency1.symbol.indexOf(searchText) != -1
				|| String(item.allocPoint).indexOf(searchText) != -1
				|| String(item.totalLPAmount).indexOf(searchText) != -1
				|| String(item.liquidity).indexOf(searchText) != -1
				|| String(item.earned).indexOf(searchText) != -1
				|| String(item.APR).indexOf(searchText) != -1) return true;
		})
	}, [searchText, sortBy, farmPools]);

	const stakeLpAmountChangleHandle = (v: any) => {
		console.log(v);
		if (!isNaN(Number(v))) {
			setStakeLpAmount(v);
		}
		setStakeLpMax(false);
	}

	const unstakeLpAmountChangleHandle = (v: any) => {
		console.log(v);
		if (!isNaN(Number(v))) {
			setUnstakeLpAmount(v);
		}
		setUnstakeLpMax(false);
	}

	return <>
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
						finalFarmPools.length == 0 ? (
							<div className="mt-4 p-4 flex justify-between items-center bg-row-pattern">
								<p className="">There is not pools</p>
							</div>
						) : (
							finalFarmPools.map((item: any, index) => {
								return (
									<div key={index + "_"}>
										<div className="mt-4 p-4 flex justify-between items-center bg-row-pattern cursor-pointer"
											onClick={() => togglePoolHandle(index, 'open')}
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
															(`${item.liquidity.currency0.symbol} / ${item.liquidity.currency1.symbol}`)
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
															<p className="text-[#C7C7C7]">{item.totalLiquidity ? item.totalLiquidity.toFixed(3) : 0} USD</p>
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
											<button onClick={() => togglePoolHandle(item, 'open')}>
												<img className={`w-[24px] transition-all ${farmUIToggle[index] == 1 ? '' : 'rotate-180'}`} src="/images/arrow-up.png" alt="arrow-up" />
											</button>
										</div>

										{
											item.loading == false ? (
												<div className={`flex overflow-hidden transition-all ${farmUIToggle[index] == 1 ? 'pt-4 h-[124px]' : 'h-0'}`} >
													<div className="w-[160px] text-secondary flex flex-col justify-center">
														<a className="mb-2" target="_blank" href={`/liquidity`}>Get LP</a>
														<a className="mb-2" target="_blank" href={`${explorer}/address/${YOCFarm.address}`} >Contract Details</a>
														<a target="_blank" href={`${explorer}/address/${item.address}`}>Pair Info</a>
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
																		`${item.liquidity.pairSymbol}`
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
																		// item.approve ?
																		// 	(
																				item.lpAmount ? (
																					<div className="w-full h-full flex items-center justify-between">
																						<span className="font-semibold">{item.lpAmount ? Number(item.lpAmount).toFixed(YOCPair.decimals) : 0}</span>
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
																			// )
																			// :
																			// <button className="h-[36px] rounded text-sm w-[120px] bg-btn-primary shadow-btn-primary px-4 py-1.5 text-primary"
																			// 	onClick={() => enableModalHandle(item)}
																			// >
																			// 	Enable
																			// </button>
																	)
																	:
																	<button className="h-[36px] rounded text-sm w-[160px] bg-btn-secondary shadow-btn-secondary px-4 py-1.5 text-primary"
																		onClick={() => {
																			connectWallet()
																		}}
																	>
																		Connect Wallet
																	</button>
															}
														</div>
													</div>
												</div>
											) : ""
										}
									</div>
								)
							})
						)
					}
				</div>

				<div className="flex items-center justify-center my-4">
					<img className="w-[20px]" src="./images/prev.png" alt="prev" />
					<span className="px-2 text-lg">Page {1} of {1}</span>
					<img className="w-[20px]" src="./images/next.png" alt="next" />
				</div>
			</div>
		</div>

		<Modal size="small" show={enableModalShow} onClose={() => setEnableModalShow(false)}>
			<div className="p-6 pt-8 text-primary">
				<p className="text-lg py-4">Allow <span className="text-secondary">yoc.com</span> to spend your {selectFarmPool?.liquidity.currency0.symbol + "/" + selectFarmPool?.liquidity.currency1.symbol}?</p>
				<p className="mb-6 text-sm leading-7">Do you trust this site? By granting this permission, you’re
					allowing to withdraw your {selectFarmPool?.liquidity.currency0.symbol + "/" + selectFarmPool?.liquidity.currency1.symbol}
					and automate transaction for you.</p>

				<div className="flex justify-between">
					<button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => enableHandle()}>Confirm</button>
					<button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setEnableModalShow(false)}>Reject</button>
				</div>
			</div>
		</Modal>

		<Modal size="small" show={stakeLpModalShow} onClose={() => setStakeLpModalShow(false)}>
			<div className="p-6 pt-8 flex flex-col text-primary">
				<h3 className="font-semibold text-xl mb-6">Stake LP Tokens</h3>
				<div className="flex flex-col justify-between mb-4">
					<div className="flex justify-between item-center mb-4">
						<p className="">Stake</p>
						<p className="">Balance: {(selectFarmPool && selectFarmPool.balance) ? Number(selectFarmPool.balance).toFixed(YOCPair.decimals) : 0}</p>
					</div>
					<div className="flex justify-between item-center">
						<input className="w-full mr-4 px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={stakeLpAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { stakeLpAmountChangleHandle(e.target.value) }} />
						<button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxStakeLpAmountHandle()}>MAX</button>
					</div>
				</div>
				<p className="mb-4">{`${selectFarmPool?.liquidity.currency0.symbol} & ${selectFarmPool?.liquidity.currency1.symbol}`}</p>
				<a className="text-secondary mb-6" target="_blank" href={`${explorer}/address/${selectFarmPool?.liquidity.pairAddress}`}>Get LP</a>

				<div className="flex justify-between">
					<button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => stakeLPHandle(selectFarmPool as PoolInterface)}>Confirm</button>
					<button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setStakeLpModalShow(false)}>Reject</button>
				</div>
			</div>
		</Modal>

		<Modal size="small" show={unstakeLpModalShow} onClose={() => setUnstakeLpModalShow(false)}>
			<div className="p-6 pt-8 flex flex-col text-primary">
				<h3 className="font-semibold text-xl mb-6">Unstake LP Tokens</h3>
				<div className="flex flex-col justify-between mb-4">
					<div className="flex justify-between item-center mb-4">
						<p className="">Unstake</p>
						<p className="">Balance: {(selectFarmPool && selectFarmPool.lpAmount) ? selectFarmPool.lpAmount.toFixed(YOCPair.decimals) : 0}</p>
					</div>
					<div className="flex justify-between item-center">
						<input className="w-full mr-4 px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={unstakeLpAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { unstakeLpAmountChangleHandle(e.target.value) }} />
						<button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxUnstakeAmountHandle()}>MAX</button>
					</div>
				</div>
				<p className="mb-4">{`${selectFarmPool?.liquidity.currency0.symbol} & ${selectFarmPool?.liquidity.currency1.symbol}`}</p>
				<a className="text-secondary mb-6" target="_blank" href={`${explorer}/address/${selectFarmPool?.liquidity.pairAddress}`}>Get LP</a>

				<div className="flex justify-between">
					<button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => unstakeLPHandle(selectFarmPool as PoolInterface)}>Confirm</button>
					<button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setUnstakeLpModalShow(false)}>Reject</button>
				</div>
			</div>
		</Modal>
	</>
}

export default Farm;