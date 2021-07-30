import { useEffect, useState } from "react";
import { lobbyQuestionSend } from "../../utils/api";
import { Socket } from "socket.io-client";
import { CheckBox } from "../CheckBox";
interface Question {
  socket: Socket;
  members: string[];
}

const OpenQuestion = (props: Question) => {
  useEffect(() => {
    setTargets((past) =>
      props.members.map((member, index) =>
        index < targets.length ? past[index] : false
      )
    );
  }, [props.members]);
  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [targets, setTargets] = useState<Array<boolean>>(
    new Array(props.members.length).fill(true)
  );
  const [targetAll, setTargetAll] = useState(true);
  const targetChangeHandler = (position: number) => {
    const setChecked = (checked: boolean[]) =>
      checked.map((item, index) => (index === position ? !item : item));
    setTargetAll(false);
    setTargets(setChecked);
  };
  const targetChangeAll = (all: boolean) => {
    console.log(all);
    setTargets((past: boolean[]) => past.map((item) => all));
    setTargetAll((past) => !past);
  };
  const questionSendHandler = () => {
    const questionData = {
      question: question,
      details: details,
      anonymous: anonymous,
      targets: props.members.filter((member, index) => targets[index]),
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
      <div>
        <div className="flex items-center">
          <p>Show to:</p>
          <span className="ml-1">
            {targets.map((target, index) =>
                (target && 
                `${props.members[index]}, `)
            )}
          </span>
        </div>
        {props.members.map((member, index) => (
          <CheckBox
            key={member}
            item={member}
            checked={targets[index]}
            changeCheck={() => targetChangeHandler(index)}
          ></CheckBox>
        ))}
        <CheckBox
          item="all"
          checked={targetAll}
          changeCheck={(e) => targetChangeAll(e.target.checked)}
        ></CheckBox>
      </div>
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
