import React, { useState } from 'react';
import { ProjectExplorer } from './ProjectExplorer';
import { LiveCanvas } from './LiveCanvas';
import { GovernanceHUD } from './GovernanceHUD';
import { AuditModule } from './AuditModule';

export function Dashboard() {
    const [activeProject, setActiveProject] = useState<string | null>("Project Orbit");

    return (
        <div className="h-screen w-screen bg-background text-foreground flex overflow-hidden">
            {/* Left Pane: Project Explorer */}
            <div className="w-64 border-r border-border bg-card">
                <ProjectExplorer activeProject={activeProject} onSelect={setActiveProject} />
            </div>

            {/* Center Pane: Live Canvas */}
            <div className="flex-1 flex flex-col relative bg-zinc-50/50 dark:bg-zinc-950/50">
                <LiveCanvas activeProject={activeProject} />
            </div>

            {/* Right Pane: Governance HUD */}
            <div className="w-80 border-l border-border bg-card">
                <GovernanceHUD />
            </div>
        </div>
    );
}
