import React, { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToolNodeData, ToolParameter } from '@/types'; // Import shared types

// Custom Node Component for Tools
// Using React.memo for performance optimization
export const ToolNode = memo(({ id, data }: NodeProps<ToolNodeData>) => {

    // Callback to handle changes in input fields for parameters
    const onParamChange = useCallback((paramId: string, paramType: 'inputs' | 'outputs', value: string | number | boolean) => {
        // Call the onChange function injected into the node data by WorkflowPopup (via WorkflowEditor)
        if (data.onChange) {
            const updatedParams = data[paramType].map(p =>
                p.id === paramId ? { ...p, value: value } : p
            );
            // Update the specific part ('inputs' or 'outputs') of the node's data
            data.onChange(id, { [paramType]: updatedParams });
        }
    }, [id, data]); // Dependencies: node id and data object (containing onChange)

    // Helper function to render parameter inputs
    const renderParameter = (param: ToolParameter, type: 'inputs' | 'outputs') => (
        // Relative positioning needed for Handles inside this div
        <div key={param.id} className="mb-2 relative pt-1 pb-1 pl-3 pr-3"> {/* Added padding */}
            <Label htmlFor={`${id}-${param.id}`} className="text-xs font-medium text-gray-600 block mb-1"> {/* Added block and margin */}
                {param.name} ({param.type})
            </Label>
            <Input
                id={`${id}-${param.id}`}
                type={param.type === 'number' ? 'number' : 'text'} // Basic type handling
                value={param.value ?? ''} // Handle null/undefined values
                onChange={(e) => onParamChange(param.id, type, e.target.value)}
                className="h-8 text-sm" // Removed mt-1
                placeholder={param.description || param.type}
                // Example: Disable output parameter inputs
                disabled={type === 'outputs'}
            />
            {/* Render Handle for this parameter - positioned absolutely within the relative parent */}
            <Handle
                type={type === 'inputs' ? 'target' : 'source'}
                position={type === 'inputs' ? Position.Left : Position.Right}
                id={param.id} // Use parameter ID as handle ID
                // Style the handle to be vertically centered relative to the input area
                style={{
                    position: 'absolute',
                    top: '50%', // Center vertically
                    transform: 'translateY(-50%)', // Adjust for handle height
                    background: '#555',
                    height: '8px',
                    width: '8px',
                    // Adjust left/right positioning if needed
                    left: type === 'inputs' ? '-4px' : undefined,
                    right: type === 'outputs' ? '-4px' : undefined,
                }}
                isConnectable={true}
            />
        </div>
    );

    return (
        <Card className="w-64 shadow-md border border-gray-300 rounded-lg bg-white">
            <CardHeader className="p-3 bg-gray-100 border-b rounded-t-lg">
                <CardTitle className="text-sm font-semibold">{data.name}</CardTitle>
                {/* <CardDescription className="text-xs text-gray-500">{data.description}</CardDescription> */}
            </CardHeader>
            <CardContent className="p-3 text-xs"> {/* Removed relative positioning here */}
                {/* Input Parameters */}
                {data.inputs.length > 0 && (
                    <div className="mb-2"> {/* Group inputs */}
                        <p className="text-xs font-medium mb-1 text-gray-700">Inputs</p>
                        {data.inputs.map(param => renderParameter(param, 'inputs'))}
                    </div>
                )}

                {/* Separator */}
                {data.inputs.length > 0 && data.outputs.length > 0 && <Separator className="my-2" />}

                {/* Output Parameters */}
                {data.outputs.length > 0 && (
                    <div className="mt-2"> {/* Group outputs */}
                        <p className="text-xs font-medium mb-1 text-gray-700">Outputs</p>
                        {data.outputs.map(param => renderParameter(param, 'outputs'))}
                    </div>
                )}

                {/* Fallback Handles if no parameters (less critical now with per-parameter handles) */}
                {/*
         {data.inputs.length === 0 && (
            <Handle type="target" position={Position.Left} id="fallback-target" style={{ background: '#555' }} isConnectable={true} />
         )}
         {data.outputs.length === 0 && (
            <Handle type="source" position={Position.Right} id="fallback-source" style={{ background: '#555' }} isConnectable={true} />
         )}
         */}
            </CardContent>
            {/* Optional: Add status indicator */}
            {/* <div className={`absolute bottom-1 right-1 h-2 w-2 rounded-full ${data.status === 'success' ? 'bg-green-500' : data.status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`}></div> */}
        </Card>
    );
});

ToolNode.displayName = 'ToolNode'; // Set display name for DevTools