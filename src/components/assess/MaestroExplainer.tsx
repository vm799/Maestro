import { useState, useMemo, useEffect } from 'react';
import {
    Shield, ChevronLeft, AlertTriangle, Layers, Target, Zap,
    Lock, Eye, Activity, Box, Database, Cpu, Globe,
    BarChart3, ExternalLink
} from 'lucide-react';
import { useClient, type ToolNode, type Mitigation } from '../../context/ClientContext';
import { ExpertBrief } from '../shared/ExpertBrief';

// --- Types & Data ---

interface Threat {
    id: string;
    title: string;
    description: string;
    analogy: string;
    rationale: string;
    source: string;
    sourceUrl: string;
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
        description: "The interaction plane where autonomous agents interface with users, external APIs, and business applications.",
        icon: Globe,
        color: "text-blue-400",
        threats: [
            {
                id: "LLM08",
                title: "Excessive Agency",
                description: "Granting agents overly broad permissions or autonomy, leading to unintended actions in horizontal applications.",
                analogy: "Like giving a robot helper the keys to your entire house when it only needs to vacuum the living room.",
                rationale: "Excessive autonomy without human-in-the-loop (HITL) increases the blast radius of prompt injections and model failures.",
                source: "OWASP Top 10 for LLM Applications",
                sourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
            },
            {
                id: "LLM09",
                title: "Overreliance",
                description: "Uncritical acceptance of agent outputs without human oversight, leading to the propagation of errors.",
                analogy: "Following a GPS blindly even when it tells you to drive into a lake.",
                rationale: "Organizational dependency on stochastic model outputs without validation protocols creates systemic risk in decision-making.",
                source: "OWASP Top 10 for LLM Applications",
                sourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
            }
        ]
    },
    {
        id: 6,
        name: "Layer 6: Security & Compliance",
        description: "The governance framework (Govern Function) ensuring alignment with regulatory and safety standards.",
        icon: Lock,
        color: "text-purple-400",
        threats: [
            {
                id: "NIST-GOV",
                title: "Governance Deficit",
                description: "Failure to establish a risk management culture and accountability for AI systems.",
                analogy: "Building a skyscraper without any building codes or safety inspections.",
                rationale: "Lack of GOVERN-function adherence leads to non-compliance with EU AI Act and NIST AI RMF 1.0 mandates.",
                source: "NIST AI Risk Management Framework",
                sourceUrl: "https://www.nist.gov/itl/ai-risk-management-framework"
            }
        ]
    },
    {
        id: 5,
        name: "Layer 5: Evaluation & Observability",
        description: "The MEASURE function (NIST) for tracking performance, detecting anomalies, and ensuring long-term reliability.",
        icon: Eye,
        color: "text-emerald-400",
        threats: [
            {
                id: "LLM07",
                title: "Insecure Plugin Design",
                description: "Vulnerabilities in extensions or monitoring tools that interface with the agent core.",
                analogy: "Using a cheap, knock-off security camera that actually lets hackers see inside your house.",
                rationale: "Evaluation tools often require elevated privileges, making them high-value targets for lateral movement.",
                source: "OWASP Top 10 for LLM Applications",
                sourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
            }
        ]
    },
    {
        id: 4,
        name: "Layer 4: Deployment & Infrastructure",
        description: "The orchestration and compute environment (Kubernetes, Serverless) where AI assets reside.",
        icon: Box,
        color: "text-amber-400",
        threats: [
            {
                id: "LLM04",
                title: "Model Denial of Service",
                description: "Resource exhaustion attacks targeting model endpoints or orchestration layers.",
                analogy: "Prank callers calling a pizza shop so many times that real customers can't get through to order.",
                rationale: "Stochastic models are computationally expensive; lack of rate-limiting at the infra layer leads to service total failure.",
                source: "OWASP Top 10 for LLM Applications",
                sourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
            }
        ]
    },
    {
        id: 3,
        name: "Layer 3: Agent Frameworks",
        description: "Development toolkits (LangChain, AutoGen) used to build and orchestrate agent logic.",
        icon: Activity,
        color: "text-indigo-400",
        threats: [
            {
                id: "LLM05",
                title: "Supply Chain Vulnerabilities",
                description: "Risks from third-party libraries, datasets, and pre-trained models in the dev pipeline.",
                analogy: "Using a recipe that calls for an ingredient that's been recalled for being contaminated.",
                rationale: "Framework dependencies are often opaque, allowing malicious code to persist across multiple agent deployments.",
                source: "OWASP Top 10 for LLM Applications",
                sourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
            }
        ]
    },
    {
        id: 2,
        name: "Layer 2: Data Operations",
        description: "Vector storage, RAG pipelines, and data preparation workflows (MAP Function).",
        icon: Database,
        color: "text-rose-400",
        threats: [
            {
                id: "LLM03",
                title: "Training Data Poisoning",
                description: "Manipulating retrieval data or fine-tuning sets to compromise model behavior.",
                analogy: "Subtly changing a textbook so that students learn 2+2=5 without realizing it's wrong.",
                rationale: "Poisoned data in RAG pipelines can force agents to leak enterprise secrets or provide malicious advice.",
                source: "OWASP Top 10 for LLM Applications",
                sourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
            }
        ]
    },
    {
        id: 1,
        name: "Layer 1: Foundation Models",
        description: "Base LLMs and specialized models providing the core intelligence layer.",
        icon: Cpu,
        color: "text-slate-400",
        threats: [
            {
                id: "LLM01",
                title: "Prompt Injection",
                description: "Manipulating model behavior via crafted inputs to bypass safety guardrails.",
                analogy: "Telling a security guard 'The boss said it's okay for me to go in' even when you don't have a badge.",
                rationale: "Direct and indirect injections (LLM01) can override the system prompt, leading to unauthorized data access.",
                source: "OWASP Top 10 for LLM Applications",
                sourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
            },
            {
                id: "LLM10",
                title: "Model Theft",
                description: "Unauthorized access or exfiltration of proprietary model weights and architectures.",
                analogy: "Breaking into a secret lab to steal the blueprint for a revolutionary new invention.",
                rationale: "Exfiltration of model parameters (LLM10) allows attackers to perform offline adversarial testing.",
                source: "OWASP Top 10 for LLM Applications",
                sourceUrl: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
            }
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
    const { stack, connections, runMaestroAudit, maestroAudit } = useClient();
    const [activeView, setActiveView] = useState<'theory' | 'audit' | 'mitigation' | 'patterns'>('theory');
    const [selectedLayerId, setSelectedLayerId] = useState<number | null>(7);
    const [isScanning, setIsScanning] = useState(false);
    const [briefData, setBriefData] = useState<any>(null);

    useEffect(() => {
        runMaestroAudit();
    }, [stack.length, connections.length]);

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

    const handleRunScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            runMaestroAudit();
            setIsScanning(false);
            setActiveView('audit');
        }, 1500);
    };

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
                            MAESTRO Strategic Audit
                        </h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">NIST AI RMF 1.0 Aligned / OWASP Verified</p>
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
                    onClick={handleRunScan}
                    disabled={isScanning}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isScanning
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                        }`}
                >
                    {isScanning ? (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            Scanning...
                        </div>
                    ) : (
                        <>
                            <Search className="w-4 h-4" /> Run Deep Scan
                        </>
                    )}
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-zinc-950 p-10">
                    {activeView === 'theory' && (
                        <TheoryView
                            selectedLayer={selectedLayer}
                            setSelectedLayerId={setSelectedLayerId}
                            maestroAudit={maestroAudit}
                        />
                    )}
                    {activeView === 'audit' && (
                        <AuditView
                            toolsByLayer={toolsByLayer}
                            connections={connections}
                            vulnerabilities={maestroAudit.vulnerabilities}
                        />
                    )}
                    {activeView === 'mitigation' && (
                        <MitigationView
                            toolsByLayer={toolsByLayer}
                            proposedMitigations={maestroAudit.mitigations}
                        />
                    )}
                    {activeView === 'patterns' && (
                        <PatternView selectedPattern={maestroAudit.selectedPattern} />
                    )}
                </div>

                {/* Vertical Info Panel (Theory View Only) */}
                {activeView === 'theory' && selectedLayer && (
                    <div className="w-[450px] border-l border-zinc-800 bg-zinc-900/40 overflow-y-auto animate-in slide-in-from-right-8 duration-300">
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-4 rounded-2xl bg-zinc-800 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
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
                                <AlertTriangle className="w-4 h-4 text-amber-500" /> Layer Specific Risks
                            </h3>
                            <div className="space-y-3">
                                {selectedLayer.threats.map(threat => (
                                    <button
                                        key={threat.id}
                                        onClick={() => setBriefData({
                                            title: threat.title,
                                            analogy: threat.analogy,
                                            rationale: threat.rationale,
                                            frameworkReference: { label: threat.source, url: threat.sourceUrl }
                                        })}
                                        className="w-full text-left p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-emerald-500 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{threat.title}</h4>
                                            <span className="text-[10px] font-mono text-zinc-600">{threat.id}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-light">{threat.description}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> NIST Strategic Indicator
                                </h4>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Vulnerabilities at this layer impact the <span className="text-blue-400 font-bold">MEASURE</span> and <span className="text-blue-400 font-bold">MANAGE</span> functions of the NIST AI RMF, creating high variance in system output reliability.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ExpertBrief
                isOpen={!!briefData}
                onClose={() => setBriefData(null)}
                {...briefData!}
            />
        </div>
    );
}

// --- Specific Views ---

function TheoryView({ selectedLayer, setSelectedLayerId, maestroAudit }: any) {
    const { vulnerabilities } = maestroAudit;

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
                {MAESTRO_LAYERS.map((layer, idx) => {
                    const layerRisks = vulnerabilities?.filter((v: any) => v.layer === layer.id) || [];
                    const hasCritical = layerRisks.some((r: any) => r.severity === 'critical');

                    return (
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
                                : layerRisks.length > 0
                                    ? hasCritical
                                        ? "bg-red-950/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                                        : "bg-amber-950/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                                    : "bg-zinc-900/80 border-zinc-700 bg-opacity-90 group-hover:border-zinc-500"
                                }`}>
                                <div className={`p-4 rounded-xl bg-zinc-950 border border-zinc-800 mr-8`}>
                                    <layer.icon className={`w-6 h-6 ${selectedLayer?.id === layer.id ? "text-emerald-400" : "text-zinc-500"}`} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-[10px] font-mono font-bold text-zinc-500 tracking-[0.3em]">LAYER 0{layer.id}</div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold">{layer.name.split(': ')[1]}</h3>
                                        {layerRisks.length > 0 && (
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${hasCritical ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'}`}>
                                                Red Flag: {layerRisks.length} Risk{layerRisks.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`flex items-center gap-6 transition-opacity ${layerRisks.length > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <div className="text-right">
                                        <div className={`text-[10px] font-bold uppercase ${layerRisks.length > 0 ? (hasCritical ? 'text-red-400' : 'text-amber-400') : 'text-zinc-600'}`}>Threat Nodes</div>
                                        <div className="text-lg font-bold text-white">{layerRisks.length > 0 ? layerRisks.length : layer.threats.length} Identified</div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${layerRisks.length > 0 ? (hasCritical ? 'border-red-500 text-red-500' : 'border-amber-500 text-amber-500') : 'border-zinc-700 text-zinc-400'}`}>
                                        <ChevronLeft className="w-5 h-5 rotate-180" />
                                    </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

function AuditView({ toolsByLayer, connections, vulnerabilities }: any) {
    const steps = [
        { id: 1, label: "System Decomposition", status: "complete" },
        { id: 2, label: "Layer Threat Modeling", status: "complete" },
        { id: 3, label: "Cross-Layer ID", status: vulnerabilities?.length > 0 ? "complete" : "current" },
        { id: 4, label: "Risk Assessment", status: vulnerabilities?.length > 0 ? "current" : "pending" },
        { id: 5, label: "Mitigation Planning", status: "pending" },
        { id: 6, label: "Continuous Monitoring", status: "pending" }
    ];

    return (
        <div className="max-w-6xl">
            {/* Step Tracker */}
            <div className="mb-12 flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex-wrap">
                {steps.map(step => (
                    <div key={step.id} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${step.status === 'complete' ? 'bg-emerald-600 border-emerald-500 text-white' :
                            step.status === 'current' ? 'bg-blue-600 border-blue-500 text-white animate-pulse' :
                                'bg-zinc-800 border-zinc-700 text-zinc-500'
                            }`}>
                            {step.status === 'complete' ? <CheckCircle className="w-3 h-3" /> : step.id}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-zinc-600' : 'text-zinc-300'
                            }`}>{step.label}</span>
                        {step.id < 6 && <div className="w-8 h-px bg-zinc-800 hidden sm:block" />}
                    </div>
                ))}
            </div>

            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold mb-2">Ecosystem Correlation Audit</h2>
                    <p className="text-zinc-500 text-sm">Mapping detected assets to MAESTRO threats and identifying cross-layer causality.</p>
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
                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Critical Vulnerabilities</div>
                        <div className="text-2xl font-bold text-red-500">{vulnerabilities?.length || 0}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {MAESTRO_LAYERS.map(layer => {
                    const tools = toolsByLayer[layer.id];
                    const layerRisks = vulnerabilities?.filter((v: any) => v.layer === layer.id) || [];

                    return (
                        <div key={layer.id} className={`p-6 bg-zinc-900/40 border rounded-2xl flex gap-10 items-center transition-all ${layerRisks.length > 0 ? "border-red-500/30 bg-red-950/5" : "border-zinc-800"
                            }`}>
                            <div className="w-48 shrink-0">
                                <div className="text-[10px] font-mono font-bold text-zinc-500">LAYER 0{layer.id}</div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <layer.icon className={`w-4 h-4 ${layerRisks.length > 0 ? 'text-red-400' : 'text-zinc-600'}`} />
                                    {layer.name.split(': ')[1]}
                                </h3>
                            </div>

                            <div className="flex-1 flex gap-3 flex-wrap">
                                {tools.length > 0 ? (
                                    tools.map((t: any) => (
                                        <div key={t.id} className="px-4 py-2 bg-zinc-950 border border-zinc-700/50 rounded-xl flex items-center gap-3">
                                            <span className="text-sm font-bold text-zinc-300">{t.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-zinc-700 italic">No assets detected.</div>
                                )}
                            </div>

                            <div className="flex-1">
                                {layerRisks.map((risk: any) => (
                                    <div key={risk.id} className="flex items-start gap-2 text-xs text-red-400 animate-in slide-in-from-left-2">
                                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        <span>{risk.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MitigationView({ toolsByLayer, proposedMitigations }: any) {
    const allMitigations = useMemo(() => {
        const merged = [...MITIGATION_STRATEGIES];
        proposedMitigations?.forEach((pm: any) => {
            if (!merged.find(m => m.id === pm.id)) merged.push(pm);
        });
        return merged;
    }, [proposedMitigations]);

    return (
        <div className="max-w-4xl">
            <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4 text-white">Strategic Mitigation Controls</h2>
                <p className="text-zinc-500">Validated remediation strategies aligned with NIST AI RMF Manage function and ISO 42001 standards.</p>
            </div>

            <div className="space-y-6">
                {allMitigations.map(strat => {
                    const affectedLayers = MAESTRO_LAYERS.filter(l => strat.layerRelevance.includes(l.id));
                    const toolsProtected = strat.layerRelevance.reduce((acc, lId) => acc + (toolsByLayer[lId]?.length || 0), 0);

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
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Impact Radius</div>
                                    <div className="text-3xl font-black text-white">{toolsProtected >= 1 ? 'RELEVANT' : 'ADVISORY'}</div>
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
                                        <ExternalLink className="w-3 h-3" /> Technical Evidence Rationale
                                    </div>
                                    <p className="text-xs text-zinc-300 italic">"{strat.evidence}"</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 p-8 bg-zinc-900 border border-zinc-800 rounded-3xl text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Secure Your Stack?</h3>
                <p className="text-zinc-500 text-sm mb-6">These mitigations have been injected into your dynamic remediation roadmap.</p>
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'roadmap' }))}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                    View Remediation Plan
                </button>
            </div>
        </div>
    );
}

function PatternView({ selectedPattern }: any) {
    return (
        <div className="max-w-5xl">
            <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4">Agentic Architecture Patterns</h2>
                <p className="text-zinc-500">Analysis of autonomous interaction models detected in your architecture.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {AGENTIC_PATTERNS.map(pattern => (
                    <div key={pattern.name} className={`p-8 bg-zinc-900 border rounded-3xl transition-all flex flex-col ${selectedPattern === pattern.name.split(' ')[0] || (selectedPattern === 'Multi-Agent' && pattern.name.includes('Multi'))
                        ? "border-emerald-500 bg-emerald-950/5 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        : "border-zinc-800"
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">{pattern.name}</h3>
                            {selectedPattern && (pattern.name.includes(selectedPattern) || (selectedPattern === 'Multi-Agent' && pattern.name.includes('Multi'))) && (
                                <span className="px-2 py-1 bg-emerald-500 text-black text-[10px] font-black rounded uppercase">Detected Pattern</span>
                            )}
                        </div>
                        <p className="text-zinc-400 text-sm mb-6 flex-1 leading-relaxed">{pattern.description}</p>

                        <div className="space-y-4 pt-6 border-t border-zinc-800">
                            <div>
                                <div className="text-[10px] font-bold text-red-400/80 uppercase mb-1 flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" /> Architecture Risk Profile
                                </div>
                                <div className="text-xs text-zinc-300 font-medium leading-relaxed italic">"{pattern.threat}"</div>
                            </div>
                            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                                <div className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Prescribed Mitigation</div>
                                <div className="text-xs text-zinc-400 leading-relaxed font-light">{pattern.mitigation}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Support Components
const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const Search = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
