import React, {useEffect, useRef} from "react";
import MessageComponent from "./MessageComponent";
import { cn } from '@/lib/utils'; // Import cn utility for merging class names

type Message = {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: Date;
};

interface ChatAreaProps {
    messages: Message[];
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string; // Add optional className prop
}

const ChatArea: React.FC<ChatAreaProps> = ({messages, onClick, className}) => { // Destructure className
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        // Apply className prop using cn, merging with default classes
        <div 
            ref={scrollAreaRef} 
            className={cn("flex-1 overflow-y-auto p-4 space-y-2 bg-background", className)} 
            onClick={onClick}
        >
            {messages.map((msg) => (
                <MessageComponent key={msg.id} sender={msg.sender} text={msg.text} timestamp={msg.timestamp}/>
            ))}
        </div>
    );
};

export default ChatArea;
