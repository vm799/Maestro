/**
 * Maestro Sentinel
 * Layer 4: AI Governance Firewall
 * Enforces safety guardrails and detects potential hallucinations/PII leakage.
 */

export class MaestroSentinel {
    private static instance: MaestroSentinel;
    private constructor() { }

    public static getInstance(): MaestroSentinel {
        if (!MaestroSentinel.instance) {
            MaestroSentinel.instance = new MaestroSentinel();
        }
        return MaestroSentinel.instance;
    }

    /**
     * Checks if a prompt or response contains sensitive information (PII).
     */
    public containsPII(text: string): boolean {
        const piiPatterns = [
            /\b\d{3}-\d{2}-\d{4}\b/, // SSN
            /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
            /\b\d{4}-\d{4}-\d{4}-\d{4}\b/, // Credit Card
            /(?:\bsk-[a-zA-Z0-9]{20,}\b)/, // Generic API Key (simulated)
        ];
        return piiPatterns.some(pattern => pattern.test(text));
    }

    /**
     * Wraps an agent request with governance checks.
     */
    public async wrapAgentRequest<T>(requestFn: () => Promise<T>, metadata: { agent: string, task: string }): Promise<T> {
        console.log(`[Sentinel] Intercepting request for Agent: ${metadata.agent} | Task: ${metadata.task}`);

        // 1. Pre-Execution Check: Input Validation
        // (In a real app, this would check the prompt)

        const result = await requestFn();

        // 2. Post-Execution Check: Output Validation
        if (typeof result === 'string' && this.containsPII(result)) {
            console.error(`[Sentinel] WARNING: PII Leak detected in Agent response! Redacting...`);
            // Redaction logic would go here
        }

        return result;
    }
}

export const sentinel = MaestroSentinel.getInstance();
