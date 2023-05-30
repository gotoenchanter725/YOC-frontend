import axios from "axios";
import React, { FC, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VotingQueryInterface, VotingResultInterface } from "../../interfaces/voting";
import { convertStringIntoDate } from "../../../utils/date";

import Button from "./Button";


type Props = {
    votingResponse?: VotingQueryInterface[];
    votingQueryDetail: any;
    votingResult: any;
    item: any;
    selectHistoryItem: any;
    currentUserAnswer: any;
    currentUserIsBet: boolean;
    load: any;
    show: any;
}

const VotingHistory: FC<Props> = ({ votingResponse, votingResult, votingQueryDetail, item, selectHistoryItem, currentUserAnswer, currentUserIsBet, load, show }) => {
    const [historyItem, setHistoryItem] = useState<Number>(0);

    useEffect(() => {
        if (!show) setHistoryItem(0);
    }, [show])

    const answerArr= (votingQueryDetail.answerStr ? votingQueryDetail.answerStr : '').split(',');
    const changeHistoryItem = (index: Number) => {
        if (historyItem === index) return;
        setHistoryItem(index)
        selectHistoryItem(index)
    }
    const totalAmount = votingResult.reduce((prev: any, curr: any) => prev + curr.sum, 0);
    let answerList = [];
    if (load) {
        for (let i = 0; i < answerArr.length; i++) {
            if (!votingResult[i]) break;
            let percent = (votingResult[i].sum / totalAmount * 100);
            isNaN(percent) ? percent = 0 : '';
            answerList.push(
                <div key={i} className={`flex items-center py-1`}>
                    <p className="text-left w-[100px]">{i + 1}.  {answerArr[i]}: </p>
                    <p>{percent.toFixed(2)}%</p>
                    {i == currentUserAnswer ? (<div className="ml-3 rounded-full w-[8px] h-[8px] bg-secondary"></div>) : ""}
                </div>)
        }
    } else {
        answerList.push(
            <div key={1} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-2/3 max-w-[360px] mb-3"></div>
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-[300px] flex items-stretch rounded border border-solid border-[#ffffff4d] overflow-hidden">
                <div className="h-[300px] w-[200px] -mt-[1px] border-r border-solid border-[#ffffff4d]">
                    {
                        votingResponse?.map((item: any, index: Number) => {
                            return <div key={index + 'key'} className={`flex items-center justify-between border-t border-solid border-[#ffffff4d] cursor-pointer text-left px-2 py-1 ${historyItem === index ? 'bg-[#2d5f9b96]' : ''}`}
                                onClick={() => changeHistoryItem(index)}>
                                {item.queryTitle >= 20 ? (item.queryTitle.slice(0, 20) + ' ') : item.queryTitle}

                                {item.ongoing ? (<div className="rounded-full w-[8px] h-[8px] bg-secondary"></div>) : ""}
                            </div>
                        })
                    }
                </div>
                <div className="w-[calc(100%_-_200px)] flex flex-col justify-between p-4 relative">
                    {
                        currentUserIsBet ? (
                            <div className="absolute rounded border-b-[0.5px] border-l-[2px] border-solid border-[#ffffff4d] -right-1 top-[10px] px-2 pt-[4px] pb-[1px] bg-primary-pattern -skew-x-12">You bet</div>
                        ) : ""
                    }
                    <div className="flex flex-col w-full">
                        <p className="text-xl">{votingQueryDetail.queryTitle}</p>
                        <p className="text-lg text-left py-2">{votingQueryDetail.queryContent}</p>
                        <div className="py-4 pl-4">
                            {
                                answerList
                            }
                        </div>
                    </div>
                    <div className="flex justify-around">
                        <span className="w-full text-left">Start Time: {convertStringIntoDate(String(votingQueryDetail.startDate))}</span>
                        <span className="w-full text-left">End Time: {convertStringIntoDate(String(votingQueryDetail.startDate))}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VotingHistory;
