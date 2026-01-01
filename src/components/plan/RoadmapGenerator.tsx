import React from 'react';
import { useClient } from '../../context/ClientContext';
import { Calendar, CheckCircle, ArrowRight, Shield, Zap, DollarSign } from 'lucide-react';

export function RoadmapGenerator() {
    const { identifiedRisks, frictionCost, shieldScore, spearScore } = useClient();

    // Logic: No Assumptions. Derive Plan from Real Risks.

    // 1. Identify Phases
    const phases = [
        {
            id: 'p1',
            title: 'Phase 1: Stabilization',
            duration: 'Weeks 1-4',
            description: "Stop the bleeding. Lock down critical risks and establish a cost baseline.",
            items: [
                ...identifiedRisks.map(risk => ({
                    type: 'remediation',
                    text: `Remediate ${risk.description} (${risk.severity.toUpperCase()})`,
                    icon: Shield
                })),
                { type: 'gov', text: 'Deploy "The Governor" for PII blocking', icon: Shield },
                { type: 'cost', text: `Reclaim ~$${(frictionCost * 0.3).toLocaleString()} in monthly waste`, icon: DollarSign }
            ]
        },
        {
            id: 'p2',
            title: 'Phase 2: Literacy & Culture',
            duration: 'Weeks 5-8',
            description: "Shift from Fear to Adoption. Train the team on the tools they are already using.",
            items: [
                { type: 'culture', text: 'Launch "Spear" Pilot Program', icon: Zap },
                { type: 'training', text: 'AI Ethics & Safety Workshop', icon: CheckCircle },
                ...(spearScore < 50 ? [{ type: 'critical', text: 'Emergency "Fear Gauge" Town Hall', icon: Zap }] : [])
            ]
        }
    ];

    return (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <header className="px-8 py-6 border-b border-border bg-card flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <span className="text-primary">Phase 2:</span> The Remediation Roadmap
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Based on {identifiedRisks.length} risks and a friction cost of ${frictionCost.toLocaleString()}/mo.
                    </p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Approve SOW
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Executive Summary */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex gap-6 items-center">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">Executive Summary</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Our audit detected <span className="text-foreground font-medium">{identifiedRisks.length} critical vulnerabilities</span> in your current AI stack.
                                Without intervention, the projected annualized friction cost is <span className="text-red-500 font-bold">${(frictionCost * 12).toLocaleString()}</span>.
                                This roadmap proposes a 2-phase approach to neutralize these threats and pivot to ROI.
                            </p>
                        </div>
                        <div className="w-px h-16 bg-border" />
                        <div className="text-right">
                            <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Total Impact</div>
                            <div className="text-3xl font-mono font-bold text-emerald-500">
                                ${(frictionCost * 12 * 2.5).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-muted-foreground">Est. Annual Value Created</div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative border-l-2 border-border ml-4 space-y-12 pb-12">
                        {phases.map((phase, idx) => (
                            <div key={phase.id} className="relative pl-8">
                                {/* Dot */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-xl">{phase.title}</h3>
                                                <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">{phase.duration}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {phase.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-transparent hover:border-primary/20 transition-colors">
                                                <div className={`p-2 rounded-md ${item.type === 'remediation' ? 'bg-red-500/10 text-red-500' :
                                                        item.type === 'cost' ? 'bg-emerald-500/10 text-emerald-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium">{item.text}</span>
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
