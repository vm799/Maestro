import { X, Download, Shield, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useClient } from '../../context/ClientContext';

interface ExecutiveReportProps {
    onClose: () => void;
    scores: any[];
    rubric: any[];
    answers: Record<string, number>;
}

export function ExecutiveReport({ onClose, scores, rubric, answers }: ExecutiveReportProps) {
    const { stack, frictionCost } = useClient();
    const overallScore = (scores.reduce((a, b) => a + b.score, 0) / (scores.length || 1)).toFixed(1);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 shrink-0">
                    <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Confidential Audit Report</div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-emerald-500" />
                            Sovereign Architect Assessment
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium">
                            <Download className="w-4 h-4" /> Export PDF
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-zinc-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-8">

                        {/* Executive Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Score Card */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp className="w-24 h-24 text-blue-500" />
                                </div>
                                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Maturity Score</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-5xl font-bold ${Number(overallScore) > 3 ? 'text-emerald-400' : Number(overallScore) > 2 ? 'text-blue-400' : 'text-amber-400'}`}>
                                        {overallScore}
                                    </span>
                                    <span className="text-zinc-600 text-lg">/ 4.0</span>
                                </div>
                                <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${Number(overallScore) > 3 ? 'bg-emerald-500' : Number(overallScore) > 2 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                        style={{ width: `${(Number(overallScore) / 4) * 100}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-zinc-500">Industry Avg: 2.8</p>
                            </div>

                            {/* Risk Card */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <AlertTriangle className="w-24 h-24 text-red-500" />
                                </div>
                                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Projected Friction Cost</h3>
                                <div className="text-4xl font-bold text-red-400 font-mono">
                                    ${frictionCost.toLocaleString()}
                                </div>
                                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                                    Estimated monthly loss due to shadow AI inefficiency and governance gaps.
                                </p>
                            </div>

                            {/* Stack Card */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Shield className="w-24 h-24 text-emerald-500" />
                                </div>
                                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Stack Integrity</h3>
                                <div className="text-4xl font-bold text-white">
                                    {stack.length} <span className="text-lg text-zinc-500 font-normal">Tools</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20 font-bold">
                                        {stack.filter(i => i.risky).length} Risky
                                    </span>
                                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-bold">
                                        {stack.filter(i => !i.risky).length} Secure
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Findings Table */}
                        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
                            <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    Detailed Audit Findings
                                </h3>
                                <span className="text-xs text-zinc-500 italic">Evidence-based analysis</span>
                            </div>

                            <div className="divide-y divide-zinc-800/50">
                                {rubric.map((section: any) => (
                                    <div key={section.id} className="p-6">
                                        <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                                            <section.icon className="w-4 h-4" />
                                            {section.title}
                                        </h4>

                                        <div className="space-y-6 pl-4 border-l border-zinc-800">
                                            {section.questions.map((q: any) => {
                                                const score = answers[q.id] || 0;
                                                const scoreKey = score === 1 ? 'nonExistent' : score === 2 ? 'emerging' : score === 3 ? 'systematic' : 'optimized';
                                                const observation = q.scoringGuide?.[scoreKey] || "Not Assessed";

                                                return (
                                                    <div key={q.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                                        <div className="lg:col-span-4">
                                                            <div className="text-zinc-300 font-medium text-sm mb-1">{q.text}</div>
                                                            <div className="text-xs text-zinc-500">Audit Criteria {q.id.toUpperCase()}</div>
                                                        </div>
                                                        <div className="lg:col-span-4">
                                                            <div className={`text-sm font-bold mb-1 ${score < 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                                Level {score}: {scoreKey.replace(/([A-Z])/g, ' $1').trim()}
                                                            </div>
                                                            <div className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/50 p-2 rounded border border-zinc-800">
                                                                "{observation}"
                                                            </div>
                                                        </div>
                                                        <div className="lg:col-span-4">
                                                            <div className="text-xs font-bold text-zinc-500 uppercase mb-1">Consultant Analysis</div>
                                                            <div className="text-xs text-zinc-400 italic leading-relaxed">
                                                                {q.consultantContext}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-gradient-to-r from-emerald-950/50 to-zinc-900 border border-emerald-500/20 rounded-xl p-8 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Remediation Roadmap Ready</h3>
                            <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
                                Based on these findings, we have generated a tailored implementation plan to close the identified compliance gaps and optimize stack efficiency.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 flex items-center gap-2 mx-auto"
                            >
                                View Remediation Plan <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
