import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types ---

export type ToolCategory = 'comm' | 'crm' | 'ai' | 'email' | 'hosting' | 'other';

export interface ToolNode {
    id: string;
    name: string;
    category: ToolCategory;
    risky: boolean;
    x?: number;
    y?: number;
    icon?: any; // Storing the icon component reference or name
}

export interface Risk {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'security' | 'financial' | 'operational';
    description: string;
    detectedBy: 'StackMap' | 'AuditScout';
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

    // Assessment Data (The Audit)
    shieldScore: number; // 0-100 (Security/Governance)
    spearScore: number;  // 0-100 (Culture/Adoption)
    frictionCost: number; // Estimated monthly waste

    // The "Mess" Findings
    identifiedRisks: Risk[];

    // Actions
    addTool: (tool: ToolNode) => void;
    updateToolPosition: (id: string, x: number, y: number) => void;
    removeTool: (toolId: string) => void;
    reportRisk: (risk: Risk) => void;
    updateScores: (shieldDelta: number, spearDelta: number) => void;
    updateCostBasis: (basis: Partial<CostBasis>) => void;
}

// --- Context ---

const ClientContext = createContext<ClientState | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
    const [stack, setStack] = useState<ToolNode[]>([]);
    const [identifiedRisks, setRisks] = useState<Risk[]>([]);
    const [shieldScore, setShieldScore] = useState(100); // Start perfect, drop as we find problems
    const [spearScore, setSpearScore] = useState(50);    // Start neutral

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
        // Note: We don't remove risks automatically yet, as the "memory" of the risk might persist
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

    return (
        <ClientContext.Provider value={{
            companyName: "Acme Corp", // Placeholder
            industry: "Technology",
            costBasis,
            stack,
            shieldScore,
            spearScore,
            frictionCost,
            identifiedRisks,
            addTool,
            updateToolPosition,
            removeTool,
            reportRisk,
            updateScores,
            updateCostBasis: (basis) => setCostBasis(prev => ({ ...prev, ...basis }))
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
