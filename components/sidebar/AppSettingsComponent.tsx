import React from "react";
import {Eye, EyeOff, Moon, Settings, Sun} from "lucide-react";
import type {AppSettings} from "../../types";
import {Switch} from "../ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Input} from "../ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";

interface AppSettingsComponentProps {
    settings: AppSettings;
    onToggleTheme: () => void;
    onSetModel: (model: string) => void;
}

interface ControlledAppSettingsComponentProps extends AppSettingsComponentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AppSettingsComponent: React.FC<ControlledAppSettingsComponentProps> = ({
                                                                                 settings,
                                                                                 onToggleTheme,
                                                                                 onSetModel,
                                                                                 open,
                                                                                 onOpenChange
                                                                             }) => {
    const models = ["gemini-pro", "claude-3-opus", "gpt-4-turbo"];
    const [apiKey, setApiKey] = React.useState("");
    const [showApiKey, setShowApiKey] = React.useState(false);
    // Restore default popover behavior: close on outside click
    const popoverContentProps = {side: "top" as const, className: "w-72", align: "center" as const};

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <button
                    className="flex w-full items-center justify-between p-0 text-sm font-medium text-left hover:bg-accent rounded-md transition-colors"
                    aria-label="Open settings"
                >
                    <div className="flex items-center">
                        <Settings className="mr-2 h-4 w-4"/>
                        Settings
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent {...popoverContentProps}>
                <div className="space-y-4 px-1 pt-1">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="theme-toggle" className="text-sm flex items-center">
                            {settings.theme === 'light' ? <Sun className="mr-2 h-4 w-4"/> :
                                <Moon className="mr-2 h-4 w-4"/>}
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
                            <SelectTrigger className="w-full">
                                <SelectValue>{settings.model}</SelectValue>
                            </SelectTrigger>
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
                        <div className="relative flex items-center">
                            <Input
                                id="api-key"
                                type={showApiKey ? "text" : "password"}
                                placeholder="Enter your API key"
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                                autoComplete="off"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                aria-label={showApiKey ? "Hide API key" : "Show API key"}
                                onClick={() => setShowApiKey((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                                tabIndex={0}
                            >
                                {showApiKey ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default AppSettingsComponent;

