import React, { FC } from "react"

type Props = {
    text: string;
    onClick?: any;
    bgColor?: string;
    color?: string;
    className?: string;
}

const Button:FC<Props> = ({text, onClick, bgColor="#2d86f2", color="white", className}) => {
    return <div className={"app-button "+className} onClick={onClick} style={{backgroundColor: bgColor, color: color}}>{text}</div>
}

export default Button;