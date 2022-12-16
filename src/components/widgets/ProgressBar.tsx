import React, { FC } from "react"

type Props = {
    percent: number;
}

const ProgressBar: FC<Props> = ({ percent }) => {
    return <div className="app-progressbar">
        <div className="completed" style={{width: percent + "%"}}>
        </div>
    </div>
}

export default ProgressBar;