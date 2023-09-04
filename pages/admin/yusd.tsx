import useNetwork from "@hooks/useNetwork";
import { NextPage } from "next";
import { useState } from "react";
import { AiOutlineSwap, AiFillControl } from 'react-icons/ai';

const AdminYUSD: NextPage = () => {
    const { native, YOC } = useNetwork();
    const [ function1State, setFunction1State ] = useState(false);

    return <div className="w-full px-6 py-12 text-dark-secondary">
        <h2 className='text-3xl text-white mb-6'>YUSD</h2>
        <div className="flex items-center mb-4">
            <p>Audo Rebalance when price of YUSD is greater than $2.</p>
            {
                function1State ? (
                    <div className="flex items-center ml-2">
                        <p className="text-green-500">Enabled</p>
                        <button className="flex text-white px-3 py-2 leading-none bg-btn-primary rounded ml-2"><AiOutlineSwap className="mr-2" />Disable</button>
                    </div>
                ) : (
                    <div className="flex items-center ml-2">
                        <p className="text-red-500">Disabled</p>
                        <button className="flex text-white px-3 py-2 leading-none bg-btn-primary rounded ml-2"><AiOutlineSwap className="mr-2" />Enable</button>
                    </div>
                )
            }
        </div>
        <div className="flex items-center mb-4">
            <p>Manual Rebalance to keep 75% SOL and 25% YOC</p>
            <button className="flex text-white px-3 py-2 leading-none bg-btn-primary rounded ml-2"><AiFillControl className="mr-2" />Vault2</button>
        </div>

        <div className="flex justify-between text-white px-4 py-3 mb-2 bg-[#25262b]">
            <div className="w-1/5 flex items-center">
                <img className="w-[36px] h-[36px] p-1 border-2 border-border-primary rounded-full mr-2" src="/images/coins/YUSD.png" />
                <p className="text-white text-lg">YUSD</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Total Supply</p>
                <p className="text-lg">{84.205427}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Price</p>
                <p>${1.3029}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Total Volume</p>
                <p className="text-lg">${109}</p>
            </div>
            <div className="w-1/5"></div>
        </div>
        <p className="text-xl font-semibold py-3">Pool Composition</p>
        <div className="flex justify-between text-white px-4 py-3">
            <div className="w-1/5 flex items-center">
                <img className="w-[36px] h-[36px] p-1 border-2 border-border-primary rounded-full mr-2" src={`/images/coins/${native}.png`} />
                <p className="text-white text-lg">{native}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Reserve</p>
                <p className="text-lg">{84.205427}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Price</p>
                <p className="text-lg">${1.3029}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Volume</p>
                <p className="text-lg">${109}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Percent</p>
                <p className="text-lg">{60.56}%</p>
            </div>
        </div>
        <div className="flex justify-between text-white px-4 py-3">
            <div className="w-1/5 flex items-center">
                <img className="w-[36px] h-[36px] p-1 border-2 border-border-primary rounded-full mr-2" src={`/images/coins/${YOC}.png`} />
                <p className="text-white text-lg">{native}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Reserve</p>
                <p className="text-lg">{84.205427}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Price</p>
                <p className="text-lg">${1.3029}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Volume</p>
                <p className="text-lg">${109}</p>
            </div>
            <div className="w-1/5 flex flex-col items-center justify-center">
                <p className="text-sm">Percent</p>
                <p className="text-lg">{60.56}%</p>
            </div>
        </div>
    </div>
}

export default AdminYUSD;