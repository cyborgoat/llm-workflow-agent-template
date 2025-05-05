'use client';

import React, {useEffect, useState, useCallback} from 'react';
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import ChatArea from "../components/chat/ChatArea";
import InputArea from "../components/chat/InputArea";
import {AppSettings, ChatTopic, initialMessages, initialSettings, initialTopics, Message} from "../mock/mockData";
import CanvasArea from '@/components/canvas/CanvasArea';

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
    const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false);

    const toggleTheme = useCallback(() => {
        setSettings((prev) => ({...prev, theme: prev.theme === 'light' ? 'dark' : 'light'}));
    }, []);

    const setModel = useCallback((model: string) => {
        setSettings((prev) => ({...prev, model}));
    }, []);

    return {settings, settingsPopoverOpen, setSettingsPopoverOpen, toggleTheme, setModel};
};

const useMockChatHistory = () => {
    const [topics, setTopics] = useState<ChatTopic[]>(initialTopics);
    const [activeTopic, setActiveTopic] = useState<string>('t1');

    const selectTopic = (id: string) => setActiveTopic(id);

    return {topics, activeTopic, selectTopic};
}

const AppLayout: React.FC = () => {
    const {messages, inputValue, setInputValue, addMessage} = useMockChat();
    const {topics, activeTopic, selectTopic} = useMockChatHistory();
    const {settings, settingsPopoverOpen, setSettingsPopoverOpen, toggleTheme, setModel} = useMockSettings();
    const [showCanvas, setShowCanvas] = useState(false); 
    const [isSidebarHovered, setIsSidebarHovered] = useState(false); 

    const handleSendMessage = (text: string) => {
        addMessage('user', text);
        // In real app, send to backend here
    }

    const toggleCanvas = useCallback(() => {
        setShowCanvas(prev => !prev);
    }, []);

    // Apply theme class to body
    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(settings.theme);
    }, [settings.theme]);

    return (
        <div className={`flex flex-col h-screen ${settings.theme}`}>
            <Header settings={settings}/>
            <main className="flex flex-1 overflow-hidden">
                {/* Sidebar Container with Hover Handlers */}
                <div 
                    onMouseEnter={() => setIsSidebarHovered(true)}
                    onMouseLeave={() => setIsSidebarHovered(false)}
                    className={`transition-all duration-300 ease-in-out shrink-0 ${isSidebarHovered ? 'md:w-64 lg:w-72' : 'md:w-16'}`}
                >
                    <Sidebar
                        settings={settings}
                        onToggleTheme={toggleTheme}
                        onSetModel={setModel}
                        topics={topics}
                        activeTopic={activeTopic}
                        onSelectTopic={selectTopic}
                        settingsPopoverOpen={settingsPopoverOpen}
                        onSettingsPopoverOpenChange={setSettingsPopoverOpen}
                        isExpanded={isSidebarHovered} 
                    />
                </div>

                {/* Main Content Area (Chat + Optional Canvas) */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Top section (Chat or Chat+Canvas) */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Chat Area always visible */}
                        <div className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${showCanvas ? 'w-1/2' : 'w-full'}`}> 
                            <ChatArea messages={messages} className="flex-1 overflow-y-auto p-4"/>
                        </div>
                        
                        {/* Canvas Area conditionally rendered */}
                        {showCanvas && (
                            <div className="w-1/2 border-l overflow-hidden">
                                <CanvasArea/>
                            </div>
                        )}
                    </div>
                    {/* Input Area */}
                    <InputArea
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        onSendMessage={handleSendMessage}
                        showCanvas={showCanvas}
                        onToggleCanvas={toggleCanvas}
                    />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;