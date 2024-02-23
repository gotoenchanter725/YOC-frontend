import React, { FC } from "react"

type Props = {
    text: string;
    onClick?: any;
    bgColor?: string;
    color?: string;
    className?: string;
    disabled?: boolean;
    defaultSize?: boolean;
}

const Button: FC<Props> = ({ text, onClick, className, disabled = false, defaultSize = false }) => {
    return <button disabled={disabled} className={`bg-btn-primary text-white ${defaultSize ? '!w-[132px]' : ''} px-2 py-1 rounded backdrop-blur-md ${className} ${disabled ? 'disabled bg-gray-600' : ''}`} onClick={onClick}>{text}</button>
}

export default Button;