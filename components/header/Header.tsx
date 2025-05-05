import React from "react";
import { Unplug } from "lucide-react";
import StatusIndicators from "./StatusIndicators";
import ScrollingMessages from "./ScrollingMessages";
import type {AppSettings} from "@/types";

const Header: React.FC<{ settings: AppSettings }> = ({settings}) => {
    return (
        <header
            className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6 sticky top-0 z-10">
            <div className="flex items-center gap-2 font-semibold text-lg">
                <Unplug className="w-6 h-6" />
                Awesome Agent
            </div>
            <div className="flex-1 flex justify-center">
                <ScrollingMessages/>
            </div>
            <StatusIndicators settings={settings}/>
        </header>
    );
};

export default Header;

