import React, { useState } from 'react';
import { ProjectExplorer } from './ProjectExplorer';
import { GovernanceHUD } from './GovernanceHUD';
import { Plus, Search, Filter, Briefcase, ArrowRight, UserCircle, Calendar, AlertCircle } from 'lucide-react';

export function Dashboard() {
    // Real "Engagement" Data - No fake agents
    const [clients] = useState([
        { id: 1, name: "Northwind Traders", industry: "Logistics", phase: "Phase 3: Content", status: "Active", risk: "Low", lastActive: "2h ago" },
        { id: 2, name: "Acme Corp", industry: "Manufacturing", phase: "Phase 1: Discovery", status: "Onboarding", risk: "High", lastActive: "1d ago" },
        { id: 3, name: "Contoso Finance", industry: "FinTech", phase: "Phase 2: Audit", status: "Review", risk: "Medium", lastActive: "4h ago" },
    ]);

    const [filter, setFilter] = useState('');

    return (
        <div className="h-screen w-screen bg-background text-foreground flex overflow-hidden">
            {/* Left Pane: Project Explorer (Preserved for folder nav if needed, or we can minimize) */}
            <div className="w-64 border-r border-border bg-card hidden md:block">
                <ProjectExplorer activeProject="Home" onSelect={() => { }} />
            </div>

            {/* Center Pane: Engagement Hub */}
            <div className="flex-1 flex flex-col relative bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden">
                <header className="px-8 py-8 border-b border-border bg-card">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Engagement Hub</h1>
                            <p className="text-muted-foreground text-sm mt-1">Manage your active client portfolios and consulting phases.</p>
                        </div>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            <Plus className="w-4 h-4" /> New Engagement
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <input
                                className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Search clients, industries, or phases..."
                            />
                        </div>
                        <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary flex items-center gap-2 text-sm font-medium">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>
                </header>

                <div className="p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Client Cards */}
                        {clients.map(client => (
                            <div key={client.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer border-t-4" style={{ borderTopColor: client.risk === 'High' ? '#ef4444' : client.risk === 'Medium' ? '#f59e0b' : '#10b981' }}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{client.name}</h3>
                                            <p className="text-xs text-muted-foreground">{client.industry}</p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${client.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                            client.status === 'Onboarding' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {client.status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                                        <span className="text-muted-foreground flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Current Phase</span>
                                        <span className="font-medium">{client.phase}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2"><UserCircle className="w-3 h-3" /> Lead Consultant</span>
                                        <span className="font-medium">You</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-3 h-3" /> Last Active</span>
                                        <span className="font-mono text-xs">{client.lastActive}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                    {client.risk === 'High' && (
                                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                                            <AlertCircle className="w-3 h-3" /> High Risk Detected
                                        </div>
                                    )}
                                    {client.risk !== 'High' && <div />}

                                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                        Open Dashboard <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add New Card */}
                        <button className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all gap-4 h-full min-h-[250px]">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-bold">Initialize New Client</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Pane: Governance HUD */}
            <div className="w-80 border-l border-border bg-card hidden xl:block">
                <GovernanceHUD />
            </div>
        </div>
    );
}
