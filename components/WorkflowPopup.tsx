import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { WorkflowEditor } from './WorkflowEditor';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    NodeChange,
    EdgeChange,
    Connection,
} from '@xyflow/react';
import { WorkflowData, ToolNodeData } from '@/types';


const dialogContentMotionProps = {
    initial: { scale: 0.95, opacity: 0, y: 10 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.95, opacity: 0, y: 10 },
    transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.2 }
};

interface WorkflowPopupProps {
    isOpen: boolean;
    onClose: () => void;
    initialWorkflow: WorkflowData; 
    onSave: (workflow: WorkflowData) => void;
}

const MotionDialogContent = motion(DialogContent);

export function WorkflowPopup({ isOpen, onClose, initialWorkflow, onSave }: WorkflowPopupProps) {

    const [editedNodes, setEditedNodes] = useState<Node<ToolNodeData>[]>([]);
    const [editedEdges, setEditedEdges] = useState<Edge[]>([]);

    const handleNodeDataChange = useCallback((nodeId: string, dataChanges: Partial<ToolNodeData>) => {
        setEditedNodes((currentNodes) =>
            currentNodes.map((node) => {
                if (node.id === nodeId) {
                    const newNodeData = { ...node.data, ...dataChanges };
                    return { ...node, data: newNodeData };
                }
                return node;
            })
        );
    }, []);

    useEffect(() => {
        if (isOpen) {
            setEditedNodes(initialWorkflow.nodes.map(node => ({
                ...node,
                data: { ...node.data, onChange: handleNodeDataChange }
            })));
            setEditedEdges(initialWorkflow.edges);
        }
    }, [isOpen, initialWorkflow, handleNodeDataChange]);

    const onNodesChange: OnNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setEditedNodes((nds) => applyNodeChanges(changes, nds.map(n => ({ ...n, data: { ...n.data, onChange: handleNodeDataChange } }))));
        },
        [handleNodeDataChange]
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEditedEdges((eds) => applyEdgeChanges(changes, eds));
        },
        []
    );

    const onConnect: OnConnect = useCallback(
        (connection: Connection) => {
            if (connection.source && connection.target) {
                const newEdge = {
                    ...connection,
                    id: `e-${connection.source}${connection.sourceHandle || ''}-${connection.target}${connection.targetHandle || ''}-${Math.random().toString(16).slice(2)}`,
                    animated: true,
                };
                setEditedEdges((eds) => addEdge(newEdge, eds));
            }
        },
        []
    );

    const handleInternalSave = useCallback(() => {
        const nodesToSave = editedNodes.map(({ data, ...rest }) => {
            const { onChange, ...dataToSave } = data; 
            return { ...rest, data: dataToSave };
        });
        onSave({ nodes: nodesToSave, edges: editedEdges });
        onClose(); 
    }, [editedNodes, editedEdges, onSave, onClose]); 

    const handleCancel = useCallback(() => {
        onClose();
    }, [onClose]); 

    const handleInteractOutside = useCallback((e: Event) => {
        const target = e.target as HTMLElement;
        if (target.closest('.react-flow')) {
            e.preventDefault(); 
        }
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={(openState) => {
                    if (!openState) {
                        onClose();
                    }
                }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        style={{ pointerEvents: 'auto' }} 
                    />
                    <MotionDialogContent
                        className="sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] h-[80vh] flex flex-col z-50 p-0 bg-white rounded-lg shadow-xl overflow-hidden"
                        {...dialogContentMotionProps}
                        onInteractOutside={handleInteractOutside} 
                    >
                        <DialogHeader className="p-6 border-b flex-shrink-0">
                            <DialogTitle>Workflow Editor</DialogTitle>
                            <DialogDescription>
                                View and modify the agent's planned workflow. Drag nodes and edit parameters.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-grow my-0 overflow-hidden min-h-0">
                            <WorkflowEditor
                                key={initialWorkflow.nodes.map(n => n.id).join('-')}
                                nodes={editedNodes} 
                                edges={editedEdges} 
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                            />
                        </div>

                        <DialogFooter className="p-6 border-t bg-gray-50 flex-shrink-0">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleInternalSave}>Save Changes</Button>
                        </DialogFooter>
                    </MotionDialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
