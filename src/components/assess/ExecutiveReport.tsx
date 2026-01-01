import React from 'react';
import { X, Download, Share2, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { useClient } from '../../context/ClientContext';

interface ExecutiveReportProps {
    onClose: () => void;
    scores: any[]; // In real implementation, strict types
}

export function ExecutiveReport({ onClose, scores }: ExecutiveReportProps) {
    const { stack, frictionCost } = useClient();
    const overallScore = (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-zinc-800 flex justify-between items-start bg-zinc-900/50">
                    <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Confidential • Executive Summary</div>
                        <h2 className="text-3xl font-bold text-white">Digital Sovereignty Assessment</h2>
                        <p className="text-zinc-400 mt-1">Prepared for Client Leadership</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
                            <Download className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: The "Reality" */}
                    <div className="space-y-8">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4 text-amber-500">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Current Risk Profile</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-400">Projected Friction Cost</span>
                                    <span className="font-mono font-bold text-red-400 text-lg">${frictionCost.toLocaleString()}/mo</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-400">High-Risk Apps Detected</span>
                                    <span className="font-mono font-bold text-white text-lg">{stack.filter(i => i.risky).length}</span>
                                </div>
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs list-disc text-red-200">
                                    "Critical vulnerability detected in data governance layer. Immediate alignment of AI procurement policy required."
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4 text-blue-500">
                                <TrendingUp className="w-5 h-5" />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Maturity Benchmark</h3>
                            </div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-5xl font-bold text-white">{overallScore}</span>
                                <span className="text-zinc-500 text-xl mb-1">/ 4.0</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
                                <div className="bg-blue-500 h-full transition-all" style={{ width: `${(Number(overallScore) / 4) * 100}%` }} />
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Your organization is currently at the <strong>{Number(overallScore) < 2 ? 'Ad-Hoc' : 'Defined'}</strong> stage.
                                Peers in this industry typically average <strong>2.8</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: The "Plan" */}
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-6 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 text-emerald-400">
                            <Shield className="w-5 h-5" />
                            <h3 className="font-bold text-sm uppercase tracking-wider">Strategic Imperatives</h3>
                        </div>

                        <div className="space-y-6 flex-1">
                            {[
                                { title: "Sanitize the Stack", desc: "Remove shadow AI tools identified in Phase 1.", priority: "Immediate" },
                                { title: "Governance Charter", desc: "Establish the AI Council to oversee procurement.", priority: "Week 2" },
                                { title: "Workforce Training", desc: "Upskill 'Champions' to reduce reliance on external vendors.", priority: "Month 1" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/20">{(i + 1)}</div>
                                    <div>
                                        <h4 className="font-bold text-zinc-200">{item.title}</h4>
                                        <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                                        <span className="inline-block mt-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">{item.priority}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-zinc-500 text-xs italic">"Transformation is not an event, but a disciplined process."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
