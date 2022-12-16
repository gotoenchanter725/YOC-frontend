import axios from "axios";
import React, { FC, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../widgets/Button";


type Props = {
    handleClose: () => void;
    projectTitle: string;
    votingQueryDetail: any;
}

const AdminVotingContent: FC<Props> = ({ handleClose, projectTitle, votingQueryDetail }) => {
    const { projects, account, signer } = useSelector((state: any) => state.data);

    const [queryTitle, setQueryTitle] = useState<string>("Color Question");
    const [queryContent, setQueryContent] = useState<string>("What is your favorite Color?");
    const [amountAnswer, setAmountAnswer] = useState<number>(2);
    const [answerArr, setAnswerArr] = useState<string[]>(['Cyan', 'Blue']);

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const handleAmountAnswer = (value: number) => {
        setAmountAnswer(value);
        answerArr.length = value;
        setAnswerArr(JSON.parse(JSON.stringify(answerArr)));
    }
    const handleAnswerArr = (value: string, index: number) => {
        answerArr[index] = value;
        setAnswerArr(JSON.parse(JSON.stringify(answerArr)));
    }
    let answerList = [];
    for (let i = 0; i < amountAnswer; i++) {
        answerList.push(<div className="input_control answer_item" key={i}>
            <label htmlFor="">Answer {i + 1}</label>
            <input className="border border-solid border-black text-base px-2 py-1 rounded" type="text" onChange={(e) => handleAnswerArr(e.target.value, i)} value={answerArr[i]} />
        </div>)
    }

    const saveVotingQuestion = () => {
        handleClose();
        let data = {
            projectTitle, queryTitle, queryContent, amountAnswer, answerStr: answerArr.join(','), startDate: new Date(+startDate), endDate: new Date(+endDate)
        }
        axios.post(process.env.API_ADDRESS + '/voting/create', data).then(res => {
            console.log(res);
        });
    }
    const cancelVoting = () => {
        handleClose();
        console.log("cancel Action");
    }

    return <div className="admin_voting_content">
        <div className='input_field'>
            <div className="input_control query_title">
                <label htmlFor="">Query Title</label>
                <input className="border border-solid border-black text-base px-2 py-1 rounded" type="text" onChange={(e) => setQueryTitle(e.target.value)} value={queryTitle} />
            </div>
            <div className="input_control query_content">
                <label htmlFor="">Question?</label>
                <textarea className="border border-solid border-black text-base px-2 py-1 rounded" rows={3} onChange={(e) => setQueryContent(e.target.value)} value={queryContent} />
            </div>
            <div className="input_control amount_answer">
                <label htmlFor="">Amount of Answer</label>
                <input className="border border-solid border-black text-base px-2 py-1 rounded" type="number" onChange={(e) => handleAmountAnswer(+e.target.value)} value={amountAnswer} />
            </div>
            {answerList}
            <div className="input_control start_date">
                <label htmlFor="">Start Date</label>
                <input className="border border-solid border-black text-base px-2 py-1 rounded" type="date" onChange={(e) => setStartDate(new Date(e.target.value).getTime().toString())} />
            </div>
            <div className="input_control end_date">
                <label htmlFor="">End Date</label>
                <input className="border border-solid border-black text-base px-2 py-1 rounded" type="date" onChange={(e) => setEndDate(new Date(e.target.value).getTime().toString())} />
            </div>
        </div>

        <div className="d-flex btn_group">
            <Button className="saveBtn" text="Launch" onClick={saveVotingQuestion} />
            <Button className="cancelBtn" text="Cancel" onClick={cancelVoting} />
        </div>
    </div>
}

export default AdminVotingContent;
