import React from 'react';
import { Activity, AlertOctagon, DollarSign, Bot, ArrowRight, UserCheck } from 'lucide-react';

export function AIOpsDashboard() {
    return (
        <div className="h-full bg-zinc-50 dark:bg-zinc-950 p-8 overflow-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">AIOps Traffic Controller</h1>
                    <p className="text-muted-foreground mt-1">The "Business Box" for your Agent Fleet.</p>
                </div>
                <div className="flex gap-4">
                    <StatusBadge label="System Status" status="Healthy" color="bg-emerald-500" />
                    <StatusBadge label="Active Agents" status="12 / 15" color="bg-blue-500" />
                </div>
            </header>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard
                    title="Agent Health Score"
                    value="88%"
                    sub="2 Loops Detected"
                    icon={Activity}
                    trend="down"
                />
                <MetricCard
                    title="Human Handoffs"
                    value="14"
                    sub="Last 24 Hours"
                    icon={UserCheck}
                    trend="up" // Bad trend
                />
                <MetricCard
                    title="Cost-Per-Success"
                    value="$0.42"
                    sub="vs $12.50 Human Equiv."
                    icon={DollarSign}
                    trend="flat"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* Main Panel: Agent Fleet Monitor */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm flex flex-col">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2"><Bot className="w-5 h-5" /> Live Agent Fleet</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">Updating live...</span>
                    </div>
                    <div className="flex-1 overflow-auto p-6 space-y-4">
                        <AgentRow name="CS_Tier1_Bot" role="Customer Support" status="running" uptime="99.9%" />
                        <AgentRow name="Sales_Outreach_V2" role="Lead Gen" status="looping" uptime="92.1%" alert />
                        <AgentRow name="Invoice_Parser_X" role="Finance Ops" status="running" uptime="99.5%" />
                        <AgentRow name="Creative_Drafter" role="Social Content" status="idle" uptime="100%" />
                    </div>
                </div>

                {/* Right Panel: The "Panic Button" / Handoff Triggers */}
                <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col">
                    <div className="p-6 border-b border-border">
                        <h3 className="font-bold flex items-center gap-2 text-destructive"><AlertOctagon className="w-5 h-5" /> Handoff Triggers</h3>
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm text-destructive">Sales_Outreach_V2</span>
                                <span className="text-[10px] text-muted-foreground">Now</span>
                            </div>
                            <p className="text-xs text-foreground mb-3">Agent is repeating the same "Value Prop" message 3x to Client #4092.</p>
                            <button className="w-full py-2 bg-white dark:bg-zinc-800 border border-border rounded text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2">
                                <UserCheck className="w-3 h-3" /> Intervene (Takeover)
                            </button>
                        </div>

                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg opacity-60">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm text-amber-600">CS_Tier1_Bot</span>
                                <span className="text-[10px] text-muted-foreground">14m ago</span>
                            </div>
                            <p className="text-xs text-foreground mb-3">Sentiment Score dropped below 0.3.</p>
                            <button disabled className="w-full py-2 bg-secondary/50 border border-transparent rounded text-xs font-bold flex items-center justify-center gap-2 text-muted-foreground">
                                Resolved by @SarahJ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, sub, icon: Icon, trend }: any) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded ${trend === 'up' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                            trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : // Context: Health down is bad
                                'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                        }`}>
                        {trend === 'up' ? '+12%' : trend === 'down' ? '-4%' : '+0%'}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
            <div className="text-sm text-muted-foreground">{sub}</div>
        </div>
    )
}

function AgentRow({ name, role, status, uptime, alert }: any) {
    return (
        <div className={`flex items-center justify-between p-4 rounded-lg border transition-all ${alert ? "bg-destructive/5 border-destructive/30" : "bg-secondary/30 border-transparent hover:border-border"
            }`}>
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-emerald-500 animate-pulse' :
                        status === 'looping' ? 'bg-destructive animate-ping' :
                            'bg-zinc-400'
                    }`} />
                <div>
                    <div className="font-bold text-sm">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-mono text-sm">{uptime}</div>
                <div className="text-[10px] uppercase font-bold opacity-60">{status}</div>
            </div>
        </div>
    )
}

function StatusBadge({ label, status, color }: any) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium">
            <span className="text-muted-foreground">{label}:</span>
            <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                <span className="font-bold">{status}</span>
            </div>
        </div>
    )
}
