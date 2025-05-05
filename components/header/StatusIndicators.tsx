import React from "react";
import type { AppSettings } from "../../types";

const StatusDot: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-block w-3 h-3 rounded-full mr-1 ${
      status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-400"
    }`}
  />
);

const StatusIndicators: React.FC<{ settings: AppSettings }> = ({ settings }) => (
  <div className="flex gap-4 text-xs items-center">
    <span><StatusDot status={settings.llmStatus} />LLM</span>
    <span><StatusDot status={settings.sensorStatus} />Sensor</span>
    <span><StatusDot status={settings.toolStatus} />Tool</span>
  </div>
);

export default StatusIndicators;

