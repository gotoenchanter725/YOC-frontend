import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Head from 'next/head';
import Link from "next/link"
import { useRouter } from "next/router"
import { FaTimes } from "react-icons/fa";

import NetworkSelector from "@components/widgets/NetworkSelector";

import arrowRightImage from "../../../public/images/arrow-right.png";
import YOCb from "../../../public/images/coins/YOCb.png";
import YOCe from "../../../public/images/coins/YOCe.png";

import useAccount from "@hooks/useAccount"
import useWallet from "@hooks/useWallet"
import useAdmin from "@hooks/useAdmin";
import useNetwork from "@hooks/useNetwork";
import { YOC } from "../../constants/contracts";

const menuData = [
    {
        name: 'Home',
        route: '/'
    },
    {
        name: 'Trade',
        route: '/trate',
        includes: ['/swap', '/liquidity', '/charts'],
        children: [
            {
                name: "YUSD",
                route: '/yusd'
            },
            {
                name: "Swap",
                route: '/swap'
            },
            {
                name: "Liquidity",
                route: '/liquidity'
            },
            {
                name: "Charts",
                route: '/charts'
            },
        ]
    },
    {
        name: 'Farms',
        route: '/farms'
    },
    {
        name: 'Pool',
        route: '/pools'
    },
    {
        name: 'Funds',
        route: '/funds'
    },
    {
        name: 'Network',
        route: '/network'
    }
]

const Navbar = () => {
    const router = useRouter();
    const [navbarBgActive, setNavbarBgActive] = useState(false);
    const { account, balance } = useAccount();
    const { connectWallet, disconnectWallet } = useWallet();
    const { network } = useNetwork();
    const isAdmin = useAdmin();
    const currentPath = useMemo(() => {
        return router.pathname;
    }, [router.pathname]);

    const [isOpenMobile, setIsOpenMobile] = useState(false);

    useEffect(() => {
        connectWallet();

        let body = window.document.querySelector('body');
        if (body) {
            if (body.scrollTop > 10)
                setNavbarBgActive(true);
        }
        window.document.querySelector('body')?.addEventListener('scroll', (e: any) => {
            if (e.target.scrollTop > 10) setNavbarBgActive(true);
            else setNavbarBgActive(false)
        })
    }, [])


    const addGlobalYOCTokenHandle = async () => {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: YOC.address, // The address that the token is at.
                    symbol: YOC.symbol + (network === 'ETH' ? 'e' : 'b'), // A ticker symbol or shorthand, up to 5 chars.
                    decimals: YOC.decimals, // The number of decimals in the token
                    // image: 'https://otaris.io/png/otaris_logo.png', // A string url of the token logo
                },
            },
        });
    }

    const toggleMobileHandle = () => {
        setIsOpenMobile(!isOpenMobile);
    }

    return (
        <div className="sticky top-0 w-full z-[2] h-[95px]">
            <Head>
                <link rel="shortcut icon" href={`/images/coins/YOC${network === 'ETH' ? 'e' : 'b'}.png`} />
            </Head>
            <div className={`w-full header-wrap transition-all ${navbarBgActive ? "bg-[#00160c]" : "bg-transparent"}`}>
                <nav className="hidden md:flex container heander-container !py-4 mx-auto justify-between items-center">
                    <div className="flex justify-between items-center">
                        <Link href={'/'}>
                            <div className="cursor-pointer min-w-[120px]">
                                <img className="w-[160px] h-[68px] relative -top-2" src={'/images/logo-menu.png'} alt="App Logo" />
                            </div>
                        </Link>

                        <ul className="navbar-list flex items-center ml-2">
                            {
                                menuData.map((item, index) => {
                                    let isActive = currentPath == item.route;
                                    if (item.children) {
                                        if (item.includes.indexOf(currentPath) != -1) isActive = true;
                                    }
                                    return <li key={index + '_header'} className={`item ${isActive ? "active" : ""} ${item.children ? "children" : ""}`}>
                                        <Link href={item.route}>
                                            <a className="text-base">{item.name}</a>
                                        </Link>

                                        {
                                            item.children ? (
                                                <ul className="child-list">
                                                    {
                                                        item.children.map((ele, index) => {
                                                            return <li key={index + '_child'} className="">
                                                                <Link href={ele.route}>
                                                                    <a className="w-full flex items-center justify-between">
                                                                        <span className="text-base">{ele.name}</span>
                                                                        <Image src={arrowRightImage} alt={'redirect'} />
                                                                    </a>
                                                                </Link>
                                                            </li>
                                                        })
                                                    }
                                                </ul>
                                            ) : ''
                                        }
                                    </li>
                                })
                            }
                            {
                                isAdmin ? (
                                    <li className={`item `}>
                                        <Link href={'/admin'}>
                                            <a className="text-base">Admin</a>
                                        </Link>
                                    </li>
                                ) : ''
                            }
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <div className="flex border-[1px] border-border-primary items-center ml-1">
                            <div className="flex px-2"><span className="mr-2">YOC{network === "ETH" ? 'e' : 'b'}</span><span title={balance} className="inline-block overflow-hidden text-ellipsis max-w-[60px]">{balance}</span></div>
                            <div className="cursor-pointer px-2 pt-2 border-l-[1px] border-border-primary" onClick={() => addGlobalYOCTokenHandle()}>
                                <div className="min-w-[20px]">
                                    <Image src={network === 'ETH' ? YOCe : YOCb} alt='wallet' width={20} height={20} />
                                </div>
                            </div>
                        </div>
                        <div className="flex cursor-pointer border-[1px] border-border-primary items-center ml-1">
                            <div className="px-4" onClick={() => { account ? disconnectWallet() : connectWallet() }}>{account ? `${account.slice(0, 6)}...${account.slice(38, 42)}` : 'Connect to wallet'}</div>
                            <div className="px-2 pt-2 border-l-[1px] border-border-primary">
                                <div className="min-w-[20px]">
                                    <Image src={'/images/wallet.png'} alt='wallet' width={20} height={20} />
                                </div>
                            </div>
                        </div>

                        <NetworkSelector />
                    </div>
                </nav>

                <nav className="flex md:hidden container heander-container !py-4 mx-auto justify-between items-center">
                    <div className="flex items-center">
                        <Link href={'/'}>
                            <div className="cursor-pointer rounded-full p-1 border-[2px] border-[#666]">
                                <img className="min-w-[24px] h-[24px] min-h-[24px]" src={'/images/YOC.png'} alt="App Logo" />
                            </div>
                        </Link>

                        <div className="h-[36px] flex rounded-full border-[2px] border-[#666] items-center ml-2">
                            <div className="px-2 flex"><span className="mr-2">YOC{network === "ETH" ? 'e' : 'b'}</span><span className="max-w-[60px] text-ellipsis overflow-hidden" title={balance}>{balance}</span></div>
                            <div className="h-full flex items-center justify-center cursor-pointer px-2 border-l-[2px] border-[#666]" onClick={() => addGlobalYOCTokenHandle()}>
                                <div className="flex items-center justify-center min-w-[20px]">
                                    <Image src={'/images/YOC.svg'} alt='wallet' width={20} height={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center ml-2">
                        <div className="h-[36px] flex items-center cursor-pointer rounded-lg border-[2px] border-border-primary ml-1">
                            <div className="px-2.5" onClick={() => { account ? disconnectWallet() : connectWallet() }}>{account ? `${account.slice(0, 4)}...${account.slice(40, 42)}` : 'Connect to wallet'}</div>
                            <div className="h-full flex items-center justify-center px-2 border-l-[2px] border-border-primary">
                                <div className="flex items-center justify-center min-w-[20px]">
                                    <Image src={'/images/wallet.png'} alt='wallet' width={18} height={18} />
                                </div>
                            </div>
                        </div>
                        <NetworkSelector className="ml-1" />
                        <button onClick={() => toggleMobileHandle()} className="h-[36px] w-[36px] ml-1 border-[2px] border-[#888] rounded-full flex items-center justify-center">
                            <img className="w-[14px] h-[14px]" src="/images/menu.png" alt="menu" />
                        </button>
                    </div>

                    <div className={`fixed transition-all mobile-header-container ${isOpenMobile ? 'mobile-show' : ''} -left-[200px] top-0 h-full w-[200px] bg-[#00160c] p-4`}>
                        <div className="absolute right-2 top-3 cursor-pointer" onClick={() => toggleMobileHandle()}>
                            <FaTimes className="text-secondary text-2xl" />
                        </div>
                        <div className="w-full flex flex-col justify-between items-center">
                            <Link href={'/'}>
                                <div className="cursor-pointer min-w-[120px] my-4">
                                    <img className="w-full" src={'/images/logo-menu.png'} alt="App Logo" />
                                </div>
                            </Link>

                            <ul className="w-full flex flex-col items-start">
                                {
                                    menuData.map((item, index) => {
                                        let isActive = currentPath == item.route;
                                        return <li key={index + '_header'} className={`w-full rounded my-1 item ${isActive ? "bg-[#2AF6FF88]" : ""} ${item.children ? "children" : ""}`}>
                                            {
                                                item.children ? (
                                                    <>
                                                        <input className='hidden' id={item.route + "_" + index} type='checkbox' />
                                                        <label htmlFor={item.route + "_" + index} className='cursor-pointer block w-full'>
                                                            {item.name}
                                                        </label>

                                                        {
                                                            item.children ? (
                                                                <ul className="sub-mobile-header ml-4 mt-2">
                                                                    {
                                                                        item.children.map((ele, index) => {
                                                                            let isActive = currentPath == ele.route;
                                                                            return <li key={index + '_child'} className={`item my-1 rounded ${isActive ? "bg-[#2AF6FF88]" : ""}`}>
                                                                                <Link href={ele.route}>
                                                                                    <a className="w-full flex items-center justify-between">
                                                                                        <span className="text-base">{ele.name}</span>
                                                                                        <Image src={arrowRightImage} alt={'redirect'} />
                                                                                    </a>
                                                                                </Link>
                                                                            </li>
                                                                        })
                                                                    }
                                                                </ul>
                                                            ) : ''
                                                        }
                                                    </>
                                                ) : (
                                                    <Link href={item.route}>
                                                        <a className="block w-full text-base">{item.name}</a>
                                                    </Link>
                                                )
                                            }
                                        </li>
                                    })
                                }
                                {
                                    isAdmin ? (
                                        <li className={`item `}>
                                            <Link href={'/admin'}>
                                                <a className="text-base">Admin</a>
                                            </Link>
                                        </li>
                                    ) : ''
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Navbar;