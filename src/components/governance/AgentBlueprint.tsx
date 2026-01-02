import { X, Code, Zap, Shield, Database, Network } from 'lucide-react';

interface AgentBlueprintProps {
    agent: any;
    onClose: () => void;
}

export function AgentBlueprint({ agent, onClose }: AgentBlueprintProps) {
    if (!agent) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-5xl h-[80vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
                            {agent.icon && <agent.icon className="w-6 h-6" />}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Agent Architecture</div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                {agent.name}
                                <span className="px-2 py-0.5 rounded textxs font-mono border border-zinc-700 bg-zinc-900 text-zinc-400">v2.1.0</span>
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 grid grid-cols-12 overflow-hidden">
                    {/* Left: Specs */}
                    <div className="col-span-4 border-r border-zinc-800 bg-zinc-900/30 p-6 overflow-y-auto space-y-8">
                        <div>
                            <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4 flex items-center gap-2">
                                <Code className="w-4 h-4" /> System Prompt Scope
                            </h3>
                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-400 leading-relaxed">
                                {agent.name === "Audit Scout" && "YOU ARE AN AUDITOR. ANALYZE STACK FOR REDUNDANCIES."}
                                {agent.name === "The Governor" && "YOU ARE A COMPLIANCE OFFICER. BLOCK ANY PII IN PROMPTS."}
                                {agent.name === "The Writer" && "YOU ARE A GHOSTWRITER. ADAPT TONE TO C-SUITE."}
                                {agent.name === "The Analyst" && "YOU ARE A DATA SCIENTIST. COMPUTE ROI AND LATENCY."}
                                <br /><br />
                                <span className="text-zinc-600">// Strict adherence to "Coal-Theme" guidelines required.</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Capabilities (Tools)
                            </h3>
                            <div className="space-y-2">
                                {['read_file', 'context_search', 'risk_calculator'].map(tool => (
                                    <div key={tool} className="flex items-center gap-2 text-sm text-zinc-300 p-2 bg-zinc-950 rounded border border-zinc-800/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span className="font-mono">{tool}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Security & Access
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="bg-red-900/10 border border-red-500/20 text-red-400 p-2 rounded text-center">NO INTERNET</div>
                                <div className="bg-emerald-900/10 border border-emerald-500/20 text-emerald-400 p-2 rounded text-center">READ-ONLY FS</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Flow */}
                    <div className="col-span-8 bg-zinc-950 relative overflow-hidden flex flex-col">
                        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                        <div className="p-6 border-b border-zinc-800 bg-zinc-900/10 backdrop-blur z-10 flex justify-between">
                            <h3 className="font-bold text-zinc-400 text-sm">Execution Logic Visualization</h3>
                            <div className="flex gap-4 text-xs font-mono text-zinc-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> LIVE</span>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center relative p-8">
                            {/* Flowchart Visualization */}
                            <div className="flex items-center gap-8 relative z-20">
                                {/* Trigger */}
                                <div className="flex flex-col items-center gap-2 opacity-50">
                                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center bg-zinc-900">
                                        <Zap className="w-8 h-8 text-zinc-500" />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-500 uppercase">Trigger Event</span>
                                </div>

                                <div className="h-0.5 w-16 bg-zinc-700" />

                                {/* The Agent Core */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-40 h-40 rounded-xl bg-zinc-900 border-2 border-primary shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col items-center justify-center p-4 relative group cursor-help">
                                        <div className="absolute -top-3 px-3 py-1 bg-primary text-black text-xs font-bold rounded-full">LLM KERNEL</div>
                                        <Network className="w-12 h-12 text-primary mb-2 group-hover:scale-110 transition-transform" />
                                        <div className="text-center">
                                            <div className="text-sm font-bold text-white">Reasoning Engine</div>
                                            <div className="text-[10px] text-zinc-400 mt-1">GPT-4 Turbo (0.2 temp)</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-0.5 w-16 bg-zinc-700" />

                                {/* Output */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-24 h-24 rounded-xl border border-zinc-700 bg-zinc-900 flex items-center justify-center flex-col gap-2">
                                        <Database className="w-6 h-6 text-emerald-500" />
                                        <span className="text-[10px] font-mono text-zinc-400">JSON_OUTPUT</span>
                                    </div>
                                    <span className="text-xs font-bold text-zinc-500 uppercase">Action Artifact</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
