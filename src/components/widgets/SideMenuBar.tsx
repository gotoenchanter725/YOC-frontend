import { useState } from "react";
import useWallet from "@hooks/useWallet";
import useAccount from "@hooks/useAccount";

const SideMenuBar = () => {
    const { account } = useAccount();
    const { disconnectWallet } = useWallet();
    const [btnMenuBarToggle, setBtnMenuBarToggle] = useState(true);

    return (
        <div className='flex flex-col bg-bg-pattern rounded border border-[#FFFFFF20] w-[400px]'>
            <div className='bg-primary-pattern px-4 py-5 text-xl mb-[50px] cursor-pointer'>
                Wallet
            </div>
            <div className='bg-primary-pattern px-4 py-5 text-xl mb-[50px] cursor-pointer'>
                Recent Transaction
            </div>
            <div className='bg-primary-pattern px-4 py-5 text-xl mb-[50px] cursor-pointer'>
                Your NFT's
            </div>
            <div className={`flex justify-between items-center bg-primary-pattern px-4 py-5 text-xl ${btnMenuBarToggle ? 'mb-[50px]' : ''} cursor-pointer`} onClick={() => setBtnMenuBarToggle(true)}>
                {btnMenuBarToggle ? "Make a Profile" : "More Options"}
                {
                    !btnMenuBarToggle &&
                    <img src='/images/drop-down.png' alt='drop-down' />
                }
            </div>
            <div className={`flex flex-col overflow-hidden transition-all ${btnMenuBarToggle ? `${account ? 'h-[185px]' : 'h-[65px]'}` : "h-0"}`}>
                {
                    account ?
                        <div className='bg-primary-pattern px-4 py-5 text-xl mb-[50px] cursor-pointer' onClick={() => disconnectWallet()}>
                            Disconnect
                        </div>
                        : ""
                }
                <div className='flex justify-between items-center bg-primary-pattern px-4 py-5 text-xl cursor-pointer' onClick={() => setBtnMenuBarToggle(false)}>
                    Less Options
                    <img src='/images/drop-up.png' alt='drop-up' />
                </div>
            </div>
        </div>
    )
}

export default SideMenuBar;