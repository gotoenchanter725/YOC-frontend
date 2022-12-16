import axios from "axios";
import React, { FC, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../widgets/Button";


type Props = {
    handleClose: () => void;
    votingQueryDetail?: any;
    userVotingDetail: any;
    currentUserBalance: any;
}

const UserVotingContent: FC<Props> = ({ handleClose, votingQueryDetail, userVotingDetail, currentUserBalance }) => {
    const { projects, account, signer } = useSelector((state: any) => state.data);
    const [queryId, setQueryId] = useState<number>(votingQueryDetail.id);
    const [queryContent, setQueryContent] = useState<string>(votingQueryDetail.queryContent);
    const [amountAnswer, setAmountAnswer] = useState<number>(votingQueryDetail.amountAnswer || 2);
    const [answerArr, setAnswerArr] = useState<string[]>(votingQueryDetail.answerStr.split(','));

    // const [startDate, setStartDate] = useState<string>("");
    // const [endDate, setEndDate] = useState<string>("");

    const saveUserVotingStatus = (userAddress: string, votingState: number, queryId: number) => {

        let data = { queryId, userAddress, votingState }
        axios.post(process.env.API_ADDRESS + '/voting/saveUserStatus', data).then(res => {
            if (res.statusText == 'Created') {
                handleClose();
                console.log('Vote Status Created');
            } else {
                console.log('error occured');
            }
        });
    }
    let answerList = [];
    for (let i = 0; i < amountAnswer; i++) {
        answerList.push(<div className="answer_item" key={i}>
            <div className="answer">
                <p>{i + 1}:</p>
                <p>{answerArr[i]}</p>
            </div>
            <Button className={userVotingDetail.votingState != undefined ? "vote_btn disabled" : "vote_btn"} onClick={() => saveUserVotingStatus(account, i, queryId)} text="Vote" />
        </div>)
    }
    let endDate = new Date(votingQueryDetail.endDate);
    let timeDiff = Math.ceil(Math.abs(endDate.getTime() - new Date().getTime()) / 1000 / 3600 / 24)
    let remainDays = timeDiff > 1 ? `${timeDiff} days` : timeDiff == 1 ? `1 day` : 'today';
    return <div className="user_voting_content">
        <div className="query_content">
            <p>{queryContent}</p>
        </div>
        <div className="answer_content">
            {answerList}
        </div>
        {
            userVotingDetail.votingState != undefined ? <p className="mt-10">You already Voted</p> : ""
        }
        <div className="vote_power">
            {/* <p>Vote Power: {currentUserBalance}%</p> */}
        </div>
        <div className="remain_date">
            <p>Voting Poll wil end in {remainDays}</p>
        </div>
        <div>
            <p>Obs: You cannot change your vote once you have voted</p>
        </div>

    </div>
}

export default UserVotingContent;
