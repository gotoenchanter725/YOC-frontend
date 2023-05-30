import Image from 'next/image';
import React, { FC } from 'react';

import FooterIon1 from "../../../public/images/footer1.png";
import FooterIon2 from "../../../public/images/footer2.png";
import FooterIon4 from "../../../public/images/footer4.png";
import FooterIon5 from "../../../public/images/footer5.png";
import useNetwork from '../../hooks/useNetwork';

const socialDisplayData = [
    {
        image: FooterIon1,
        route: "https://twitter.com/Yocfund"
    },
    {
        image: FooterIon2,
        route: "https://www.instagram.com/yocfund/"
    },
    {
        image: FooterIon4,
        route: "https://www.youtube.com/channel/UCTCK_B6y9i-RKiRXBq8DDCw"
    },
    {
        image: FooterIon5,
        route: "https://www.facebook.com/profile.php?id=100090566250790"
    },
]


interface propsType {
    emptyLogo?: boolean;
}

const FooterV2: FC<propsType> = (props) => {
    const { network } = useNetwork();

    return (
        <div className={`container mx-auto !py-0 flex justify-between items-center ${props.emptyLogo ? "h-[100px]" : "h-[200px]"}`}>
            <div className=''>
                {
                    props?.emptyLogo ? (
                        ""
                    ) : (
                        <img src='/images/footer-logo.png' className='w-[400px] h-[180px]' />
                    )
                }
            </div>
            <div className='flex flex-col items-center'>
                <div className='flex items-center'>
                    {
                        socialDisplayData.map((item: any, index: number) => {
                            return <div key={'footer-' + index} className='mr-4 h-[30px] aspect-[1/1] cursor-pointer'>
                                <a href={item.route} target="_blank">
                                    <div>
                                        <Image src={item.image} />
                                    </div>
                                </a>
                            </div>
                        })
                    }
                </div>
                <span className='text-primary mt-2'><span >{network === 'ETH' ? 'contact@yoc.fund' : 'contact@yoc.fund'}</span></span>
            </div>
        </div>
    )
}

export default FooterV2;