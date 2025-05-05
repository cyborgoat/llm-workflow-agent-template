import React from "react";
import { Settings, Sun, Moon } from "lucide-react";
import type { AppSettings } from "../../types";
import { Switch } from "../ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Input } from "../ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

interface AppSettingsComponentProps {
  settings: AppSettings;
  onToggleTheme: () => void;
  onSetModel: (model: string) => void;
}

const AppSettingsComponent: React.FC<AppSettingsComponentProps> = ({ settings, onToggleTheme, onSetModel }) => {
  const models = ["gemini-pro", "claude-3-opus", "gpt-4-turbo"];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-left hover:bg-accent rounded-md transition-colors"
        >
          <div className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="w-72">
        <div className="space-y-4 px-1 pt-1">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <label htmlFor="theme-toggle" className="text-sm flex items-center">
              {settings.theme === 'light' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              Theme
            </label>
            <Switch
              checked={settings.theme === 'dark'}
              onCheckedChange={onToggleTheme}
              id="theme-toggle"
            />
          </div>
          {/* Model Selector */}
          <div className="space-y-1">
            <label htmlFor="model-select" className="text-sm font-medium">LLM Model</label>
            <Select value={settings.model} onValueChange={onSetModel}>
              <SelectTrigger className="w-full" />
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Example API Key input */}
          <div className="space-y-1">
            <label htmlFor="api-key" className="text-sm font-medium">API Key (Example)</label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key"
            />
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default AppSettingsComponent;

