import React, { FC } from "react"

type Props = {
    text: string;
    onClick?: any;
    bgColor?: string;
    color?: string;
    className?: string;
    disabled?: boolean;
}

const Button: FC<Props> = ({ text, onClick, bgColor = "#43e3e091", color = "white", className, disabled = false }) => {
    return <button disabled={disabled} className={`app-button !rounded ${className} ${disabled ? 'disabled' : ''}`} onClick={onClick} style={{ backgroundColor: bgColor, color: color }}>{text}</button>
}

export default Button;