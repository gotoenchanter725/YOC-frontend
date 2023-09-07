import { useState, useEffect, useMemo, useCallback } from 'react';
import { Contract } from 'ethers';
import Modal from '@components/widgets/Modalv2';
import useNetwork from '@hooks/useNetwork';
import useAccount from '@hooks/useAccount';
import useLoading from '@hooks/useLoading';
import useAlert from '@hooks/useAlert';
import { convertEthToWei, convertWeiToEth } from 'utils/unit';
import { debounceHook } from 'utils/hook';
import { YOCSwapRouter, YUSD, YOC as YOCToken, WETH } from 'src/constants/contracts';

const MintSection = () => {
    const { provider, signer, ETHBalance, YUSDBalance, account } = useAccount();
    const { network, YOC, native } = useNetwork();
    const { loadingStart, loadingEnd } = useLoading();
    const { alertShow } = useAlert();
    const [amount, setAmount] = useState("0");
    const [approx, setApprox] = useState(0);
    const [compositionETHAmount, setCompositionETHAmount] = useState(0);
    const [compositionYOCAmount, setCompositionYOCAmount] = useState(0);
    const [showMintModalToggle, setShowMintModalToggle] = useState(false);
    const [ETHPriceByUSD, setETHPriceByUSD] = useState(0);
    const [YOCPriceByUSD, setYOCPriceByUSD] = useState(0);
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
                let ETHAmount = await YUSDContract.getETHAmountForMint(val);
                setApprox(ETHAmount);
                let ETHAmountByNumber = Number(convertWeiToEth(ETHAmount, 18));
                setCompositionETHAmount(ETHAmountByNumber * 0.75);

                let tempResult = await SwapRouterContract.getAmountsOut(
                    convertEthToWei(ETHAmountByNumber * 0.25 + "", 18),
                    [WETH, YOCToken.address]
                );
                setCompositionYOCAmount(Number(convertWeiToEth(tempResult[1], YOCToken.decimals)));
                loadingEnd();
            } catch (error) {
                loadingEnd();
            }
        })
    }

    const setMaxHandle = useCallback(() => {
        let totalETHAmountByUSD = ETHBalance * ETHPriceByUSD;
        console.log(totalETHAmountByUSD);
        amountChangeHandle(totalETHAmountByUSD.toFixed(0));
    }, [ETHBalance, ETHPriceByUSD]);

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
            YUSDContract.on("Mint", (user, YUSDAmount, paidETHAmount) => {
                console.log(user, paidETHAmount);
                if (user == account) {
                    alertShow({ content: `Mint Successfully`, text: `Paid: ${convertWeiToEth(paidETHAmount, 18)} ${native}, Minted: ${YUSDAmount} ${YUSD.symbol}`, status: 'success' });
                    loadingEnd();
                }
            })
            await YUSDContract.mint(amount, {
                value: approx,
                gasLimit: 300000
            });
        } catch (error) {
            console.log(error);
            loadingEnd();
        }
    }

    return <div className="text-dark-primary">
        <h3 className='text-xl text-white mb-2'>Mint YUSD tokens</h3>
        <p className='mb-2 text-dark-secondary'>Ratio: 1 YUSD = 1 USD</p>
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

        <div>Approx: <span className='text-dark-secondary'>{convertWeiToEth(approx, 18)} {native}</span></div>
        <div>Account balance: <span className='text-dark-secondary'>{YUSDBalance.toFixed(4)} YUSD</span></div>
        <div className='w-full flex items-center justify-between mb-4'>
            <p>Account balance: <span>{ETHBalance.toFixed(4)} {native}</span></p>
            <button className='text-white p-2 leading-none bg-btn-primary rounded shadow-btn-primary' onClick={() => setMaxHandle()}>Max</button>
        </div>
        <div className="w-full flex justify-center">
            <button className='bg-btn-primary text-white w-full py-5 text-3xl rounded-lg shadow-btn-primary' onClick={() => confirmMintHandle()}>Mint</button>
        </div>


        <Modal size="small" show={showMintModalToggle} onClose={() => setShowMintModalToggle(false)}>
            <div className="p-6 pt-8 text-primary">
                <p className="text-xl py-4">Mint <span className="text-secondary">{amount} YUSD</span></p>
                <p className="mb-6 text-sm leading-7">Please confirm to initiate this transaction</p>

                <div className="flex justify-between">
                    <button className="w-full font-semibold rounded text-primary bg-btn-primary shadow-btn-primary px-4 py-2 mr-2" onClick={() => mintHandle()}>Confirm</button>
                    <button className="w-full font-semibold rounded text-primary bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF22] px-4 py-2" onClick={() => setShowMintModalToggle(false)}>Reject</button>
                </div>
            </div>
        </Modal>
    </div>
}

export default MintSection;