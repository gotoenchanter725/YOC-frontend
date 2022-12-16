import React, { FC, useState } from "react";
import { TOKENS, tokenInterface } from "../../constants/tokens";

interface propsInterface {
    type: any,
    setType: (item: tokenInterface) => void,
    amount: any,
    setAmount: (item: any) => void,
    ignoreValue?: any,
    disabled?: boolean,
    side?: string
}

const TokenComponent = (props: propsInterface) => {
    const [toggle, setToggle] = useState(false);
    const selectToken = (address: string) => {
        setToggle(false);
        let token = TOKENS.find(i => i.address == address) || TOKENS[0];
        props.setType(token);
    }

    const changeAmountHandle = (v: any) => {
        if (!isNaN(Number(v))) {
            props.setAmount(v);
        }
    }

    return (
        <div className='relative border border-solid border-secondary rounded'>
            <div className={`flex items-center px-1 ${props.side == 'right' ? 'justify-end' : ''}`}>
                {
                    props.type ? (
                        <>
                            <div className={`flex items-center mr-2 ${(props.side && props.side == "right") ? "order-2" : "order-1"}`}>
                                <div className={`ml-2 mr-1 w-[24px]`}>
                                    <img className='rounded-full w-full aspect-[1/1]' src={props.type.logoURI} alt='coin' />
                                </div>
                                <button className={`px-1 text-lg font-semibold text-secondary bg-transparent`} disabled={props.disabled} onClick={() => setToggle(!toggle)}>{props.type.symbol}</button>
                            </div>
                            <input className={`bg-transparent text-right text-lg w-full block p-2 ${(props.side && props.side == "right") ? "order-1 !text-left" : "order-2"}`} placeholder='0.00' value={props.amount} disabled={props.disabled} onChange={(e) => changeAmountHandle(e.target.value)} />
                        </>
                    ) : (
                        <button className='p-2 text-lg font-semibold text-secondary bg-transparent' onClick={() => setToggle(!toggle)} disabled={props.disabled}>Select Token</button>
                    )
                }
            </div>
            {
                toggle ? (
                    <div className="flex flex-col w-full absolute top-[40px] left-0 z-[120] border bg-[#082725] border-solid border-secondary rounded">
                        {
                            (props.ignoreValue ? TOKENS.filter(item => item.address != props.ignoreValue.address) : TOKENS)
                                .map((item: any, index: number) => {
                                    return (
                                        <div key={index} className={`flex items-center w-full cursor-pointer ${props.type && item.address == props.type.address && "bg-[#00000055]"} hover:bg-[#00000055] px-3 py-1.5`} onClick={() => selectToken(item.address)}>
                                            <img className="rounded-full w-[36x] h-[36px] mr-3" src={item.logoURI} alt={item.symbol} />
                                            <div className="flex flex-col">
                                                <h4 className="text-xl font-bold">{item.name}</h4>
                                                <span className="text-sm font-medium text-[#FFFFFF55]">{item.symbol}</span>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                ) : ''
            }
        </div>
    )
}

export default TokenComponent;