import { useState } from 'react';
import { ShieldAlert, CheckCircle, FileText, ArrowRight, Server, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

export function AuditModule() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAudit = (e: React.FormEvent) => {
        e.preventDefault();
        setAnalyzing(true);
        // Simulate Backend Delay
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                score: 100,
                gaps: [], // All gaps resolved
                plan: [
                    "Maestro Sentinel (AI Firewall) Active",
                    "Maestro Logger (HITL) Enabled",
                    "ISO 42001 Real-time Monitoring Operational"
                ],
                resolved: true
            });
        }, 2000);
    };

    return (
        <div className="p-8 h-full overflow-auto bg-zinc-50/50 dark:bg-zinc-950/50">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded dark:bg-emerald-900/30 dark:text-emerald-400">B2B TOOL</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Maestro Auditor v1.0</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Stack & Security Audit</h1>
                    <p className="text-muted-foreground mt-2">
                        "Trojan Horse" Assessment: Analyze a client's stack to identify where Sovereign Architect is needed.
                    </p>
                </header>

                {!result && (
                    <form onSubmit={handleAudit} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Company Tech Stack</label>
                                <div className="relative">
                                    <Server className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Node.js, AWS Lambda, Python, React..."
                                        className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Target Compliance</label>
                                <div className="relative">
                                    <ShieldAlert className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <select className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none">
                                        <option>ISO 42001 (AI Management)</option>
                                        <option>NIST AI RMF</option>
                                        <option>EU AI Act</option>
                                        <option>GDPR / MAESTRO Framework</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Repository URL (Optional)</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="github.com/client/repo"
                                        className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={analyzing}
                                className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 flex items-center justify-center gap-2 transition-all"
                            >
                                {analyzing ? (
                                    <>Processing Stack Analysis...</>
                                ) : (
                                    <>Run Deep Audit <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        {/* Score Card */}
                        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-8">
                            <div className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4",
                                result.score < 70 ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10" : "border-green-500 text-green-500"
                            )}>
                                {result.score}/100
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Security Posture: {result.score < 100 ? "VULNERABLE" : "OPTIMAL"}</h2>
                                <p className="text-muted-foreground">
                                    {result.score < 100
                                        ? "Critical gaps identified. Immediate remediation recommended via Maestro Governance Layer."
                                        : "Systems operational. All governance layers are strictly enforced and verified."}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Gaps */}
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-5">
                                <h3 className="text-red-700 dark:text-red-400 font-bold flex items-center gap-2 mb-3">
                                    <ShieldAlert className="w-5 h-5" /> Critical Gaps
                                </h3>
                                <ul className="space-y-2">
                                    {result.gaps.map((gap: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-300">
                                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-red-500" />
                                            {gap}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Maestro Plan */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5">
                                <h3 className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5" /> Maestro Integration Plan
                                </h3>
                                <ul className="space-y-2">
                                    {result.plan.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                                            <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* PDF Download */}
                        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-md">
                                    <FileText className="w-5 h-5 text-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">B2B_Audit_Proposal_Draft.pdf</h3>
                                    <p className="text-xs text-muted-foreground">Generated 2 seconds ago • Confidential</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 text-sm border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                                Download Report
                            </button>
                        </div>

                        <button onClick={() => setResult(null)} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
                            Run Another Audit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
