/**
 * Maestro Logger
 * Layer 5: Compliance & Observability
 * Provides verifiable audit trails for agentic decision-making.
 */

export interface LogEntry {
    timestamp: string;
    agent: string;
    action: string;
    reasoning: string;
    humanValidated: boolean;
    layer: number;
}

export class MaestroLogger {
    private static instance: MaestroLogger;
    private logs: LogEntry[] = [];

    private constructor() { }

    public static getInstance(): MaestroLogger {
        if (!MaestroLogger.instance) {
            MaestroLogger.instance = new MaestroLogger();
        }
        return MaestroLogger.instance;
    }

    public log(entry: Omit<LogEntry, 'timestamp' | 'humanValidated'>): void {
        const fullEntry: LogEntry = {
            ...entry,
            timestamp: new Date().toISOString(),
            humanValidated: false // Default to false until HITL check
        };
        this.logs.push(fullEntry);
        console.log(`[Maestro Audit] ${fullEntry.timestamp} | ${entry.agent} | ${entry.action}`);
    }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public validateLog(index: number): void {
        if (this.logs[index]) {
            this.logs[index].humanValidated = true;
        }
    }
}

export const maestroLogger = MaestroLogger.getInstance();
