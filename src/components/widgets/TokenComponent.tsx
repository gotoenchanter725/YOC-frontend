import React, { useEffect, useMemo, useState } from "react";
import { tokenInterface } from "../../constants/tokens";
import { useCurrency } from "@hooks/useTokens";

interface propsInterface {
    type: any,
    setType: (item: tokenInterface) => void,
    amount?: any,
    setAmount?: (item: any) => void,
    ignoreValue?: any,
    disabled?: boolean,
    side?: string
}

const TokenComponent = (props: propsInterface) => {
    const { tokens: TOKENS } = useCurrency();
    const [toggle, setToggle] = useState(false);

    const selectToken = (address: string) => {
        setToggle(false);

        if (TOKENS && TOKENS.length) {
            let token = TOKENS.find(i => i.address == address) || TOKENS[0];
            props.setType(token);
        }
    }

    const changeAmountHandle = (v: any) => {
        if (!isNaN(Number(v)) && props.setAmount) {
            props.setAmount(v);
        }
    }

    const showNumber = (v: any) => {
        if (isNaN(Number(v))) return 0;
        else return v;
    }

    useEffect(() => {
        document.addEventListener('click', (e: any) => {
            if (!e.target.closest('.currencySelectorDropDownMenu')) {
                setToggle(false);
            }
        })
    }, [])

    return (
        <div className='currencySelectorDropDownMenu relative border border-solid border-secondary rounded'>
            <div className={`flex items-center px-1 ${props.side == 'right' ? 'justify-end' : ''}`}>
                {
                    props.type ? (
                        <>
                            <div className={`flex items-center p-2 ${(props.side && props.side == "right") ? "order-2" : "order-1"}`}>
                                <div className={`mr-1 w-[24px]`}>
                                    <img className='rounded-full w-full aspect-[1/1]' src={props.type.image} alt='coin' />
                                </div>
                                <button className={`px-1 text-lg font-semibold text-secondary bg-transparent`} disabled={props.disabled} onClick={() => setToggle(!toggle)}>{props.type.symbol}</button>
                            </div>
                            {
                                props.setAmount ?
                                    <input className={`bg-transparent text-right text-lg w-full block p-2 ${(props.side && props.side == "right") ? "order-1 !text-left" : "order-2"}`} placeholder='0.00' value={showNumber(props.amount)} disabled={props.disabled} onChange={(e) => changeAmountHandle(e.target.value)} />
                                    : ""
                            }
                        </>
                    ) : (
                        <button className='p-2 text-lg font-semibold text-secondary bg-transparent' onClick={() => setToggle(!toggle)} disabled={props.disabled}>Select Token</button>
                    )
                }
            </div>
            {
                toggle ? (
                    <div className="flex flex-col w-full absolute top-[46px] left-0 z-[120] bg-[#0b3330] border border-secondary rounded p-1.5">
                        <div className="w-full max-h-[300px] overflow-y-auto scrollbar-w-[3px] scroll-smooth scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent scrollbar-corner-transparent scrollbar-thumb-rounded-full scrollbar-track-p-2">
                            {
                                (props.ignoreValue ? TOKENS.filter(item => item.address !== props.ignoreValue.address) : TOKENS)
                                    .map((item: any, index: number) => {
                                        return (
                                            <div key={index} className={`flex items-center w-full cursor-pointer bg-[#082725] ${props.type && item.address == props.type.address && "!bg-[#0f1d17]"} hover:bg-[#0f1d17] px-3 py-1.5 hover:rounded transition-all`} onClick={() => selectToken(item.address)}>
                                                <img className="rounded-full w-[36x] h-[36px] mr-3" src={item.image} alt={item.symbol} />
                                                <div className="flex flex-col">
                                                    <h4 className="text-xl font-bold">{item.symbol}</h4>
                                                    <span className="text-sm font-medium text-[#FFFFFF55]">{item.name}</span>
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                ) : ''
            }
        </div>
    )
}

export default TokenComponent;