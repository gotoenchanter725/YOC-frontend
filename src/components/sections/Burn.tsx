import { useState, useEffect, useMemo, useCallback } from 'react';
import { Contract } from 'ethers';
import useNetwork from '@hooks/useNetwork';
import useAccount from '@hooks/useAccount';
import useLoading from '@hooks/useLoading';
import useAlert from '@hooks/useAlert';
import { convertEthToWei, convertWeiToEth } from 'utils/unit';
import { debounceHook } from 'utils/hook';
import { YOCSwapRouter, YUSD, YOC as YOCToken, WETH } from 'src/constants/contracts';
import Modal from '@components/widgets/Modalv2';

const BurnSection = () => {
    const { provider, signer, ETHBalance, YUSDBalance, account } = useAccount();
    const { network, YOC, native } = useNetwork();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const [amount, setAmount] = useState("0");
    const [compositionETHAmount, setCompositionETHAmount] = useState(0);
    const [compositionYOCAmount, setCompositionYOCAmount] = useState(0);
    const [showBurnModalToggle, setShowBurnModalToggle] = useState(false);
    const [ETHPriceByUSD, setETHPriceByUSD] = useState(0);
    const [YOCPriceByUSD, setYOCPriceByUSD] = useState(0);
    const [YUSDPriceByUSD, setYUSDPriceByUSD] = useState(0);
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
            if (YUSDContract && SwapRouterContract) {
                try {
                    let ETHPrice = Number(convertWeiToEth(await YUSDContract.getETHPrice(), 6));
                    setETHPriceByUSD(ETHPrice);
                    let tempResult = await SwapRouterContract.getAmountsOut(
                        convertEthToWei("1", YOCToken.decimals),
                        [YOCToken.address, WETH]
                    );
                    setYOCPriceByUSD(Number(convertWeiToEth(tempResult[1], 18)) * ETHPrice);
                    let YUSDPrice = Number(convertWeiToEth(await YUSDContract.price(), 6));
                    console.log(YUSDPrice);
                    setYUSDPriceByUSD(YUSDPrice);
                } catch (error) {
                }
            }
        })()
    }, [YUSDContract])

    const amountChangeHandle = (val: string) => {
        setAmount(val);
        debounceHook(async () => {
            if (!val) return;
            loadingStart();
            try {
                let totalBurntByUSD = (YUSDPriceByUSD > 1 ? 1 : YUSDPriceByUSD) * Number(val);
                setCompositionETHAmount(totalBurntByUSD * 0.75 / ETHPriceByUSD);
                let tempResult = await SwapRouterContract.getAmountsOut(
                    convertEthToWei(totalBurntByUSD * 0.25 / ETHPriceByUSD + "", 18),
                    [WETH, YOCToken.address]
                );
                setCompositionYOCAmount(Number(convertWeiToEth(tempResult[1], YOCToken.decimals)));
                loadingEnd();
            } catch (error) {
                loadingEnd();
            }
        })
    }

    const setMaxHandle = () => {
        console.log(YUSDBalance);
        amountChangeHandle(YUSDBalance + "");
    };

    const confirmMintHandle = () => {
        console.log(amount);
        if (!Number(amount) || Number(amount) > YUSDBalance) {
            alertShow({ content: 'Please input the amount exactly', status: 'error' });
            return;
        }
        setShowBurnModalToggle(true);
    }

    const burnHandle = async () => {
        setShowBurnModalToggle(false);
        loadingStart();
        try {
            YUSDContract.on("Burn", (user, YUSDAmount, receivedETHAmount, receivedYOCAmount) => {
                if (user == account) {
                    alertShow({
                        content: `Burn Successfully`,
                        text: `Minted: ${YUSDAmount} ${YUSD.symbol}, Received: ${Number(convertWeiToEth(receivedETHAmount, 18)).toFixed(6)} ${native}, ${Number(convertWeiToEth(receivedYOCAmount, YOCToken.decimals)).toFixed(6)} ${YOCToken.symbol}`,
                        status: 'success'
                    });
                    loadingEnd();
                }
            })
            await YUSDContract.burn(amount, {
                gasLimit: 300000
            });
        } catch (error) {
            console.log(error);
            loadingEnd();
        }
    }

    return <div className="text-dark-primary">
        <h3 className='text-xl text-white mb-2'>Burn YUSD tokens</h3>
        <p className='mb-2 text-dark-secondary'>Ratio: 1 YUSD = {YUSDPriceByUSD > 1 ? 1 : YUSDPriceByUSD} USD</p>
        <div className='flex items-center text-sm italic'>
            <p>YUSD are composed of:</p>
            <div className='group relative'>
                <img className='ml-2 w-[14px] h-[14px]' src='/images/question.png' />
                <div className='hidden group-hover:block not-italic text-white absolute left-2 top-3.5 w-[200px] p-2 z-100 bg-body-primary rounded shadow-btn-primary'>
                    YUSD is composed by 75% of Near and 25% of YOCn, YOC´s government coin.<br />
                    These assets are locked on your YUSD Tokens contract
                </div>
            </div>
        </div>
        <p className='mb-4 text-sm italic'>75% {network} and 25% {YOC}</p>

        <div className="yusd-selector rounded-lg border border-border-primary mb-4">
            <div className="w-full flex justify-between items-center bg-primary-pattern border-b border-border-primary px-3">
                <input className='bg-transparent text-white py-2' placeholder="Enter YUSD amout to burn" onChange={(e: any) => amountChangeHandle(e.target.value)} value={amount} />
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

        <div>Account balance: <span className='text-dark-secondary'>{YUSDBalance.toFixed(4)} YUSD</span></div>
        <div className='w-full flex justify-between items-center mb-4'>
            <p>Account balance: <span>{ETHBalance.toFixed(4)} {native}</span></p>
            <button className='text-white p-2 leading-none bg-btn-primary rounded shadow-btn-primary' onClick={() => setMaxHandle()}>Max</button>
        </div>
        <div className="w-full flex justify-center">
            <button className='bg-btn-primary text-white w-full py-5 text-3xl rounded-lg shadow-btn-primary' onClick={() => confirmMintHandle()}>Burn</button>
        </div>

        <Modal size="small" show={showBurnModalToggle} onClose={() => setShowBurnModalToggle(false)}>
            <div className="p-6 pt-8 text-primary">
                <p className="text-xl py-4">Burn <span className="text-secondary">{amount} YUSD</span></p>
                <p className="mb-6 text-sm leading-7">Please confirm to initiate this transaction</p>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => burnHandle()}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setShowBurnModalToggle(false)}>Reject</button>
                </div>
            </div>
        </Modal>
    </div>
}

export default BurnSection;