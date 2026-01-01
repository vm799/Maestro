import React, { useState, useEffect } from 'react';
import { useClient } from '../../context/ClientContext';
import { Target, ArrowRight, Shield, Zap, CheckCircle, Lock, Clock, Wrench, ChevronRight, DollarSign, X, FileText, Download, BookOpen, AlertCircle } from 'lucide-react';

export function RoadmapGenerator() {
    const { identifiedRisks, frictionCost, shieldScore, spearScore, maturityScores } = useClient();
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // DYNAMIC: Generate remediation based on actual gaps
    const literacyGap = 4 - maturityScores.literacy;
    const governanceGap = 4 - maturityScores.governance;

    // Determine which scale needs more attention
    const priorityArea = literacyGap > governanceGap ? 'literacy' : 'governance';

    // Build dynamic remediation items based on gaps
    const buildLiteracyItems = () => {
        const items: any[] = [];
        if (maturityScores.literacy < 2) {
            items.push({
                title: 'CRITICAL: Launch Emergency AI Training Program',
                type: 'critical',
                tools: ['Internal LMS', 'Workshops'],
                est: '2 weeks',
                icon: BookOpen,
                scale: 'literacy',
                deliverable: {
                    type: 'Training Deck',
                    markdown: `# Emergency AI Literacy Bootcamp\n\n**Gap Identified:** Literacy Score ${maturityScores.literacy}/4.0\n\n## Week 1: Foundations\n- What is an LLM?\n- Prompt Engineering 101\n- Understanding Hallucinations\n\n## Week 2: Hands-On\n- Approved Tools Walkthrough\n- Best Practices & Guardrails\n- Quiz & Certification`
                }
            });
        }
        if (maturityScores.literacy < 3) {
            items.push({
                title: 'Deploy Prompt Engineering Certification',
                type: 'training',
                tools: ['LMS', 'Notion'],
                est: '1 week',
                icon: CheckCircle,
                scale: 'literacy',
                deliverable: {
                    type: 'Certification Module',
                    markdown: `# Prompt Engineering Certification\n\n**Target:** Move from Level ${Math.round(maturityScores.literacy)} to Level 3 (Systematic)\n\n## Curriculum\n1. Zero-shot vs Few-shot prompting\n2. Chain-of-thought reasoning\n3. Output formatting and validation\n\n**Pass Mark:** 80% on assessment`
                }
            });
        }
        return items;
    };

    const buildGovernanceItems = () => {
        const items: any[] = [];
        if (maturityScores.governance < 2) {
            items.push({
                title: 'URGENT: Draft Acceptable Use Policy',
                type: 'critical',
                tools: ['Legal', 'Compliance'],
                est: '1 week',
                icon: Shield,
                scale: 'governance',
                deliverable: {
                    type: 'Policy Template',
                    markdown: `# AI Acceptable Use Policy (DRAFT)\n\n**Gap Identified:** Governance Score ${maturityScores.governance}/4.0 - No policy exists.\n\n## Scope\nAll employees using AI tools for work purposes.\n\n## Prohibited Actions\n- Uploading customer PII to public AI platforms\n- Using AI outputs without human review in legal/financial contexts\n\n## Enforcement\nViolations escalated to HR and CISO.`
                }
            });
        }
        if (maturityScores.governance < 3) {
            items.push({
                title: 'Implement DLP Monitoring for AI Tools',
                type: 'governance',
                tools: ['Microsoft Purview', 'Netskope'],
                est: '2 weeks',
                icon: AlertCircle,
                scale: 'governance',
                deliverable: {
                    type: 'DLP Configuration',
                    markdown: `# DLP for AI Traffic\n\n**Objective:** Move from Level ${Math.round(maturityScores.governance)} to Level 3\n\n## Configuration\n1. Block outbound traffic to unsanctioned AI endpoints\n2. Monitor paste operations containing SSN/Credit Card patterns\n3. Alert on bulk document uploads to ChatGPT domains`
                }
            });
        }
        if (identifiedRisks.length > 0) {
            items.push({
                title: `Remediate ${identifiedRisks.length} Shadow AI Risks`,
                type: 'governance',
                tools: ['Drata', 'Vanta'],
                est: '1 week per risk',
                icon: Shield,
                scale: 'governance',
                deliverable: {
                    type: 'Risk Register',
                    markdown: `# Shadow AI Risk Remediation\n\n${identifiedRisks.map((r, i) => `## Risk ${i + 1}: ${r.description}\n- Severity: ${r.severity}\n- Action: Remove or replace with sanctioned alternative\n`).join('\n')}`
                }
            });
        }
        return items;
    };

    // Assemble phases based on actual gaps
    const phases = [
        {
            title: `Phase 1: ${priorityArea === 'governance' ? 'Governance Lockdown' : 'Literacy Uplift'}`,
            color: priorityArea === 'governance' ? 'from-amber-400 to-orange-500' : 'from-blue-400 to-indigo-500',
            duration: 'Weeks 1-4',
            description: priorityArea === 'governance'
                ? `Critical: Governance gap of ${governanceGap.toFixed(1)} points. Lock down policies first.`
                : `Critical: Literacy gap of ${literacyGap.toFixed(1)} points. Upskill the team first.`,
            gapScore: priorityArea === 'governance' ? governanceGap : literacyGap,
            items: priorityArea === 'governance' ? buildGovernanceItems() : buildLiteracyItems()
        },
        {
            title: `Phase 2: ${priorityArea === 'governance' ? 'Literacy Uplift' : 'Governance Lockdown'}`,
            color: priorityArea === 'governance' ? 'from-blue-400 to-indigo-500' : 'from-amber-400 to-orange-500',
            duration: 'Weeks 5-8',
            description: priorityArea === 'governance'
                ? `Secondary: Literacy gap of ${literacyGap.toFixed(1)} points. Train the workforce.`
                : `Secondary: Governance gap of ${governanceGap.toFixed(1)} points. Establish controls.`,
            gapScore: priorityArea === 'governance' ? literacyGap : governanceGap,
            items: priorityArea === 'governance' ? buildLiteracyItems() : buildGovernanceItems()
        },
        {
            title: 'Phase 3: Sustained Excellence',
            color: 'from-emerald-400 to-teal-500',
            duration: 'Ongoing',
            description: 'Maintain 4.0 maturity across all scales with continuous monitoring.',
            gapScore: 0,
            items: [
                {
                    title: 'Quarterly Maturity Re-Assessment',
                    type: 'ops',
                    tools: ['Maestro Platform'],
                    est: 'Quarterly',
                    icon: Target,
                    scale: 'all',
                    deliverable: {
                        type: 'Process Doc',
                        markdown: `# Quarterly Review Process\n\n1. Re-run the Maturity Assessment\n2. Compare scores to previous quarter\n3. Identify regression areas\n4. Update Roadmap accordingly`
                    }
                }
            ]
        }
    ].filter(p => p.items.length > 0 || p.title.includes('Sustained')); // Only show phases with items

    return (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
            <header className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                        <span className="text-emerald-500 font-mono">Phase 2:</span> Dynamic Remediation Roadmap
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Based on: Literacy {maturityScores.literacy.toFixed(1)}/4.0 (Gap: {literacyGap.toFixed(1)}) • Governance {maturityScores.governance.toFixed(1)}/4.0 (Gap: {governanceGap.toFixed(1)}) • {identifiedRisks.length} risks • ${frictionCost.toLocaleString()}/mo friction
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20">
                        Literacy: {maturityScores.literacy.toFixed(1)}
                    </div>
                    <div className="px-3 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20">
                        Governance: {maturityScores.governance.toFixed(1)}
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    {/* Check if assessment has been completed */}
                    {maturityScores.overall === 0 && identifiedRisks.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <AlertCircle className="w-12 h-12 text-amber-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">No Assessment Data</h2>
                            <p className="text-zinc-400 max-w-md mx-auto mb-8">
                                Complete the <strong>Maturity Assessment</strong> first to generate a dynamic remediation roadmap based on your actual gaps.
                            </p>
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'assess' }))}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all"
                            >
                                Go to Assessment →
                            </button>

                            <div className="mt-12 grid grid-cols-2 gap-6 max-w-xl mx-auto text-left">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                                    <div className="text-xs text-zinc-500 uppercase mb-1">Literacy Gap</div>
                                    <div className="text-2xl font-bold text-blue-400">?/4.0</div>
                                    <div className="text-xs text-zinc-500 mt-1">Complete assessment</div>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                                    <div className="text-xs text-zinc-500 uppercase mb-1">Governance Gap</div>
                                    <div className="text-2xl font-bold text-amber-400">?/4.0</div>
                                    <div className="text-xs text-zinc-500 mt-1">Complete assessment</div>
                                </div>
                            </div>
                        </div>
                    ) : (
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
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedItem(item)}
                                                    className="w-full flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800/50 hover:border-zinc-500/50 hover:bg-zinc-900 transition-all group/item cursor-pointer text-left"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-md transition-colors ${item.type === 'tech' ? 'bg-blue-500/10 text-blue-500 group-hover/item:bg-blue-500/20' :
                                                            item.type === 'governance' ? 'bg-amber-500/10 text-amber-400 group-hover/item:bg-amber-500/20' :
                                                                item.type === 'critical' ? 'bg-red-500/10 text-red-500 group-hover/item:bg-red-500/20' : 'bg-purple-500/10 text-purple-400 group-hover/item:bg-purple-500/20'
                                                            }`}>
                                                            <item.icon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-zinc-300 text-sm group-hover/item:text-white transition-colors">{item.title}</span>
                                                            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                                                <FileText className="w-3 h-3" />
                                                                {item.deliverable?.type || "Deliverable"}
                                                            </div>
                                                        </div>
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
                                                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover/item:text-white transition-colors" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Deliverable Modal */}
            {selectedItem && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <header className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 rounded-lg">
                                    <FileText className="w-5 h-5 text-zinc-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{selectedItem.deliverable?.type}</h3>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">For: {selectedItem.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 bg-zinc-950/50">
                            <div className="prose prose-invert prose-sm max-w-none">
                                {/* Simple Markdown Rendering Simulation */}
                                {selectedItem.deliverable?.markdown.split('\n').map((line: string, i: number) => {
                                    if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-4 text-white pb-2 border-b border-zinc-800">{line.replace('# ', '')}</h1>;
                                    if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-6 mb-3 text-emerald-400">{line.replace('## ', '')}</h2>;
                                    if (line.startsWith('**')) return <p key={i} className="font-bold my-2 text-zinc-200">{line.replace(/\*\*/g, '')}</p>;
                                    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-zinc-400 list-disc my-1">{line.replace('- ', '')}</li>;
                                    if (line === '') return <br key={i} />;
                                    return <p key={i} className="text-zinc-400 leading-relaxed mb-2">{line}</p>;
                                })}
                            </div>
                        </div>

                        <footer className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-between items-center">
                            <span className="text-xs text-zinc-500 font-mono">Generated by Maestro-Content-Engine v4.2</span>
                            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                                <Download className="w-4 h-4" /> Export PDF
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
