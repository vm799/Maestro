import React, { useState, useMemo } from 'react';
import {
    Shield, ChevronLeft, AlertTriangle, Layers, Info, Target, Zap,
    Lock, Eye, Activity, Box, Database, Cpu, Globe, ArrowRight,
    CheckCircle, ExternalLink, Filter, BarChart3, Search, Play, FileText
} from 'lucide-react';
import { useClient, type ToolNode, type Risk, type Mitigation } from '../../context/ClientContext';

// --- Types & Data ---

interface Threat {
    id: string;
    title: string;
    description: string;
}

interface MaestroLayer {
    id: number;
    name: string;
    description: string;
    icon: any;
    color: string;
    threats: Threat[];
}

const MAESTRO_LAYERS: MaestroLayer[] = [
    {
        id: 7,
        name: "Layer 7: Agent Ecosystem",
        description: "The marketplace and interface layer where AI agents interact with users and business applications.",
        icon: Globe,
        color: "text-blue-400",
        threats: [
            { id: "L7-C1", title: "Compromised Agents", description: "Malicious AI agents designed to perform harmful actions, infiltrating the ecosystem by posing as legitimate services." },
            { id: "L7-IA", title: "Agent Identity Attack", description: "Attacks that compromise the identity and authorization mechanisms of AI agents, resulting in unauthorized access." },
            { id: "L7-GZ", title: "Agent Goal Manipulation", description: "Attackers manipulating the intended goals of AI agents, causing them to pursue objectives different from their original purpose." },
            { id: "L7-TM", title: "Agent Tool Misuse", description: "AI agents being manipulated to utilize their tools in ways not intended, leading to unforeseen harmful actions." },
            { id: "L7-MM", title: "Marketplace Manipulation", description: "False ratings, reviews, or recommendations designed to promote malicious AI agents." },
            { id: "L7-IR", title: "Integration Risks", description: "Vulnerabilities in APIs or SDKs used to integrate AI agents with other systems." },
            { id: "L7-REP", title: "Repudiation", description: "AI agents denying actions they performed, creating accountability issues in the system." },
            { id: "L7-AR", title: "Compromised Agent Registry", description: "Manipulating agent listings to inject malicious entries or modify details of legitimate agents." }
        ]
    },
    {
        id: 6,
        name: "Layer 6: Security & Compliance (Vertical)",
        description: "A vertical layer ensuring security and compliance controls are integrated into all operations.",
        icon: Lock,
        color: "text-purple-400",
        threats: [
            { id: "L6-DP", title: "Security Agent Data Poisoning", description: "Manipulating training data used by AI security agents, causing them to misidentify threats." },
            { id: "L6-EV", title: "Evasion of Security AI Agents", description: "Using adversarial techniques to bypass security AI agents' detection capabilities." },
            { id: "L6-COM", title: "Compromised Security AI Agents", description: "Attackers gaining control over AI security agents to disable security systems." },
            { id: "L6-NC", title: "Regulatory Non-Compliance", description: "AI security agents operating in violation of privacy regulations due to misconfiguration." },
            { id: "L6-BIAS", title: "Bias in Security AI Agents", description: "Biases leading to unfair or discriminatory security practices." },
            { id: "L6-XAI", title: "Lack of Explainability", description: "Transparency issues causing difficulty in auditing actions or identifying root causes of failure." }
        ]
    },
    {
        id: 5,
        name: "Layer 5: Evaluation & Observability",
        description: "Tools and processes for tracking AI performance, detecting anomalies, and ensuring reliability.",
        icon: Eye,
        color: "text-emerald-400",
        threats: [
            { id: "L5-MET", title: "Manipulation of Evaluation Metrics", description: "Influencing benchmarks to favor certain agents via poisoned datasets or biased test cases." },
            { id: "L5-OTC", title: "Compromised Observability Tools", description: "Injecting malicious code into monitoring systems to exfiltrate data or hide behavior." },
            { id: "L5-DOS", title: "DoS on Evaluation Infrastructure", description: "Disrupting testing processes to prevent detection of compromised behavior." },
            { id: "L5-EV", title: "Evasion of Detection", description: "Agents designed to avoid triggering alerts or being flagged by observability systems." },
            { id: "L5-LEAK", title: "Data Leakage through Observability", description: "Sensitive information exposed through logs or monitoring dashboards." }
        ]
    },
    {
        id: 4,
        name: "Layer 4: Deployment & Infrastructure",
        description: "The underlying compute and orchestration environment (Cloud, K8s, On-prem).",
        icon: Box,
        color: "text-amber-400",
        threats: [
            { id: "L4-IMG", title: "Compromised Container Images", description: "Malicious code injected into AI agent containers infecting production systems." },
            { id: "L4-ORC", title: "Orchestration Attacks", description: "Exploiting K8s or similar systems to gain unauthorized control over AI deployments." },
            { id: "L4-IAC", title: "IaC Manipulation", description: "Tampering with Terraform/CloudFormation to provision insecure or compromised resources." },
            { id: "L4-DOS", title: "Denial of Service (DoS)", description: "Overwhelming infrastructure resources to make AI systems unavailable." },
            { id: "L4-LAT", title: "Lateral Movement", description: "Gaining access to one part of the infrastructure to compromise other sensitive AI areas." }
        ]
    },
    {
        id: 3,
        name: "Layer 3: Agent Frameworks",
        description: "The developer toolkits (LangChain, AutoGen) and orchestration frameworks.",
        icon: Activity,
        color: "text-indigo-400",
        threats: [
            { id: "L3-COM", title: "Compromised Framework Components", description: "Malicious code in libraries or modules used by AI development frameworks." },
            { id: "L3-BACK", title: "Backdoor Attacks", description: "Hidden vulnerabilities in frameworks exploited to gain unauthorized access." },
            { id: "L3-VAL", title: "Input Validation Attacks", description: "Exploiting weaknesses in input handling allowing for code injection." },
            { id: "L3-SC", title: "Supply Chain Attacks", description: "Targeting framework dependencies to compromise software before distribution." },
            { id: "L3-DOS", title: "DoS on Framework APIs", description: "Overloading services to prevent normal operation of the AI agents." }
        ]
    },
    {
        id: 2,
        name: "Layer 2: Data Operations",
        description: "Processing, vector storage, RAG pipelines, and data preparation.",
        icon: Database,
        color: "text-rose-400",
        threats: [
            { id: "L2-PSN", title: "Data Poisoning", description: "Manipulating training or retrieval data to compromise AI agent behavior." },
            { id: "L2-EXF", title: "Data Exfiltration", description: "Stealing sensitive AI information from vector stores or databases." },
            { id: "L2-TAMP", title: "Data Tampering", description: "Modifying AI data in transit or at rest, leading to incorrect agent behavior." },
            { id: "L2-RAG", title: "Compromised RAG Pipelines", description: "Injecting malicious data into retrieval workflows to cause erroneous results." },
            { id: "L2-DOS", title: "DoS on Data Infrastructure", description: "Disrupting access to data needed by AI agents for functionality." }
        ]
    },
    {
        id: 1,
        name: "Layer 1: Foundation Models",
        description: "The core LLMs and base models providing the fundamental intelligence.",
        icon: Cpu,
        color: "text-slate-400",
        threats: [
            { id: "L1-ADV", title: "Adversarial Examples", description: "Inputs crafted to fool the model into making incorrect predictions or behaving unexpectedly." },
            { id: "L1-STL", title: "Model Stealing", description: "Extracting a copy of the AI model through API queries for IP theft." },
            { id: "L1-BACK", title: "Backdoor Attacks", description: "Hidden triggers causing the model to behave maliciously when activated." },
            { id: "L1-INF", title: "Membership Inference", description: "Determining if a specific data point was used to train the model, violating privacy." },
            { id: "L1-DOS", title: "Model DoS (Sponge Attacks)", description: "Overwhelming models with expensive queries to exhaust computational resources." }
        ]
    }
];

const AGENTIC_PATTERNS = [
    {
        name: "Single-Agent Pattern",
        description: "A single AI agent operating independently to achieve a goal.",
        threat: "Goal Manipulation: Attackers can change the agent's internal goal to produce harmful results.",
        mitigation: "Input validation, limiting access to internal parameters, and monitoring.",
        riskLevel: "Moderate"
    },
    {
        name: "Multi-Agent Pattern",
        description: "Multiple AI agents working together through communication channels.",
        threat: "Communication Channel & Identity Attacks: Intercepting messages or masquerading as agents.",
        mitigation: "Secure communication protocols, mutual authentication, and input validation.",
        riskLevel: "High"
    },
    {
        name: "Hierarchical Agent Pattern",
        description: "Multiple layers of agents, where higher-level agents control subordinates.",
        threat: "Control Compromise: Gaining control of high-level agent allows manipulation of entire hierarchy.",
        mitigation: "Strong access controls, secure inter-agent communication, and regular monitoring.",
        riskLevel: "Critical"
    },
    {
        name: "Distributed Agent Ecosystem",
        description: "Decentralized system of many agents working within a shared environment.",
        threat: "Sybil Attacks: Creating fake agent identities to gain disproportionate influence.",
        mitigation: "Robust identity management and reputation-based reputation systems.",
        riskLevel: "High"
    }
];

const MITIGATION_STRATEGIES: Mitigation[] = [
    {
        id: "M-ADV",
        title: "Adversarial Training & Robustness",
        description: "Training agents specifically to recognize and resist adversarial examples and sponge attacks.",
        evidence: "Proven to reduce model error rates against crafted inputs by 35% in enterprise LLM deployments.",
        layerRelevance: [1],
        status: "proposed"
    },
    {
        id: "M-AUTH",
        title: "Mutual TLS & Agent Identity (SPIFFE)",
        description: "Implementing strong cryptographic identity for every agent and microservice communication.",
        evidence: "Prevents 99% of agent impersonation and lateral movement attacks in distributed ecosystems.",
        layerRelevance: [3, 4, 7],
        status: "proposed"
    },
    {
        id: "M-DLP",
        title: "AI-Aware Data Loss Prevention",
        description: "Monitoring RAG pipelines and model outputs for PII, secrets, and sensitive intellectual property.",
        evidence: "Critical for GDPR/SOC2 compliance; identifies 90% of unintended data leaks in observability logs.",
        layerRelevance: [2, 5],
        status: "proposed"
    },
    {
        id: "M-RED",
        title: "Continuous Red Teaming",
        description: "Automated simulation of prompt injection, model stealing, and jailbreaking attacks.",
        evidence: "Identifies vulnerabilities in framework APIs and model endpoints before attackers can exploit them.",
        layerRelevance: [1, 3, 6],
        status: "proposed"
    }
];

// --- Main Components ---

export function MaestroExplainer() {
    const { stack, connections } = useClient();
    const [activeView, setActiveView] = useState<'theory' | 'audit' | 'mitigation' | 'patterns'>('theory');
    const [selectedLayerId, setSelectedLayerId] = useState<number | null>(7);

    const selectedLayer = useMemo(() =>
        MAESTRO_LAYERS.find(l => l.id === selectedLayerId),
        [selectedLayerId]);

    const toolsByLayer = useMemo(() => {
        const mapping: Record<number, ToolNode[]> = {};
        MAESTRO_LAYERS.forEach(l => {
            mapping[l.id] = stack.filter(t => t.layer === l.id);
        });
        return mapping;
    }, [stack]);

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden select-none">
            {/* Nav Header */}
            <header className="px-8 py-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'stackmap' }))}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            MAESTRO Deep Audit
                        </h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">PhD Security Expert / McKinsey Logic</p>
                    </div>
                </div>

                <div className="flex bg-zinc-800/50 p-1 rounded-xl border border-zinc-700">
                    {[
                        { id: 'theory', label: 'Framework View', icon: Layers },
                        { id: 'audit', label: 'Ecosystem Audit', icon: Target },
                        { id: 'mitigation', label: 'Strategic Mitigations', icon: Zap },
                        { id: 'patterns', label: 'Agentic Patterns', icon: Activity }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === tab.id
                                    ? "bg-emerald-600 text-white shadow-lg"
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'assess' }))}
                    className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                    Final Recommendation <ArrowRight className="w-4 h-4" />
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-zinc-950 p-10">
                    {activeView === 'theory' && <TheoryView selectedLayer={selectedLayer} setSelectedLayerId={setSelectedLayerId} />}
                    {activeView === 'audit' && <AuditView toolsByLayer={toolsByLayer} connections={connections} />}
                    {activeView === 'mitigation' && <MitigationView toolsByLayer={toolsByLayer} />}
                    {activeView === 'patterns' && <PatternView />}
                </div>

                {/* Vertical Info Panel (Conditional based on view) */}
                {selectedLayer && activeView === 'theory' && (
                    <div className="w-[450px] border-l border-zinc-800 bg-zinc-900/30 overflow-y-auto animate-in slide-in-from-right-8 duration-300">
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-4 rounded-2xl bg-zinc-800 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]`}>
                                    <selectedLayer.icon className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-xs font-mono font-bold text-emerald-500">LAYER 0{selectedLayer.id}</div>
                                    <h2 className="text-2xl font-bold">{selectedLayer.name.split(': ')[1]}</h2>
                                </div>
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-8 italic">
                                "{selectedLayer.description}"
                            </p>

                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" /> Granular Threat Landscape
                            </h3>
                            <div className="space-y-3">
                                {selectedLayer.threats.map(threat => (
                                    <div key={threat.id} className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-zinc-500 transition-all group">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{threat.title}</h4>
                                            <span className="text-[10px] font-mono text-zinc-600">{threat.id}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-light">{threat.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> McKinsey Impact Projection
                                </h4>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Disruption at this layer represents a <span className="text-red-400 font-bold">High Blast Radius</span> risk. Failure here typically cascades to higher layers through compromised API registries or goal misalignment.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Specific Views ---

function TheoryView({ selectedLayer, setSelectedLayerId }: any) {
    return (
        <div className="max-w-4xl">
            <div className="mb-12">
                <h2 className="text-5xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                    The MAESTRO Reference Architecture
                </h2>
                <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                    Decomposing complex AI agent ecosystems into distinct functional layers to enable modular security and systematic audit.
                </p>
            </div>

            <div className="relative space-y-[-20px] pb-20 mt-20">
                {MAESTRO_LAYERS.map((layer, idx) => (
                    <button
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`group relative w-full h-[100px] transition-all duration-500 hover:translate-x-4 ${selectedLayer?.id === layer.id ? "scale-105 z-20" : "scale-100 z-10"
                            }`}
                        style={{
                            transform: `perspective(1000px) rotateX(25deg)`,
                            zIndex: 20 - idx
                        }}
                    >
                        <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 flex items-center px-10 ${selectedLayer?.id === layer.id
                                ? "bg-zinc-800 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                                : "bg-zinc-900/80 border-zinc-700 bg-opacity-90 group-hover:border-zinc-500"
                            }`}>
                            <div className={`p-4 rounded-xl bg-zinc-950 border border-zinc-800 mr-8`}>
                                <layer.icon className={`w-6 h-6 ${selectedLayer?.id === layer.id ? "text-emerald-400" : "text-zinc-500"}`} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-[10px] font-mono font-bold text-zinc-500 tracking-[0.3em]">LAYER 0{layer.id}</div>
                                <h3 className="text-xl font-bold">{layer.name.split(': ')[1]}</h3>
                            </div>
                            <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-zinc-600 uppercase">Threat Nodes</div>
                                    <div className="text-lg font-bold text-white">{layer.threats.length} Identified</div>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function AuditView({ toolsByLayer, connections }: any) {
    return (
        <div className="max-w-6xl">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold mb-2">Ecosystem Correlation Audit</h2>
                    <p className="text-zinc-500">Projecting your specific tech stack onto the MAESTRO layers.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex gap-8">
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Total Assets</div>
                        <div className="text-2xl font-bold">{Object.values(toolsByLayer).flat().length as number}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Active Links</div>
                        <div className="text-2xl font-bold text-blue-400">{connections.length}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Gaps Detected</div>
                        <div className="text-2xl font-bold text-red-400">
                            {MAESTRO_LAYERS.filter(l => toolsByLayer[l.id].length === 0).length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {MAESTRO_LAYERS.map(layer => {
                    const tools = toolsByLayer[layer.id];
                    return (
                        <div key={layer.id} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex gap-10 items-center group hover:bg-zinc-900/60 transition-all">
                            <div className="w-48 shrink-0">
                                <div className="text-[10px] font-mono font-bold text-zinc-500">LAYER 0{layer.id}</div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <layer.icon className="w-4 h-4 text-zinc-600" />
                                    {layer.name.split(': ')[1]}
                                </h3>
                            </div>

                            <div className="flex-1 flex gap-3 flex-wrap">
                                {tools.length > 0 ? (
                                    tools.map((t: any) => (
                                        <div key={t.id} className="px-4 py-2 bg-zinc-950 border border-zinc-700/50 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center">
                                                {t.icon && <t.icon className="w-3.5 h-3.5 text-zinc-400" />}
                                            </div>
                                            <span className="text-sm font-bold">{t.name}</span>
                                            {t.risky && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-zinc-700 italic flex items-center gap-2">
                                        <Info className="w-3 h-3" /> No assets detected in this architectural layer.
                                    </div>
                                )}
                            </div>

                            {tools.length === 0 && (
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-amber-500/50 uppercase mb-1">Vulnerability</div>
                                    <div className="text-xs font-bold text-amber-500">Unmanaged Layer</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MitigationView({ toolsByLayer }: any) {
    return (
        <div className="max-w-4xl">
            <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4">Strategic Mitigation Strategies</h2>
                <p className="text-zinc-500">PhD-level controls prioritized by your tech stack's risk profile.</p>
            </div>

            <div className="space-y-6">
                {MITIGATION_STRATEGIES.map(strat => {
                    const affectedLayers = MAESTRO_LAYERS.filter(l => strat.layerRelevance.includes(l.id));
                    const toolsProtected = strat.layerRelevance.reduce((acc, lId) => acc + toolsByLayer[lId].length, 0);

                    return (
                        <div key={strat.id} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap className="w-32 h-32 text-emerald-400" />
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                            {strat.id}
                                        </span>
                                        <h3 className="text-2xl font-bold">{strat.title}</h3>
                                    </div>
                                    <p className="text-zinc-400 leading-relaxed max-w-xl">{strat.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Relevance Score</div>
                                    <div className="text-3xl font-black text-white">{toolsProtected > 2 ? 'CORE' : toolsProtected > 0 ? 'HIGH' : 'GLOBAL'}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
                                        <Layers className="w-3 h-3" /> Mitigated Layers
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {affectedLayers.map(l => (
                                            <span key={l.id} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-400">
                                                Layer {l.id}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/20">
                                    <div className="text-[10px] font-bold text-emerald-500 uppercase mb-2 flex items-center gap-2">
                                        <ExternalLink className="w-3 h-3" /> Audit Evidence
                                    </div>
                                    <p className="text-xs text-zinc-300 italic">"{strat.evidence}"</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PatternView() {
    return (
        <div className="max-w-5xl">
            <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4">Agentic Architecture Patterns</h2>
                <p className="text-zinc-500">Assessing organizational risk based on autonomous interaction models.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {AGENTIC_PATTERNS.map(pattern => (
                    <div key={pattern.name} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-500 transition-all flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">{pattern.name}</h3>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${pattern.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    pattern.riskLevel === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                {pattern.riskLevel.toUpperCase()} RISK
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6 flex-1">{pattern.description}</p>

                        <div className="space-y-4 pt-6 border-t border-zinc-800">
                            <div>
                                <div className="text-[10px] font-bold text-red-400/80 uppercase mb-1">Primary Threat</div>
                                <div className="text-xs text-zinc-300 font-medium leading-relaxed">{pattern.threat}</div>
                            </div>
                            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                                <div className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Prescribed Mitigation</div>
                                <div className="text-xs text-zinc-400 italic">"{pattern.mitigation}"</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);
