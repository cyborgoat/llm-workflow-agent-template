import React from "react";
import ChatHistory from "./ChatHistory";
import MemorySettings from "./MemorySettings";
import AppSettingsComponent from "./AppSettingsComponent";
import type {AppSettings, ChatTopic} from "@/types";
import { cn } from '@/lib/utils'; 
import { Button } from "../ui/button"; 
import { PlusSquare } from 'lucide-react'; 
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"; 

interface SidebarProps {
    settings: AppSettings;
    onToggleTheme: () => void;
    onSetModel: (model: string) => void;
    topics: ChatTopic[];
    activeTopic: string | null;
    onSelectTopic: (id: string | null) => void;
    settingsPopoverOpen: boolean;
    onSettingsPopoverOpenChange: (open: boolean) => void;
    isExpanded?: boolean; 
}

const Sidebar: React.FC<SidebarProps> = ({
                                             settings,
                                             onToggleTheme,
                                             onSetModel,
                                             topics,
                                             activeTopic,
                                             onSelectTopic,
                                             settingsPopoverOpen,
                                             onSettingsPopoverOpenChange,
                                             isExpanded = true, 
                                         }) => {
    return (
        <aside
            className={cn(
                "hidden md:flex md:flex-col border-r bg-muted/40 dark:bg-card shrink-0 h-full",
                isExpanded ? "md:w-64 lg:w-72 p-4" : "md:w-16 p-2 items-center" 
            )}
        >
            {/* Add New Chat Button - Top Level */} 
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={activeTopic === null ? "secondary" : "ghost"} 
                        className={cn(
                            "w-full mb-4", 
                            isExpanded ? "justify-start px-3 py-2" : "justify-center p-2"
                        )}
                        onClick={() => onSelectTopic(null)} 
                        aria-label="Start new chat"
                    >
                        <PlusSquare className={cn("h-4 w-4", isExpanded ? "mr-2" : "mr-0")} />
                        {isExpanded && <span className="text-sm">New Chat</span>}
                    </Button>
                </TooltipTrigger>
                {!isExpanded && (
                    <TooltipContent side="right" sideOffset={5}>
                        Start new chat
                    </TooltipContent>
                )}
            </Tooltip>

            <div className={cn("flex flex-col flex-1 overflow-y-auto space-y-4", isExpanded ? "w-full" : "w-auto")}>
                <ChatHistory 
                    topics={topics} 
                    activeTopic={activeTopic} 
                    onSelectTopic={onSelectTopic} 
                    isExpanded={isExpanded} 
                />
                <MemorySettings isExpanded={isExpanded}/>  
            </div>
            <div className={cn("flex-shrink-0 mt-auto", isExpanded ? "w-full" : "w-auto")}> 
                <AppSettingsComponent
                    settings={settings}
                    onToggleTheme={onToggleTheme}
                    onSetModel={onSetModel}
                    open={settingsPopoverOpen}
                    onOpenChange={onSettingsPopoverOpenChange}
                    isExpanded={isExpanded} 
                />
            </div>
        </aside>
    );
};

export default Sidebar;
