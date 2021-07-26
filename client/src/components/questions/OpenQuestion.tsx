import { useState } from 'react';
import { lobbyQuestionSend } from '../../utils/api';
import { Socket } from 'socket.io-client';
interface Question {
    socket: Socket
}

const OpenQuestion = (props: Question) => { 
    const [question, setQuestion] = useState("");
    const [details, setDetails] = useState("");
    const questionSendHandler = () => {
        const questionData =  {
            question: question,
            details: details 
        }
        lobbyQuestionSend(props.socket, questionData);
    }
    return (
        <div>
            <p>Question</p>
            <input type="text" onChange={(e) => setQuestion(e.target.value)}/>
            <p>Give more details about the question</p>
            <textarea onChange={(e) => setDetails(e.target.value)}></textarea>
            <button onClick={questionSendHandler}>Submit</button>
        </div>
    )
}

export { OpenQuestion };