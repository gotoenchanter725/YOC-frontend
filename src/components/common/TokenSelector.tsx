import React, { FC, useState } from "react";

const tokenList = [
    { name: 'bsc' },
    { name: 'sol' },
    { name: 'near' }
]

type Props = {
    name: string;
}

const TokenSelecotor: FC<Props> = ({ name }) => {
    const [showTokenList, setshowTokenList] = useState(false);
    const [selectedToken, setSelectedToken] = useState(name);
    
    const toggleLangList = () => {
        setshowTokenList(!showTokenList);
    }
    const swapNetwork = (name: string) => {
        setshowTokenList(false);
        setSelectedToken(name);
    }

    return <div className="language-selector">
        <div className="selected-lang" onClick={toggleLangList}>
            <span>{selectedToken}</span>
        </div>
        {
            showTokenList && <ul className="lang-list">
                {
                    tokenList.map((item: any, index: number) => {
                        return (
                            <li className="lang-item" key={"token_" + index} onClick={() => { swapNetwork(item.name) }}><span>{item.name}</span></li>
                        )
                    })
                }
            </ul>
        }
    </div>
}

export default TokenSelecotor;