import React, { memo, useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

// Define the structure of the data object for our custom node
export interface WorkflowNodeData {
    name: string;
    description?: string;
    inputs?: { name: string; type: string; }[];
    outputs?: { name: string; type: string; }[];
    icon?: React.ReactNode; // Optional icon like lucide-react
    status?: 'pending' | 'running' | 'success' | 'error'; // Optional status indicator
}

// Extend React Flow's NodeProps with our custom data type
type WorkflowNodeProps = NodeProps<WorkflowNodeData>;

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ id, data, isConnectable, selected }) => {
    const { name, description, inputs, outputs, icon, status } = data;
    const [isEditing, setIsEditing] = useState(false);
    const [nodeName, setNodeName] = useState(name);
    const { setNodes } = useReactFlow();

    useEffect(() => {
        setNodeName(name);
    }, [name]);

    const finishEditing = useCallback(() => {
        setIsEditing(false);
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, name: nodeName } };
                }
                return node;
            })
        );
    }, [id, nodeName, setNodes]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            finishEditing();
        }
    };

    const getStatusBorderColor = () => {
        switch (status) {
            case 'running': return 'border-blue-500';
            case 'success': return 'border-green-500';
            case 'error': return 'border-destructive';
            default: return selected ? 'border-primary' : 'border-border';
        }
    };

    return (
        <Card 
            className={`w-64 shadow-md ${getStatusBorderColor()} border-2 bg-card`}
            onDoubleClick={() => setIsEditing(true)}
        >
            {/* Target Handle (Incoming Connections) */}
            <Handle
                type="target"
                position={Position.Top}
                id="top-target"
                isConnectable={isConnectable}
                className="!bg-primary w-2 h-2"
            />
            <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                isConnectable={isConnectable}
                className="!bg-primary w-2 h-2"
            />

            <CardHeader className="p-3">
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                         {icon && <div className="text-muted-foreground mr-1">{icon}</div>}
                         {isEditing ? (
                            <Input 
                                value={nodeName}
                                onChange={(e) => setNodeName(e.target.value)}
                                onBlur={finishEditing}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="h-7 text-sm py-1 px-2" 
                            />
                         ) : (
                            <CardTitle className="text-sm font-medium">{nodeName}</CardTitle>
                         )}
                    </div>
                   {status && <Badge variant={status === 'error' ? 'destructive' : status === 'success' ? 'default' : 'secondary'} className="text-xs">{status}</Badge>}
                </div>
                {description && <CardDescription className="pt-1 text-xs">{description}</CardDescription>}
            </CardHeader>

            {(inputs && inputs.length > 0) || (outputs && outputs.length > 0) ? (
                 <CardContent className="p-3 pt-0">
                    {inputs && inputs.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">INPUTS</p>
                            <Separator className="mb-1"/>
                            {inputs.map((input, index) => (
                                <div key={`input-${index}`} className="flex justify-between items-center text-xs mb-1">
                                    <span>{input.name}</span>
                                    <Badge variant="outline" className="px-1 py-0 text-xs">{input.type}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                     {outputs && outputs.length > 0 && (
                        <div>
                             <p className="text-xs font-semibold text-muted-foreground mb-1">OUTPUTS</p>
                             <Separator className="mb-1"/>
                             {outputs.map((output, index) => (
                                <div key={`output-${index}`} className="flex justify-between items-center text-xs mb-1">
                                    <span>{output.name}</span>
                                    <Badge variant="outline" className="px-1 py-0 text-xs">{output.type}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            ) : null}

            {/* Source Handles (Outgoing Connections) */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom-source"
                isConnectable={isConnectable}
                 className="!bg-primary w-2 h-2"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right-source"
                isConnectable={isConnectable}
                 className="!bg-primary w-2 h-2"
            />
        </Card>
    );
};

// Use memo for performance optimization
export default memo(WorkflowNode);
