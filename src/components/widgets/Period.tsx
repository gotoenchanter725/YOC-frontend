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
        <div className="flex items-center p-2 bg-[#FFFFFF33] rounded-md">
            <div onClick={() => setValueHandle('1D')} className={`px-4 py-1 ${period == '1D' ? 'bg-[#FFFFFF33]' : ''} cursor-pointer text-white text-sm rounded-md mr-4`}>1D</div>
            <div onClick={() => setValueHandle('1W')} className={`px-4 py-1 ${period == '1W' ? 'bg-[#FFFFFF33]' : ''} cursor-pointer text-white text-sm rounded-md mr-4`}>1W</div>
            <div onClick={() => setValueHandle('1M')} className={`px-4 py-1 ${period == '1M' ? 'bg-[#FFFFFF33]' : ''} cursor-pointer text-white text-sm rounded-md mr-4`}>1M</div>
            <div onClick={() => setValueHandle('3M')} className={`px-4 py-1 ${period == '3M' ? 'bg-[#FFFFFF33]' : ''} cursor-pointer text-white text-sm rounded-md mr-4`}>3M</div>
            <div onClick={() => setValueHandle('1Y')} className={`px-4 py-1 ${period == '1Y' ? 'bg-[#FFFFFF33]' : ''} cursor-pointer text-white text-sm rounded-md mr-4`}>1Y</div>
            <div onClick={() => setValueHandle('ALL')} className={`px-4 py-1 ${period == 'ALL' ? 'bg-[#FFFFFF33]' : ''} cursor-pointer text-white text-sm rounded-md`}>ALL</div>
        </div>
    )
}

export default Period;