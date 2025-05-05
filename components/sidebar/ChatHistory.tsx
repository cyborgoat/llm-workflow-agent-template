import React from "react";
import type { ChatTopic } from "../../types";
import { History, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface ChatHistoryProps {
  topics: ChatTopic[];
  activeTopic: string;
  onSelectTopic: (id: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ topics, activeTopic, onSelectTopic }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-left hover:bg-accent rounded-md transition-colors"
      >
        <div className="flex items-center">
          <History className="mr-2 h-4 w-4" />
          <span className="text-xs">History</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-1 px-1 pt-1 space-y-1">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`w-full text-left rounded px-2 py-1 text-xs transition-colors ${activeTopic === topic.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatHistory;
