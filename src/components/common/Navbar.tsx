import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Head from 'next/head';
import Link from "next/link";
import { useRouter } from "next/router";

import { FaTimes, FaChartArea } from "react-icons/fa";
import { IoMdSwap } from "react-icons/io";
import { RiCoinsFill } from "react-icons/ri";
import { GiCoins } from "react-icons/gi";
import { MdHowToVote } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";
import { HiOutlineDocument } from "react-icons/hi2";
import { RiMapPinFill } from "react-icons/ri";
import { BiSolidInfoSquare } from "react-icons/bi";
import { IoWallet } from "react-icons/io5";

import NetworkSelector from "@components/widgets/NetworkSelector";

import useAccount from "@hooks/useAccount"
import useWallet from "@hooks/useWallet"
import useAdmin from "@hooks/useAdmin";
import useNetwork from "@hooks/useNetwork";
import { YOC, YUSD } from "../../constants/contracts";

const menuData = [
    {
        name: 'Companies',
        route: '/funds'
    },
    {
        name: 'Trade',
        children: [
            {
                name: "YUSD",
                route: '/yusd',
                icon: <RiCoinsFill />
            },
            {
                name: "Swap",
                route: '/swap',
                icon: <IoMdSwap />
            },
            {
                name: "Liquidity",
                route: '/liquidity',
                icon: <GiCoins />
            },
            {
                name: "Charts",
                route: '/charts',
                icon: <FaChartArea />
            },
            {
                name: "Trade Project",
                route: '/trade',
                icon: <MdHowToVote />
            },
        ]
    },
    {
        name: 'Stakes',
        route: '/pools'
    },
    {
        name: 'Farms',
        route: '/farms'
    },
    {
        name: "Info",
        children: [
            {
                name: "Tokennomics",
                route: 'https://yoc.gitbook.io/docs/tokenomics',
                target: '_blank',
                icon: <BiSolidInfoSquare />
            },
            {
                name: "Docs",
                route: 'https://yoc.gitbook.io/docs/',
                target: '_blank',
                icon: <CgFileDocument />
            },
            {
                name: "White Paper",
                route: 'https://yoc.gitbook.io/white-paper/',
                target: '_blank',
                icon: <HiOutlineDocument />
            },
            {
                name: "Road Map",
                route: '',
                target: '_blank',
                icon: <RiMapPinFill />
            },
        ]
    }
    // {
    //     name: 'Network',
    //     route: '/network'
    // }
]

const Navbar = () => {
    const router = useRouter();
    const [navbarBgActive, setNavbarBgActive] = useState(false);
    const { account, YOCBalance, ETHBalance, YUSDBalance } = useAccount();
    const { connectWallet, showWalletModal, disconnectWallet } = useWallet();
    const { network, native, YOC: YOC_TOKEN } = useNetwork();
    const isAdmin = useAdmin();
    const currentPath = useMemo(() => {
        console.log(router.pathname);
        return router.pathname;
    }, [router.pathname]);

    const [isOpenMobile, setIsOpenMobile] = useState(false);

    useEffect(() => {
        showWalletModal();

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
                    symbol: YOC_TOKEN, // A ticker symbol or shorthand, up to 5 chars.
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
        <div className="sticky top-0 w-full z-[2] h-[95px] text-base">
            <Head>
                <link rel="shortcut icon" href={`/images/coins/${YOC_TOKEN}.png`} />
            </Head>
            <div className={`w-full header-wrap transition-all ${navbarBgActive ? "bg-[#00160c]" : "bg-transparent"}`}>
                <nav className="hidden md:flex container heander-container !py-4 mx-auto justify-between items-center">
                    <div className="flex justify-between items-center">
                        <Link href={'/'}>
                            <div className="cursor-pointer min-w-[120px]">
                                <img className="w-[160px] h-[68px] relative" src={'/images/logo-menu.png'} alt="App Logo" />
                            </div>
                        </Link>

                        <ul className="navbar-list flex items-center ml-2">
                            {
                                menuData.map((item, index) => {
                                    let isActive = currentPath == item.route;
                                    if (item.children && currentPath != "/") {
                                        if (item.children.filter(item => item.route.indexOf(currentPath) != -1).length) isActive = true;
                                    }
                                    return <li key={index + '_header'} className={`item ${isActive ? "active" : ""} ${item.children ? "children" : ""}`}>
                                        <Link href={item.route ? item.route : ""}>
                                            <a className="">{item.name}</a>
                                        </Link>

                                        {
                                            item.children ? (
                                                <ul className="child-list">
                                                    {
                                                        item.children.map((ele: any, index) => {
                                                            return <li key={index + '_child'} className="">
                                                                <Link href={ele.route}>
                                                                    <a target={ele.target ? ele.target : ""} className="w-full flex items-center justify-between">
                                                                        <div className="flex items-center">
                                                                            <div className="text-lg mr-2">
                                                                                {
                                                                                    ele.icon ? ele.icon : ""
                                                                                }
                                                                            </div>
                                                                            <span className="">{ele.name}</span>
                                                                        </div>
                                                                        <img className="w-[12px] h-[12px]" src={'/images/arrow-right.png'} alt={'redirect'} />
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
                                            <a className="">Admin</a>
                                        </Link>
                                    </li>
                                ) : ''
                            }
                        </ul>
                    </div>
                    <div className="flex items-center h-[48px]">
                        <NetworkSelector className="w-[48px] h-[48px]" />
                        <div className="cursor-pointer flex rounded-lg border-[1px] border-border-primary items-center h-full ml-1" onClick={() => addGlobalYOCTokenHandle()}>
                            <div className="min-w-[20px] p-1.5">
                                <img src={`/images/coins/${YOC_TOKEN}.png`} className="min-w-[22px] w-[22px] h-[22px]" alt='wallet' />
                            </div>
                            <div className="flex pr-2"><span className="mr-2">{YOC_TOKEN}</span><span className="inline-block overflow-hidden text-ellipsis max-w-[60px]">${YOCBalance}</span></div>
                        </div>
                        <div className="flex rounded-lg border-[1px] border-border-primary items-center h-full p-2 ml-1">
                            <p className="whitespace-nowrap">Your Balance</p>
                            <div className="border-l border-border-primary text-md ml-2 pl-2 w-[86px]">
                                <div className="flex items-center justify-between" title={`${YOCBalance.toFixed(2)} ${YOC_TOKEN}`}><span>{YOC_TOKEN}:&nbsp;</span><span className="truncate">{YOCBalance.toFixed(2)}</span></div>
                                <div className="flex items-center justify-between" title={`${YUSDBalance.toFixed(2)} ${YUSD.symbol}`}><span>{YUSD.symbol}:&nbsp;</span><span className="truncate">{YUSDBalance.toFixed(2)}</span></div>
                                <div className="flex items-center justify-between" title={`${ETHBalance.toFixed(4)} ${native}`}><span>{native}:&nbsp;</span><span className="truncate">{ETHBalance.toFixed(4)}</span></div>
                            </div>
                        </div>
                        <div className="flex cursor-pointer rounded-lg border-[1px] border-border-primary items-center h-full p-2 ml-1"
                            onClick={() => { account ? disconnectWallet() : showWalletModal() }}>
                            <span className="pr-1">
                                {account ? `${account.slice(0, 6)}...${account.slice(38, 42)}` : 'Connect to wallet'}</span>
                            <IoWallet className="text-xl" />
                        </div>
                    </div>
                </nav>

                <nav className="flex md:hidden container heander-container !py-4 mx-auto justify-between items-center">
                    <div className="flex items-center">
                        <Link href={'/'}>
                            <div className="cursor-pointer rounded-full p-1 border-[2px] border-[#666]">
                                <img className="min-w-[26px] h-[26px] min-h-[24px]" src={`/images/coins/${YOC_TOKEN}.png`} alt="App Logo" />
                            </div>
                        </Link>

                        <div className="h-[40px] flex rounded-full border-[2px] border-[#666] items-center ml-2">
                            <div className="px-2 flex"><span className="mr-2">{YOC_TOKEN}</span><span className="max-w-[60px] text-ellipsis overflow-hidden" title={YOCBalance + ""}>{YOCBalance}</span></div>
                            <div className="h-full flex items-center justify-center cursor-pointer px-2 border-l-[2px] border-[#666]" onClick={() => addGlobalYOCTokenHandle()}>
                                <div className="flex items-center justify-center min-w-[20px]">
                                    <Image src={`/images/coins/${YOC_TOKEN}.png`} alt='wallet' width={20} height={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center ml-2">
                        <div className="h-[40px] flex items-center cursor-pointer rounded-lg border border-border-primary ml-1">
                            <div className="px-2.5" onClick={() => { account ? disconnectWallet() : showWalletModal() }}>{account ? `${account.slice(0, 4)}...${account.slice(40, 42)}` : 'Connect to wallet'}</div>
                            <div className="h-full flex items-center justify-center px-2 border-l-[2px] border-border-primary">
                                <IoWallet className="text-xl" />
                            </div>
                        </div>
                        <NetworkSelector className="ml-1" />
                        <button onClick={() => toggleMobileHandle()} className="h-[40px] w-[40px] ml-1 border-[2px] border-[#888] rounded-full flex items-center justify-center">
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
                                        return <li key={index + '_header'} className={`w-full rounded my-1 item ${isActive ? "bg-[#2AF6FF88]" : ""} ${item.children ? "children" : ""} hover:text-[#2AF6FF88]`}>
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
                                                                                    <a className="w-full flex items-center justify-between hover:text-[#2AF6FF88]">
                                                                                        <div className="flex items-center">
                                                                                            <div className="text-lg mr-2">{ele.icon ? ele.icon : ""}</div>
                                                                                            <span className="">{ele.name}</span>
                                                                                        </div>
                                                                                        <img className="w-[12px] h-[12px]" src={'/images/arrow-right.png'} alt={'redirect'} />
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
                                                        <a className="block w-full ">{item.name}</a>
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
                                                <a className="">Admin</a>
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