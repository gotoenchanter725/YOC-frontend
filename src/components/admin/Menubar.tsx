import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaList } from "react-icons/fa";
import { FaCoins } from "react-icons/fa6";
import { GiCoins } from "react-icons/gi";
import { RiCoinsFill, RiNftFill, RiHandCoinFill } from "react-icons/ri";
import { GiCrownCoin } from "react-icons/gi";

import useAccount from "@hooks/useAccount";
import useAdmin from "@hooks/useAdmin";


const adminMenus = [
    {
        title: "Project",
        logo: <FaList />,
        router: '/admin',
    },
    {
        title: "Currencies",
        logo: <FaCoins />,
        router: '/admin/currency',
    },
    {
        title: "YUSD",
        logo: <RiCoinsFill />,
        router: '/admin/yusd',
    },
    {
        title: "Liquidity Pool",
        logo: <GiCoins />,
        router: '/admin/liquidity',
    },
    {
        title: "Farm",
        logo: <RiHandCoinFill />,
        router: '/admin/farm',
    },
    {
        title: "Stake",
        logo: <GiCrownCoin />,
        router: '/admin/stake',
    },
    {
        title: "NFT",
        logo: <RiNftFill />,
        router: '/admin/nft',
    },
]

import useWallet from "@hooks/useWallet";
import SimpleLoading from "../widgets/SimpleLoading";

const MenuBar = () => {
    const router = useRouter();
    const { connectWallet } = useWallet();
    const isAdmin = useAdmin();
    const { account } = useAccount();

    useEffect(() => {
        connectWallet();
    }, [])


    return <nav className="admin-menu bg-[#25262b] min-h-[100vh] sticky top-0">
        <div className="logo">
            <div className="w-[240px] p-2 border-b border-[#ffffff2d]">
                <Link href={'/'}>
                    <img className="w-full cursor-pointer" src="/images/logo.png" alt="Footer Logo" />
                </Link>
            </div>

            <div className="flex flex-col px-4 py-8 text-base">
                {
                    account ?
                        isAdmin ?
                            adminMenus.map((item: any, index) => {
                                return <Link key={'menu' + index} href={item.router}>
                                    <a>
                                        <div className={`flex items-center p-2 text-[#00fffa] ${item.router === router.route ? 'bg-[#a7dbe421]' : ''} hover:bg-[#a7dbe421] rounded cursor-pointer`}>
                                            <div className="bg-[#a7e4b81e] text-xl text-[#31fff5] rounded p-2 mr-4">
                                                {item.logo}
                                            </div>
                                            <span>{item.title}</span>
                                        </div>
                                    </a>
                                </Link>
                            })
                            : <div className='w-full h-full flex items-center justify-center'>
                                <p className='text-xl text-center text-dark-secondary'>You are not admin!</p>
                            </div>
                        : <div className='w-full h-full flex items-center justify-center'><SimpleLoading className='w-[30px]' /></div>
                }
            </div>
        </div>
        <div>
        </div>
    </nav>
}

export default MenuBar;