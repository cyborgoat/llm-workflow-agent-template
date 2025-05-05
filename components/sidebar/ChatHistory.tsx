import React from "react";
import type {ChatTopic} from "../../types";
import {ChevronDown, History} from "lucide-react";
import {motion} from "framer-motion";
import { cn } from '@/lib/utils'; 
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"; 

interface ChatHistoryProps {
    topics: ChatTopic[];
    activeTopic: string;
    onSelectTopic: (id: string) => void;
    isExpanded?: boolean; 
}

const ChatHistory: React.FC<ChatHistoryProps> = ({topics, activeTopic, onSelectTopic, isExpanded = true}) => { 
    const [isOpen, setIsOpen] = React.useState(true);
    return (
        <div>
            {/* History Header Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center py-2 text-sm font-medium text-left hover:bg-accent rounded-md transition-colors",
                    isExpanded ? "justify-between px-3" : "justify-center px-1"
                )}
                aria-label={isOpen ? "Collapse History" : "Expand History"}
                disabled={!isExpanded && !isOpen} 
            >
                <div className="flex items-center">
                    <History className={cn("h-4 w-4", isExpanded ? "mr-2" : "mr-0")}/>
                    {isExpanded && <span className="text-xs">History</span>}
                </div>
                {isExpanded && (
                    <motion.div animate={{rotate: isOpen ? 0 : -90}}>
                        <ChevronDown className="h-4 w-4"/>
                    </motion.div>
                )}
            </button>

            {/* Collapsible Topic List */}
            {(isExpanded || isOpen) && (
                <motion.div
                    initial={false}
                    animate={{
                        height: isOpen ? 'auto' : 0, 
                        opacity: isOpen ? 1 : 0,
                        display: isOpen || !isExpanded ? 'block' : 'none' 
                    }}
                    transition={{duration: 0.2, ease: "easeInOut"}}
                    className="overflow-hidden"
                >
                    <div className={cn("mt-1 pt-1 space-y-1", isExpanded ? "px-1" : "px-0 flex flex-col items-center")} >
                        {topics.map((topic) => (
                            <button
                                key={topic.id}
                                onClick={() => onSelectTopic(topic.id)}
                                className={cn(
                                    "w-full text-left rounded px-2 py-1 text-xs transition-colors",
                                    activeTopic === topic.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                    !isExpanded && "p-1 justify-center flex" // Center content (sr-only span) when collapsed
                                )}
                                aria-label={topic.title} // Keep aria-label
                            >
                                {/* Show only icon or text based on state */} 
                                {isExpanded ? (
                                    topic.title
                                ) : (
                                     <span className="sr-only">{topic.title}</span> // Keep screen reader text
                                    // Placeholder for potential topic icons later
                                    // <MessageSquare size={14} /> 
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ChatHistory;
