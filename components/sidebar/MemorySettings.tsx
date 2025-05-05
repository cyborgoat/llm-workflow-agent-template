import React, {useState} from "react";
import {BrainCircuit, ChevronDown} from "lucide-react";
import {motion} from "framer-motion";

const MemorySettings: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const mockMemory = `Key Context:\n- User is planning a trip to Mars.\n- Focus areas: Budget, Launch Windows.\n- Current date: ${new Date().toLocaleDateString()}.\n- Agent model: gemini-pro.`;
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-left hover:bg-accent rounded-md transition-colors"
            >
                <div className="flex items-center">
                    <BrainCircuit className="mr-2 h-4 w-4"/>
                    <span className="text-xs">Memory</span>
                </div>
                <motion.div animate={{rotate: isOpen ? 0 : -90}}>
                    <ChevronDown className="h-4 w-4"/>
                </motion.div>
            </button>
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
        </div>
    );
};

export default MemorySettings;

