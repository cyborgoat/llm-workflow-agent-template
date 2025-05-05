import React from "react";
import type { AppSettings } from "../../types";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

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

const StatusDot: React.FC<{ status: string; color?: string }> = ({ status, color }) => (
  <span
    className={`inline-block w-3 h-3 rounded-full transition-transform duration-200 mr-1 ${
      status === "active" ? `${color || 'bg-green-500'} animate-pulse` : 'bg-gray-400'
    } group-hover:scale-125`}
  />
);

const StatusIndicators: React.FC<{ settings: AppSettings }> = ({ settings }) => (
  <div className="flex gap-5 text-xs items-center">
    {/* Model/LLM */}
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center gap-1 group cursor-pointer">
          <StatusDot status={settings.llmStatus} color="bg-green-500" />
          <span className="font-medium">{statusDetails.llm.label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {settings.llmStatus === 'active' ? statusDetails.llm.ok : statusDetails.llm.down}
      </TooltipContent>
    </Tooltip>
    {/* Tools */}
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center gap-1 group cursor-pointer">
          <StatusDot status={settings.toolStatus} color="bg-blue-500" />
          <span className="font-medium">{statusDetails.tool.label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {settings.toolStatus === 'active' ? statusDetails.tool.ok : statusDetails.tool.down}
      </TooltipContent>
    </Tooltip>
    {/* Sensors */}
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center gap-1 group cursor-pointer">
          <StatusDot status={settings.sensorStatus} color="bg-yellow-400" />
          <span className="font-medium">{statusDetails.sensor.label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {settings.sensorStatus === 'active' ? statusDetails.sensor.ok : statusDetails.sensor.down}
      </TooltipContent>
    </Tooltip>
  </div>
);

export default StatusIndicators;

