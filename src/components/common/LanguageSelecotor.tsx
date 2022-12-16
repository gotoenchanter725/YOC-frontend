import React, { FC, useState } from "react"
import Image from "next/image";
const languages = [
    { code: 'en', name: 'English' },
    { code: 'por', name: 'Portuguese' }
]

type Props = {
    lang: string;
}

const LanguageSelecotor: FC<Props> = ({ lang }) => {
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    const toggleLangList = () => {
        setShowLanguageMenu(!showLanguageMenu);
    }

    return <div className="language-selector">
        <div className="selected-lang" onClick={toggleLangList}>
            <Image src="/flags/en.png" width={30} height={20} /><span>ENG</span>
        </div>
        {
            showLanguageMenu && <ul className="lang-list">
                <li className="lang-item active"><Image src="/flags/en.png" width={30} height={20} /><span>ENG</span></li>
                <li className="lang-item"><Image src="/flags/pt.png" width={30} height={20} /><span>PRT</span></li>
                <li className="lang-item"><Image src="/flags/sp.png" width={30} height={20} /><span>SPA</span></li>
            </ul>
        }
    </div>
}

export default LanguageSelecotor;