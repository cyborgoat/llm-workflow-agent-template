import React, { useMemo } from 'react';
import {
    ReactFlow,
    Controls,
    Background,

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
import { WorkflowData, ToolNodeData } from '@/types';
import { ToolNode } from './ToolNode';


interface WorkflowEditorProps {
    nodes: Node<ToolNodeData>[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
}


export function WorkflowEditor({
                                   nodes,
                                   edges,
                                   onNodesChange,
                                   onEdgesChange,
                                   onConnect,
                               }: WorkflowEditorProps) {

    // Define custom node types
    const nodeTypes: NodeTypes = useMemo(() => ({ toolNode: ToolNode }), []);



    return (

        <div style={{ height: '100%', width: '100%', minHeight: 0 }}>
            <ReactFlowProvider>
                <ReactFlow
                    // Pass props directly from parent (WorkflowPopup)
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    className="bg-gray-100"
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={true}
                    nodesConnectable={true}
                    elementsSelectable={true}
                    deleteKeyCode={['Backspace', 'Delete']}
                >
                    <Controls /> {/* Add zoom/pan controls */}
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} /> {/* Add dotted background */}
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}