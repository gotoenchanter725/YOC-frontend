import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { Contract } from "ethers"

import Button from "../widgets/Button"
import TokenSelecotor from "./TokenSelector"

import logoImage from "../../../public/images/logo-menu.png";
import arrowRightImage from "../../../public/images/arrow-right.png";
import walletIcon from "../../../public/images/wallet.png";
import appIcon from "../../../public/images/app-icon.png";
import coinIcon from "../../../public/images/coin.png";

import { walletConnect, walletDisconnect } from "../../../store/actions";

const Navbar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [navbarBgActive, setNavbarBgActive] = useState(false);
    const { account, balance } = useSelector((state: any) => state.data);
    const currentPath = router.pathname;

    useEffect(() => {
        dispatch(walletConnect() as any);
        
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
    
    return (
        <div className="sticky top-0 w-full z-[200] h-[95px]">
            <div className={`w-full header-wrap transition-all ${navbarBgActive ? "bg-[#00160c]" : "bg-transparent"}`}>
                <nav className="container heander-container !py-4 mx-auto flex justify-between items-center">
                    <div className="flex justify-between items-center">
                        <Link href={'/'}>
                            <div className="cursor-pointer min-w-[115px]">
                                <Image src={logoImage} alt="App Logo" width={115} height={55} />
                            </div>
                        </Link>
                        <ul className="navbar-list flex items-center">
                            <li className={`item ${currentPath == "/" ? "active" : ""}`}>
                                <Link href="/">
                                    <a className="text-base">Home</a>
                                </Link>
                            </li>
                            <li className={`item children ${(currentPath == "/trade" || currentPath == "/swap" || currentPath == "/liquidity" || currentPath == "/charts") ? "active" : ""}`}>
                                <Link href={currentPath}>
                                    <a className="text-base">{currentPath == "/trade" ? "Trade" : currentPath == '/swap' ? "Swap" : currentPath == "/liquidity" ? "Liquidity" : currentPath == "/charts" ? "charts" : "Trade" }</a>
                                </Link>
                                <ul className="child-list">
                                    <Link href={currentPath == '/swap' ? '/trade' : '/swap'}>
                                        <li className="">
                                            <span className="text-base">{currentPath == '/swap' ? 'Trade' : 'Swap'}</span>
                                            <Image src={arrowRightImage} alt={'redirect'} />
                                        </li>
                                    </Link>
                                    <Link href={currentPath == '/charts' ? '/trade' : '/charts'}>
                                        <li className="">
                                            <span className="text-base">{currentPath == '/charts' ? 'Trade' : 'Charts'}</span>
                                            <Image src={arrowRightImage} alt={'redirect'} />
                                        </li>
                                    </Link>
                                    <Link href={currentPath == '/liquidity' ? 'trade' : 'liquidity'}>
                                        <li className="">
                                            <span className="text-base">{currentPath == '/liquidity' ? 'Trade' : 'Liquidity'}</span>
                                            <Image src={arrowRightImage} alt={'redirect'} />
                                        </li>
                                    </Link>
                                </ul>
                            </li>
                            <li className={`item ${currentPath == "/farms" ? "active" : ""}`}>
                                <Link href="/farms">
                                    <a className="text-base">Farms</a>
                                </Link>
                            </li>
                            <li className={`item ${currentPath == "/pools" ? "active" : ""}`}>
                                <Link href="/pools">
                                    <a className="text-base">Pools</a>
                                </Link>
                            </li>
                            <li className={`item ${currentPath == "/funds" ? "active" : ""}`}>
                                <Link href="/funds">
                                    <a className="text-base">Funds</a>
                                </Link>
                            </li>
                            <li className={`item ${currentPath == "/nft" ? "active" : ""}`}>
                                <Link href="/nft">
                                    <a className="text-base">NFT</a>
                                </Link>
                            </li>
                            <li className={`item ${currentPath == "/media" ? "active" : ""}`}>
                                <Link href="/media">
                                    <a className="text-base">Media</a>
                                </Link>
                            </li>
                            <li className={`item ${currentPath == "/info" ? "active" : ""}`}>
                                <Link href="/info">
                                    <a className="text-base">Info</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <div className="flex cursor-pointer border-[1px] border-border-primary items-center ml-1">
                            <div className="px-4"> YOC {balance}</div>
                            <div className="px-2 pt-2 border-l-[1px] border-border-primary">
                                <div className="min-w-[20px]">
                                    <Image src={coinIcon} alt='wallet' width={20} height={20} />
                                </div>
                            </div>
                        </div>
                        <div className="flex cursor-pointer border-[1px] border-border-primary items-center ml-1">
                            <div className="px-4" onClick={() => { account ? dispatch(walletDisconnect() as any) : dispatch(walletConnect() as any) }}>{account ? `${account.slice(0, 6)}...${account.slice(38, 42)}` : 'Connect to wallet'}</div>
                            <div className="px-2 pt-2 border-l-[1px] border-border-primary">
                                <div className="min-w-[20px]">
                                    <Image src={walletIcon} alt='wallet' width={20} height={20} />
                                </div>
                            </div>
                        </div>
                        <div className="cursor-pointer border-[1px] px-2 pt-2 ml-1">
                            <div className="min-w-[20px]">
                                <Image src={appIcon} alt='wallet' width={20} height={20} />
                            </div>
                        </div>
                        {/* <TokenSelecotor name="bsc" />
                <div className="connect-wallet">
                    {account ?
                        <Button text={`${account.slice(0, 6)}...${account.slice(38, 42)}`} onClick={() => dispatch(walletDisconnect() as any)} bgColor="#5d63eb" color="#ffffff" /> :
                        <Button text="Connect Wallet" onClick={() => dispatch(walletConnect() as any)} bgColor="#5d63eb" color="#ffffff" />
                    }
                </div> */}
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Navbar;