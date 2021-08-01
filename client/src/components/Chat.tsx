import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

interface PropsType {
  socket: Socket;
}
interface MessageType {
  nickname: string;
  text: string;
}
export default function Chat(props: PropsType) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageTyped, setMessageTyped] = useState("");
  const submitMessage = () => {
      props.socket.emit("send-message", messageTyped);
      setMessageTyped("");
  }
  useEffect(() => {
    props.socket.on("new-message", (message: MessageType) => {
      setMessages((past: MessageType[]) => ([...past, message]));
    });
    return () => {
      props.socket.offAny();
    };
  }, [props.socket]);
  return (
    <div>
        <div className="flex flex-col w-64 h-48 overflow-y-scroll bg-grey-500">
          {messages.map((message, index) => (
            <div key={index + ':' + message.text} className="">
              <h3>{message.nickname}</h3>
              <p className="max-w-full">{message.text}</p>
            </div>
          ))}
        </div>
        <div className="flex">
        <input type="text" maxLength={128} value={messageTyped} onChange={(e) => {setMessageTyped(e.target.value)}}/>
        <button onClick={submitMessage}>Send</button>
        </div>
    </div>
  );
}
