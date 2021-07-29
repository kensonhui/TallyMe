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
      anonymous: anonymous,
    };
    lobbyQuestionSend(props.socket, questionData);
  };
  return (
    <div className="flex flex-col items-start">
      <p>Question</p>
      <input
        type="text"
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full"
      />
      <p>Give more details about the question</p>
      <textarea
        onChange={(e) => setDetails(e.target.value)}
        className="w-full text-black"
      ></textarea>
      <div className="flex justify-center">
        <p> Anonymous Vote:</p>
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="w-8 h-5"
        />
      </div>
      <button
        onClick={questionSendHandler}
        className="bg-green-600 text-center transition duration-150 ease-in-out hover:bg-green-500"
      >
        Submit
      </button>
    </div>
  );
};

export { OpenQuestion };
