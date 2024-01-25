import axios from "axios";
import React, { FC, useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../widgets/Button";
import useAccount from "@hooks/useAccount";


type Props = {
    handleClose: () => void;
    votingQueryDetail?: any;
    userVotingDetail: any;
    currentUserBalance: any;
}

const UserVotingContent: FC<Props> = ({ handleClose, votingQueryDetail, userVotingDetail, currentUserBalance }) => {
    const { account } = useAccount();
    const queryId = useMemo(() => {
        if (votingQueryDetail && votingQueryDetail.id) return votingQueryDetail.id;
        else return 0;
    }, [votingQueryDetail]);

    const queryContent = useMemo(() => {
        if (votingQueryDetail && votingQueryDetail.queryContent) return votingQueryDetail.queryContent;
        else return [];
    }, [votingQueryDetail]);
    const amountAnswer = useMemo(() => {
        if (votingQueryDetail && votingQueryDetail.amountAnswer) return votingQueryDetail.amountAnswer;
        else return 2;
    }, [votingQueryDetail]);
    const answerArr = useMemo(() => {
        if (votingQueryDetail && votingQueryDetail.answerStr) return votingQueryDetail.answerStr.split(',');
        else return [];
    }, [votingQueryDetail]);

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
        answerList.push(<div className="answer_item flex justify-between" key={i}>
            <div className="answer flex items-center">
                <p>{i + 1}:</p>
                <p>{answerArr[i]}</p>
                {i == userVotingDetail.votingState ? (<div className="ml-3 rounded-full w-[8px] h-[8px] bg-secondary"></div>) : ""}
            </div>
            <Button className={userVotingDetail.votingState != undefined ? "vote_btn disabled" : "vote_btn"} disabled={userVotingDetail.votingState != undefined} onClick={() => saveUserVotingStatus(String(account), i, queryId)} text="Vote" />
        </div>)
    }
    let endDate = new Date(votingQueryDetail.endDate);
    let timeDiff = Math.ceil(Math.abs(endDate.getTime() - new Date().getTime()) / 1000 / 3600 / 24)
    let remainDays = timeDiff > 1 ? `${timeDiff} days` : timeDiff == 1 ? `1 day` : 'today';
    return <div className="user_voting_content text-white">
        <div className="query_content text-white rounded border border-[#FFFFFF22] !bg-transparent !bg-primary-pattern px-4 py-2 outline-none">
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
