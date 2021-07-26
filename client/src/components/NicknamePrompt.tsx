import {useState} from 'react';
interface PropsType {
    submitNicknameHandler: (nickname: string) => void
}
export default function NicknamePrompt(props: PropsType) {
    const [nickname, setNickname] = useState("");
    return (
        <div>
            <input onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                setNickname(e.target.value)}} type="text" />
                <button onClick={() => {
                    props.submitNicknameHandler(nickname)}}>Submit Name</button>
        </div>
    )
}