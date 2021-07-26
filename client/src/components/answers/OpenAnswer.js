import { useState } from "react";
import { lobbyAnswerSend } from "../../utils/api";
export default function OpenAnswer(props) {
  const [answer, setAnswer] = useState("");
  const answerSubmit = () => {
        const answerData = {
            answer: answer
        }
        lobbyAnswerSend(props.socket, answerData);
    }
const {answerPrompt} = props;
  return (
    <div>
      <p>Question: {answerPrompt.question}</p>
      <p>Additional details : {answerPrompt.details}</p>
      <p>Answer</p>
      <textarea onChange={(e) => setAnswer(e.target.value)}></textarea>
      <button onClick={answerSubmit}> Submit</button>
    </div>
  );
}
