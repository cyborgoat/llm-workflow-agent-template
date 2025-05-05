import React, { useRef, useEffect } from "react";
import MessageComponent from "./MessageComponent";
type Message = {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
};

interface ChatAreaProps {
  messages: Message[];
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-background">
      {messages.map((msg) => (
        <MessageComponent key={msg.id} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
      ))}
    </div>
  );
};

export default ChatArea;

