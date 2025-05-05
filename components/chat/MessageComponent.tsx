import React from "react";
import { Card } from "../ui/card";
import type { Message } from "../../types";

interface MessageComponentProps {
  sender: Message["sender"];
  text: Message["text"];
  timestamp: Message["timestamp"];
}

const MessageComponent: React.FC<MessageComponentProps> = ({ sender, text, timestamp }) => {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card className={`px-3 py-1 max-w-xs md:max-w-md lg:max-w-lg break-words shadow-sm gap-0 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <div className="text-sm">{text}</div>
        <div className="text-xs text-right mt-1 opacity-70">{timestamp instanceof Date ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : timestamp}</div>
      </Card>
    </div>
  );
};

export default MessageComponent;

