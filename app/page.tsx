// App.tsx (or page.tsx in Next.js App Router)
// Main entry point for the application

'use client'; // Required for hooks in Next.js App Router

import React, { useState, useRef, useEffect, useCallback } from 'react';
// Import motion from framer-motion
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Settings,
  BrainCircuit,
  History,
  Sun,
  Moon,
  Send,
  Paperclip,
  Image as ImageIcon,
  Bot,
  User,
  Circle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import AppSettingsComponent from "../components/sidebar/AppSettingsComponent";

// --- Mock Data & Types ---

type Message = {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
};

type ChatTopic = {
  id: string;
  title: string;
};

type AppSettings = {
  theme: 'light' | 'dark';
  model: string;
  sensorStatus: 'active' | 'inactive';
  llmStatus: 'active' | 'inactive';
  toolStatus: 'active' | 'inactive';
};

// --- Mock State Hooks (Replace with Context/Zustand in a real app) ---

const useMockChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'agent', text: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 60000 * 5) },
    { id: '2', sender: 'user', text: 'I need help planning my trip to Mars.', timestamp: new Date(Date.now() - 60000 * 4) },
    { id: '3', sender: 'agent', text: 'Okay, planning a trip to Mars! That sounds exciting. What aspects are you focusing on first? Budget, duration, activities?', timestamp: new Date(Date.now() - 60000 * 3) },
     { id: '4', sender: 'user', text: 'Let\'s start with the budget and potential launch windows.', timestamp: new Date(Date.now() - 60000 * 2) },
     { id: '5', sender: 'agent', text: 'Great. Budgeting for Mars requires considering transportation, habitat, supplies, and contingency funds. Current estimates range widely. As for launch windows, they occur roughly every 26 months when Earth and Mars are favorably aligned. The next few windows are...', timestamp: new Date(Date.now() - 60000 * 1) },
  ]);
  const [inputValue, setInputValue] = useState('');

  const addMessage = (sender: 'user' | 'agent', text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate agent response
    if (sender === 'user') {
        setInputValue(''); // Clear input after sending
        setTimeout(() => {
            addMessage('agent', `Thinking about "${text}"... [Simulated Response]`);
        }, 1500);
    }
  };

  return { messages, inputValue, setInputValue, addMessage };
};

const useMockSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    model: 'gemini-pro',
    sensorStatus: 'active',
    llmStatus: 'inactive',
    toolStatus: 'active',
  });

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const setModel = (model: string) => {
    setSettings((prev) => ({ ...prev, model }));
  };

  // In a real app, status would come from backend/WebSockets
  // Simulate status changes for animation demonstration
  useEffect(() => {
    const llmInterval = setInterval(() => {
        setSettings(prev => ({
            ...prev,
            llmStatus: prev.llmStatus === 'active' ? 'inactive' : 'active'
        }))
    }, 5000);
     const toolInterval = setInterval(() => {
        setSettings(prev => ({
            ...prev,
            toolStatus: prev.toolStatus === 'active' ? 'inactive' : 'active'
        }))
    }, 7000);
    return () => {
        clearInterval(llmInterval);
        clearInterval(toolInterval);
    }
  }, []);


  return { settings, toggleTheme, setModel };
};

const useMockChatHistory = () => {
    const [topics, setTopics] = useState<ChatTopic[]>([
        { id: 't1', title: 'Mars Trip Planning'},
        { id: 't2', title: 'Recipe Ideas'},
        { id: 't3', title: 'Code Debugging Session'},
        { id: 't4', title: 'Quantum Physics Explained'},
    ]);
    const [activeTopic, setActiveTopic] = useState<string>('t1');

    const selectTopic = (id: string) => setActiveTopic(id);

    return { topics, activeTopic, selectTopic };
}

// --- UI Components (Conceptual - Assuming shadcn/ui setup) ---
// In a real project, these would be in separate files and import actual shadcn components.

// Helper for class names
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Individual Components ---

// Header Components

// Define animation variants for the pulsing effect
const pulseVariants = {
  active: {
    scale: [1, 1.3, 1], // Scale up and back down
    opacity: [1, 0.7, 1], // Fade slightly during pulse
    transition: {
      duration: 1.5, // Duration of one pulse cycle
      repeat: Infinity, // Repeat indefinitely
      repeatType: "loop" as const, // Loop the animation
      ease: "easeInOut", // Smooth easing
    }
  },
  inactive: {
    scale: 1,
    opacity: 1,
  }
};


const StatusIndicators: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const getStatusColor = (status: 'active' | 'inactive', activeColor: string) => {
    return status === 'active' ? activeColor : 'bg-gray-300 dark:bg-gray-600';
  };

  return (
    <div className="flex items-center space-x-2" title="System Status (Sensor, LLM, Tools)">
      {/* Sensor Status Dot */}
      <motion.span
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          getStatusColor(settings.sensorStatus, 'bg-green-500')
        )}
        variants={pulseVariants}
        animate={settings.sensorStatus === 'active' ? 'active' : 'inactive'} // Control animation based on state
      />
      {/* LLM Status Dot */}
      <motion.span
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          getStatusColor(settings.llmStatus, 'bg-blue-500')
        )}
        variants={pulseVariants}
        animate={settings.llmStatus === 'active' ? 'active' : 'inactive'} // Control animation based on state
      />
      {/* Tool Status Dot */}
      <motion.span
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          getStatusColor(settings.toolStatus, 'bg-orange-500')
        )}
        variants={pulseVariants}
        animate={settings.toolStatus === 'active' ? 'active' : 'inactive'} // Control animation based on state
      />
    </div>
  );
};

const ScrollingMessages: React.FC = () => {
  // Placeholder - a real implementation would cycle through messages
  const [message, setMessage] = useState("Welcome to My Agent!");
  const [color, setColor] = useState("text-gray-500 dark:text-gray-400");

  useEffect(() => {
      const messages = [
          { text: "Tip: Use Shift+Enter for newlines.", color: "text-gray-500 dark:text-gray-400"},
          { text: "LLM Model updated to 'gemini-pro'.", color: "text-blue-500"},
          { text: "Warning: High token usage detected.", color: "text-orange-500"},
          { text: "System maintenance scheduled for tonight.", color: "text-gray-500 dark:text-gray-400"},
      ];
      let index = 0;
      const interval = setInterval(() => {
          index = (index + 1) % messages.length;
          setMessage(messages[index].text);
          setColor(messages[index].color);
      }, 7000); // Change message every 7 seconds
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 text-center text-sm truncate px-4">
        {/* Added motion for subtle fade transition */}
        <motion.span
            key={message} // Change key to trigger animation on message change
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn("transition-colors duration-300", color)}
        >
            {message}
        </motion.span>
    </div>
  );
};

const Header: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-10">
      <div className="font-semibold text-lg">My Agent</div>
      <ScrollingMessages />
      <StatusIndicators settings={settings} />
    </header>
  );
};

// Sidebar Components
const ChatHistory: React.FC<{
    topics: ChatTopic[];
    activeTopic: string;
    onSelectTopic: (id: string) => void;
}> = ({ topics, activeTopic, onSelectTopic }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-left hover:bg-accent rounded-md transition-colors"
            >
                <div className="flex items-center">
                    <History className="mr-2 h-4 w-4" />
                    Chat History
                </div>
                {/* Animate chevron rotation */}
                <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
            </button>
            {/* Animate presence for smooth collapse/expand */}
            <motion.div
                initial={false} // Don't animate on initial render
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden" // Hide content when collapsed
            >
                 <div className="mt-1 space-y-1 px-3 max-h-48 overflow-y-auto pt-1"> {/* Added padding top */}
                    {topics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => onSelectTopic(topic.id)}
                            className={cn(
                                "w-full text-left text-sm px-3 py-1.5 rounded-md truncate transition-colors",
                                activeTopic === topic.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            {topic.title}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

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
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Memory
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
                <div className="mt-1 px-3 pt-1">
                    <pre className="text-xs p-2 bg-muted rounded-md whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                        {mockMemory}
                    </pre>
                </div>
            </motion.div>
        </div>
    );
};

// Removed local AppSettingsComponent. Now using the one from /components/sidebar/AppSettingsComponent.tsx.

const Sidebar: React.FC<{
    settings: AppSettings;
    onToggleTheme: () => void;
    onSetModel: (model: string) => void;
    topics: ChatTopic[];
    activeTopic: string;
    onSelectTopic: (id: string) => void;
}> = (props) => {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 border-r bg-muted/40 dark:bg-card shrink-0 h-full overflow-y-auto p-4 space-y-4">
        {/* Conceptual Separator - Replace with shadcn Separator */}
        <ChatHistory topics={props.topics} activeTopic={props.activeTopic} onSelectTopic={props.onSelectTopic}/>
        <hr className="border-border" />
        <MemorySettings />
        <hr className="border-border" />
        <AppSettingsComponent
            settings={props.settings}
            onToggleTheme={props.onToggleTheme}
            onSetModel={props.onSetModel}
        />
    </aside>
  );
};

// Chat Area Components
const MessageComponent: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const Icon = isUser ? User : Bot;

  return (
    // Animate message appearance
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("flex items-start space-x-3 py-3", isUser ? 'justify-end' : '')}
    >
      {!isUser && <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-xs md:max-w-md lg:max-w-lg break-words shadow-sm", // Added shadow
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-xs text-right mt-1 opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && <User className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />}
    </motion.div>
  );
};

const ChatArea: React.FC<{ messages: Message[] }> = ({ messages }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 bg-background"> {/* Reduced space-y */}
            {messages.map((msg) => (
                <MessageComponent key={msg.id} message={msg} />
            ))}
            {/* Dummy div to target for scrolling */}
            <div ref={messagesEndRef} />
        </div>
    );
};


// Input Area Component
const InputArea: React.FC<{
    inputValue: string;
    onInputChange: (value: string) => void;
    onSendMessage: (text: string) => void;
}> = ({ inputValue, onInputChange, onSendMessage }) => {

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim());
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent newline
            handleSend();
        }
    };

    // Adjust textarea height dynamically
    useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            const scrollHeight = textarea.scrollHeight;
            // Set a max height (e.g., 200px)
            textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
        }
    }, [inputValue]);


    return (
        <div className="border-t bg-background p-3 md:p-4 sticky bottom-0">
            <div className="relative flex items-end space-x-2">
                 {/* Conceptual Buttons - Replace with shadcn Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                >
                    <Paperclip className="h-5 w-5" />
                    <span className="sr-only">Attach file</span>
                </motion.button>
                 <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                 >
                    <ImageIcon className="h-5 w-5" />
                     <span className="sr-only">Attach image</span>
                </motion.button>
                {/* Conceptual Textarea - Replace with shadcn Textarea */}
                <textarea
                    ref={textAreaRef}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Shift+Enter for newline)"
                    rows={1} // Start with 1 row
                    className="flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[200px] overflow-y-auto"
                />
                {/* Conceptual Button - Replace with shadcn Button */}
                <button
                    type="button"
                    onClick={handleSend}
                    aria-label="Send message"
                    disabled={!inputValue.trim()}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
                >
                    <Send className="h-5 w-5" />
                     <span className="sr-only">Send message</span>
                </button>
            </div>
        </div>
    );
};


// Main App Layout Component
const AppLayout: React.FC = () => {
  const { settings, toggleTheme, setModel } = useMockSettings();
  const { messages, inputValue, setInputValue, addMessage } = useMockChat();
  const { topics, activeTopic, selectTopic } = useMockChatHistory();

  // Apply theme class to body
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(settings.theme);
  }, [settings.theme]);

  const handleSendMessage = (text: string) => {
      addMessage('user', text);
      // In real app, send to backend here
  }

  return (
    // Use Framer Motion's AnimatePresence if needed for page transitions later
    <div className="flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
      <Header settings={settings} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
            settings={settings}
            onToggleTheme={toggleTheme}
            onSetModel={setModel}
            topics={topics}
            activeTopic={activeTopic}
            onSelectTopic={selectTopic}
        />
        {/* Main Content Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <ChatArea messages={messages} />
          <InputArea
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
          />
        </main>
      </div>
    </div>
  );
};


// Default export for Next.js page
export default function App() {
  return <AppLayout />;
}

/**
 * NOTES:
 * - Added `framer-motion` for animations. Remember to install it (`npm install framer-motion`).
 * - Status indicators now have a pulsing animation when active.
 * - Sidebar sections (History, Memory, Settings) use animated collapse/expand.
 * - Theme toggle switch has a spring animation.
 * - Messages fade in smoothly.
 * - Input area buttons have subtle hover/tap animations.
 * - Scrolling status message in header fades between messages.
 * - Still requires replacing mock state with real state management and backend integration.
 * - Still requires replacing conceptual UI elements with actual shadcn/ui components.
 */
