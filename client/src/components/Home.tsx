import { useState } from "react";
import { useHistory } from "react-router-dom";
import { lobbyCreateRequest } from "../utils/api";
import { Socket } from "socket.io-client";

interface PropsType {
  socket: Socket;
}
export default function Home(props: PropsType) {
  const [lobbyId, setLobbyId] = useState("");
  const enterLobby = () => {
    history.push(`lobby/${lobbyId}`);
  };
  const history = useHistory();
  return (
    <div className="grid place-items-center">
      <div className="flex flex-col m-8 bg-gray-800 p-10 rounded-md">
        <h3 className="text-center text-3xl m-2 font-sans bold">Tally Me</h3>
        <p>Create a Lobby or Join One</p>
        <input
          onChange={(e) => {
            setLobbyId(e.target.value);
          }}
          type="text"
          className="shadow-md border-2"
        />
        <button onClick={enterLobby} className="bg-green-600 m-1 transition duration-150 ease-in-out hover:bg-green-500">
          Go to Lobby
        </button>
        <button
          onClick={() => {
            lobbyCreateRequest(props.socket, history);
          }}
          className="bg-blue-600 m-1 transition duration-150 ease-in-out hover:bg-blue-500"
        >
          Host Lobby
        </button>
      </div>
    </div>
  );
}
