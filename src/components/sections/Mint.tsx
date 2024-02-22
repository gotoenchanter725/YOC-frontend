import { useState, useEffect, useMemo, useCallback } from 'react';
import { BigNumber, Contract, constants } from 'ethers';
import Modal from '@components/widgets/Modalv2';
import Toggle from '@components/widgets/Toggle';
import useNetwork from '@hooks/useNetwork';
import useAccount from '@hooks/useAccount';
import useLoading from '@hooks/useLoading';
import useAlert from '@hooks/useAlert';
import { convertEthToWei, convertWeiToEth } from 'utils/unit';
import { debounceHook } from 'utils/hook';
import { YOCSwapRouter, YUSD, YOC as YOCToken, WETH } from 'src/constants/contracts';
import useCurrency from '@hooks/useCurrency';
const { MaxUint256 } = constants;

const MintSection = () => {
    const { provider, signer, ETHBalance, YOCBalance, YUSDBalance, account, updateYOCBalance, updateYUSDBalance, updateETHBalance } = useAccount();
    const { network, YOC, native } = useNetwork();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const { YOCDetail } = useCurrency();
    const [amount, setAmount] = useState("0");
    const [approx, setApprox] = useState(0);
    const [compositionETHAmount, setCompositionETHAmount] = useState(0);
    const [compositionYOCAmount, setCompositionYOCAmount] = useState(0);
    const [showMintModalToggle, setShowMintModalToggle] = useState(false);
    const [ETHPriceByUSD, setETHPriceByUSD] = useState(0);
    const [YOCPriceByUSD, setYOCPriceByUSD] = useState(0);
    const [withYOC, setWithYOC] = useState(false);
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
            if (YUSDContract && SwapRouterContract && YOCDetail) {
                try {
                    let ETHPrice = Number(convertWeiToEth(await YUSDContract.getETHPrice(), 6));
                    setETHPriceByUSD(ETHPrice);
                    let tempResult = await SwapRouterContract.getAmountsOut(
                        convertEthToWei("1", YOCToken.decimals),
                        [YOCToken.address, WETH]
                    );
                    setYOCPriceByUSD(Number(YOCDetail.price));
                } catch (error) {
                }
            }
        })()
    }, [YUSDContract, YOCDetail])

    const amountChangeHandle = (val: string) => {
        setAmount(val);
        debounceHook(async () => {
            if (!val) return;
            loadingStart();
            try {
                if (withYOC) {
                    let YOCAmount = await YUSDContract.getYOCAmountForMint(val);
                    setApprox(YOCAmount);
                    let YOCAmountByNumber = Number(convertWeiToEth(YOCAmount, YOCToken.decimals));
                    setCompositionYOCAmount(YOCAmountByNumber * 0.25);

                    let tempResult = await SwapRouterContract.getAmountsOut(
                        convertEthToWei(YOCAmountByNumber * 0.75 + "", YOCToken.decimals),
                        [YOCToken.address, WETH]
                    );
                    console.log(tempResult);
                    setCompositionETHAmount(Number(convertWeiToEth(tempResult[1], 18)));
                } else {
                    let ETHAmount = await YUSDContract.getETHAmountForMint(val);
                    setApprox(ETHAmount);
                    let ETHAmountByNumber = Number(convertWeiToEth(ETHAmount, 18));
                    setCompositionETHAmount(ETHAmountByNumber * 0.75);

                    let tempResult = await SwapRouterContract.getAmountsOut(
                        convertEthToWei(ETHAmountByNumber * 0.25 + "", 18),
                        [WETH, YOCToken.address]
                    );
                    console.log(tempResult);
                    setCompositionYOCAmount(Number(convertWeiToEth(tempResult[1], YOCToken.decimals)));
                }
                loadingEnd();
            } catch (error) {
                console.log('amountChangeHandle', error)
                loadingEnd();
            }
        })
    }

    const setMaxHandle = useCallback(() => {
        if (withYOC) {
            console.log(YOCPriceByUSD, YOCBalance);
            let totalYOCAmountByUSD = YOCBalance * YOCPriceByUSD;
            console.log(totalYOCAmountByUSD);
            amountChangeHandle(totalYOCAmountByUSD.toFixed(0));
        } else {
            let totalETHAmountByUSD = ETHBalance * ETHPriceByUSD;
            console.log(totalETHAmountByUSD);
            amountChangeHandle(totalETHAmountByUSD.toFixed(0));
        }
    }, [ETHBalance, ETHPriceByUSD, withYOC]);

    const confirmMintHandle = () => {
        console.log(amount);
        if (!Number(amount)) {
            alertShow({ content: 'Please input the amount exactly', status: 'error' });
            return;
        }
        setShowMintModalToggle(true);
    }

    const mintHandle = async () => {
        setShowMintModalToggle(false);
        loadingStart();
        try {
            let gasLimit = 3000000, mintTx;
            if (withYOC) { // Mint with YOC
                const YOCContract = new Contract(YOCToken.address, YOCToken.abi, signer);
                const allowanceYOC = await YOCContract.allowance(account, YUSD.address);
                console.log(+approx, +allowanceYOC);
                if (approx > allowanceYOC) {
                    const approveTx = await YOCContract.approve(YUSD.address, MaxUint256, {
                        gasLimit: 300000
                    });
                    await approveTx.wait();
                }
                try {
                    console.log(+approx, +amount);
                    let mintEstimate = await YUSDContract.estimateGas.mintWithYOC(amount);
                    gasLimit = +mintEstimate.mul(150).div(100);
                } catch (error) {
                    console.log('get gaslimit', error);
                }
                console.log(gasLimit);
                mintTx = await YUSDContract.mintWithYOC(amount, {
                    gasLimit: gasLimit
                });
            } else {
                try {
                    let mintEstimate = await YUSDContract.estimateGas.mint(amount, {
                        value: approx
                    });
                    gasLimit = +mintEstimate.mul(150).div(100);
                } catch (error) {
                    console.log('get gaslimit', error);
                }
                console.log(gasLimit);
                mintTx = await YUSDContract.mint(amount, {
                    value: approx,
                    gasLimit: gasLimit
                });
            }
            const eventlistencer = (user: string, YUSDAmount: BigNumber, paidETHAmount: BigNumber) => {
                console.log(user, paidETHAmount);
                if (user == account) {
                    alertShow({ content: `Mint ${withYOC ? 'Using YOC ' : ''}Successfully`, text: `Paid: ${convertWeiToEth(paidETHAmount, (withYOC ? YOCToken.decimals : 18))} ${withYOC ? YOC : native}, Minted: ${YUSDAmount} ${YUSD.symbol}`, status: 'success' });
                    loadingEnd();
                }
                updateYOCBalance()
                updateYUSDBalance()
                updateETHBalance()
                YUSDContract.removeListener("Mint", eventlistencer);
            };
            YUSDContract.on("Mint", eventlistencer);
            await mintTx.wait();
        } catch (error) {
            console.log(error);
            loadingEnd();
        }
    }

    const mintTypeToggleHandle = (v: boolean) => {
        if (+amount) {
            amountChangeHandle(amount);
        }
        setWithYOC(v);
    }

    return <div className="text-dark-primary">
        <div className='flex items-center justify-between'>
            <h3 className='text-xl text-white mb-2'>Mint YUSD tokens</h3>
            <Toggle value={withYOC} onChange={mintTypeToggleHandle} />
        </div>
        <p className='mb-2 text-dark-secondary'>Ratio: 1 YUSD = 1 USD</p>
        <div className='flex items-center text-sm italic'>
            <p>YUSD are composed of:</p>
            <div className='group relative'>
                <img className='ml-2 w-[14px] h-[14px]' src='/images/question.png' />
                <div className='hidden group-hover:block not-italic text-white absolute left-2 top-3.5 w-[200px] p-2 z-100 backdrop-blur-md bg-[#041b298c] rounded shadow-btn-primary'>
                    YUSD is composed by 75% of Near and 25% of YOCn, YOC´s government coin.<br />
                    These assets are locked on your YUSD Tokens contract
                </div>
            </div>
        </div>
        <p className='mb-4 text-sm italic'>75% {native} and 25% {YOC}</p>

        <div className="yusd-selector rounded-lg border border-border-primary mb-4">
            <div className="w-full flex justify-between items-center bg-primary-pattern border-b border-border-primary px-3">
                <input className='bg-transparent text-white py-2' placeholder="Enter YUSD amout to mint" value={amount} onChange={(e: any) => amountChangeHandle(e.target.value)} />
                <span className='font-semibold'>YUSD</span>
            </div>
            <div className="yusd-details text-sm px-3 py-2 flex items-end justify-between">
                <div>
                    <p>Composition:</p>
                    <p>75% {native}: {compositionETHAmount.toFixed(4)} Tokens</p>
                    <p>25% {YOC}: {compositionYOCAmount.toFixed(4)} Tokens</p>
                </div>
                <div>
                    <p className='text-right'>{network} Price: {ETHPriceByUSD.toFixed(2)} USD</p>
                    <p className='text-right'>{YOC} Price: {YOCPriceByUSD.toFixed(2)} USD</p>
                </div>
            </div>
        </div>

        <div className='text-base'>Approx: <span className='text-dark-secondary'>{Number(convertWeiToEth(approx, 18)).toFixed(4)} {withYOC ? YOC : native}</span></div>
        <div className='text-base'>Account balance: <span className='text-dark-secondary'>{YUSDBalance.toFixed(4)} YUSD</span></div>
        <div className='w-full flex items-center justify-between mb-4 text-base'>
            <p>Account balance: <span>{ETHBalance.toFixed(4)} {native}</span></p>
            <button className='text-base text-white px-2 py-1 leading-none bg-btn-primary rounded shadow-btn-primary' onClick={() => setMaxHandle()}>Max</button>
        </div>
        <div className="w-full flex justify-center">
            <button className='bg-btn-primary text-white w-full py-5 text-3xl rounded-lg shadow-btn-primary' onClick={() => confirmMintHandle()}>Mint {withYOC ? " With YOC" : ""}</button>
        </div>


        <Modal size="small" show={showMintModalToggle} onClose={() => setShowMintModalToggle(false)}>
            <div className="p-6 pt-8 text-primary">
                <p className="text-xl py-4">Mint <span className="text-secondary">{amount} YUSD</span></p>
                <p className="mb-6 text-base leading-7">Please confirm to initiate this transaction</p>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => mintHandle()}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setShowMintModalToggle(false)}>Reject</button>
                </div>
            </div>
        </Modal>
    </div>
}

export default MintSection;