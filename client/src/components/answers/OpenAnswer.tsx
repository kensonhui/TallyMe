import { useEffect, useState } from "react";
import { lobbyAnswerSend } from "../../utils/api";
import { Socket } from "socket.io-client";
interface PropsType {
  answerPrompt: { question: string; details: string; anonymous: boolean };
  socket: Socket;
}
export default function OpenAnswer(props: PropsType) {
  useEffect(() => {
    setSubmitted(false);
  }, [props.answerPrompt]);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const answerSubmit = () => {
    if (!submitted) {
      const answerData = {
        answer: answer,
      };
      lobbyAnswerSend(props.socket, answerData, (response: any) => {
        console.log(response);
        if (response.status === "ok") {
          setSubmitted(true);
        }
      });
    }
  };
  const { answerPrompt } = props;
  return (
    <div className="flex flex-col items-start bg-green-700 p-5 rounded-md">
      <h3 className="text-2xl text-center">New Question</h3>
      <p>Question: {answerPrompt.question}</p>
      <p>Additional details : {answerPrompt.details}</p>
      <p>
        Your vote will be{" "}
        <span className="font-bold">
          {props.answerPrompt.anonymous ? "anonymous" : "not anonymous"}
        </span>
      </p>
      <p>Answer</p>
      <textarea
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
        className="text-black"
      ></textarea>
      <button onClick={answerSubmit} disabled={submitted}>
        {" "}
        Submit
      </button>
      {submitted ? "Answer sucessfully submitted" : "Waiting for response"}
    </div>
  );
}
