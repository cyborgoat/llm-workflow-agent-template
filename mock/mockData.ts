// mock/mockData.ts
// Centralized mock data for the agentic LLM application

import { ReactNode } from 'react';
import { MessageSquare, Bot, Wrench, CheckCircle } from 'lucide-react';

// iconKey should be one of: 'MessageSquare', 'Bot', 'Wrench', 'CheckCircle', etc. The component will map this to an icon.
export type WorkflowNodeData = {
    name: string;
    description?: string;
    inputs?: { name: string; type: string; }[];
    outputs?: { name: string; type: string; }[];
    iconKey?: string;
    status?: 'pending' | 'running' | 'success' | 'error';
};

export type WorkflowNode = {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: WorkflowNodeData;
};

export type WorkflowEdge = {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    animated?: boolean;
    type?: string;
    label?: string;
};

export type WorkflowDiagram = {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
};

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

// Chat messages for each topic are now stored in separate files in the chat_history/ directory as JSON.
// Example: chat_history/t1_mars_trip_planning.json, t2_recipe_ideas.json, etc.
//
// Use the provided function to load and parse all chat history files into a single array of Message objects.

/**
 * Loads and parses all chat history JSON files from the /chat_history directory via HTTP (browser-friendly).
 * Returns a combined array of Message objects.
 * Usage: const allMessages = await loadAllChatHistories();
 */
export async function loadAllChatHistories(): Promise<Message[]> {
    // List the filenames manually or generate dynamically if available
    const filenames = [
        't1_mars_trip_planning.json',
        't2_recipe_ideas.json',
        't3_code_debugging_session.json',
        't4_quantum_physics_explained.json',
        't5_network_incident_troubleshooting.json',
    ];
    let allMessages: Message[] = [];
    for (const filename of filenames) {
        const res = await fetch(`./chat_history/${filename}`);
        if (res.ok) {
            const messages = await res.json();
            // Convert timestamp strings to Date objects for each message
            allMessages = allMessages.concat(messages.map((m: any) => ({...m, timestamp: new Date(m.timestamp)})));
        } else {
            // Optionally handle fetch errors
            console.warn(`Failed to load ${filename}`);
        }
    }
    return allMessages;
}

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
    {id: 't5', title: 'Network Incident Troubleshooting'},
];

/**
 * Loads and parses the workflow diagram JSON for a given topicId from /chat_history/workflow_diagram/<topicId>.json.
 * Usage: const diagram = await loadWorkflowDiagram('t1_mars_trip_planning');
 */
export async function loadWorkflowDiagram(topicId: string): Promise<WorkflowDiagram> {
    // Always fetch the diagram using the topic id (e.g., t1, t2, ...)
    const res = await fetch(`./chat_history/workflow_diagram/${topicId}.json`);
    if (!res.ok) {
        throw new Error(`Failed to load workflow diagram for topic: ${topicId}`);
    }
    return res.json();
}