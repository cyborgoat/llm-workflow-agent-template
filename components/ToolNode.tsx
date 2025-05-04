import React, { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToolNodeData, ToolParameter } from '@/types'; // Import shared types


export const ToolNode = memo(({ id, data }: NodeProps<ToolNodeData>) => {


    const onParamChange = useCallback((paramId: string, paramType: 'inputs' | 'outputs', value: string | number | boolean) => {

        if (data.onChange) {
            const updatedParams = data[paramType].map(p =>
                p.id === paramId ? { ...p, value: value } : p
            );

            data.onChange(id, { [paramType]: updatedParams });
        }
    }, [id, data]);


    const renderParameter = (param: ToolParameter, type: 'inputs' | 'outputs') => (

        <div key={param.id} className="mb-2 relative pt-1 pb-1 pl-3 pr-3"> {/* Added padding */}
            <Label htmlFor={`${id}-${param.id}`} className="text-xs font-medium text-gray-600 block mb-1"> {/* Added block and margin */}
                {param.name} ({param.type})
            </Label>
            <Input
                id={`${id}-${param.id}`}
                type={param.type === 'number' ? 'number' : 'text'}
                value={param.value ?? ''}
                onChange={(e) => onParamChange(param.id, type, e.target.value)}
                className="h-8 text-sm" // Removed mt-1
                placeholder={param.description || param.type}

                disabled={type === 'outputs'}
            />
            {/* Render Handle for this parameter - positioned absolutely within the relative parent */}
            <Handle
                type={type === 'inputs' ? 'target' : 'source'}
                position={type === 'inputs' ? Position.Left : Position.Right}
                id={param.id} // Use parameter ID as handle ID

                style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#555',
                    height: '8px',
                    width: '8px',

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

            </CardHeader>
            <CardContent className="p-3 text-xs">

                {data.inputs.length > 0 && (
                    <div className="mb-2">
                        <p className="text-xs font-medium mb-1 text-gray-700">Inputs</p>
                        {data.inputs.map(param => renderParameter(param, 'inputs'))}
                    </div>
                )}


                {data.inputs.length > 0 && data.outputs.length > 0 && <Separator className="my-2" />}


                {data.outputs.length > 0 && (
                    <div className="mt-2">
                        <p className="text-xs font-medium mb-1 text-gray-700">Outputs</p>
                        {data.outputs.map(param => renderParameter(param, 'outputs'))}
                    </div>
                )}


            </CardContent>

        </Card>
    );
});

ToolNode.displayName = 'ToolNode'; // Set display name for DevTools