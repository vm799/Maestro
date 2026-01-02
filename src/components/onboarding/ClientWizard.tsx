import { useState } from 'react';
import { ArrowRight, Building, Check } from 'lucide-react';

interface ClientWizardProps {
    onComplete: (clientData: any) => void;
}

export function ClientWizard({ onComplete }: ClientWizardProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        name: '',
        industry: '',
        employees: '',
        painPoints: [] as string[]
    });

    const nextdf = () => setStep(s => s + 1);

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-card border border-border rounded-xl shadow-lg">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-bold ring-1 ring-primary/20">1</span>
                    <span className="text-xs uppercase tracking-widest font-bold">New Engagement</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Let's onboard your new client.</h1>
                <p className="text-muted-foreground mt-2">Maestro needs context to tailor the governance engine.</p>
            </div>

            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                    <div>
                        <label className="block text-sm font-medium mb-1">Company Name</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                                autoFocus
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                placeholder="e.g. Acme Corp"
                                value={data.name}
                                onChange={e => setData({ ...data, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Industry</label>
                        <select
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                            value={data.industry}
                            onChange={e => setData({ ...data, industry: e.target.value })}
                        >
                            <option value="">Select Industry...</option>
                            <option value="Finance">Financial Services</option>
                            <option value="Healthcare">Healthcare & Pharma</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail & CPG</option>
                            <option value="Tech">Technology</option>
                        </select>
                    </div>
                    <button onClick={nextdf} disabled={!data.name} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium mt-4 flex justify-center items-center gap-2">
                        Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                    <div>
                        <label className="block text-sm font-medium mb-3">Biggest AI Pain Point?</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {["Shadow AI Usage", "Data Privacy Fears", "No Clear ROI", "Regulatory Compliance"].map(pt => (
                                <div
                                    key={pt}
                                    onClick={() => setData({ ...data, painPoints: data.painPoints.includes(pt) ? data.painPoints.filter(p => p !== pt) : [...data.painPoints, pt] })}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${data.painPoints.includes(pt)
                                        ? "bg-primary/5 border-primary ring-1 ring-primary"
                                        : "bg-background border-border hover:border-primary/50"
                                        }`}
                                >
                                    <span className="text-sm font-medium">{pt}</span>
                                    {data.painPoints.includes(pt) && <Check className="w-4 h-4 text-primary" />}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => onComplete(data)} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium mt-4">
                        Initialize Workspace
                    </button>
                </div>
            )}
        </div>
    );
}
