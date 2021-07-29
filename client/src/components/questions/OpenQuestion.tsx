import { useState } from "react";
import { lobbyQuestionSend } from "../../utils/api";
import { Socket } from "socket.io-client";
interface Question {
  socket: Socket;
}

const OpenQuestion = (props: Question) => {
  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const questionSendHandler = () => {
    const questionData = {
      question: question,
      details: details,
      anonymous: anonymous
    };
    lobbyQuestionSend(props.socket, questionData);
  };
  return (
    <div>
      <p>Question</p>
      <input type="text" onChange={(e) => setQuestion(e.target.value)} />
      <p>Give more details about the question</p>
      <textarea onChange={(e) => setDetails(e.target.value)}></textarea>
      <p> Anonymous Vote:</p>
      <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
      <button onClick={questionSendHandler}>Submit</button>
    </div>
  );
};

export { OpenQuestion };
