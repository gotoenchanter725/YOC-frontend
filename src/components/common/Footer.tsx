import React from "react"
import Image from "next/image"
import Button from "../widgets/Button"
import { BsDiscord, BsInstagram, BsTelegram, BsTwitter, BsYoutube } from "react-icons/bs"
import { IconContext } from "react-icons"


const Footer = () => {
    return <nav className="footer">
        <div className="footer-logo">
            <Image src="/images/footer-logo.png" alt="Footer Logo" width={600} height={250} />
        </div>
        <div>
            <div className="social-links">
                <svg width="0" height="0">
                    <linearGradient id="red-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop stopColor="yellow" offset="0%" />
                        <stop stopColor="red" offset="100%" />
                    </linearGradient>
                </svg>
                <IconContext.Provider value={{ color: '#25aff3', size: '30px' }}>
                    <div className="item">
                        <BsTwitter />
                    </div>
                    <div className="item">
                        <BsTelegram />
                    </div>
                    <div className="item">
                        <BsDiscord color="red" style={{ fill: "url(#red-gradient)" }}/>
                    </div>
                    <div className="item">
                        <BsInstagram color="red" style={{ fill: "url(#red-gradient)" }}/>
                    </div>
                    <div className="item">
                        <BsYoutube color="red" style={{ fill: "url(#red-gradient)" }} />
                    </div>
                </IconContext.Provider>
            </div>
            <div className="contact-mail">
                <a href="mailto:CONTACT@YOC.FUND">
                    CONTACT@YOC.FUND
                </a>
            </div>
            <div className="token-price">
                <p className="token-name">YOC</p>
                <p>$5.17</p>
            </div>
        </div>
    </nav>
}

export default Footer;