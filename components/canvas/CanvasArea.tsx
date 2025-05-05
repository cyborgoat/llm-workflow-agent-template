import * as React from 'react';
import { useMemo, useState, useCallback, useEffect } from 'react';
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

import WorkflowNodeComponent from './WorkflowNode';
import type { WorkflowNodeData, WorkflowNode } from '../../mock/mockData';

const nodeTypes = {
  workflow: WorkflowNodeComponent,
};

import { loadWorkflowDiagram, WorkflowDiagram } from '../../mock/mockData';

// Icon mapping for WorkflowNodeData.iconKey
const iconMap: Record<string, React.ReactElement> = {
  MessageSquare: <MessageSquare size={16} />,
  Bot: <Bot size={16} />,
  Wrench: <Wrench size={16} />,
  CheckCircle: <CheckCircle size={16} />,
};

interface CanvasAreaProps {
  topicId?: string;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ topicId }) => {
  const [workflow, setWorkflow] = useState<WorkflowDiagram | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topicId) return;
    setLoading(true);
    setError(null);
    loadWorkflowDiagram(topicId)
      .then(data => {
        setWorkflow(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [topicId]);

  const processedNodes = useMemo(
    () =>
      workflow
        ? workflow.nodes.map((node: WorkflowNode) => ({
            ...node,
            data: {
              ...node.data,
              icon: node.data.iconKey ? iconMap[node.data.iconKey] : undefined,
            },
          }))
        : [],
    [workflow]
  );
  const processedEdges = useMemo(() => (workflow ? workflow.edges : []), [workflow]);

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>(processedNodes);
  const [edges, setEdges] = useState<Edge[]>(processedEdges);

  useEffect(() => {
    setNodes(processedNodes);
    setEdges(processedEdges);
  }, [processedNodes, processedEdges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  if (loading) return <div>Loading workflow diagram...</div>;
  if (error) return <div>Error loading workflow: {error}</div>;
  if (!workflow) return <div>No workflow diagram found.</div>;
    // Memoize nodeTypes to prevent unnecessary re-renders

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
