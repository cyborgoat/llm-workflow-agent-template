import React from "react";
import ChatHistory from "./ChatHistory";
import MemorySettings from "./MemorySettings";
import AppSettingsComponent from "./AppSettingsComponent";
import type {AppSettings, ChatTopic} from "../../types"; 
import {Separator} from "../ui/separator";
import { cn } from '@/lib/utils'; 

interface SidebarProps {
    settings: AppSettings;
    onToggleTheme: () => void;
    onSetModel: (model: string) => void;
    topics: ChatTopic[];
    activeTopic: string;
    onSelectTopic: (id: string) => void;
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
            <div className={cn("flex flex-col flex-1 overflow-y-auto space-y-4", isExpanded ? "w-full" : "w-auto")}>
                <ChatHistory 
                    topics={topics} 
                    activeTopic={activeTopic} 
                    onSelectTopic={onSelectTopic} 
                    isExpanded={isExpanded} 
                />
                <Separator/> 
                <MemorySettings isExpanded={isExpanded}/>  
                <Separator/>
            </div>
            <div className={cn("flex-shrink-0", isExpanded ? "w-full" : "w-auto")}>
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
