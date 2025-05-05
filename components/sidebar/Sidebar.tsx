import React from "react";
import ChatHistory from "./ChatHistory";
import MemorySettings from "./MemorySettings";
import AppSettingsComponent from "./AppSettingsComponent";
import type { AppSettings, ChatTopic } from "../../types";
import { Separator } from "../ui/separator";

interface SidebarProps {
  settings: AppSettings;
  onToggleTheme: () => void;
  onSetModel: (model: string) => void;
  topics: ChatTopic[];
  activeTopic: string;
  onSelectTopic: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  settings,
  onToggleTheme,
  onSetModel,
  topics,
  activeTopic,
  onSelectTopic,
}) => {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 border-r bg-muted/40 dark:bg-card shrink-0 h-full p-4">
      <div className="flex flex-col flex-1 overflow-y-auto space-y-4">
        <ChatHistory topics={topics} activeTopic={activeTopic} onSelectTopic={onSelectTopic} />
        <Separator />
        <MemorySettings />
        <Separator />
      </div>
      <div className="flex-shrink-0">
        <AppSettingsComponent
          settings={settings}
          onToggleTheme={onToggleTheme}
          onSetModel={onSetModel}
        />
      </div>
    </aside>
  );
};

export default Sidebar;

