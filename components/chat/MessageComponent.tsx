import React, { useState, useEffect } from "react";
import {Card} from "../ui/card";
import {Bot, User} from "lucide-react";
import type {Message} from "../../types";

interface MessageComponentProps {
    sender: Message["sender"];
    text: Message["text"];
    timestamp: Message["timestamp"];
}

const MessageComponent: React.FC<MessageComponentProps> = ({sender, text, timestamp}) => {
    const isUser = sender === "user";
    const [formattedTime, setFormattedTime] = useState<string | null>(null);

    useEffect(() => {
        // Format time only on the client after mount
        if (timestamp instanceof Date) {
            setFormattedTime(timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }));
        } else if (typeof timestamp === 'string') {
             setFormattedTime(timestamp); // Handle potential string timestamps
        }
    }, [timestamp]); // Re-run if timestamp changes

    return (
        <div className={`flex items-end ${isUser ? "justify-end" : "justify-start"} gap-2`}>
            {/* System icon */}
            {!isUser && <Bot className="w-5 h-5 text-primary mb-1"/>}
            <Card
                className={`px-3 py-1 max-w-xs md:max-w-md lg:max-w-lg break-words shadow-sm gap-0 flex flex-col ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <div className="text-sm">{text}</div>
                <div
                    className="text-xs text-right mt-1 opacity-70">
                    {/* Render the state variable */} 
                    {formattedTime}
                </div>
            </Card>
            {/* User icon */}
            {isUser && <User className="w-5 h-5 text-primary mb-1"/>}
        </div>
    );
};

export default MessageComponent;
