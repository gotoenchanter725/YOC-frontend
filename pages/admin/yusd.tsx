import { useState, useEffect, useMemo, useCallback } from 'react';
import { AiOutlineSwap, AiFillControl } from 'react-icons/ai';
import { ethers, Contract } from 'ethers';
import { fetchBalance } from '@wagmi/core'
import { NextPage } from "next";
import useNetwork from '@hooks/useNetwork';
import useAccount from '@hooks/useAccount';
import useLoading from '@hooks/useLoading';
import useAlert from '@hooks/useAlert';
import { convertEthToWei, convertWeiToEth } from 'utils/unit';
import { debounceHook } from 'utils/hook';
import { YOCSwapRouter, YUSD, YOC as YOCToken, WETH } from 'src/constants/contracts';
import Modal from '@components/widgets/Modalv2';
import SimpleLoading from '@components/widgets/SimpleLoading';

const AdminYUSD: NextPage = () => {
    const { provider, signer } = useAccount();
    const { YOC, native } = useNetwork();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const [function1State, setFunction1State] = useState(false);
    const [YUSDTotalSupply, setYUSDTotalSupply] = useState(-1);
    const [YUSDPriceByUSD, setYUSDPriceByUSD] = useState(-1);
    const [ETHPriceByUSD, setETHPriceByUSD] = useState(-1);
    const [ETHAmountOFPool, setETHAmountOFPool] = useState(-1);
    const [YOCPriceByUSD, setYOCPriceByUSD] = useState(-1);
    const [YOCAmountOFPool, setYOCAmountOFPool] = useState(-1);
    const [percent, setPercent] = useState(-1);
    const [previewFunction2Modal, setPreviewFunction2Modal] = useState(false);
    const [detailsByFunction2, setDetailsByFunction2] = useState({
        isETHtoYOC: true,
        transferredAmount: "0"
    });
    const YOCContract = useMemo(() => {
        return new Contract(
            YOCToken.address,
            YOCToken.abi,
            provider
        );
    }, [provider])
    const YUSDContract = useMemo(() => {
        return new Contract(
            YUSD.address,
            YUSD.abi,
            signer
        );
    }, [signer])
    const SwapRouterContract = useMemo(() => {
        return new Contract(
            YOCSwapRouter.address,
            YOCSwapRouter.abi,
            provider
        );
    }, [provider]);

    useEffect(() => {
        (async () => {
            if (YUSDContract && SwapRouterContract && provider) {
                try {
                    let ETHPrice = Number(convertWeiToEth(await YUSDContract.getETHPrice(), 6));
                    setETHPriceByUSD(ETHPrice);
                    let tempResult = await SwapRouterContract.getAmountsOut(
                        convertEthToWei("1", YOCToken.decimals),
                        [YOCToken.address, WETH]
                    );
                    let ETHBalanceOfPool = await fetchBalance({ address: YUSD.address as `0x${string}` });
                    setETHAmountOFPool(Number(convertWeiToEth(ETHBalanceOfPool.value, 18)));

                    setYOCPriceByUSD(Number(convertWeiToEth(tempResult[1], 18)) * ETHPrice);
                    let YOCBalanceOfPool = await YOCContract.balanceOf(YUSD.address);
                    setYOCAmountOFPool(Number(convertWeiToEth(YOCBalanceOfPool, YOCToken.decimals)));

                    let YUSDPrice = Number(convertWeiToEth(await YUSDContract.price(), 6));
                    console.log(YUSDPrice);
                    setYUSDPriceByUSD(YUSDPrice);
                    setYUSDTotalSupply(Number(convertWeiToEth(await YUSDContract.totalSupply(), YUSD.decimals)));

                    let p = Number(convertWeiToEth(await YUSDContract.rate(), 2));
                    setPercent(p);

                    let s = await YUSDContract.autoFunction1Action();
                    setFunction1State(s);
                } catch (error) {
                    console.log(error);
                }
            }
        })()
    }, [YUSDContract, SwapRouterContract, YOCContract, provider])

    const function1ActionToggleHandle = async (state: boolean) => {
        loadingStart();
        try {
            YUSDContract.on("SetAutoFunction1Action", (state) => {
                setFunction1State(state);
                alertShow({ content: `Set ${state ? "Enable" : "Disable"} successfully`, status: 'success' });
                loadingEnd();
            })
            await YUSDContract.setAutoFunction1Action(state);
        } catch (error) {
            console.log(error);
            loadingEnd();
        }
    }

    const confirmfunction2ActionHandle = async () => {
        loadingStart();
        try {
            let details = await YUSDContract.getReblancedDetailByFunction2();
            setDetailsByFunction2({
                isETHtoYOC: details.isETHtoYOC,
                transferredAmount: convertWeiToEth(details.transferredAmount, details.isETHtoYOC ? 18 : YOCToken.decimals)
            })
            loadingEnd();
            setPreviewFunction2Modal(true);
        } catch (error) {
            console.log(error);
            loadingEnd();
        }
    }

    const function2ActionHandle = async () => {
        loadingStart();
        try {
            YUSDContract.on("Function2", (isETHtoYOC, transferredAmount) => {
                alertShow({ content: `Swap ${convertWeiToEth(transferredAmount, isETHtoYOC ? 18 : YOCToken.decimals)} ${isETHtoYOC ? native : YOC} to ${!isETHtoYOC ? native : YOC} to keep the balance`, status: 'success' });
                loadingEnd();
                setPreviewFunction2Modal(false);
            })
            await YUSDContract.function2({
                gasLimit: 5000000
            });
        } catch (error) {
            console.log(error);
            loadingEnd();
        }
    }

    return <div className="w-full px-6 py-12 text-dark-secondary">
        <h2 className='text-3xl text-white mb-6'>YUSD</h2>
        <div className="flex items-center mb-4">
            <p>Audo Rebalance when price of YUSD is greater than $2.</p>
            {
                function1State ? (
                    <div className="flex items-center ml-2">
                        <p className="text-green-500">Enabled</p>
                        <button onClick={() => function1ActionToggleHandle(false)} className="flex text-white px-3 py-2 leading-none bg-btn-primary rounded ml-2"><AiOutlineSwap className="mr-2" />Disable</button>
                    </div>
                ) : (
                    <div className="flex items-center ml-2">
                        <p className="text-red-500">Disabled</p>
                        <button onClick={() => function1ActionToggleHandle(true)} className="flex text-white px-3 py-2 leading-none bg-btn-primary rounded ml-2"><AiOutlineSwap className="mr-2" />Enable</button>
                    </div>
                )
            }
        </div>
        <div className="flex items-center mb-4">
            <p>Manual Rebalance to keep 75% SOL and 25% YOC</p>
            <button onClick={() => confirmfunction2ActionHandle()} className="flex text-white px-3 py-2 leading-none bg-btn-primary rounded ml-2"><AiFillControl className="mr-2" />Vault2</button>
        </div>

        <div className="flex justify-between text-white px-4 py-3 mb-2 bg-[#25262b]">
            <div className="w-1/5 flex items-center">
                <img className="w-[36px] h-[36px] p-1 border-2 border-border-primary rounded-full mr-2" src="/images/coins/YUSD.png" />
                <p className="text-white text-lg">YUSD</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    YUSDTotalSupply == -1 ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Total Supply</p>
                        <p className="text-lg">{YUSDTotalSupply}</p>
                    </>
                }
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    YUSDPriceByUSD == -1 ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Price</p>
                        <p>${YUSDPriceByUSD.toFixed(6)}</p>
                    </>
                }
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    (YUSDTotalSupply == -1 || YUSDPriceByUSD == -1) ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Total Volume</p>
                        <p className="text-lg">${(YUSDPriceByUSD * YUSDTotalSupply).toFixed(6)}</p>
                    </>
                }
            </div>
            <div className="w-1/5"></div>
        </div>
        <p className="text-xl font-semibold py-3">Pool Composition</p>
        <div className="flex justify-between text-white px-4 py-3">
            <div className="w-1/5 flex items-center">
                <img className="w-[36px] h-[36px] p-1 border-2 border-border-primary rounded-full mr-2" src={`/images/coins/${native}.png`} />
                <p className="text-white text-lg">{native}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    ETHAmountOFPool == -1 ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Reserve</p>
                        <p className="text-lg">{ETHAmountOFPool.toFixed(6)}</p>
                    </>
                }
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    ETHPriceByUSD == -1 ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Price</p>
                        <p className="text-lg">${ETHPriceByUSD.toFixed(6)}</p>
                    </>
                }
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    (ETHAmountOFPool == -1 || ETHPriceByUSD == -1) ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Volume</p>
                        <p className="text-lg">${(ETHAmountOFPool * ETHPriceByUSD).toFixed(6)}</p>
                    </>
                }
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    percent == -1 ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Percent</p>
                        <p className="text-lg">{percent * 100}%</p>
                    </>
                }
            </div>
        </div>
        <div className="flex justify-between text-white px-4 py-3">
            <div className="w-1/5 flex items-center">
                <img className="w-[36px] h-[36px] p-1 border-2 border-border-primary rounded-full mr-2" src={`/images/coins/${YOC}.png`} />
                <p className="text-white text-lg">{YOC}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    YOCAmountOFPool == -1 ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Reserve</p>
                        <p className="text-lg">{YOCAmountOFPool.toFixed(6)}</p>
                    </>
                }
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    YOCPriceByUSD == -1 ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Price</p>
                        <p className="text-lg">${YOCPriceByUSD.toFixed(6)}</p>
                    </>
                }
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    (YOCAmountOFPool == -1 || YOCPriceByUSD == -1) ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Volume</p>
                        <p className="text-lg">${(YOCAmountOFPool * YOCPriceByUSD).toFixed(6)}</p>
                    </>
                }
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                {
                    percent == -1 ? <SimpleLoading className='w-[26px] h-[26px]' /> : <>
                        <p className="text-sm">Percent</p>
                        <p className="text-lg">{100 - percent * 100}%</p>
                    </>
                }
            </div>
        </div>

        <Modal size="small" show={previewFunction2Modal} onClose={() => setPreviewFunction2Modal(false)}>
            <div className="p-6 pt-8 text-primary">
                <p className="text-xl py-4">Vault2 </p>
                <p className="mb-3 text-md leading-7">
                    {`%${percent * 100} ${native} + ${100 - percent * 100}% ${YOC} -> 75% ${native} + 25% ${YOC}`}
                    {
                        detailsByFunction2.isETHtoYOC ? "" : ""
                    }
                </p>
                <div className='w-full rounded-xl border border-border-primary p-4 mb-3'>
                    <p className='text-sm text-gray-200'>Swap Amount</p>
                    <p className='text-lg text-white'>
                        {detailsByFunction2.transferredAmount} {detailsByFunction2.isETHtoYOC ? native : YOC}
                    </p>
                </div>
                <p className="mb-3 text-md leading-7">
                    {`Swap ${detailsByFunction2.transferredAmount} ${detailsByFunction2.isETHtoYOC ? native : YOC} to ${!detailsByFunction2.isETHtoYOC ? native : YOC} to keep the balance`}
                </p>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => function2ActionHandle()}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setPreviewFunction2Modal(false)}>Reject</button>
                </div>
            </div>
        </Modal>
    </div>
}

export default AdminYUSD;