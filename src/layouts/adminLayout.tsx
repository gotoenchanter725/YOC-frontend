
import { ReactNode } from "react";
import MenuBar from "@components/admin/Menubar";
import useAdmin from "@hooks/useAdmin";
import useAccount from "@hooks/useAccount";
import SimpleLoading from "@components/widgets/SimpleLoading";

interface LayoutProps {
    children: ReactNode;
}

const adminLayout = ({ children }: LayoutProps) => {

    const isAdmin = useAdmin();
    const { account } = useAccount();

    return <div>
        <div className='w-full flex justify-between bg-[#141517]'>
            <MenuBar />

            <div className='w-[calc(100vw_-_340px)] mr-[10px] bg-[#1a1b1e] overflow-x-hidden'>
                {
                    account ?
                        isAdmin ?
                            children :
                            <div className='w-full h-full flex items-center justify-center'>
                                <p className='text-xl text-center text-dark-secondary'>You are not admin!</p>
                            </div>
                        : <div className='w-full h-full flex items-center justify-center'><SimpleLoading className='w-[30px]' /></div>
                }
            </div>
        </div>
    </div>
}

export default adminLayout;