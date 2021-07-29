import { useState } from "react";
import Lobby from "./Lobby";
import { Socket } from "socket.io-client";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import NicknamePrompt from "./NicknamePrompt";

interface PropsType {
  socket: Socket;
}
export default function Lobbies(props: PropsType) {
  let match = useRouteMatch();
  const [nickname, setNickname] = useState("");
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  return (
    <Switch>
      <Route path={`${match.path}/:lobbyId`}>
        {nickname.length !== 0 ? (
          <Lobby nickname={nickname} socket={props.socket} />
        ) : (
          <NicknamePrompt submitNicknameHandler={setNickname} />
        )}
      </Route>
      <Route path={match.path}>
        <p> Please add a lobby id</p>
      </Route>
    </Switch>
  );
}
