import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

interface InputAreaProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: (text: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ inputValue, onInputChange, onSendMessage }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSendMessage(inputValue);
    }
  };
  return (
    <div className="flex gap-2 p-4 border-t bg-background">
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

