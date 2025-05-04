import React, { useMemo } from 'react'; // Removed useState, useCallback, useEffect
import {
    ReactFlow,
    Controls,
    Background,
    // Removed state-related imports: applyNodeChanges, applyEdgeChanges, addEdge
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    ReactFlowProvider,
    BackgroundVariant,
    // Removed state-related types: NodeChange, EdgeChange, Connection
    NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
// Import shared types and the custom node
import { WorkflowData, ToolNodeData } from '@/types'; // Adjust path if needed
import { ToolNode } from './ToolNode'; // Import the custom node component

// Interface for props received from WorkflowPopup
interface WorkflowEditorProps {
    nodes: Node<ToolNodeData>[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
}

// Simplified WorkflowEditor - now primarily presentational
export function WorkflowEditor({
                                   nodes,
                                   edges,
                                   onNodesChange,
                                   onEdgesChange,
                                   onConnect,
                               }: WorkflowEditorProps) {

    // Define custom node types - remains the same
    const nodeTypes: NodeTypes = useMemo(() => ({ toolNode: ToolNode }), []);

    // Removed internal state management (useState, useEffect)
    // Removed internal handlers (handleNodeDataChange, internal onNodesChange/onEdgesChange/onConnect)

    return (
        // Ensure container takes up full space and allows shrinking
        <div style={{ height: '100%', width: '100%', minHeight: 0 }}>
            <ReactFlowProvider>
                <ReactFlow
                    // Pass props directly from parent (WorkflowPopup)
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes} // Register custom node types
                    onNodesChange={onNodesChange} // Use handler from props
                    onEdgesChange={onEdgesChange} // Use handler from props
                    onConnect={onConnect}         // Use handler from props
                    fitView // Fit nodes on initial render/data change
                    fitViewOptions={{ padding: 0.2 }}
                    className="bg-gray-100" // Slightly different background
                    proOptions={{ hideAttribution: true }} // Hide React Flow attribution
                    nodesDraggable={true}
                    nodesConnectable={true}
                    elementsSelectable={true}
                    deleteKeyCode={['Backspace', 'Delete']} // Allow deletion using Backspace or Delete keys
                >
                    <Controls /> {/* Add zoom/pan controls */}
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} /> {/* Add dotted background */}
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}