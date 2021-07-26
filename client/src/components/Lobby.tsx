import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { lobbyQuestionSend } from "../utils/api";
import { Socket } from "socket.io-client";
import OpenAnswer from "./answers/OpenAnswer";
import { OpenQuestion } from "./questions/OpenQuestion";
import NicknamePrompt from "./NicknamePrompt";
interface LobbyProps {
  socket: Socket
  nickname: string
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
}

export default function Lobby(props: LobbyProps) {
  const { lobbyId } = useParams<ParamTypes>();
  const { socket } = props;
  const [members, setMembers] = useState<Array<string>>([]);
  const [answerPrompt, setAnswerPrompt] = useState({
    question: "",
  });
  const [nickname, setNickname] = useState("");
  const [responses, setResponses] = useState<Array<ResponseType>>([]);
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
        setMembers(response.members);
      }
    );
    socket.on("lobbyQuestionPose", (questionData) => {
      console.log("Question asked", questionData);
      setAnswerPrompt(questionData);
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
  }, []);
  return (
    <div>
      <div>
        {members.map((member) => (
          <p key={member}>{member}</p>
        ))}
      </div>
      Requested lobbyid: {lobbyId}
      <OpenQuestion socket={socket} />
      {answerPrompt.question.length !== 0 ? (
        <OpenAnswer socket={socket} answerPrompt={answerPrompt} />
      ) : (
        <p>Waiting for host to send question</p>
      )}
      <button onClick={lobbyAnswerEnd}>End responses</button>
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
