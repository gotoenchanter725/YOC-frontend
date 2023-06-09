import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BsListTask } from "react-icons/bs"
import useAccount from "@hooks/useAccount";
import useAdmin from "@hooks/useAdmin";


const adminMenus = [
    {
        title: "Project",
        logo: '',
        router: '/admin',
    },
    {
        title: "Currencies",
        logo: "",
        router: '/admin/currency',
    },
    {
        title: "Survey",
        logo: "",
        router: '/admin/survey',
    },
    {
        title: "Liquidity Pool",
        logo: "",
        router: '/admin/liquidity',
    },
    {
        title: "Farm",
        logo: "",
        router: '/admin/farm',
    },
    {
        title: "Stake",
        logo: "",
        router: '/admin/stake',
    },
    {
        title: "NFT",
        logo: "",
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
            <div className="w-[300px] p-2 border-b border-[#ffffff2d]">
                <Link href={'/'}>
                    <img className="w-full cursor-pointer" src="/images/logo.png" alt="Footer Logo" />
                </Link>
            </div>

            <div className="flex flex-col px-4 py-8">
                {
                    account ?
                        isAdmin ?
                            adminMenus.map((item: any, index) => {
                                return <Link key={'menu' + index} href={item.router}>
                                    <a>
                                        <div className={`flex items-center px-4 py-2.5 text-[#00fffa] ${item.router === router.route ? 'bg-[#a7dbe421]' : ''} hover:bg-[#a7dbe421] rounded cursor-pointer`}>
                                            <div className="bg-[#a7e4b81e] rounded p-2 mr-4">
                                                <BsListTask fontSize={20} className='text-[#31fff5]' />
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