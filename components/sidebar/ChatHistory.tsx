import React from "react";
import type { ChatTopic } from "../../types";

interface ChatHistoryProps {
  topics: ChatTopic[];
  activeTopic: string;
  onSelectTopic: (id: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ topics, activeTopic, onSelectTopic }) => (
  <div className="space-y-1 p-2">
    <div className="font-bold text-sm mb-1">History</div>
    {topics.map((topic) => (
      <button
        key={topic.id}
        onClick={() => onSelectTopic(topic.id)}
        className={`w-full text-left rounded px-2 py-1 hover:bg-muted ${activeTopic === topic.id ? "bg-primary text-primary-foreground" : ""}`}
      >
        {topic.title}
      </button>
    ))}
  </div>
);

export default ChatHistory;

