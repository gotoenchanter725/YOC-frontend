import React, { FC } from "react"

type Props = {
    value?: any;
    setValue?: (v: any) => void,
    type?: string;
    label?: string;
    onClick?: any;
    bgColor?: string;
    color?: string;
    className?: string;
    disabled?: boolean;
    leftText?: string;
}

const CInput: FC<Props> = ({ value = "", setValue, type = "text", label = "", leftText = "", bgColor = "#43e3e091", color = "white", className, disabled = false }) => {

    const changeHandle = (v: any) => {
        if (setValue) {
            setValue(v);
        }
    }

    return <div className={`bg-transparent ${className}`}>
        {
            label ?
                <label className="mb-2">{label}</label>
                : <></>
        }
        <div className="w-full relative bg-transparent flex items-center">
            <input type={type} disabled={disabled} className={`bg-[#00000025] block w-full rounded border border-solid border-border-secondary p-2`} value={value} onChange={(e: any) => changeHandle(e.target.value)} />
            <span className="absolute right-3 text-gray-500">{leftText}</span>
        </div>
    </div>
}

export default CInput;