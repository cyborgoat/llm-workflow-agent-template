import {Edge, Node} from '@xyflow/react';

// Define structure for tool parameters
export interface ToolParameter {
    id: string;
    name: string;
    type: string; // e.g., 'string', 'number', 'boolean', 'file'
    value: string | number | boolean | null; // Current value
    description?: string;
}

// Define the data structure for our custom tool nodes
export interface ToolNodeData {
    name: string;
    description: string;
    inputs: ToolParameter[];
    outputs: ToolParameter[];
    // Callback function injected by WorkflowPopup to handle data changes within the node
    onChange?: (id: string, data: Partial<ToolNodeData>) => void;
    // Optional status indicator
    status?: 'idle' | 'running' | 'success' | 'error';
}

// Update WorkflowData to use the specific ToolNodeData type
export interface WorkflowData {
    nodes: Node<ToolNodeData>[]; // Use specific data type for nodes
    edges: Edge[]; // Edges can remain generic for now
}

// Chat message structure remains the same
export interface Message {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    workflow?: WorkflowData; // Optional workflow associated with an agent message
}