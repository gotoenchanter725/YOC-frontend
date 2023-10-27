import React, { FC, MouseEventHandler, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { BsX } from "react-icons/bs";
type Props = {
    show?: boolean;
    onClose: () => void;
    size?: string,
    children?: React.ReactNode;
    opacity?: string,
    layer?: number
}

const Modal: FC<Props> = (props) => {
    const modalWrapContainer = useRef(null);
    const [isBrowser, setIsBrowser] = useState(false);
    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const closeHandle = (e: EventTarget | String) => {
        if (e === 'close' || e == modalWrapContainer.current) {
            props.onClose();
        }
    }

    const convertSizeToClass = (size?: string) => {
        if (!size || size == 'small') return "max-w-[600px]";
        else if (size == 'md') return "max-w-[1000px]"
        else if (size == 'large') return "max-w-[1200px]"
        else if (size == 'full') return "max-w-[calc(100vw_-_100px)]"
    }

    return (
        <>
            <div className="z-[50] -z-1"></div>
            <div className={`transition-all overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 p-6 w-full md:inset-0 min-h-full flex justify-around items-center ${props.show ? `z-[${props.layer ? props.layer : '50'}] visible bg-[#141130d0] ` : " -z-1 invisible bg-transparent "}`}
                onClick={(e) => closeHandle(e.target)}
                ref={modalWrapContainer}
            >
                <div className={"w-full h-full md:h-auto z-100 bg-body-secondary " + convertSizeToClass(props.size)}>
                    <div className="relative bg-primary-pattern border-[0.5px] border-solid border-[#FFFFFF30] rounded-lg shadow ">
                        <button type="button" className="absolute right-3 top-3 bg-transparent hover:bg-gray-200 rounded-full p-1 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal"
                            onClick={() => closeHandle('close')}
                        >
                            <BsX className="w-[24px] h-[24px] flex justify-space items-center" color="#FEFEFE" />
                        </button>
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    )
}


export default Modal;