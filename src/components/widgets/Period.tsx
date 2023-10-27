import { FC, useState } from 'react';

type Props = {
    value: String;
    setValue?: (e: string) => void;
}

const Period: FC<Props> = (props) => {
    const [period, setPeriod] = useState(props.value);

    const setValueHandle = (value: string) => {
        if (props.setValue) {
            props.setValue(value);
        } else {
            setPeriod(value);
        }
    }

    return (
        <div className="flex items-center p-1.5 bg-[#FFFFFF33] rounded">
            <div onClick={() => setValueHandle('1D')} className={`px-3 py-1 leading-none cursor-pointer text-white text-sm rounded ${props.value == '1D' ? 'bg-[#FFFFFF33]' : ''} mr-2`}>1D</div>
            <div onClick={() => setValueHandle('1W')} className={`px-3 py-1 leading-none cursor-pointer text-white text-sm rounded ${props.value == '1W' ? 'bg-[#FFFFFF33]' : ''} mr-2`}>1W</div>
            <div onClick={() => setValueHandle('1M')} className={`px-3 py-1 leading-none cursor-pointer text-white text-sm rounded ${props.value == '1M' ? 'bg-[#FFFFFF33]' : ''} mr-2`}>1M</div>
            <div onClick={() => setValueHandle('3M')} className={`px-3 py-1 leading-none cursor-pointer text-white text-sm rounded ${props.value == '3M' ? 'bg-[#FFFFFF33]' : ''} mr-2`}>3M</div>
            <div onClick={() => setValueHandle('1Y')} className={`px-3 py-1 leading-none cursor-pointer text-white text-sm rounded ${props.value == '1Y' ? 'bg-[#FFFFFF33]' : ''} mr-2`}>1Y</div>
            <div onClick={() => setValueHandle('ALL')} className={`px-3 py-1 leading-none cursor-pointer text-white text-sm rounded ${props.value == 'ALL' ? 'bg-[#FFFFFF33]' : ''}`}>ALL</div>
        </div>
    )
}

export default Period;