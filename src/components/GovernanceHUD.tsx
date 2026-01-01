import React from 'react';
import { ShieldCheck, Lock, Activity, Eye, FileCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export function GovernanceHUD() {
    const layers = [
        { name: "Layer 7: Ecosystem", status: "Active", icon: Activity, color: "text-green-500" },
        { name: "Layer 6: Auth/Identity", status: "Verified", icon: Lock, color: "text-blue-500" },
        { name: "Layer 5: Compliance", status: "ISO 42001", icon: FileCheck, color: "text-emerald-500" },
        { name: "Layer 4: Sandbox", status: "Isolated", icon: ShieldCheck, color: "text-purple-500" },
        { name: "Layer 3: Agent Logic", status: "Monitoring", icon: Eye, color: "text-amber-500" },
    ];

    return (
        <div className="p-4 h-full flex flex-col font-mono">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 border-b pb-2">
                Governance System (Active)
            </h2>

            <div className="space-y-4">
                {layers.map((layer) => (
                    <div key={layer.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                            <layer.icon className={cn("w-5 h-5", layer.color)} />
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-foreground">{layer.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">{layer.status}</span>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                ))}
            </div>

            <div className="mt-auto p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold text-sm">System Secure</span>
                </div>
                <p className="text-xs opacity-90">All agents operating within defined guardrails. No hallucinations detected in last 24h cycle.</p>
            </div>
        </div>
    );
}
