import React, {useEffect, useRef} from "react";
import MessageComponent from "./MessageComponent";

type Message = {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: Date;
};

interface ChatAreaProps {
    messages: Message[];
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const ChatArea: React.FC<ChatAreaProps> = ({messages, onClick}) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-background" onClick={onClick}>
            {messages.map((msg) => (
                <MessageComponent key={msg.id} sender={msg.sender} text={msg.text} timestamp={msg.timestamp}/>
            ))}
        </div>
    );
};

export default ChatArea;

