import React from 'react';
import { Bot, FileCode, Play, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LiveCanvasProps {
    activeProject: string | null;
}

export function LiveCanvas({ activeProject }: LiveCanvasProps) {
    return (
        <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{activeProject}</h1>
                    <p className="text-muted-foreground mt-2">Mission Control Active: Orchestrating 4 Agents</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background/50 p-6 rounded-xl border border-dashed border-border">
                    {/* Agent Card: Analyst */}
                    <AgentCard
                        name="Analyst Agent"
                        role="Research & Verification"
                        status="Complete"
                        icon={Bot}
                        color="bg-blue-500"
                    >
                        <div className="text-xs space-y-2 mt-4 text-muted-foreground">
                            <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Scraped SEC Filings (FY2025)</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Analyzed Competitor Supply Chains</div>
                        </div>
                    </AgentCard>

                    {/* Agent Card: Writer */}
                    <AgentCard
                        name="Writer Agent"
                        role="PhD Architect Persona"
                        status="Processing"
                        icon={FileCode}
                        color="bg-purple-500"
                    >
                        <div className="text-xs space-y-2 mt-4 text-foreground">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" /> Drafting Keynote (Section 2/5)
                            </div>
                            <div className="p-2 bg-muted rounded border text-[10px] font-mono opacity-75">
                                "The shift from predictive to agentic workflows represents..."
                            </div>
                        </div>
                    </AgentCard>

                    {/* Agent Card: Designer */}
                    <AgentCard
                        name="Designer Agent"
                        role="Visual Artifacts"
                        status="Waiting"
                        icon={FileCode}
                        color="bg-pink-500"
                    >
                        <div className="text-xs space-y-2 mt-4 text-muted-foreground">
                            <span className="italic">Waiting for Writer Draft...</span>
                        </div>
                    </AgentCard>
                </div>
            </div>
        </div>
    );
}

function AgentCard({ name, role, status, icon: Icon, color, children }: any) {
    return (
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-md", color, "bg-opacity-10 text-opacity-100")}>
                        <Icon className={cn("w-5 h-5", color.replace("bg-", "text-"))} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">{name}</h3>
                        <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                </div>
                <span className={cn(
                    "text-[10px] uppercase font-bold px-2 py-1 rounded-full",
                    status === "Complete" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        status === "Processing" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                            "bg-secondary text-muted-foreground"
                )}>
                    {status}
                </span>
            </div>
            {children}
        </div>
    )
}
