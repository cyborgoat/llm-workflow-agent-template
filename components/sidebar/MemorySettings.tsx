import React, {useState} from "react";
import {BrainCircuit, ChevronDown} from "lucide-react";
import {motion} from "framer-motion";
import { cn } from '@/lib/utils'; 
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"; 

interface MemorySettingsProps {
    isExpanded?: boolean;
}

const MemorySettings: React.FC<MemorySettingsProps> = ({ isExpanded = true }) => { 
    const [isOpen, setIsOpen] = useState(false);
    const mockMemory = `Key Context:
- User is planning a trip to Mars.
- Focus areas: Budget, Launch Windows.
- Current date: ${new Date().toLocaleDateString()}.
- Agent model: gemini-pro.`;
    return (
        <div>
            {/* Memory Header Button - Remove Tooltip */} 
            <button
                // Only allow opening if expanded
                onClick={() => isExpanded && setIsOpen(!isOpen)} 
                // Adjust padding/justify
                className={cn(
                    "flex w-full items-center py-2 text-sm font-medium text-left hover:bg-accent rounded-md transition-colors",
                    isExpanded ? "justify-between px-3" : "justify-center px-1",
                    !isExpanded && "cursor-default hover:bg-transparent" // Don't show hover effect if collapsed
                )}
                aria-label={isOpen ? "Collapse Memory" : "Expand Memory"}
            >
                <div className="flex items-center">
                    <BrainCircuit className={cn("h-4 w-4", isExpanded ? "mr-2" : "mr-0")}/>
                    {/* Conditionally render text */} 
                    {isExpanded && <span className="text-xs">Memory</span>}
                </div>
                 {/* Only show chevron if expanded */} 
                {isExpanded && (
                    <motion.div animate={{rotate: isOpen ? 0 : -90}}>
                        <ChevronDown className="h-4 w-4"/>
                    </motion.div>
                )}
            </button>
            {/* Removed TooltipTrigger and TooltipContent */} 
            
            {/* Collapsible Memory Content - Only show if expanded */}
            {isExpanded && (
                <motion.div
                    initial={false}
                    animate={{height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0}}
                    transition={{duration: 0.2, ease: "easeInOut"}}
                    className="overflow-hidden"
                >
                    <div className="mt-1 px-3 pt-1">
                        <pre className="text-xs p-1 bg-muted rounded-md whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                            {mockMemory}
                        </pre>
                    </div>
                </motion.div>
            )}
            {!isExpanded && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="sr-only">Memory</span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Memory
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    );
};

export default MemorySettings;
