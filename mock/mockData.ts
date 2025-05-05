// mock/mockData.ts
// Centralized mock data for the agentic LLM application

export type Message = {
    id: string;
    topicId: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: Date;
};

export type ChatTopic = {
    id: string;
    title: string;
};

export type AppSettings = {
    theme: 'light' | 'dark';
    model: string;
    sensorStatus: 'active' | 'inactive';
    llmStatus: 'active' | 'inactive';
    toolStatus: 'active' | 'inactive';
};

export const initialMessages: Message[] = [
    // Topic t1: Mars Trip Planning
    {
        id: '1',
        topicId: 't1',
        sender: 'agent',
        text: 'Hello! How can I help you today?',
        timestamp: new Date(Date.now() - 60000 * 5)
    },
    {
        id: '2',
        topicId: 't1',
        sender: 'user',
        text: 'I need help planning my trip to Mars.',
        timestamp: new Date(Date.now() - 60000 * 4)
    },
    {
        id: '3',
        topicId: 't1',
        sender: 'agent',
        text: 'Okay, planning a trip to Mars! That sounds exciting. What aspects are you focusing on first? Budget, duration, activities?',
        timestamp: new Date(Date.now() - 60000 * 3)
    },
    {
        id: '4',
        topicId: 't1',
        sender: 'user',
        text: 'Let\'s start with the budget and potential launch windows.',
        timestamp: new Date(Date.now() - 60000 * 2)
    },
    {
        id: '5',
        topicId: 't1',
        sender: 'agent',
        text: 'Great. Budgeting for Mars requires considering transportation, habitat, supplies, and contingency funds. Current estimates range widely. As for launch windows, they occur roughly every 26 months when Earth and Mars are favorably aligned. The next few windows are...', 
        timestamp: new Date(Date.now() - 60000 * 1)
    },
    // Topic t2: Recipe Ideas
    {
        id: '6',
        topicId: 't2',
        sender: 'agent',
        text: 'What kind of recipe are you looking for?',
        timestamp: new Date(Date.now() - 60000 * 10)
    },
    {
        id: '7',
        topicId: 't2',
        sender: 'user',
        text: 'Something quick and easy for a weeknight.',
        timestamp: new Date(Date.now() - 60000 * 9)
    },
    {
        id: '8',
        topicId: 't2',
        sender: 'agent',
        text: 'How about a simple pasta dish with cherry tomatoes, garlic, and basil? It takes about 20 minutes.',
        timestamp: new Date(Date.now() - 60000 * 8)
    }
];

export const initialSettings: AppSettings = {
    theme: 'light',
    model: 'gemini-pro',
    sensorStatus: 'active',
    llmStatus: 'inactive',
    toolStatus: 'active',
};

export const initialTopics: ChatTopic[] = [
    {id: 't1', title: 'Mars Trip Planning'},
    {id: 't2', title: 'Recipe Ideas'},
    {id: 't3', title: 'Code Debugging Session'},
    {id: 't4', title: 'Quantum Physics Explained'},
];
