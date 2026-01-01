import React, { useState, useEffect } from 'react';
import { useClient } from '../../context/ClientContext';
import { Target, ArrowRight, Shield, Zap, CheckCircle, Lock, Clock, Wrench, ChevronRight, DollarSign, X, FileText, Download } from 'lucide-react';

export function RoadmapGenerator() {
    const { identifiedRisks, frictionCost, shieldScore, spearScore } = useClient();
    const [selectedItem, setSelectedItem] = useState<any>(null);

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
                    icon: Shield,
                    deliverable: {
                        type: 'Implementation Guide',
                        markdown: `# Remediation Protocol: ${risk.description}\n\n**Severity Level:** ${risk.severity.toUpperCase()}\n\n## Step 1: Isolation\nImmediately restrict access to the affected endpoint or service. Update IAM policies to enforce least-privilege access.\n\n## Step 2: Configuration Change\nApply the patch or configuration change documented in the vendor security bulletin. Verify the fix using the relevant CLI tools.\n\n## Step 3: Validation\nRun the automated regression suite to ensure no service disruption. Document the incident in the GRC platform.`
                    }
                })),
                {
                    title: 'Deploy "The Governor" PII Filter',
                    type: 'tech',
                    tools: ['Maestro-Gov', 'Azure OpenAI'],
                    est: '2 days',
                    icon: Shield,
                    deliverable: {
                        type: 'Configuration Artifact',
                        markdown: `# The Governor: PII Filter Configuration\n\n## Overview\nThis module intercepts all LLM prompts and redacts sensitive entities before they leave your VPC.\n\n## Setup Instructions\n1. Pull the Docker container: \`docker pull maestro/governor:latest\`\n2. Set environment variables for Azure OpenAI endpoint.\n3. Configure redaction rules in \`rules.yaml\`:\n   - **SSN**: [REDACTED]\n   - **Credit Card**: [REDACTED]\n   - **Email**: [HASHED]`
                    }
                },
                {
                    title: 'Establish Cost Baseline',
                    type: 'ops',
                    tools: ['Maestro-Friction'],
                    est: '3 days',
                    icon: DollarSign,
                    deliverable: {
                        type: 'Audit Template',
                        markdown: `# Friction Cost Analysis Report\n\n## Objective\nQuantify the "Shadow AI" spend and productivity loss due to fragmented tool usage.\n\n## Methodology\n- **API Audit**: Scan network logs for unauthorized 3rd party AI calls.\n- **User Survey**: "What tools do you pay for on your personal card?"\n- **Output**: A consolidated board-ready PDF report highlighting the projected $${frictionCost.toLocaleString()} annual waste.`
                    }
                }
            ]
        },
        {
            title: 'Phase 2: Literacy & Culture',
            color: 'from-blue-400 to-indigo-500',
            duration: 'Weeks 5-8',
            description: "Shift from Fear to Adoption. Train the team on the tools they are already using.",
            items: [
                {
                    title: 'Launch "Spear" Pilot Program',
                    type: 'culture',
                    tools: ['Workshops'],
                    est: '2 weeks',
                    icon: Zap,
                    deliverable: {
                        type: 'Workshop Deck',
                        markdown: `# Spear Pilot: From Fear to Power\n\n## Slide 1: The "Why"\nAI isn't coming for your job; a human using AI is. Let's upgrade your toolkit.\n\n## Slide 2: The Rules of Engagement\n- Never put customer data in public ChatGPT.\n- Always verify output.\n- Share your prompts in the "Spec Library".\n\n## Activity\nSplit into groups and solve a real business problem using the approved "Maestro" tools.`
                    }
                },
                {
                    title: 'AI Ethics & Safety Certification',
                    type: 'training',
                    tools: ['Internal LMS'],
                    est: '1 week',
                    icon: CheckCircle,
                    deliverable: {
                        type: 'Training Module',
                        markdown: `# AI Safety Certification\n\n**Module 1: Bias & Hallucination**\nUnderstanding how LLMs work and why they lie.\n\n**Module 2: Data Sovereignty**\nWhy your data must stay within our legal jurisdiction.\n\n**Quiz**\n30-question assessment required for "Agent Author" access privileges.`
                    }
                },
                ...(spearScore < 50 ? [{
                    title: 'Emergency "Fear Gauge" Town Hall',
                    type: 'critical',
                    tools: ['Zoom'],
                    est: '1 day',
                    icon: Zap,
                    deliverable: {
                        type: 'Meeting Script',
                        markdown: `# Town Hall Script: Addressing AI Anxiety\n\n**Opening:**\n"We've heard the concerns about 'replacement'. Today we are committing to a 'augmentation-first' policy."\n\n**Key Message:**\nNo one gets fired for automation. We reinvest the saved time into innovation.\n\n**Q&A Preparation:**\nPrepare for questions about job security, privacy, and skill rot.`
                    }
                }] : [])
            ]
        },
        {
            title: 'Phase 3: Sovereign Acceleration',
            color: 'from-purple-400 to-pink-500',
            duration: 'Weeks 9-12',
            description: "Full local deployment. Move off public APIs to private, fine-tuned models.",
            items: [
                {
                    title: 'Deploy Local Llama 3 Swarm',
                    type: 'tech',
                    tools: ['Ollama', 'Docker'],
                    est: '2 weeks',
                    icon: Wrench,
                    deliverable: {
                        type: 'Technical Architecture',
                        markdown: `# Local Swarm Architecture\n\n## Nodes\n- **Inference**: 3x AWS g5.2xlarge instances running Ollama.\n- **Orchestration**: Kubernetes cluster managing the Agent Swarm.\n- **Model Selection**: We will use Llama 3 70B Quantized for general reasoning and CodeLlama for dev tasks.`
                    }
                },
                {
                    title: 'Fine-tune "The Writer" on Company Data',
                    type: 'tech',
                    tools: ['HuggingFace', 'LoRA'],
                    est: '1 week',
                    icon: Target,
                    deliverable: {
                        type: 'Dataset Spec',
                        markdown: `# Fine-Tuning Specification\n\n**Base Model**: Llama 3 8B\n**Target**: "The Writer" (Marketing Copy Specialist)\n\n**Dataset:**\n- 5,000 internal blog posts.\n- 200 whitepapers.\n- Brand Voice Guidelines.\n\n**Method:**\nQLoRA on a single A100 GPU for 4 hours.`
                    }
                }
            ]
        }
    ];

    return (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
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
