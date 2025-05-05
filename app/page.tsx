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

    const addMessage = (sender: 'user' | 'agent', text: string, topicId: string) => {
        if (!topicId) { 
            console.error("Attempted to add message without a topicId");
            return; // Don't add messages without a topic
        }
        const newMessage: Message = {
            id: Date.now().toString(),
            topicId, // Assign topicId
            sender,
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);

        // Simulate agent response
        if (sender === 'user') {
            setInputValue('');
            setTimeout(() => {
                // Agent response also needs the topicId
                addMessage('agent', `Thinking about "${text}"... [Simulated Response]`, topicId); 
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
    const [activeTopic, setActiveTopic] = useState<string | null>('t1'); 

    const selectTopic = (id: string | null) => setActiveTopic(id);

    // Function to create a new topic
    const createNewTopic = (title: string): string => {
        const newTopicId = `t${Date.now()}`; // Simple unique ID generation
        const newTopic: ChatTopic = { id: newTopicId, title };
        setTopics(prevTopics => [...prevTopics, newTopic]);
        return newTopicId;
    };

    return {topics, activeTopic, selectTopic, createNewTopic};
}

const AppLayout: React.FC = () => {
    const {messages, inputValue, setInputValue, addMessage} = useMockChat();
    const {topics, activeTopic, selectTopic, createNewTopic} = useMockChatHistory(); 
    const {settings, settingsPopoverOpen, setSettingsPopoverOpen, toggleTheme, setModel} = useMockSettings();
    const [showCanvas, setShowCanvas] = useState(false); 
    const [isSidebarHovered, setIsSidebarHovered] = useState(false); 

    const handleSendMessage = (text: string) => {
        let targetTopicId = activeTopic;

        // If no topic is active (new chat), create one first
        if (!targetTopicId) {
            const newTitle = text.length > 30 ? text.substring(0, 27) + '...' : text; // Use first part of message as title
            targetTopicId = createNewTopic(newTitle || "New Chat"); 
            selectTopic(targetTopicId); // Activate the new topic
        }

        // Now add the message to the target topic (either existing or new)
        addMessage('user', text, targetTopicId);
    }

    const toggleCanvas = useCallback(() => {
        setShowCanvas(prev => !prev);
    }, []);

    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(settings.theme);
    }, [settings.theme]);

    const filteredMessages = activeTopic ? messages.filter(msg => msg.topicId === activeTopic) : [];

    return (
        <div className={`flex flex-col h-screen ${settings.theme}`}>
            <Header settings={settings}/>
            <main className="flex flex-1 overflow-hidden">
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

                <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex flex-1 overflow-hidden">
                        <div className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${showCanvas ? 'w-1/2' : 'w-full'}`}> 
                            <ChatArea messages={filteredMessages} className="flex-1 overflow-y-auto p-4"/>
                        </div>
                        
                        {showCanvas && (
                            <div className="w-1/2 border-l overflow-hidden">
                                <CanvasArea/>
                            </div>
                        )}
                    </div>
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