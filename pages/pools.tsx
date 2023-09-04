import React, { FC, useEffect, useState, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Contract, constants } from 'ethers';
const { MaxUint256, AddressZero, Zero } = constants;

import Modal from "@components/widgets/Modalv2";

import { YOCFarm, YOCSwapRouter, TokenTemplate, YOC, YOCPool, USDCToken } from "../src/constants/contracts";
import { TOKENS } from "../src/constants/tokens";
import { PairOpenInterface, StakeInterface } from "../src/interfaces/pools";
import { alert_show, walletConnect } from "../store/actions";
import { convertEthToWei, convertRate, convertWeiToEth } from "../utils/unit";
import useAccount from "@hooks/useAccount";
import useAlert from "@hooks/useAlert";
import useLoading from "@hooks/useLoading";
import useWallet from "@hooks/useWallet";
import { CurrencyDataInterface } from "src/interfaces/currency";
import useNetwork from "@hooks/useNetwork";

const yocAmountYear = 4.5 * 60 * 24 * 365 * 20;

const Pools: FC = () => {
	const { provider, signer, account, rpc_provider } = useAccount();
	const { loadingStart, loadingEnd } = useLoading();
	const { alertShow } = useAlert();
	const { connectWallet, updateWalletBalance } = useWallet();
	const { explorer, network } = useNetwork();
	const [after1second, setAfter1second] = useState(false);  // flag that checks if the 1 second is passed from when the page is loaded.
	const dispatch = useDispatch();
	const [sortBy, setSortBy] = useState('');
	const [searchText, setSearchText] = useState('');
	const [stakeUIToggle, setStakeUIToggle] = useState<Number[]>([]); // default:0, open: 1, loading: 2 
	const [stakePools, setStakePools] = useState<any[]>([]);
	const [currencies, setCurrencies] = useState<CurrencyDataInterface[]>([]);
	const [selectPool, setSelectPool] = useState<any>();

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
		rpc_provider
	));
	const [swapContract] = useState(new Contract(
		YOCSwapRouter.address,
		YOCSwapRouter.abi,
		rpc_provider
	));

	useEffect(() => {
		(async () => {
			if (after1second) {
				loadingStart();
				await checkPools();
				loadingEnd();
			}
		})()
	}, [account, after1second])

	const checkPools = useCallback(async () => {
		if (currencies && currencies.length && yocAmountYear && farmContract) {
			console.log("Check Pools");
			try {
				const totalAlloc = await farmContract.totalAllocPoint();
				let stakeResponse = await axios.get(process.env.API_ADDRESS + `/stake/all`);
				if (stakeResponse && stakeResponse.data && stakeResponse.data.pools) {
					let data = [...new Array(stakeResponse.data.pools.length).map(item => 0)].map(item => { return { loading: true } });
					for (let i = 0; i < stakeResponse.data.pools.length; i++) {
						const item = stakeResponse.data.pools[i];
						console.log(isYocCheck(item.currency.id));
						const stakingContract = new Contract(
							item.address,
							(isYocCheck(item.currency.id) ? YOCPool.abi : YOCPool.TokenABI),
							rpc_provider
						)
						console.log(stakingContract);
						const tokenContract = new Contract(
							item.currency.address,
							TokenTemplate.abi,
							rpc_provider
						)

						let totalLiquidity, APR;
						if (currencies.length) {
							let yocAmountForCurrentPool = yocAmountYear * item.allocPoint / totalAlloc;
							let yocDetail = getCurrencyDetail(YOC.address);
							let currencyDetail = getCurrencyDetail(item.currency.address);

							// if (!yocDetail) return item;
							data[i] = {
								...item,
								loading: true,
							};
							setStakePools([...data]);
							let yocUSDAmountForCurrentPool = yocAmountForCurrentPool * (yocDetail ? yocDetail.price : 0);
							let totalAmount = Number(item.totalAmount);
							var YocPerShare;
							if (item.currency.address == YOC.address) {
								YocPerShare = convertWeiToEth(await stakingContract.getPricePerFullShare(), YOC.decimals);
								totalLiquidity = Number(item.totalShare) * Number(YocPerShare);
							} else {
								totalLiquidity = item.totalAmount;
							}
							console.log(totalAmount, Number(item.currency.price))
							let tokenUSDAmount = totalAmount * Number(item.currency.price);


							console.log('YOC: ', yocUSDAmountForCurrentPool);
							console.log('TOKEN: ', tokenUSDAmount);
							APR = tokenUSDAmount ? Number(yocUSDAmountForCurrentPool / tokenUSDAmount * 100) : 0;


							let balance, userInfo: any, approve = '', allowance = 0, amount, earned = 0, usdcAmount = 0;
							if (account) {
								let userDetailResponse = await axios.get(process.env.API_ADDRESS + `/stake/user?address=${account}&stakeId=${item.id}`);
								let stakeUserDetail;
								if (userDetailResponse && userDetailResponse.data) stakeUserDetail = userDetailResponse.data.stakeData;
								if (stakeUserDetail) {
									allowance = stakeUserDetail.allowance ? stakeUserDetail.allowance : 0;
									amount = + stakeUserDetail.amount; // share amount
								}
								// allowance = Number(convertWeiToEth(await tokenContract.allowance(account, item.address), item.currency.decimals));

								if (item.currency.address == YOC.address) {
									if (item.totalShare) {
										let userShare = stakeUserDetail ? stakeUserDetail.amount : 0;
										amount = Number(userShare) * Number(YocPerShare);
										earned = amount;
									}
								} else {
									console.log("amount", amount);
									if (amount) {
										const pending = await stakingContract.pendingReward(account);
										if (pending) earned = Number(convertWeiToEth(pending, YOC.decimals));
									}
								}

								if (earned && yocDetail) {
									usdcAmount = earned * yocDetail.price;
								}

								balance = convertWeiToEth(await tokenContract.balanceOf(account), Number(item.currency.decimals));
							}

							data[i] = {
								...item,
								stakingContract: stakingContract,
								tokenContact: tokenContract,
								totalLiquidity: totalLiquidity,
								loading: false,
								isYoc: item.currency.address === YOC.address,
								APR: APR,

								balance: balance ? Number(balance) : 0,
								allowance,
								approve: allowance ? true : false,
								earned: earned,
								amount: amount ? Number(amount) : 0,
								usdcAmount: usdcAmount,
							}
						}

					}
					setStakePools([...data]);
					console.log(data);
				}
			} catch (err) {
				console.log(err);
			}
		}
	}, [currencies.length, yocAmountYear, account, farmContract]);

	useEffect(() => {
		(async () => {
			let currencyResponse = await axios.get(process.env.API_ADDRESS + `/currency/all`);
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
		setStakeUIToggle([...new Array(stakePools.length).map(item => 0)]);
	}, [account, stakePools.length])

	const togglePoolHandle = (index: number, type: string) => {
		let rst: any[] = stakeUIToggle.map((item: any, i: number) => {
			return i === index ? (type === 'open' ? (item ? 0 : 1) : (item == 0 ? 2 : 0)) : item;
		});

		setStakeUIToggle([...rst]);
	}

	const enableModalHandle = (pair: StakeInterface) => {
		setSelectPool(pair)
		setEnableModalShow(true);
	}

	const enableHandle = async () => {
		loadingStart();
		try {
			const pool = selectPool;
			let tokenContract = new Contract(
				pool?.currency.address + '',
				TokenTemplate.abi,
				signer
			)
			tokenContract.on("Approval", async () => {
				setStakePools(stakePools.map(item => item.address == pool?.address ? { ...item, approve: true } : item));
				setEnableModalShow(false);
				loadingEnd();
				alertShow({ content: `Approve Successfully`, status: 'success' });

				await axios.post(process.env.API_ADDRESS + "/stake/user/allowance", {
					stakeId: pool.id,
					address: account,
					balance: convertWeiToEth(MaxUint256, pool.currency.decimals)
				})
			})
			await tokenContract.approve(String(pool?.address), MaxUint256, {
				gasLimit: 27000
			});
		} catch (err) {
			loadingEnd();
		}
	}

	const stakeModalHandle = (pool: StakeInterface) => {
		setSelectPool(pool);
		setStakeModalShow(true);
	}

	const unstakeModalHandle = (pool: StakeInterface) => {
		setSelectPool(pool);
		setUnstakeModalShow(true);
	}

	const setMaxStakeAmountHandle = () => {
		if (selectPool && Boolean(selectPool.balance)) {
			stakeAmountChangleHandle(Number(selectPool.balance) * 1);
		} else {
			stakeAmountChangleHandle(0);
		}
		setStakeMax(true);
	}

	const setMaxUnstakeAmountHandle = () => {
		if (selectPool && Boolean(selectPool.amount)) {
			unstakeAmountChangleHandle(Number(selectPool.amount) * 1);
		} else {
			unstakeAmountChangleHandle(0);
		}
		setUnstakeMax(true);
	}

	const stakeHandle = async (pool: any) => {
		if (!stakeAmount) {
			dispatch(alert_show({ content: 'Please input the stake amount exactly', status: 'error' }) as any)
			return;
		}
		loadingStart();
		try {
			const pool = selectPool;
			let tokenContract = new Contract(
				pool?.currency.address + '',
				TokenTemplate.abi,
				signer
			)
			let approveTx = await tokenContract.approve(String(pool?.address), convertEthToWei(String(stakeAmount), Number(pool?.currency.decimals)), {
				gasLimit: pool.currency.address == YOC.address ? 47000 : 27000
			});
			await approveTx.wait();

			let stakeContract = new Contract(
				String(pool.address),
				isYocCheck(pool.currency.id) ? YOCPool.abi : YOCPool.TokenABI,
				signer
			)
			stakeContract.on('Deposit', (user, amount) => {
				if (user == account) {
					setStakePools(stakePools.map(item => item.address == pool?.address ? { ...item, amount: Number(item.amount) + Number(convertWeiToEth(amount, pool?.currency.decimals)), balance: Number(item.balance) - stakeAmount } : item));
					setStakeModalShow(false);
					loadingEnd();

					console.log(user, amount);
					alertShow({ content: `Deposit Successfully`, text: `Amount: ${convertWeiToEth(amount, pool?.currency.decimals)} ${pool?.currency.symbol}`, status: 'success' });
				}
			})
			await stakeContract.deposit(convertEthToWei(String(stakeAmount), Number(pool?.currency.decimals)), {
				gasLimit: 3000000
			});
		} catch (err) {
			console.dir(err);
			loadingEnd();
		}
	}

	const unstakeHandle = async (pool: any) => {
		if (!unstakeAmount) {
			dispatch(alert_show({ content: 'Please input the unstake amount exactly', status: 'error' }) as any)
			return;
		}
		loadingStart();
		try {
			let stakeContract = new Contract(
				String(pool.address),
				isYocCheck(pool.currency.id) ? YOCPool.abi : YOCPool.TokenABI,
				signer
			)
			stakeContract.on("Withdraw", (user, amount, share) => {
				if (user == account) {
					setStakePools(stakePools.map(item => item.address == pool?.address ? { ...item, amount: Number(item.amount) - Number(convertWeiToEth(amount, pool?.currency.decimals)), balance: Number(item.balance) + unstakeAmount } : item));
					setUnstakeModalShow(false);
					loadingEnd();

					console.log(user, amount, share);
					alertShow({ content: `Withdraw Successfully`, text: `Amount: ${convertWeiToEth(amount, pool.currency.decimals)} ${pool.currency.symbol}`, status: 'success' });
				}
			})
			if (selectPool.currency.address == YOC.address) {
				await stakeContract.withdrawByAmount(convertEthToWei(String(unstakeAmount), Number(selectPool?.currency.decimals)), {
					gasLimit: 3000000
				});
			} else {
				await stakeContract.withdraw(convertEthToWei(String(unstakeAmount), Number(selectPool?.currency.decimals)), {
					gasLimit: 3000000
				});
			}
		} catch (err) {
			loadingEnd();
			console.log(err);
		}
	}

	const harvestHandle = async (pair: any) => {
		loadingStart();
		try {
			let stakeContract = new Contract(
				String(pair.address),
				YOCPool.abi,
				signer
			)
			stakeContract.on("Harvest", (user, amount) => {
				if (user == account) {
					setStakePools(stakePools.map(item => item.address == pair?.address ? { ...item, earned: 0, balance: Number(item.balance) + Number(item.earned) } : item));
					loadingEnd();
					console.log(user, amount, pair);
					alertShow({ content: `Harvest Successfully`, text: `Amount: ${convertWeiToEth(amount, YOC.decimals)} ${YOC.symbol}`, status: 'success' });
				}
			})
			await stakeContract.withdraw(0, {
				gasLimit: 300000
			});
		} catch (err) {
			loadingEnd();
		}
	}

	const getImage = (pool: any) => {
		const token = currencies.find((item: any) => item.address == pool.currency.address);
		return token ? token.image : './images/coins/Unknow.png';
	}

	const isYocCheck = (id: any) => {
		let result = currencies.find((item: any) => item.id == id && item.address == YOC.address);
		if (result) return true;
		return false;
	}

	const getCurrencyDetail = useCallback((address: string) => {
		return currencies.find((currency: any) => currency.address === address);
	}, [currencies]);


	const finalStakePools = useMemo(() => {
		return stakePools.sort((a: any, b: any) => {
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
		}).filter((item: any) => {
			if (item.loading == true) return true;
			if (item.address?.indexOf(searchText) != -1
				|| item.currency.symbol?.indexOf(searchText) != -1
				|| String(item.totalLiquidity)?.indexOf(searchText) != -1
				|| String(item.APR)?.indexOf(searchText) != -1) return true;
		})
	}, [searchText, sortBy, stakePools]);

	const stakeAmountChangleHandle = (v: any) => {
		if (!isNaN(Number(v))) {
			setStakeAmount(v);
		}
		setStakeMax(false);
	}

	const unstakeAmountChangleHandle = (v: any) => {
		if (!isNaN(Number(v))) {
			setUnstakeAmount(v);
		}
		setUnstakeMax(false);
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
						finalStakePools.length == 0 ? (
							<div className="mt-4 p-4 flex justify-between items-center bg-row-pattern">
								<p className="">There is not pools</p>
							</div>
						) : (
							finalStakePools.map((item, index) => {
								return (
									<div key={index + "_"}>
										<div className="mt-4 p-4 flex justify-between items-center bg-row-pattern cursor-pointer"
											onClick={() => togglePoolHandle(index, 'open')}
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
																	<img className="w-full h-full" src={getImage(item)} alt="token" />
																	<div className="w-[22px] h-[22px] absolute bottom-0 right-0 bg-gray-800 rounded-full">
																		<img className="w-w-full h-full" alt="YOC" src={`./images/coins/${YOC.symbol + (network === 'ETH' ? 'e' : 'b')}.png`} />
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
																	<div className="mb-2">Stake {item.currency.symbol}</div>
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
																<p className="text-dark-primary text-sm">{item.earned ? Number(item.earned).toFixed(2) : '0'}</p>
																<span className="text-dark-primary text-xs">{item.usdcAmount ? Number(item.usdcAmount).toFixed(2) : "0"} USD</span>
															</>
													}
												</div>
												<div className="w-[25%] min-w-[120px] mr-4">
													<div className="mb-2">Total staked</div>
													{
														item.loading ? <div role="status" className="max-w-sm animate-pulse h-[24px] flex items-center">
															<p className="h-3 bg-gray-200 rounded-full w-12"></p>
														</div> :
															<p className="text-[#C7C7C7]">{item.totalLiquidity ? Number(item.totalLiquidity).toFixed(2) : 0} {item.isYoc ? "YOC" : item.currency.symbol}</p>
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
											<button onClick={() => togglePoolHandle(item, 'open')}>
												<img className={`w-[24px] transition-all ${stakeUIToggle[index] == 1 ? '' : 'rotate-180'}`} src="/images/arrow-up.png" alt="arrow-up" />
											</button>
										</div>

										{
											item.loading == false ?
												<div className={`flex justify-between overflow-hidden transition-all ${stakeUIToggle[index] == 1 ? 'pt-4 h-[124px]' : 'h-0'}`} >
													<div className="w-[160px] text-secondary flex flex-col justify-center">
														<a className="mb-2" target="_blank" href={`/swap`}>Get Staked Token</a>
														<a className="mb-2" target="_blank" href={`${explorer}/address/${item.address}`} >Contract Details</a>
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
																		`${item.currency.symbol} staked ${(item.amount) ? Number(item.amount) : 0}`
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
																		// Number(item.approve) ?
																		// 	(
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
																			dispatch(walletConnect() as any);
																		}}
																	>
																		Connect Wallet
																	</button>
															}
														</div>
													</div>
												</div> : ""
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
				<p className="text-lg py-4">Allow <span className="text-secondary">yoc.com</span> to spend your {selectPool?.currency.symbol}?</p>
				<p className="mb-4 text-sm leading-7">Do you trust this site? By granting this permission, you’re
					allowing to withdraw your {selectPool?.currency.symbol}&nbsp;
					and automate transaction for you.</p>

				<div className="flex justify-between">
					<button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => enableHandle()}>Confirm</button>
					<button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setEnableModalShow(false)}>Reject</button>
				</div>
			</div>
		</Modal>

		<Modal size="small" show={stakeModalShow} onClose={() => setStakeModalShow(false)}>
			<div className="p-6 pt-8 flex flex-col text-primary">
				<h3 className="font-semibold text-xl mb-6">Stake {selectPool?.currency.symbol} Tokens</h3>
				<div className="flex items-stretch justify-between mb-4">
					<div className="flex flex-col justify-between w-[calc(100%_-_180px)]">
						<p className="mb-4">Stake</p>
						<input className="w-full px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={stakeAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { stakeAmountChangleHandle(e.target.value)}} />
					</div>
					<div className="flex flex-col justify-between w-[160px]">
						<p className="mb-4">Balance: {(selectPool && selectPool.balance) ? Number(selectPool.balance).toFixed(selectPool.currency.decimals) : 0}</p>
						<button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxStakeAmountHandle()}>MAX</button>
					</div>
				</div>
				<a className="text-secondary mb-6" target="_blank" href={`/swap`}>Get {selectPool?.currency.symbol}</a>

				<div className="flex justify-between">
					<button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => stakeHandle(selectPool as any)}>Confirm</button>
					<button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setStakeModalShow(false)}>Reject</button>
				</div>
			</div>
		</Modal>

		<Modal size="small" show={unstakeModalShow} onClose={() => setUnstakeModalShow(false)}>
			<div className="p-6 pt-8 flex flex-col text-primary">
				<h3 className="font-semibold text-xl mb-6">Unstake {selectPool?.currency.symbol} Tokens</h3>
				<div className="flex items-stretch justify-between mb-4">
					<div className="flex flex-col justify-between w-[calc(100%_-_180px)]">
						<p className="mb-4">Unstake</p>
						<input className="w-full px-2 py-1 rounded border-[1px] border-solid border-secondary bg-transparent text-dark-primary" value={unstakeAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { unstakeAmountChangleHandle(e.target.value) }} />
					</div>
					<div className="flex flex-col justify-between w-[160px]">
						<p className="mb-4">Balance: {(selectPool && selectPool.amount) ? Number(selectPool.amount).toFixed(selectPool.currency.decimals) : 0}</p>
						<button className="text-primary bg-btn-secondary shadow-btn-secondary px-4 py-1 rounded" onClick={() => setMaxUnstakeAmountHandle()}>MAX</button>
					</div>
				</div>

				<div className="flex justify-between">
					<button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => unstakeHandle(selectPool as any)}>Confirm</button>
					<button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setUnstakeModalShow(false)}>Reject</button>
				</div>
			</div>
		</Modal>
	</>
}

export default Pools;