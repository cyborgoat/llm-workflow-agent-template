import React, { useState, useEffect, useRef } from "react";
import type {AppSettings} from "@/types";
import {Tooltip, TooltipContent, TooltipTrigger} from "../ui/tooltip";
import { cn } from '@/lib/utils';

const statusDetails: Record<string, { label: string; ok: string; down: string }> = {
    llm: {
        label: 'Model',
        ok: 'Model is online and ready.',
        down: 'Model is unavailable.'
    },
    tool: {
        label: 'Tools',
        ok: 'All tools are operational.',
        down: 'Some tools are offline.'
    },
    sensor: {
        label: 'Sensors',
        ok: 'Sensors are active.',
        down: 'Sensors are not responding.'
    }
};

type Status = 'active' | 'inactive';

const StatusDot: React.FC<{ status: Status; color?: string }> = ({status, color}) => {
    const [applyShine, setApplyShine] = useState(false);
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) {
            setApplyShine(true);
            const timer = setTimeout(() => {
                setApplyShine(false);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            isMounted.current = true;
        }
    }, [status]);

    return (
        <span
            className={cn(
              "inline-block w-3 h-3 rounded-full mr-1",
              "transition-colors duration-300 ease-in-out",
              "transform-gpu",
              status === "active" ? `${color || 'bg-green-500'} animate-pulse` : 'bg-gray-400',
              "transition-transform duration-200 ease-in-out group-hover:scale-125",
              applyShine && 'animate-shine'
            )}
        />
    );
};

const StatusIndicators: React.FC<{ settings: AppSettings }> = ({settings}) => {
    const [llmSimulatedStatus, setLlmSimulatedStatus] = useState<Status>(settings.llmStatus); 
    const [toolSimulatedStatus, setToolSimulatedStatus] = useState<Status>(settings.toolStatus);
    const [sensorSimulatedStatus, setSensorSimulatedStatus] = useState<Status>(settings.sensorStatus);

    useEffect(() => {
        const possibleStatuses: Status[] = ['active', 'inactive'];
        const intervalId = setInterval(() => {
            setLlmSimulatedStatus(possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)]);
            setToolSimulatedStatus(possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)]);
            setSensorSimulatedStatus(possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)]);
        }, 2500); 

        return () => clearInterval(intervalId);
    }, []); 

    return (
    <div className="flex gap-5 text-xs items-center">
        {/* Model/LLM */}
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="flex items-center gap-1 group cursor-pointer">
                  <StatusDot status={llmSimulatedStatus} color="bg-green-500"/> 
                  <span className="font-medium">{statusDetails.llm.label}</span>
                </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                {llmSimulatedStatus === 'active' ? statusDetails.llm.ok : statusDetails.llm.down}
            </TooltipContent>
        </Tooltip>
        {/* Tools */}
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="flex items-center gap-1 group cursor-pointer">
                    <StatusDot status={toolSimulatedStatus} color="bg-blue-500"/> 
                    <span className="font-medium">{statusDetails.tool.label}</span>
                </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                {toolSimulatedStatus === 'active' ? statusDetails.tool.ok : statusDetails.tool.down}
            </TooltipContent>
        </Tooltip>
        {/* Sensors */}
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="flex items-center gap-1 group cursor-pointer">
                    <StatusDot status={sensorSimulatedStatus} color="bg-yellow-400"/> 
                    <span className="font-medium">{statusDetails.sensor.label}</span>
                </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                {sensorSimulatedStatus === 'active' ? statusDetails.sensor.ok : statusDetails.sensor.down}
            </TooltipContent>
        </Tooltip>
    </div>
    );
};

export default StatusIndicators;
