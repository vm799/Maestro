import React, { useState, useEffect } from 'react';
import { useClient } from '../../context/ClientContext';
import { Target, ArrowRight, Shield, Zap, CheckCircle, Lock, Clock, Wrench, ChevronRight, DollarSign } from 'lucide-react';

export function RoadmapGenerator() {
    const { identifiedRisks, frictionCost, shieldScore, spearScore } = useClient();

    // Logic: No Assumptions. Derive Plan from Real Risks + Maturity.
    const phases = [
        {
            title: 'Phase 1: Stabilization',
            color: 'from-amber-400 to-orange-500',
            duration: 'Weeks 1-4',
            description: "Stop the bleeding. Lock down critical risks and establish a cost baseline.",
            items: [
                ...identifiedRisks.map(risk => ({
                    title: `Remediate ${risk.description}`,
                    type: 'governance',
                    tools: ['Drata', 'Vanta'],
                    est: '1 week',
                    icon: Shield
                })),
                { title: 'Deploy "The Governor" PII Filter', type: 'tech', tools: ['Maestro-Gov', 'Azure OpenAI'], est: '2 days', icon: Shield },
                { title: 'Establish Cost Baseline', type: 'ops', tools: ['Maestro-Friction'], est: '3 days', icon: DollarSign }
            ]
        },
        {
            title: 'Phase 2: Literacy & Culture',
            color: 'from-blue-400 to-indigo-500',
            duration: 'Weeks 5-8',
            description: "Shift from Fear to Adoption. Train the team on the tools they are already using.",
            items: [
                { title: 'Launch "Spear" Pilot Program', type: 'culture', tools: ['Workshops'], est: '2 weeks', icon: Zap },
                { title: 'AI Ethics & Safety Certification', type: 'training', tools: ['Internal LMS'], est: '1 week', icon: CheckCircle },
                ...(spearScore < 50 ? [{ title: 'Emergency "Fear Gauge" Town Hall', type: 'critical', tools: ['Zoom'], est: '1 day', icon: Zap }] : [])
            ]
        },
        {
            title: 'Phase 3: Sovereign Acceleration',
            color: 'from-purple-400 to-pink-500',
            duration: 'Weeks 9-12',
            description: "Full local deployment. Move off public APIs to private, fine-tuned models.",
            items: [
                { title: 'Deploy Local Llama 3 Swarm', type: 'tech', tools: ['Ollama', 'Docker'], est: '2 weeks', icon: Wrench },
                { title: 'Fine-tune "The Writer" on Company Data', type: 'tech', tools: ['HuggingFace', 'LoRA'], est: '1 week', icon: Target }
            ]
        }
    ];

    return (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <header className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                        <span className="text-emerald-500 font-mono">Phase 3:</span> The Remediation Roadmap
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Based on {identifiedRisks.length} risks and a friction cost of ${frictionCost.toLocaleString()}/mo.
                    </p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                    <CheckCircle className="w-4 h-4" /> Approve Logic
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="space-y-8 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-zinc-800" />

                        {phases.map((phase, pIdx) => (
                            <div key={pIdx} className="relative z-10 pl-24 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${pIdx * 150}ms` }}>
                                {/* Phase Marker */}
                                <div className={`absolute left-0 top-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center font-bold text-2xl shadow-lg text-white border border-white/10`}>
                                    {pIdx + 1}
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${phase.color}`}>
                                                {phase.title}
                                            </h3>
                                            <p className="text-zinc-500 text-sm mt-1">{phase.description}</p>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-zinc-600 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800">
                                            {phase.duration}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {phase.items.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-md ${item.type === 'tech' ? 'bg-blue-500/10 text-blue-500' :
                                                        item.type === 'governance' ? 'bg-amber-500/10 text-amber-400' :
                                                            item.type === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-purple-500/10 text-purple-400'
                                                        }`}>
                                                        <item.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-zinc-300 text-sm">{item.title}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex gap-1.5">
                                                        {item.tools?.map(tool => (
                                                            <span key={tool} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800 font-mono">
                                                                {tool}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-mono text-zinc-600 hidden sm:block">{item.est}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
