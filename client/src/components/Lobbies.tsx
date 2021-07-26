import { useState } from "react";
import Lobby from "./Lobby";
import { Socket } from 'socket.io-client';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import NicknamePrompt from "./NicknamePrompt";

interface PropsType {
  socket: Socket
}
export default function Lobbies(props: PropsType) {
  let match = useRouteMatch();
  const [nickname, setNickname] = useState("");
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  return (
    <Switch>
      <Route path={`${match.path}/:lobbyId`}>
        <NicknamePrompt submitNicknameHandler={setNickname}/>
        {nickname.length != 0 &&
          <Lobby nickname={nickname} socket={props.socket} /> 
        }
        
      </Route>
      <Route path={match.path}>
        <p> Please add a lobby id</p>
      </Route>
    </Switch>
  );
}
