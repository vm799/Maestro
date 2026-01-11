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

    const [isOnboarding, setIsOnboarding] = useState(false);

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

        // 1. Tool-Specific Risk Detection
        stack.forEach(tool => {
            if (tool.layer === 1) {
                vulnerabilities.push({
                    id: `V-L1-${tool.id}`,
                    severity: 'critical',
                    category: 'security',
                    description: `${tool.name} (Layer 1) is vulnerable to Model Stealing. Ensure it is wrapped in Maestro Sentinel.`,
                    detectedBy: 'MAESTRO',
                    layer: 1
                });
            }
            if (tool.layer === 2 && tool.risky) {
                vulnerabilities.push({
                    id: `V-L2-${tool.id}`,
                    severity: 'high',
                    category: 'security',
                    description: `Unencrypted RAG pipeline detected for ${tool.name}. Risk of Data Poisoning.`,
                    detectedBy: 'MAESTRO',
                    layer: 2
                });
            }
        });

        // 2. Connection-Based Data Flow Analysis
        connections.forEach(conn => {
            const from = stack.find(t => t.id === conn.fromId);
            const to = stack.find(t => t.id === conn.toId);

            if (from && to) {
                // Direct Ecosystem to Model Exposure (L7 -> L1)
                if (from.layer === 7 && to.layer === 1) {
                    vulnerabilities.push({
                        id: `V-CONN-L7L1-${conn.fromId}`,
                        severity: 'critical',
                        category: 'security',
                        description: `Direct Data Flow: ${from.name} is connected directly to ${to.name}. Bypass Risk: Prompt Injection (L7) hitting Model (L1) without Layer 4 Sandbox.`,
                        detectedBy: 'MAESTRO',
                        layer: 7
                    });
                    mitigations.push({
                        id: 'M-SANDBOX',
                        title: 'Insert Layer 4 Sandbox',
                        description: 'Route all Ecosystem agent traffic through a Layer 4 validation sandbox.',
                        evidence: 'NIST AI RMF 1.0 (27.2)',
                        layerRelevance: [4],
                        status: 'proposed'
                    });
                }

                // Risky Tool to Data Store (Risky -> L2)
                if (from.risky && to.layer === 2) {
                    vulnerabilities.push({
                        id: `V-RISKY-DATA-${from.id}`,
                        severity: 'critical',
                        category: 'security',
                        description: `Sensitive Access: ${from.name} (Unverified/Risky) has direct access to ${to.name} (Layer 2 Data store).`,
                        detectedBy: 'MAESTRO',
                        layer: 2
                    });
                }
            }
        });

        // 3. Dynamic Score Calculation
        const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
        const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
        setShieldScore(Math.max(0, 100 - (criticalCount * 20) - (highCount * 10)));

        setMaestroAuditState({
            vulnerabilities,
            mitigations,
            selectedPattern: connections.length > 5 ? 'Multi-Agent' : 'Single-Agent'
        });
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
