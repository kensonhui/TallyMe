import { useEffect, useState } from 'react';
import { OpenQuestion } from './questions/OpenQuestion'
import {Socket} from 'socket.io-client'
interface PropsType {
    socket: Socket;
    setSettings: any;
}

interface Settings {
    anonymous_vote: boolean
}

export default function HostControls(props: PropsType) {
    const [anonymous, setAnonymous] = useState(false);
    useEffect(() => {
        props.setSettings((past: Settings) => ({...past, anonymous_vote: anonymous}));
    }, [anonymous])
   return( 
    <div>
    </div>
   )  
     
}