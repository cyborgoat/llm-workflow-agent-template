import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    Edge, 
    Node, 
    applyNodeChanges, 
    applyEdgeChanges,
    NodeChange,
    EdgeChange
} from 'reactflow';
import { MessageSquare, Bot, Wrench, CheckCircle } from 'lucide-react';

import 'reactflow/dist/style.css';

import WorkflowNode, { WorkflowNodeData } from './WorkflowNode';

const nodeTypes = {
  workflow: WorkflowNode,
};

const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: 'user-input',
    type: 'workflow',
    position: { x: 50, y: 50 },
    data: {
      name: 'User Input',
      description: 'The initial request from the user.',
      icon: <MessageSquare size={16}/>,
      outputs: [{ name: 'Query Text', type: 'string' }],
      status: 'success',
    },
  },
  {
    id: 'intent-analysis',
    type: 'workflow',
    position: { x: 350, y: 50 },
    data: {
      name: 'Intent Analysis',
      description: 'LLM analyzes the input to determine intent and required tools.',
      icon: <Bot size={16}/>,
      inputs: [{ name: 'Query Text', type: 'string' }],
      outputs: [{ name: 'Tool Name', type: 'string' }, { name: 'Tool Args', type: 'object' }],
      status: 'running',
    },
  },
  {
    id: 'tool-call',
    type: 'workflow',
    position: { x: 350, y: 250 },
    data: {
      name: 'Tool Call (e.g., grep_search)',
      description: 'Executing the selected tool with provided arguments.',
      icon: <Wrench size={16}/>,
      inputs: [{ name: 'Tool Name', type: 'string' }, { name: 'Tool Args', type: 'object' }],
      outputs: [{ name: 'Tool Result', type: 'json' }],
      status: 'pending',
    },
  },
  {
    id: 'final-output',
    type: 'workflow',
    position: { x: 650, y: 150 },
    data: {
      name: 'Final Response',
      description: 'Generating the final response based on analysis and tool results.',
      icon: <CheckCircle size={16}/>,
      inputs: [{ name: 'Tool Result', type: 'json' }, { name: 'Analysis Context', type: 'string' }],
      outputs: [{ name: 'Agent Response', type: 'string' }],
      status: 'success',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'user-input', target: 'intent-analysis', sourceHandle: 'right-source', targetHandle: 'left-target', animated: true },
  { id: 'e2-3', source: 'intent-analysis', target: 'tool-call', sourceHandle: 'bottom-source', targetHandle: 'top-target', animated: true },
  { id: 'e3-4', source: 'tool-call', target: 'final-output', sourceHandle: 'right-source', targetHandle: 'left-target', animated: true },
  { id: 'e2-4', source: 'intent-analysis', target: 'final-output', sourceHandle: 'right-source', targetHandle: 'top-target', type: 'step', label: 'Context'},
];

const CanvasArea: React.FC = () => {
    // Memoize nodeTypes to prevent unnecessary re-renders
    const memoizedNodeTypes = useMemo(() => nodeTypes, []);

    // Use React Flow hooks to manage state
    const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    // Handler for node changes (drag, select, remove)
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    // Handler for edge changes (select, remove)
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

  return (
    <div style={{ width: '100%', height: '100%' }} className="bg-muted/40 dark:bg-card">
      <ReactFlow 
        nodes={nodes} // Use state 
        edges={edges} // Use state
        onNodesChange={onNodesChange} // Handle node changes
        onEdgesChange={onEdgesChange} // Handle edge changes
        nodeTypes={memoizedNodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CanvasArea;
