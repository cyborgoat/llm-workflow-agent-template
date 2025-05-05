'use client';

import React, {useEffect, useState} from 'react';
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import ChatArea from "../components/chat/ChatArea";
import InputArea from "../components/chat/InputArea";
import {AppSettings, ChatTopic, initialMessages, initialSettings, initialTopics, Message} from "../mock/mockData";

const useMockChat = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
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
            setInputValue('');
            setTimeout(() => {
                addMessage('agent', `Thinking about "${text}"... [Simulated Response]`);
            }, 1500);
        }
    };

    return {messages, inputValue, setInputValue, addMessage};
};

const useMockSettings = () => {
    const [settings, setSettings] = useState<AppSettings>(initialSettings);

    const toggleTheme = () => {
        setSettings((prev) => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light',
        }));
    };

    const setModel = (model: string) => {
        setSettings((prev) => ({...prev, model}));
    };

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
    const [topics, setTopics] = useState<ChatTopic[]>(initialTopics);
    const [activeTopic, setActiveTopic] = useState<string>('t1');

    const selectTopic = (id: string) => setActiveTopic(id);

    return {topics, activeTopic, selectTopic};
}


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