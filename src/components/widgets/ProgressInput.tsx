import { FC, useState } from "react";

type propsType = {
    className?: string,
    inputClassName?: string,
    value?: number,
    setValue?: (v: number) => void
};

const ProgressInput: FC<propsType> = ({ className = "", inputClassName = "", value = 0, setValue }) => {
    const [val, setVal] = useState(0);

    return <div className={`range-container flex ${className}`}>
        <input type="range" min="0" max="100" value={value} step="1"
            className={`${inputClassName} w-full bg-gray-300`}
            onChange={(e: any) => { if (setValue) setValue(e.target.value) }}
        />
    </div>
}

export default ProgressInput;