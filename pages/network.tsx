import React, { FC } from "react"

const networks = [
    {
        name: 'BSC',
        color: "#f3ba2f",
        image: "/images/coins/network-binance.png",
        route: "https://www.yoc.fund/bsc"
    },
    {
        name: 'Ethereum',
        color: "#d0cfcf",
        image: "/images/coins/network-ethereum.png",
        route: "https://www.yoc.fund/eth"
    },
    {
        name: 'SOLANA',
        color: '#FFF',
        image: "/images/coins/network-solana.png",
        route: "https://www.yoc.so"
    },
    {
        name: 'NEAR',
        color: "#000",
        image: "/images/coins/network-near.png",
        route: "https://www.yocnear.io"
    },
]

const Network: FC = () => {
    return <div className="container">
        <div className="w-full flex flex-col items-center">
            <a className="w-[70%]">
                <img src="/images/logo-menu.png" alt="logo" />
            </a>

            <div className="flex items-center gap-4 md:gap-16">
                <a href={networks[0].route} className="flex flex-col items-center cursor-pointer">
                    <div className="w-[140px] h-[140px] flex items-center justify-center">
                        <img className="w-[120px]" src={networks[0].image} alt={networks[0].name} />
                    </div>
                    <p className={`text-3xl mt-4 text-[#f3ba2f]`}>{networks[0].name}</p>
                </a>
                <a href={networks[1].route} className="flex flex-col items-center cursor-pointer">
                    <div className="w-[140px] h-[140px] flex items-center justify-center">
                        <img className="w-[120px]" src={networks[1].image} alt={networks[1].name} />
                    </div>
                    <p className={`text-3xl mt-4 text-[#d0cfcf]`}>{networks[1].name}</p>
                </a>
                <a href={networks[2].route} className="flex flex-col items-center cursor-pointer">
                    <div className="w-[140px] h-[140px] flex items-center justify-center">
                        <img className="w-[120px]" src={networks[2].image} alt={networks[0].name} />
                    </div>
                    <p className={`text-3xl mt-4 text-[#fff]`}>{networks[2].name}</p>
                </a>
                <a href={networks[3].route} className="flex flex-col items-center cursor-pointer">
                    <div className="w-[140px] h-[140px] flex items-center justify-center">
                        <img className="w-[120px]" src={networks[3].image} alt={networks[0].name} />
                    </div>
                    <p className={`text-3xl mt-4 text-[#000]`}>{networks[3].name}</p>
                </a>
            </div>
        </div>
    </div>
}

export default Network;