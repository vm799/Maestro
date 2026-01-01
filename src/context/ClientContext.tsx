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
}

export interface Risk {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'security' | 'financial' | 'operational';
    description: string;
    detectedBy: 'StackMap' | 'AuditScout';
}

export interface ClientState {
    // Identity
    companyName: string;
    industry: string;

    // The Stack (Day 1 Input)
    stack: ToolNode[];

    // Assessment Data (The Audit)
    shieldScore: number; // 0-100 (Security/Governance)
    spearScore: number;  // 0-100 (Culture/Adoption)
    frictionCost: number; // Estimated monthly waste

    // The "Mess" Findings
    identifiedRisks: Risk[];

    // Actions
    addTool: (tool: ToolNode) => void;
    removeTool: (toolId: string) => void;
    reportRisk: (risk: Risk) => void;
    updateScores: (shieldDelta: number, spearDelta: number) => void;
}

// --- Context ---

const ClientContext = createContext<ClientState | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
    const [stack, setStack] = useState<ToolNode[]>([]);
    const [identifiedRisks, setRisks] = useState<Risk[]>([]);
    const [shieldScore, setShieldScore] = useState(100); // Start perfect, drop as we find problems
    const [spearScore, setSpearScore] = useState(50);    // Start neutral

    // Derived metrics
    const frictionCost = identifiedRisks.length * 1500; // $1.5k per risk roughly

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
            stack,
            shieldScore,
            spearScore,
            frictionCost,
            identifiedRisks,
            addTool,
            removeTool,
            reportRisk,
            updateScores
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
