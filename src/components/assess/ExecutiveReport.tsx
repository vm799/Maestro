import { X, Download, Shield, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { generateCTOReport } from '../../lib/ReportGenerator';

interface ExecutiveReportProps {
    onClose: () => void;
}

export function ExecutiveReport({ onClose }: ExecutiveReportProps) {
    const state = useClient();
    const { stack, frictionCost } = state;
    const report = generateCTOReport(state);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 print:p-0 print:bg-white">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col print:max-h-none print:w-full print:border-0 print:rounded-none">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 shrink-0 print:bg-white print:border-zinc-200">
                    <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Confidential Audit Report</div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2 print:text-black">
                            <Shield className="w-6 h-6 text-emerald-500" />
                            Sovereign Architect Assessment
                        </h2>
                    </div>
                    <div className="flex gap-2 print:hidden">
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
                    <div className="p-8 space-y-8 print:p-12">
                        {/* Top Level Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                            {/* Company Profile Card */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group print:bg-zinc-50 print:border-zinc-200">
                                <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Client Profile</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1 print:text-black">{report.companyProfile.name}</div>
                                        <div className="flex items-center gap-2 text-sm text-zinc-400 print:text-zinc-600">
                                            <span className="px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700 print:bg-white print:border-zinc-300">{report.companyProfile.industry}</span>
                                            <span className="px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700 uppercase print:bg-white print:border-zinc-300">{report.companyProfile.region}</span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-zinc-600 font-mono">
                                        Report ID: ASR-{Date.now().toString().slice(-6)} | {new Date(report.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group print:bg-white print:border-zinc-200">
                                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 print:text-emerald-700">
                                    <TrendingUp className="w-4 h-4" /> Executive Summary
                                </h3>
                                <p className="text-sm text-zinc-100 font-medium leading-relaxed print:text-zinc-800">
                                    {report.executiveSummary}
                                </p>
                                <p className="mt-4 text-[11px] text-zinc-500 italic print:text-zinc-600">
                                    {report.governanceGap}
                                </p>
                            </div>

                            {/* Risk Card */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group print:bg-white print:border-zinc-200">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <AlertTriangle className="w-24 h-24 text-red-500" />
                                </div>
                                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2 print:text-zinc-500">Projected Friction Cost</h3>
                                <div className="text-4xl font-bold text-red-400 font-mono">
                                    ${frictionCost.toLocaleString()}
                                </div>
                                <p className="mt-2 text-sm text-zinc-500 leading-relaxed print:text-zinc-600">
                                    Estimated monthly loss due to shadow AI inefficiency and governance gaps.
                                </p>
                            </div>

                            {/* Stack Card */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group print:bg-white print:border-zinc-200">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Shield className="w-24 h-24 text-emerald-500" />
                                </div>
                                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2 print:text-zinc-500">Observed Tech Stack</h3>
                                <div className="text-4xl font-bold text-white print:text-black">
                                    {stack.length} <span className="text-lg text-zinc-500 font-normal">Active Assets</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20 font-bold">
                                        {stack.filter(i => i.risky).length} Risky
                                    </span>
                                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-bold">
                                        {stack.filter(i => !i.risky).length} Managed
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2: Discovery Findings */}
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden print:bg-white print:border-zinc-200">
                            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2 print:bg-zinc-50 print:border-zinc-200">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 print:text-blue-700">Phase 2: Deep Audit Insights</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                {report.discoveryInsights.map((log, idx) => (
                                    <div key={idx} className="flex gap-4 text-sm items-start group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 shrink-0 group-hover:bg-blue-400 transition-colors" />
                                        <div className="text-zinc-300 font-medium print:text-zinc-800">{log}</div>
                                    </div>
                                ))}
                                {report.discoveryInsights.length === 0 && (
                                    <div className="text-zinc-500 text-sm italic">No qualitative findings captured in current session.</div>
                                )}
                            </div>
                        </div>

                        {/* Prioritized Mitigations */}
                        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30 print:bg-white print:border-zinc-200">
                            <div className="p-4 bg-emerald-950/30 border-b border-emerald-500/20 flex justify-between items-center print:bg-emerald-50 print:border-emerald-200">
                                <h3 className="font-bold text-emerald-400 flex items-center gap-2 print:text-emerald-800">
                                    <CheckCircle className="w-4 h-4" />
                                    Prioritized Strategic Mitigations
                                </h3>
                                <span className="text-xs text-zinc-500">Top 3 Prescriptive Actions</span>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-1">
                                {report.prioritizedMitigations.map((m, idx) => (
                                    <div key={idx} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5 relative overflow-hidden print:bg-white print:border-zinc-200">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-3 flex items-center justify-between">
                                            <span>Priority #{idx + 1}</span>
                                            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded print:border print:border-emerald-200">{m.pillar}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2 print:text-black">{m.title}</h4>
                                        <p className="text-sm text-zinc-400 leading-relaxed mb-4 print:text-zinc-700">
                                            {m.description}
                                        </p>
                                        <div className="text-[10px] text-zinc-600 font-mono">
                                            Evidence Required: Awaiting Client Validation
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-gradient-to-r from-emerald-950/50 to-zinc-900 border border-emerald-500/20 rounded-xl p-8 text-center print:bg-white print:border-zinc-200">
                            <h3 className="text-xl font-bold text-white mb-2 print:text-black">Architect's Recommendation</h3>
                            <p className="text-zinc-400 max-w-2xl mx-auto mb-6 print:text-zinc-600">
                                The current dynamic map demonstrates architectural debt that exceeds industry best practices. We recommend immediate deployment of the Maestro Governance Layer.
                            </p>
                            <button
                                onClick={() => {
                                    onClose();
                                    window.dispatchEvent(new CustomEvent('navigate', { detail: 'roadmap' }));
                                }}
                                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 flex items-center gap-2 mx-auto print:hidden"
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
