import { FC } from 'react';
import { BsDatabaseSlash } from "react-icons/bs";

interface propsType {
    className?: string,
    text?: string
}

const NoData: FC<propsType> = ({ className = "", text = "No Data" }) => {
    return (
        <div className={`w-full h-full flex items-center justify-center ${className}`}>
            <div className='flex items-center justify-center'>
                <BsDatabaseSlash className='text-lg mr-2' />
                <span className=''>{text}</span>
            </div>
        </div>
    )
}

export default NoData;