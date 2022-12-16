import React, { FC } from "react"
import { FaLongArrowAltDown } from "react-icons/fa"
import { GoArrowDown } from "react-icons/go"
import { ImArrowDown } from "react-icons/im"

type Props = {
    text: string;
    bgColor?: string;
    color?: string;
}

const ShowMoreIcon: FC<Props> = ({ text, bgColor = "#17365b", color = "white" }) => {
    return <div className="show-more-icon" style={{ backgroundColor: bgColor, color: color }}>
        <p>{text}</p>
        {/* <FaLongArrowAltDown /> */}
        <ImArrowDown />
    </div>
}

export default ShowMoreIcon;