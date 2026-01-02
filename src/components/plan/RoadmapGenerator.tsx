import { useState } from 'react';
import { useClient } from '../../context/ClientContext';
import { Target, Shield, CheckCircle, ChevronRight, X, FileText, Download, BookOpen, AlertCircle, Zap } from 'lucide-react';

export function RoadmapGenerator() {
    const { identifiedRisks, maturityScores, maestroAudit, stack } = useClient();
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const literacyGap = 4 - maturityScores.literacy;
    const governanceGap = 4 - maturityScores.governance;
    const priorityArea = literacyGap > governanceGap ? 'literacy' : 'governance';

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
                    markdown: `# Emergency AI Literacy Bootcamp\n\n**Gap Identified:** Literacy Score ${maturityScores.literacy.toFixed(1)}/4.0\n\n## Week 1: Foundations\n- What is an LLM?\n- Prompt Engineering 101\n- Understanding Hallucinations\n\n## Week 2: Hands-On\n- Approved Tools Walkthrough\n- Best Practices & Guardrails\n- Quiz & Certification`
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
                    markdown: `# AI Acceptable Use Policy (DRAFT)\n\n**Gap Identified:** Governance Score ${maturityScores.governance.toFixed(1)}/4.0 - No policy exists.\n\n## Scope\nAll employees using AI tools for work purposes.\n\n## Prohibited Actions\n- Uploading customer PII to public AI platforms\n- Using AI outputs without human review in legal/financial contexts\n\n## Enforcement\nViolations escalated to HR and CISO.`
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

    const buildMaestroItems = () => {
        const items: any[] = [];
        if (maestroAudit.vulnerabilities.length > 0) {
            items.push({
                title: `PATCH: ${maestroAudit.vulnerabilities.length} Framework Vulnerabilities`,
                type: 'security',
                tools: stack.map(t => t.name).slice(0, 3),
                est: '3 days',
                icon: AlertCircle,
                scale: 'security',
                deliverable: {
                    type: 'Patch Report',
                    markdown: `# MAESTRO Framework Security Patching\n\n**Objective:** Remediate PhD-level vulnerabilities detected in the 7-layer audit.\n\n## Vulnerabilities Addressed\n${maestroAudit.vulnerabilities.map(v => `- [ ] **${v.id}**: ${v.description} (Severity: ${v.severity.toUpperCase()})`).join('\n')}`
                }
            });
        }
        maestroAudit.mitigations.forEach(m => {
            items.push({
                title: `IMPLEMENT: ${m.title}`,
                type: 'mitigation',
                tools: [`Layer ${m.layerRelevance.join(', ')}`],
                est: '1 week',
                icon: Zap,
                scale: 'security',
                deliverable: {
                    type: 'Implementation Guide',
                    markdown: `# Mitigation: ${m.title}\n\n**Evidence Rationale:** ${m.evidence}\n\n## Implementation Steps\n1. Analyze affected layers: ${m.layerRelevance.join(', ')}\n2. Deploy control: ${m.description}\n3. Verify effectiveness via MAESTRO recurring scan.`
                }
            });
        });
        return items;
    };

    const phases = [
        {
            title: `Phase 1: ${priorityArea === 'governance' ? 'Governance Lockdown' : 'Literacy Uplift'}`,
            color: priorityArea === 'governance' ? 'from-amber-400 to-orange-500' : 'from-blue-400 to-indigo-500',
            duration: 'Weeks 1-4',
            description: priorityArea === 'governance'
                ? `Critical: Governance gap of ${governanceGap.toFixed(1)} points. Lock down policies first.`
                : `Critical: Literacy gap of ${literacyGap.toFixed(1)} points. Upskill the team first.`,
            items: priorityArea === 'governance' ? buildGovernanceItems() : buildLiteracyItems()
        },
        {
            title: 'Technical Hardening (MAESTRO)',
            color: 'from-red-400 to-pink-500',
            duration: 'Urgent / Concurrent',
            description: 'Direct remediation of detected MAESTRO architectural vulnerabilities.',
            items: buildMaestroItems()
        },
        {
            title: `Phase 2: ${priorityArea === 'governance' ? 'Literacy Uplift' : 'Governance Lockdown'}`,
            color: priorityArea === 'governance' ? 'from-blue-400 to-indigo-500' : 'from-amber-400 to-orange-500',
            duration: 'Weeks 5-8',
            description: priorityArea === 'governance'
                ? `Secondary: Literacy gap of ${literacyGap.toFixed(1)} points. Train the workforce.`
                : `Secondary: Governance gap of ${governanceGap.toFixed(1)} points. Establish controls.`,
            items: priorityArea === 'governance' ? buildLiteracyItems() : buildGovernanceItems()
        },
        {
            title: 'Phase 3: Sustained Excellence',
            color: 'from-emerald-400 to-teal-500',
            duration: 'Ongoing',
            description: 'Maintain 4.0 maturity across all scales with continuous monitoring.',
            items: [
                {
                    title: 'Quarterly Maturity Re-Assessment',
                    type: 'ops',
                    tools: ['Maestro Platform'],
                    est: 'Quarterly',
                    icon: Target,
                    deliverable: {
                        type: 'Process Doc',
                        markdown: `# Quarterly Review Process\n\n1. Re-run the Maturity Assessment\n2. Compare scores to previous quarter\n3. Identify regression areas\n4. Update Roadmap accordingly`
                    }
                }
            ]
        }
    ].filter(p => p.items.length > 0 || p.title.includes('Sustained'));

    return (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
            <header className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center flex-wrap gap-4 text-white">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <span className="text-emerald-500 font-mono">Phase 2:</span> Dynamic Remediation Roadmap
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Based on: Literacy {maturityScores.literacy.toFixed(1)}/4.0 | Governance {maturityScores.governance.toFixed(1)}/4.0 | {maestroAudit.vulnerabilities.length} MAESTRO risks
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

            <div className="flex-1 overflow-y-auto p-8 space-y-12">
                {phases.map((phase, idx) => (
                    <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`h-12 w-1.5 rounded-full bg-gradient-to-b ${phase.color}`} />
                            <div>
                                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{phase.duration}</h3>
                                <h2 className="text-2xl font-bold dark:text-white">{phase.title}</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {phase.items.map((item: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedItem(item)}
                                    className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:bg-emerald-500/10 transition-colors">
                                            <item.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-500" />
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                            {item.est}
                                        </span>
                                    </div>
                                    <h4 className="font-bold dark:text-white mb-2 leading-tight">{item.title}</h4>
                                    <div className="flex flex-wrap gap-1 mt-auto">
                                        {item.tools.map((t: string) => (
                                            <span key={t} className="text-[9px] text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide-over Detail Panel */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
                    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 h-full shadow-2xl relative animate-in slide-in-from-right duration-500 flex flex-col">
                        <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                    <selectedItem.icon className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{selectedItem.type}</h3>
                                    <h2 className="text-xl font-bold dark:text-white">{selectedItem.title}</h2>
                                </div>
                            </div>
                            <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                <X className="w-6 h-6 text-zinc-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10">
                            <div className="prose dark:prose-invert max-w-none">
                                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
                                    <FileText className="w-4 h-4" />
                                    <span>Deliverable Type: <strong>{selectedItem.deliverable.type}</strong></span>
                                    <span className="mx-2">|</span>
                                    <span>Estimated Effort: <strong>{selectedItem.est}</strong></span>
                                </div>

                                <div className="space-y-4">
                                    {selectedItem.deliverable.markdown.split('\n').map((line: string, i: number) => {
                                        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black mt-10 mb-6">{line.replace('# ', '')}</h1>;
                                        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            {line.replace('## ', '')}
                                        </h2>;
                                        if (line.startsWith('- ')) return <div key={i} className="flex gap-3 mb-2 text-zinc-400">
                                            <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-emerald-500" />
                                            <span>{line.replace('- ', '')}</span>
                                        </div>;
                                        if (line.startsWith('**')) return <p key={i} className="text-zinc-300 font-bold mb-4">{line.replace(/\*\*/g, '')}</p>;
                                        return <p key={i} className="text-zinc-400 mb-4 leading-relaxed">{line}</p>;
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex gap-4">
                            <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-600/20 group">
                                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                Generate Deliverable
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
