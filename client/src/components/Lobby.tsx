import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import OpenAnswer from "./answers/OpenAnswer";
import { OpenQuestion } from "./questions/OpenQuestion";
interface LobbyProps {
  socket: Socket;
  nickname: string;
}
interface ParamTypes {
  lobbyId: string;
}

interface ResponseType {
  answer: string;
  nickname?: string;
}
interface LobbyDataType {
  members: [string];
  givenHost: boolean;
}

export default function Lobby(props: LobbyProps) {
  const { lobbyId } = useParams<ParamTypes>();
  const { socket } = props;
  const [members, setMembers] = useState<Array<string>>([]);
  const [answerPrompt, setAnswerPrompt] = useState({
    question: "",
    details: "",
    anonymous: false,
    targets: [],
  });
  const [numberResponses, setNumberResponses] = useState(0);
  const [responses, setResponses] = useState<Array<ResponseType>>([]);
  const [isHost, setIsHost] = useState(false);
  const lobbyAnswerEnd = () => {
    socket.emit("lobbyAnswerEnd");
  };

  useEffect(() => {
    socket.open();
    socket.connect();
    socket.emit(
      "lobbyJoinRequest",
      lobbyId,
      props.nickname,
      (response: LobbyDataType) => {
        if (response.givenHost) {
          setIsHost(true);
        }
        setMembers(response.members);
      }
    );
    socket.on("lobbyQuestionPose", (questionData) => {
      setNumberResponses(0);
      setAnswerPrompt(questionData);
    });
    socket.on("answer-count", (count) => {
      setNumberResponses(count);
    });
    socket.on("lobby-update", (data) => {
      setMembers(data.members);
    });
    socket.on("lobbyAnswerEnd", (responses) => {
      console.log(responses);
      setResponses(responses);
    });
    return () => {
      socket.emit("user-leave");
      socket.offAny();
    };
  }, [lobbyId, props.nickname, socket]);
  return (
    <div className="grid place-items-center bg-gray-800">
      <div className="flex space-between">
        {members.map((member) => (
          <p
            key={member}
            className={`${
              member == props.nickname ? "bg-blue-600" : "bg-green-600"
            } m-1 p-2`}
          >
            {member}
          </p>
        ))}
      </div>
      Requested lobbyid: {lobbyId}
      {isHost && (
        <div>
          <OpenQuestion socket={socket} members={members} />
          <div className="grid place-items-center m-2">
            <button onClick={lobbyAnswerEnd} className="bg-blue-700">
              End responses
            </button>
          </div>
        </div>
      )}
      {answerPrompt.question.length !== 0 ? (
        <div>
          <OpenAnswer socket={socket} answerPrompt={answerPrompt} />
          Number of responses:{" "}
          <span className="bg-green-900 rounded-full w-3 h-3">
            {numberResponses}
          </span>
        </div>
      ) : (
        <p>Waiting for host to send question</p>
      )}
      <div className="w-full">
        {responses.length !== 0 && (
          <h3 className="text-3xl text-left">Responses:</h3>
        )}
        {responses.map((response) => (
          <div
            key={response.nickname + response.answer}
            className="bg-green-500 border-2 border-black m-2"
          >
            <h3 className="text-3xl">{response.nickname}</h3>
            <p>{response.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
