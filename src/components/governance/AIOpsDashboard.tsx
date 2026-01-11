import { useEffect, useState } from 'react';
import { useClient } from '../../context/ClientContext';
import { Shield, Zap, Activity, Bot } from 'lucide-react';
import { AgentBlueprint } from './AgentBlueprint';

export function AIOpsDashboard() {
    const { shieldScore, spearScore, identifiedRisks, frictionCost, isOnboarding } = useClient();

    // Live Event Stream state
    const [events, setEvents] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<any>(null); // For modal

    useEffect(() => {
        if (!isOnboarding) {
            setEvents(["🛰️ Monitoring live data feeds...", "📡 Awaiting neural signatures..."]);
            return;
        }

        const interval = setInterval(() => {
            const actions = [
                "🛡️ Governor blocked PII in 'Sales_Bot_04'",
                "⚡ Analyst processed 4 SEC filings",
                "📝 Writer published 'Q3 Innovation' draft",
                "🔍 Scout detected new tool 'Midjourney' (Pending Auth)"
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            setEvents(prev => [randomAction, ...prev].slice(0, 8));
        }, 3000);
        return () => clearInterval(interval);
    }, [isOnboarding]);

    const AgentCard = ({ name, role, status, icon: Icon }: any) => (
        <div
            onClick={() => setSelectedAgent({ name, role, status, icon: Icon })}
            className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-primary/50 cursor-pointer transition-all group hover:bg-zinc-800/80"
        >
            <div className={`p-3 rounded-lg ${status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-950 text-zinc-500'}`}>
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
                <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{name}</h4>
                <p className="text-xs text-zinc-500">{role}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'active' ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                <span className="text-[10px] font-mono text-zinc-600 uppercase hidden lg:block">{status}</span>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden">
            {selectedAgent && (
                <AgentBlueprint
                    agent={selectedAgent}
                    onClose={() => setSelectedAgent(null)}
                />
            )}
            <header className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <span className="text-emerald-500 font-mono">Phase 4:</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">AIOps Control</span>
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Live Orchestration & Governance</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-mono text-emerald-500 font-bold">SYSTEM ONLINE</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: The Gauges (Shield & Spear) */}
                <div className="space-y-6">
                    {/* Shield Gauge */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield className="w-24 h-24" />
                        </div>
                        <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Governance Layer</h3>
                        <div className="flex items-end gap-2 mb-4">
                            <span className={`text-4xl font-mono font-bold ${shieldScore < 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {shieldScore}%
                            </span>
                            <span className="text-sm text-zinc-500 mb-1">Health Score</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${shieldScore < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${shieldScore}%` }}
                            />
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Risks Mitigated</span>
                                <span className="font-mono">{identifiedRisks.length * 4}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Active Policies</span>
                                <span className="font-mono text-emerald-500">ISO 42001</span>
                            </div>
                        </div>
                    </div>

                    {/* Spear Gauge */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="w-24 h-24" />
                        </div>
                        <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Performance Layer</h3>
                        <div className="flex items-end gap-2 mb-4">
                            <span className={`text-4xl font-mono font-bold ${spearScore < 50 ? 'text-amber-500' : 'text-blue-500'}`}>
                                {spearScore}%
                            </span>
                            <span className="text-sm text-zinc-500 mb-1">ROI Index</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${spearScore < 50 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                style={{ width: `${spearScore}%` }}
                            />
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Waste Reclaimed</span>
                                <span className="font-mono text-emerald-500">${frictionCost.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Agent Utilization</span>
                                <span className="font-mono text-zinc-300 italic">Evidence Required</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Column: The Agent Fleet Grid */}
                {/* Center Column: The Agent Fleet Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Maestro System Agents */}
                    <AgentCard name="Audit Scout" role="Stack Discovery & Discovery" status="active" icon={Zap} />
                    <AgentCard name="The Governor" role="Real-time PII & Security" status="active" icon={Shield} />
                    <AgentCard name="System Analyst" role="ROI & Friction Diagnostic" status="active" icon={Activity} />
                    <AgentCard name="Neural Engine" role="Core Intelligence Layer" status="idle" icon={Bot} />
                </div>
            </div>

            {/* Event Stream Footer */}
            <div className="h-32 bg-zinc-900 border-t border-zinc-800 p-6">
                <h3 className="text-xs font-bold uppercase text-zinc-500 mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Live Event Stream
                </h3>
                <div className="space-y-1 font-mono text-sm text-zinc-400">
                    {events.map((e, i) => (
                        <div key={i} className="flex items-center gap-2 animate-in slide-in-from-bottom-1 fade-in duration-300">
                            <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
                            {e}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
