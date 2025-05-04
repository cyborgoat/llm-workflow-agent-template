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
// Import React Flow handlers and types needed for state lifting
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
// Import shared types
import { WorkflowData, ToolNodeData } from '@/types';

// Define motion props for DialogContent
const dialogContentMotionProps = {
    initial: { scale: 0.95, opacity: 0, y: 10 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.95, opacity: 0, y: 10 },
    transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.2 }
};

interface WorkflowPopupProps {
    isOpen: boolean;
    onClose: () => void;
    workflowData: WorkflowData; // The *initial* workflow data when opened
    onSave: (workflow: WorkflowData) => void;
}

// ForwardRef required when applying motion props directly to Shadcn components
const MotionDialogContent = motion(DialogContent);

export function WorkflowPopup({ isOpen, onClose, workflowData, onSave }: WorkflowPopupProps) {
    // State lifted up from WorkflowEditor: holds the nodes/edges being edited
    const [editedNodes, setEditedNodes] = useState<Node<ToolNodeData>[]>([]);
    const [editedEdges, setEditedEdges] = useState<Edge[]>([]);

    // Callback function (to be injected into nodes) to handle data changes within a ToolNode
    const handleNodeDataChange = useCallback((nodeId: string, dataChanges: Partial<ToolNodeData>) => {
        setEditedNodes((currentNodes) =>
            currentNodes.map((node) => {
                if (node.id === nodeId) {
                    // Merge the changes into the existing node data
                    const newNodeData = { ...node.data, ...dataChanges };
                    return { ...node, data: newNodeData };
                }
                return node;
            })
        );
    }, []); // No dependencies needed as it only uses the setter

    // Effect to initialize/reset the edited state when the dialog opens or the initial data changes
    useEffect(() => {
        if (isOpen) {
            // Initialize nodes, injecting the onChange callback into each node's data
            setEditedNodes(workflowData.nodes.map(node => ({
                ...node,
                data: { ...node.data, onChange: handleNodeDataChange }
            })));
            setEditedEdges(workflowData.edges);
        }
        // Only reset when isOpen becomes true or the initial workflowData structure changes
    }, [isOpen, workflowData, handleNodeDataChange]);

    // --- React Flow Handlers (Lifted from WorkflowEditor) ---

    const onNodesChange: OnNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setEditedNodes((nds) => applyNodeChanges(changes, nds.map(n => ({ ...n, data: { ...n.data, onChange: handleNodeDataChange } }))));
        },
        [handleNodeDataChange] // Ensure latest callback is used
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
    // --- End React Flow Handlers ---


    // Handler for the Save button
    const handleInternalSave = useCallback(() => {
        // Prepare the final data to save (remove the injected onChange)
        const nodesToSave = editedNodes.map(({ data, ...rest }) => {
            const { onChange, ...dataToSave } = data; // Destructure to remove onChange
            return { ...rest, data: dataToSave };
        });
        // Call the parent's onSave with the cleaned nodes and current edges
        onSave({ nodes: nodesToSave, edges: editedEdges });
    }, [editedNodes, editedEdges, onSave]);

    // Handler for the Cancel button - directly calls the onClose prop from parent
    const handleCancel = useCallback(() => {
        onClose();
    }, [onClose]);


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
                        onInteractOutside={(e) => {
                            const target = e.target as HTMLElement;
                            if (target.closest('.react-flow')) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <DialogHeader className="p-6 border-b flex-shrink-0">
                            <DialogTitle>Workflow Editor</DialogTitle>
                            <DialogDescription>
                                View and modify the agent's planned workflow. Drag nodes and edit parameters.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Editor Container */}
                        <div className="flex-grow my-0 overflow-hidden min-h-0">
                            {/* Pass lifted state and handlers down to WorkflowEditor */}
                            <WorkflowEditor
                                key={JSON.stringify(workflowData.nodes.map(n => n.id).join('-'))} // Key based on initial node IDs
                                nodes={editedNodes}
                                edges={editedEdges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                // Removed onChange prop as state is lifted
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
// --- End of components/WorkflowPopup.tsx ---

