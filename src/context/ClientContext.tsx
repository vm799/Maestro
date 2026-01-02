import { createContext, useContext, useState, type ReactNode } from 'react';

// --- Types ---

export type ToolCategory = 'comm' | 'crm' | 'ai' | 'email' | 'hosting' | 'other';

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

    const runMaestroAudit = () => {
        const vulnerabilities: Risk[] = [];
        const mitigations: Mitigation[] = [];

        // 1. Layer-Specific Risk Detection
        stack.forEach(tool => {
            if (tool.layer === 1) {
                vulnerabilities.push({
                    id: `V-L1-${tool.id}`,
                    severity: 'critical',
                    category: 'security',
                    description: `${tool.name} (Layer 1) is vulnerable to Model Stealing and Adversarial Examples via public API endpoints.`,
                    detectedBy: 'MAESTRO',
                    layer: 1
                });
            }
            if (tool.layer === 2 && tool.risky) {
                vulnerabilities.push({
                    id: `V-L2-${tool.id}`,
                    severity: 'high',
                    category: 'security',
                    description: `Unencrypted RAG pipeline detected for ${tool.name}. Risk of Data Poisoning in vector store.`,
                    detectedBy: 'MAESTRO',
                    layer: 2
                });
            }
            if (tool.layer === 7) {
                vulnerabilities.push({
                    id: `V-L7-${tool.id}`,
                    severity: 'medium',
                    category: 'operational',
                    description: `${tool.name} lacks verified Agent Identity. Potential for Agent Impersonation in the ecosystem.`,
                    detectedBy: 'MAESTRO',
                    layer: 7
                });
            }
        });

        // 2. Cross-Layer Logic (e.g. Layer 4 impacting Layer 1)
        const hasInfra = stack.some(t => t.layer === 4);
        const hasModel = stack.some(t => t.layer === 1);
        if (hasInfra && hasModel) {
            vulnerabilities.push({
                id: 'V-CROSS-L4-L1',
                severity: 'critical',
                category: 'security',
                description: 'Cross-Layer Criticality: Infrastructure (L4) vulnerabilities could allow direct model tampering or weights exfiltration (L1).',
                detectedBy: 'MAESTRO'
            });
        }

        // 3. Propose Mitigations based on Findings
        if (vulnerabilities.some(v => v.layer === 1)) {
            mitigations.push({
                id: 'M-ADV-1',
                title: 'Adversarial Training Implementation',
                description: 'Hardening models against Sponge attacks and jailbreaking.',
                evidence: 'NIST AI RMF 1.0 (27.2)',
                layerRelevance: [1],
                status: 'proposed'
            });
        }
        if (vulnerabilities.some(v => v.layer === 2)) {
            mitigations.push({
                id: 'M-DLP-1',
                title: 'Vector Store Encryption & DLP',
                description: 'Encrypting retrievals and scrubbing PII from RAG inputs.',
                evidence: 'ISO 27001 Control A.8.12',
                layerRelevance: [2],
                status: 'proposed'
            });
        }

        setMaestroAuditState({
            vulnerabilities,
            mitigations,
            selectedPattern: connections.length > 5 ? 'Multi-Agent' : 'Single-Agent'
        });
    };

    return (
        <ClientContext.Provider value={{
            companyName: "Acme Corp", // Placeholder
            industry: "Technology",
            costBasis,
            stack,
            connections,
            shieldScore,
            spearScore,
            frictionCost,
            maturityScores,
            identifiedRisks,
            maestroAudit,
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
            runMaestroAudit
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
