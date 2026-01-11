import type { ClientState } from '../context/ClientContext';

export interface CTOReport {
    timestamp: string;
    executiveSummary: string;
    companyProfile: {
        name: string;
        industry: string;
        region: string;
    };
    observedTechStack: {
        name: string;
        category: string;
        layer: number;
    }[];
    prioritizedMitigations: {
        title: string;
        pillar: string;
        description: string;
    }[];
    governanceGap: string;
    maturityScores?: {
        literacy: number;
        governance: number;
        overall: number;
    };
    discoveryInsights: string[];
}

export const generateCTOReport = (state: ClientState): CTOReport => {
    const { stack, maestroAudit, companyName, industry, identifiedRisks } = state;

    // Automated Summary Logic
    const riskCount = maestroAudit.vulnerabilities.length;
    const criticalRisks = maestroAudit.vulnerabilities.filter(v => v.severity === 'critical');

    let summary = `Strategic audit for ${companyName}. `;
    if (riskCount > 0) {
        summary += `Identified ${riskCount} architectural vulnerabilities, including ${criticalRisks.length} critical blockers. `;
    } else {
        summary += "No critical vulnerabilities detected in the current stack mapping.";
    }

    return {
        timestamp: new Date().toISOString(),
        executiveSummary: summary,
        companyProfile: {
            name: companyName,
            industry: industry,
            region: state.region
        },
        observedTechStack: stack.map(t => ({
            name: t.name,
            category: t.category,
            layer: t.layer
        })),
        prioritizedMitigations: maestroAudit.mitigations.slice(0, 3).map(m => ({
            title: m.title,
            pillar: m.governancePillar,
            description: m.description
        })),
        governanceGap: identifiedRisks.length > 0
            ? "Current posture indicates a focus on capability over control. Migration to Maestro Governance Layer recommended."
            : "Compliance posture is stable across measured domains.",
        maturityScores: state.maturityScores.overall > 0 ? {
            literacy: state.maturityScores.literacy,
            governance: state.maturityScores.governance,
            overall: state.maturityScores.overall
        } : undefined,
        discoveryInsights: state.meetingPulse
    };
};
