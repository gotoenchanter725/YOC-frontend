import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

import FooterIon1 from "../../../public/images/footer1.png";
import FooterIon2 from "../../../public/images/footer2.png";
import FooterIon3 from "../../../public/images/footer3.png";
import FooterIon4 from "../../../public/images/footer4.png";
import FooterIon5 from "../../../public/images/footer5.png";
interface propsType {
    emptyLogo?: boolean;
}

const FooterV2: FC<propsType> = (props) => {
    return (
        <div className={`container mx-auto !py-0 flex justify-between items-center ${props.emptyLogo ? "h-[100px]" : "h-[200px]"}`}>
            <div className=''>
                {
                    props?.emptyLogo ? (
                        ""
                    ) : (
                        <img src='./images/footer-logo.png' className='w-[400px] h-[180px]' />
                    )
                }
            </div>
            <div className='flex flex-col items-center'>
                <div className='flex items-center'>
                    <div className='mr-4 h-[30px] aspect-[1/1] cursor-pointer'>
                        <Link href={'/'}>
                            <div>
                                <Image src={FooterIon1} />
                            </div>
                        </Link>
                    </div>
                    <div className='mr-4 h-[30px] aspect-[1/1] cursor-pointer'>
                        <Link href={'/'}>
                            <div>
                                <Image src={FooterIon2} />
                            </div>
                        </Link>
                    </div>
                    <div className='mr-4 h-[30px] aspect-[1/1] cursor-pointer'>
                        <Link href={'/'}>
                            <div>
                                <Image src={FooterIon3} />
                            </div>
                        </Link>
                    </div>
                    <div className='mr-4 h-[30px] aspect-[1/1] cursor-pointer'>
                        <Link href={'/'}>
                            <div>
                                <Image src={FooterIon4} />
                            </div>
                        </Link>
                    </div>
                    <div className='mr-4 h-[30px] aspect-[1/1] cursor-pointer'>
                        <Link href={'/'}>
                            <div>
                                <Image src={FooterIon5} />
                            </div>
                        </Link>
                    </div>
                </div>
                <span className='text-primary mt-2'><a href={'https://yocnear.io'} target={'_blank'}>yocnear.io</a></span>
            </div>
        </div>
    )
}

export default FooterV2;