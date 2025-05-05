import React from "react";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Paperclip, Send, Workflow} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "../ui/tooltip";

interface InputAreaProps {
    inputValue: string;
    onInputChange: (val: string) => void;
    onSendMessage: (text: string) => void;
    onFileUpload?: (file: File) => void; // Called for each file uploaded
    showCanvas: boolean; // Add prop for canvas state
    onToggleCanvas: () => void; // Add prop for toggling canvas
}

const InputArea: React.FC<InputAreaProps> = ({
    inputValue,
    onInputChange,
    onSendMessage,
    onFileUpload,
    showCanvas, // Destructure prop
    onToggleCanvas // Destructure prop
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Imperatively set webkitdirectory and directory attributes for folder upload
    React.useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.setAttribute('webkitdirectory', '');
            fileInputRef.current.setAttribute('directory', '');
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (inputValue.trim() !== "") {
                onSendMessage(inputValue);
            }
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && onFileUpload) {
            Array.from(files).forEach(file => onFileUpload(file));
        }
        e.target.value = '';
    };

    return (
        <div className="flex gap-2 p-4 border-t bg-background items-center">
            {/* File Upload Button */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="p-2"
                        aria-label="Upload files, images, or folders"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-5 w-5"/>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                            className="hidden"
                            onChange={handleFileChange}
                            aria-label="Upload files, images, or folders"
                            multiple
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    Upload files, images, or entire folders
                </TooltipContent>
            </Tooltip>
            {/* Canvas Toggle Button */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant={showCanvas ? "secondary" : "ghost"} // Change variant based on state
                        size="icon"
                        className="p-2"
                        aria-label={showCanvas ? "Hide Workflow Canvas" : "Show Workflow Canvas"}
                        onClick={onToggleCanvas} // Call toggle function
                    >
                        <Workflow className="h-5 w-5"/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    {showCanvas ? "Hide Workflow Canvas" : "Show Workflow Canvas"}
                </TooltipContent>
            </Tooltip>
            {/* Input Field */}
            <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={e => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                aria-label="Chat input"
            />
            <Button
                onClick={() => {
                    if (inputValue.trim() !== "") {
                        onSendMessage(inputValue);
                    }
                }}
                aria-label="Send message"
            >
                <Send className="h-5 w-5"/>
            </Button>
        </div>
    );
};

export default InputArea;
