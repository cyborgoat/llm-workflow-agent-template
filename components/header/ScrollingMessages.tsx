import React from "react";
import {AlertTriangle, Bell, CheckCircle, Info, Megaphone} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

const messages = [
    {text: "Welcome to the AI Chat App!", type: "normal"},
    {text: "Your data is private and secure.", type: "info"},
    {text: "Try switching themes in settings.", type: "info"},
    {text: "Critical: Model service unavailable!", type: "critical"},
    {text: "Critical: Unauthorized access attempt detected!", type: "critical"},
    {text: "Critical: Data sync failed. Immediate attention required.", type: "critical"},
    {text: "Important: Scheduled maintenance at 2am.", type: "warning"},
    {text: "Success: API key validated.", type: "success"},
    {text: "Notice: New features have been added.", type: "info"},
    {text: "Tip: Use the sidebar to access chat history.", type: "normal"},
];

const ScrollingMessages: React.FC = () => {
    const [index, setIndex] = React.useState(0);
    React.useEffect(() => {
        const timer = setInterval(() => {
            setIndex(i => (i + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="relative h-8 flex items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={index + '-' + messages[index].text}
                    initial={{opacity: 0, y: 16}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -16}}
                    transition={{duration: 0.35, ease: "easeInOut"}}
                    className={`flex items-center gap-2 text-xs px-2 py-1 rounded-md shadow-sm w-full justify-center
            ${messages[index].type === 'critical' ? 'bg-red-50 text-red-700 font-semibold' : ''}
            ${messages[index].type === 'info' ? 'bg-blue-50 text-blue-700' : ''}
            ${messages[index].type === 'success' ? 'bg-green-50 text-green-700' : ''}
            ${messages[index].type === 'warning' ? 'bg-yellow-50 text-yellow-700' : ''}
            ${messages[index].type === 'normal' ? 'bg-muted text-muted-foreground' : ''}`.replace(/\s+/g, ' ')}
                >
                    {messages[index].type === 'critical' && <AlertTriangle className="w-4 h-4 text-red-500"/>}
                    {messages[index].type === 'info' && <Info className="w-4 h-4 text-blue-400"/>}
                    {messages[index].type === 'success' && <CheckCircle className="w-4 h-4 text-green-500"/>}
                    {messages[index].type === 'warning' && <Bell className="w-4 h-4 text-yellow-500"/>}
                    {messages[index].type === 'normal' && <Megaphone className="w-4 h-4 text-muted-foreground"/>}
                    <span>{messages[index].text}</span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ScrollingMessages;

