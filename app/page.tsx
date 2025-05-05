// App.tsx (or page.tsx in Next.js App Router)
// Main entry point for the application

'use client';

import React, {useEffect, useState} from 'react';
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import ChatArea from "../components/chat/ChatArea";
import InputArea from "../components/chat/InputArea";

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
        {
            id: '1',
            sender: 'agent',
            text: 'Hello! How can I help you today?',
            timestamp: new Date(Date.now() - 60000 * 5)
        },
        {
            id: '2',
            sender: 'user',
            text: 'I need help planning my trip to Mars.',
            timestamp: new Date(Date.now() - 60000 * 4)
        },
        {
            id: '3',
            sender: 'agent',
            text: 'Okay, planning a trip to Mars! That sounds exciting. What aspects are you focusing on first? Budget, duration, activities?',
            timestamp: new Date(Date.now() - 60000 * 3)
        },
        {
            id: '4',
            sender: 'user',
            text: 'Let\'s start with the budget and potential launch windows.',
            timestamp: new Date(Date.now() - 60000 * 2)
        },
        {
            id: '5',
            sender: 'agent',
            text: 'Great. Budgeting for Mars requires considering transportation, habitat, supplies, and contingency funds. Current estimates range widely. As for launch windows, they occur roughly every 26 months when Earth and Mars are favorably aligned. The next few windows are...',
            timestamp: new Date(Date.now() - 60000 * 1)
        },
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

    return {messages, inputValue, setInputValue, addMessage};
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
        setSettings((prev) => ({...prev, model}));
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


    return {settings, toggleTheme, setModel};
};

const useMockChatHistory = () => {
    const [topics, setTopics] = useState<ChatTopic[]>([
        {id: 't1', title: 'Mars Trip Planning'},
        {id: 't2', title: 'Recipe Ideas'},
        {id: 't3', title: 'Code Debugging Session'},
        {id: 't4', title: 'Quantum Physics Explained'},
    ]);
    const [activeTopic, setActiveTopic] = useState<string>('t1');

    const selectTopic = (id: string) => setActiveTopic(id);

    return {topics, activeTopic, selectTopic};
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

// Main App Layout Component
const AppLayout: React.FC = () => {
    const {settings, toggleTheme, setModel} = useMockSettings();
    const {messages, inputValue, setInputValue, addMessage} = useMockChat();
    const {topics, activeTopic, selectTopic} = useMockChatHistory();
    const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false);

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
            <Header settings={settings}/>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    settings={settings}
                    onToggleTheme={toggleTheme}
                    onSetModel={setModel}
                    topics={topics}
                    activeTopic={activeTopic}
                    onSelectTopic={selectTopic}
                    settingsPopoverOpen={settingsPopoverOpen}
                    onSettingsPopoverOpenChange={setSettingsPopoverOpen}
                />
                {/* Main Content Area */}
                <main className="flex flex-1 flex-col overflow-hidden">
                    <ChatArea messages={messages}/>
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
    return <AppLayout/>;
}