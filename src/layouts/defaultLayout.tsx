
import { FC, ReactNode } from "react";
import Navbar from "@components/common/Navbar";
import FooterV2 from "@components/common/FooterV2";

interface LayoutProps {
    children: ReactNode;
}

const defaultLayout = ({ children }: LayoutProps) => {
    return <div>
        <Navbar />
        <div className="min-h-[calc(100vh_-_300px)]">
            {children}
        </div>
        <FooterV2 />
    </div>
}

export default defaultLayout;