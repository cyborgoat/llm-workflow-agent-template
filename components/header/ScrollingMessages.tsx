import React from "react";

const messages = [
  "Welcome to the AI Chat App!",
  "Your data is private and secure.",
  "Try switching themes in settings.",
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
    <div className="text-muted-foreground text-xs animate-fade-in">
      {messages[index]}
    </div>
  );
};

export default ScrollingMessages;

