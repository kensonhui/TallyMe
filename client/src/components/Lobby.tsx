import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { lobbyQuestionSend } from "../utils/api";
import { Socket } from "socket.io-client";
import OpenAnswer from "./answers/OpenAnswer";
import { OpenQuestion } from "./questions/OpenQuestion";
import NicknamePrompt from "./NicknamePrompt";
import HostControls from "./HostControls";
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
        console.log(response.members);
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
      setResponses(responses);
    });
    return () => {
      socket.emit("user-leave");
      socket.offAny();
    };
  }, []);
  return (
    <div>
      <div>
        {members.map((member) => (
          <p key={member}>{member}</p>
        ))}
      </div>
      Requested lobbyid: {lobbyId}
      {isHost && <OpenQuestion socket={socket} />}
      <button onClick={lobbyAnswerEnd}>End responses</button>
      {answerPrompt.question.length !== 0 ? (
        <div>
          <OpenAnswer socket={socket} answerPrompt={answerPrompt} />
          Number of responses:{numberResponses}
        </div>
      ) : (
        <p>Waiting for host to send question</p>
      )}
      <div>
        {responses.map((response) => (
          <div key={response.nickname + response.answer}>
            <h3>{response.nickname}</h3>
            <p>{response.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
