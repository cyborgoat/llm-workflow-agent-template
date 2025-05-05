import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send, Paperclip } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

interface InputAreaProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: (text: string) => void;
  onFileUpload?: (file: File) => void; // Called for each file uploaded
}

const InputArea: React.FC<InputAreaProps> = ({ inputValue, onInputChange, onSendMessage, onFileUpload }) => {
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
      onSendMessage(inputValue);
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
            <Paperclip className="h-5 w-5" />
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
      <Input
        type="text"
        placeholder="Type your message..."
        value={inputValue}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        aria-label="Chat input"
      />
      <Button onClick={() => onSendMessage(inputValue)} aria-label="Send message">
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default InputArea;

