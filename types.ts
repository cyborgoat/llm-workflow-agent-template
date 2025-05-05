export interface Message {
    id: string;
    sender: "user" | "agent";
    text: string;
    workflow?: any;
    timestamp: Date;
};

export interface ChatTopic {
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
