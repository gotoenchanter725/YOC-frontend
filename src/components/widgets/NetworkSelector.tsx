import useNetwork from '@hooks/useNetwork';
import { FC, useState } from 'react';


const networks = [
    {
        name: 'Ethereum',
        image: "/images/coins/network-ethereum.png",
        route: "https://www.yoc.fund/eth"
    },
    {
        name: 'Binance',
        image: "/images/coins/network-binance.png",
        route: "https://www.yoc.fund/bsc"
    },
    {
        name: 'Solana',
        image: "/images/coins/network-solana.png",
        route: "https://www.yoc.so"
    },
    {
        name: 'Near',
        image: "/images/coins/network-near.png",
        route: "https://www.yocnear.io"
    },
]

type Props = {
    className?: string
}

const NetworkSelector: FC<Props> = (props) => {
    const { network } = useNetwork();
    const [networkSelector, setNetworkSelector] = useState(false);

    return (
        <div className={`relative ${props.className}`} onMouseOver={() => setNetworkSelector(true)} onMouseLeave={() => setNetworkSelector(false)}>
            <div className="w-full h-full flex items-center justify-center cursor-pointer rounded-full lg:rounded-lg border-[#888] lg:border-secondary border-[2px] lg:border">
                <div className="min-w-[20px] p-1.5">
                    {
                        network === "ETH" ?
                            <img className='w-[24px] h-[24px]' src={'/images/coins/network-ethereum.png'} alt='wallet' />
                            :
                            <img className='w-[24px] h-[24px]' src={'/images/coins/network-binance.png'} alt='wallet' />
                    }
                </div>
            </div>

            <div className={`transition-all ${networkSelector ? 'visible opacity-100' : 'invisible opacity-0'} absolute right-0 top-[48px] w-[240px] rounded-xl overflow-hidden border bg-body-primary`}>
                <div className="py-3 px-3.5 border-b">Select a Network</div>
                {
                    networks.map((item: any, index: number) => {
                        return <div key={'network' + index} className="py-3 px-3.5 hover:bg-[#a7dbe421]">
                            <a className="flex items-center " href={item.route}>
                                <img className="w-[24px] h-[24px] mr-2.5" src={item.image} alt={item.name} />
                                <span>{item.name}</span>
                            </a>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default NetworkSelector;