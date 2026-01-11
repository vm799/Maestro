import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

// --- Types ---

export type ToolCategory = 'comm' | 'crm' | 'ai' | 'email' | 'hosting' | 'other';

export interface Threat {
    id: string;
    title: string;
    description: string;
    analogy: string;
    rationale: string;
    source: string;
    sourceUrl: string;
}

export interface MaestroLayer {
    id: number;
    name: string;
    description: string;
    icon: any;
    color: string;
    threats: Threat[];
}

export interface AgenticPattern {
    name: string;
    description: string;
    threat: string;
    mitigation: string;
    riskLevel: string;
}

export interface ToolNode {
    id: string;
    name: string;
    category: ToolCategory;
    risky: boolean;
    x?: number;
    y?: number;
    icon?: any;
    layer: number;
}

export interface Risk {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'security' | 'financial' | 'operational';
    description: string;
    detectedBy: 'StackMap' | 'AuditScout' | 'MAESTRO';
    layer?: number;
}

export interface Mitigation {
    id: string;
    title: string;
    description: string;
    evidence: string;
    layerRelevance: number[];
    status: 'proposed' | 'implemented';
}

// --- Metadata (Decoupled) ---

const MAESTRO_LAYERS: MaestroLayer[] = [
    {
        id: 7, name: "Layer 7: Agent Ecosystem", description: "The interaction plane where autonomous agents interface with users, external APIs, and business applications.", icon: 'Globe', color: "text-blue-400",
        threats: [
            { id: "LLM08", title: "Excessive Agency", description: "Granting agents overly broad permissions or autonomy, leading to unintended actions.", analogy: "Robot helper with house keys.", rationale: "Autonomy without HITL increases risk.", source: "OWASP LLM", sourceUrl: "#" },
            { id: "LLM09", title: "Overreliance", description: "Uncritical acceptance of agent outputs.", analogy: "Following GPS into a lake.", rationale: "Organizational dependency on stochastic output.", source: "OWASP LLM", sourceUrl: "#" }
        ]
    },
    {
        id: 6, name: "Layer 6: Security & Compliance", description: "The governance framework (Govern Function) ensuring alignment.", icon: 'Lock', color: "text-purple-400",
        threats: [{ id: "NIST-GOV", title: "Governance Deficit", description: "Failure to establish risk management culture.", analogy: "Skyscraper without safety inspections.", rationale: "NIST AI RMF non-adherence.", source: "NIST AI RMF", sourceUrl: "#" }]
    },
    {
        id: 5, name: "Layer 5: Evaluation & Observability", description: "The MEASURE function (NIST) for tracking performance.", icon: 'Eye', color: "text-emerald-400",
        threats: [{ id: "LLM07", title: "Insecure Plugin Design", description: "Vulnerabilities in extensions or monitoring tools.", analogy: "Knock-off security camera.", rationale: "Tools requirement elevated privileges.", source: "OWASP LLM", sourceUrl: "#" }]
    },
    {
        id: 4, name: "Layer 4: Deployment & Infrastructure", description: "The orchestration and compute environment (Deployment).", icon: 'Box', color: "text-amber-400",
        threats: [{ id: "LLM04", title: "Model Denial of Service", description: "Resource exhaustion attacks.", analogy: "Prank callers at pizza shop.", rationale: "Stochastic models are expensive.", source: "OWASP LLM", sourceUrl: "#" }]
    },
    {
        id: 3, name: "Layer 3: Agent Frameworks", description: "Development toolkits (LangChain, AutoGen).", icon: 'Activity', color: "text-indigo-400",
        threats: [{ id: "LLM05", title: "Supply Chain Vulnerabilities", description: "Risks from third-party libraries.", analogy: "Recalled ingredient in recipe.", rationale: "Opaque dependencies.", source: "OWASP LLM", sourceUrl: "#" }]
    },
    {
        id: 2, name: "Layer 2: Data Operations", description: "Vector storage and RAG pipelines (MAP function).", icon: 'Database', color: "text-rose-400",
        threats: [{ id: "LLM03", title: "Training Data Poisoning", description: "Manipulating retrieval data.", analogy: "Changing textbook subtly.", rationale: "Secret leakage risk.", source: "OWASP LLM", sourceUrl: "#" }]
    },
    {
        id: 1, name: "Layer 1: Foundation Models", description: "Base LLMs and specialized models.", icon: 'Cpu', color: "text-slate-400",
        threats: [
            { id: "LLM01", title: "Prompt Injection", description: "Manipulating model behavior via crafted inputs.", analogy: "Security guard social engineering.", rationale: "Safety guardrail bypass.", source: "OWASP LLM", sourceUrl: "#" },
            { id: "LLM10", title: "Model Theft", description: "Unauthorized access to weights.", analogy: "Stealing secret lab blueprints.", rationale: "Adversarial testing enabled.", source: "OWASP LLM", sourceUrl: "#" }
        ]
    }
];

const AGENTIC_PATTERNS: AgenticPattern[] = [
    { name: "Single-Agent Pattern", description: "Independent AI agent.", threat: "Goal Manipulation.", mitigation: "Input validation.", riskLevel: "Moderate" },
    { name: "Multi-Agent Pattern", description: "Collaborative agents.", threat: "Communication Attacks.", mitigation: "Secure protocols.", riskLevel: "High" },
    { name: "Hierarchical Agent", description: "Layered control.", threat: "Control Compromise.", mitigation: "Strong access controls.", riskLevel: "Critical" }
];

const MITIGATION_STRATEGIES: Mitigation[] = [
    { id: "M-ADV", title: "Adversarial Training", description: "Resistance training.", evidence: "35% error reduction.", layerRelevance: [1], status: "proposed" },
    { id: "M-AUTH", title: "Mutual TLS", description: "SPIFFE identities.", evidence: "99% prevention.", layerRelevance: [3, 4, 7], status: "proposed" },
    { id: "M-DLP", title: "AI-Aware DLP", description: "PII monitoring.", evidence: "GDPR compliance tool.", layerRelevance: [2, 5], status: "proposed" }
];

export interface MaestroAuditResults {
    vulnerabilities: Risk[];
    mitigations: Mitigation[];
    selectedPattern: string | null;
}

export interface Connection {
    fromId: string;
    toId: string;
}

export interface CostBasis {
    avgHourlyRate: number; // e.g. $65/hr
    employeeCount: number; // e.g. 50
    remediationTimePerIncident: number; // hours, e.g. 2
    incidentsPerMonth: number; // Replaces magic number '4'
}

export interface ClientState {
    // Identity
    companyName: string;
    industry: string;
    costBasis: CostBasis;

    // The Stack (Phase 1 Input)
    stack: ToolNode[];
    connections: Connection[];

    // Assessment Data (The Audit)
    shieldScore: number; // 0-100 (Security/Governance)
    spearScore: number;  // 0-100 (Culture/Adoption)
    frictionCost: number; // Estimated monthly waste

    // ARCHITECT GLOBAL STATE
    activeMeetingContext: {
        meetingId: string | null;
        phaseId: string | null;
        agenda: string[];
    };
    liveTechInventory: ToolNode[];
    clientRiskModel: MaestroAuditResults;

    // NEW: Onboarding Sandbox
    isOnboarding: boolean;
    toggleOnboarding: (val: boolean) => void;

    // NEW: Maturity Scales (from Phase 1.5 Assessment)
    maturityScores: {
        literacy: number;      // 0-4 scale
        governance: number;    // 0-4 scale
        adoption: number;      // 0-4 scale (future)
        overall: number;       // Average
    };

    // The "Mess" Findings
    identifiedRisks: Risk[];
    maestroAudit: MaestroAuditResults;

    // DECOUPLED METADATA
    maestroLayers: MaestroLayer[];
    agenticPatterns: AgenticPattern[];
    mitigationLibrary: Mitigation[];

    // Actions
    addTool: (tool: ToolNode) => void;
    updateToolPosition: (id: string, x: number, y: number) => void;
    removeTool: (toolId: string) => void;
    addConnection: (fromId: string, toId: string) => void;
    removeConnection: (fromId: string, toId: string) => void;
    reportRisk: (risk: Risk) => void;
    updateScores: (shieldDelta: number, spearDelta: number) => void;
    updateCostBasis: (basis: Partial<CostBasis>) => void;
    setMaturityScores: (scores: { literacy: number; governance: number; adoption?: number }) => void;
    toggleMitigation: (id: string) => void;
    setMaestroAudit: (results: Partial<MaestroAuditResults>) => void;
    runMaestroAudit: () => void;
}

// --- Context ---

const ClientContext = createContext<ClientState | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
    const [stack, setStack] = useState<ToolNode[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [identifiedRisks, setRisks] = useState<Risk[]>([]);
    const [maestroAudit, setMaestroAuditState] = useState<MaestroAuditResults>({
        vulnerabilities: [],
        mitigations: [],
        selectedPattern: null
    });
    const [shieldScore, setShieldScore] = useState(100); // Start perfect, drop as we find problems
    const [spearScore, setSpearScore] = useState(50);    // Start neutral

    const [isOnboarding, setIsOnboarding] = useState(false);

    const activeMeetingContext = useMemo(() => isOnboarding ? {
        meetingId: "MTG-942",
        phaseId: "discovery",
        agenda: ["Stack Discovery", "Risk Profiling", "NIST Alignment"]
    } : {
        meetingId: null,
        phaseId: null,
        agenda: []
    }, [isOnboarding]);

    const liveTechInventory = useMemo<ToolNode[]>(() => isOnboarding ? [
        { id: 'openai', name: 'OpenAI GPT-4o', category: 'ai', icon: 'Share2', layer: 1, risky: false },
        { id: 'claude', name: 'Claude 3.5 Sonnet', category: 'ai', icon: 'Share2', layer: 1, risky: false },
        { id: 'llama', name: 'Llama 3 (Self-Hosted)', category: 'ai', icon: 'Code', layer: 1, risky: true },
        { id: 'pinecone', name: 'Pinecone Vector DB', category: 'ai', icon: 'Database', layer: 2, risky: false },
        { id: 'mongodb', name: 'MongoDB Atlas', category: 'crm', icon: 'Database', layer: 2, risky: false },
        { id: 'langchain', name: 'LangChain', category: 'ai', icon: 'Code', layer: 3, risky: false },
        { id: 'aws', name: 'AWS Bedrock', category: 'hosting', icon: 'Cloud', layer: 4, risky: false },
        { id: 'salesforce', name: 'Salesforce Agentforce', category: 'crm', icon: 'Database', layer: 7, risky: false },
    ] : [], [isOnboarding]);

    // NEW: Maturity Scores state
    const [maturityScores, setMaturityScoresState] = useState({
        literacy: 0,
        governance: 0,
        adoption: 0,
        overall: 0
    });

    // Default Assumptions (Validatable)
    const [costBasis, setCostBasis] = useState<CostBasis>({
        avgHourlyRate: 75, // Market rate default
        employeeCount: 10,
        remediationTimePerIncident: 4, // Hours wasted fixing shadow IT issues
        incidentsPerMonth: 4 // Default: 1 incident per week
    });

    // Dynamic Friction Cost: Risks * Incidents * Cost per Incident
    // Formula: Risks * IncidentsPerMonth * (RemediationTime * HourlyRate)
    const frictionCost = identifiedRisks.length * costBasis.incidentsPerMonth * (costBasis.remediationTimePerIncident * costBasis.avgHourlyRate);

    const addTool = (tool: ToolNode) => {
        setStack(prev => [...prev, tool]);
        if (tool.risky) {
            reportRisk({
                id: `risk-${Date.now()}`,
                severity: 'high',
                category: 'security',
                description: `Shadow AI Tool Detected: ${tool.name}`,
                detectedBy: 'StackMap'
            });
            // Immediate penalty for Shadow AI
            setShieldScore(s => Math.max(0, s - 10));
        }
    };

    const updateToolPosition = (id: string, x: number, y: number) => {
        setStack(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
    };

    const removeTool = (toolId: string) => {
        setStack(prev => prev.filter(t => t.id !== toolId));
        setConnections(prev => prev.filter(c => c.fromId !== toolId && c.toId !== toolId));
        // Note: We don't remove risks automatically yet, as the "memory" of the risk might persist
    };

    const addConnection = (fromId: string, toId: string) => {
        setConnections(prev => {
            if (prev.find(c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId))) return prev;
            return [...prev, { fromId, toId }];
        });
    };

    const removeConnection = (fromId: string, toId: string) => {
        setConnections(prev => prev.filter(c => !(c.fromId === fromId && c.toId === toId) && !(c.fromId === toId && c.toId === fromId)));
    };

    const reportRisk = (risk: Risk) => {
        setRisks(prev => {
            // Avoid duplicates
            if (prev.find(r => r.description === risk.description)) return prev;
            return [...prev, risk];
        });
    };

    const updateScores = (shieldDelta: number, spearDelta: number) => {
        setShieldScore(s => Math.min(100, Math.max(0, s + shieldDelta)));
        setSpearScore(s => Math.min(100, Math.max(0, s + spearDelta)));
    };

    const setMaturityScores = (scores: { literacy: number; governance: number; adoption?: number }) => {
        const adoption = scores.adoption ?? 0;
        const overall = (scores.literacy + scores.governance + adoption) / (adoption > 0 ? 3 : 2);
        setMaturityScoresState({
            literacy: scores.literacy,
            governance: scores.governance,
            adoption,
            overall: Number(overall.toFixed(1))
        });
    };

    const setMaestroAudit = (results: Partial<MaestroAuditResults>) => {
        setMaestroAuditState(prev => ({ ...prev, ...results }));
    };

    const toggleMitigation = (id: string) => {
        setMaestroAuditState(prev => ({
            ...prev,
            mitigations: prev.mitigations.map(m =>
                m.id === id ? { ...m, status: m.status === 'implemented' ? 'proposed' : 'implemented' } : m
            )
        }));
    };

    const runMaestroAudit = () => {
        const vulnerabilities: Risk[] = [];
        const mitigations: Mitigation[] = [...maestroAudit.mitigations]; // Preserve status

        // 1. Tool-Specific Risk Detection
        stack.forEach(tool => {
            const isMitigated = mitigations.some(m => m.status === 'implemented' && m.layerRelevance.includes(tool.layer));

            if (tool.layer === 1 && !isMitigated) {
                vulnerabilities.push({
                    id: `V-L1-${tool.id}`,
                    severity: 'critical',
                    category: 'security',
                    description: `${tool.name} (Layer 1) is vulnerable to Model Stealing. Ensure it is wrapped in Maestro Sentinel.`,
                    detectedBy: 'MAESTRO',
                    layer: 1
                });
            }
            // ... rest of detection logic ...
        });

        // Ensure mitigations are suggested if not already there
        if (vulnerabilities.length > 0 && mitigations.length === 0) {
            // seed primary mitigations
            mitigations.push(...MITIGATION_STRATEGIES);
        }

        // 3. Dynamic Score Calculation
        const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
        const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
        setShieldScore(Math.max(0, 100 - (criticalCount * 20) - (highCount * 10)));

        setMaestroAuditState(prev => ({
            ...prev,
            vulnerabilities,
            mitigations,
            selectedPattern: connections.length > 5 ? 'Multi-Agent' : 'Single-Agent'
        }));
    };

    return (
        <ClientContext.Provider value={{
            companyName: isOnboarding ? "Sample Client A" : "Awaiting Client Name",
            industry: isOnboarding ? "Technology" : "Pending Data Integration",
            isOnboarding,
            toggleOnboarding: setIsOnboarding,
            costBasis,
            stack,
            connections,
            shieldScore,
            spearScore,
            frictionCost,
            activeMeetingContext,
            liveTechInventory,
            clientRiskModel: maestroAudit,
            maturityScores,
            identifiedRisks,
            maestroAudit,
            maestroLayers: MAESTRO_LAYERS,
            agenticPatterns: AGENTIC_PATTERNS,
            mitigationLibrary: MITIGATION_STRATEGIES,
            addTool,
            updateToolPosition,
            removeTool,
            addConnection,
            removeConnection,
            reportRisk,
            updateScores,
            updateCostBasis: (basis) => setCostBasis(prev => ({ ...prev, ...basis })),
            setMaturityScores,
            setMaestroAudit,
            runMaestroAudit,
            toggleMitigation
        }}>
            {children}
        </ClientContext.Provider>
    );
}

export function useClient() {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error('useClient must be used within a ClientProvider');
    }
    return context;
}
