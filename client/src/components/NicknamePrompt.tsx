import { useState } from "react";
interface PropsType {
  submitNicknameHandler: (nickname: string) => void;
}
export default function NicknamePrompt(props: PropsType) {
  const [nickname, setNickname] = useState("");
  return (
    <div className="grid place-items-center">
        <div className="flex flex-col bg-green-600 p-6">
            <label>Nickname</label>
                  <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNickname(e.target.value);
            }}
            type="text"
                  />
                  <button
            onClick={() => {
              props.submitNicknameHandler(nickname);
            }}
            className="bg-green-700 m-2 transition duration-150 ease-in-out hover:bg-green-600"
                  >
            Submit Name
                  </button>
        </div>
    </div>
  );
}
