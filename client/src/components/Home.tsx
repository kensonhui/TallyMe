import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { lobbyCreateRequest } from '../utils/api';
import { Socket } from "socket.io-client";

interface PropsType {
  socket: Socket
}
export default function Home(props: PropsType) {
  const [lobbyId, setLobbyId] = useState("");
  const enterLobby = () => {
    history.push(`lobby/${lobbyId}`);
  }
    const history = useHistory();
    return (
      <div>
          <p>Create a Lobby or Join One</p>
          <input onChange={(e) => {setLobbyId(e.target.value)}}
          type="text" className="shadow-md border-2"/>
          <button onClick={enterLobby}>Go to Lobby</button>
          <button onClick={() => {
            lobbyCreateRequest(props.socket, history);
          }}>
            Host Lobby
          </button>
      </div>
    )
}