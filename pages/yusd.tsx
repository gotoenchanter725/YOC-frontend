import BurnSection from "@components/sections/Burn";
import MintSection from "@components/sections/Mint";
import React, { FC, useState } from "react"

const YUSD: FC = () => {
    const [tab, setTab] = useState('mint');

    return <div className="container flex items-center justify-center">
        <div className="yusd-wrap w-[400px] shadow-big bg-primary-pattern rounded-xl px-4 py-8">
            <div className="yusd-header flex bg-primary-pattern border-1 border-border-primary w-full rounded-full p-0.5 mb-3">
                <div onClick={() => setTab('mint')} className={`w-1/2 text-center leading-none rounded-full p-1.5 text-lg cursor-pointer ${tab == 'mint' ? 'font-bold text-white bg-dark-primary' : 'text-dark-secondary'} `}>Mint</div>
                <div onClick={() => setTab('burn')} className={`w-1/2 text-center leading-none rounded-full p-1.5 text-lg cursor-pointer ${tab == 'burn' ? 'font-bold text-white bg-dark-primary' : 'text-dark-secondary'}`}>Burn</div>
            </div>

            <div className="yusd-body p-2">
                {
                    tab == 'mint' ? <MintSection /> : <BurnSection />
                }
            </div>
        </div>
    </div>
}

export default YUSD;