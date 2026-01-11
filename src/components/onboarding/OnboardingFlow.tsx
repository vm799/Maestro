import { useState } from 'react';
import { useClient } from '../../context/ClientContext';
import { Building2, Shield, DollarSign, ArrowRight, CheckCircle, ChevronLeft, Globe } from 'lucide-react';

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
    const { updateClientIdentity, updateCostBasis, reportRisk } = useClient();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        region: 'NA',
        concerns: [] as string[],
        hourlyRate: 75,
        employees: 10
    });

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const finishOnboarding = () => {
        updateClientIdentity({ name: formData.name, industry: formData.industry, region: formData.region });
        updateCostBasis({ avgHourlyRate: formData.hourlyRate, employeeCount: formData.employees });

        // Seed initial risks based on concerns
        formData.concerns.forEach(concern => {
            reportRisk({
                id: `init-${concern}`,
                severity: 'medium',
                category: 'security',
                description: `Pre-Audit Concern: ${concern}`,
                detectedBy: 'AuditScout'
            });
        });

        onComplete();
    };

    const toggleConcern = (concern: string) => {
        setFormData(prev => ({
            ...prev,
            concerns: prev.concerns.includes(concern)
                ? prev.concerns.filter(c => c !== concern)
                : [...prev.concerns, concern]
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Progress Bar */}
                <div className="h-1 text-zinc-800 bg-zinc-800 flex">
                    <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
                </div>

                <div className="p-10 overflow-y-auto flex-1">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Corporate Identity</h2>
                            <p className="text-zinc-400 mb-8 leading-relaxed">Let's initialize the audit parameters. Who are we securing today?</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-xl p-4 text-white outline-none transition-all placeholder:text-zinc-700"
                                        placeholder="e.g. Global Dynamics"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Industry</label>
                                        <input
                                            type="text"
                                            value={formData.industry}
                                            onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-xl p-4 text-white outline-none transition-all"
                                            placeholder="e.g. Fintech"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Primary Region</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <select
                                                value={formData.region}
                                                onChange={e => setFormData({ ...formData, region: e.target.value })}
                                                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-xl pl-12 p-4 text-white outline-none transition-all appearance-none"
                                            >
                                                <option value="NA">North America</option>
                                                <option value="EU">Europe (GDPR Core)</option>
                                                <option value="APAC">Asia-Pacific</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Security Posture</h2>
                            <p className="text-zinc-400 mb-8 leading-relaxed">What internal architectural concerns should Maestro prioritize?</p>

                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    "Shadow AI Detection",
                                    "PII Leakage in RAG",
                                    "Agentic Permission Sprawl",
                                    "Prompt Injection Resilience",
                                    "Cost Overruns/Token Waste"
                                ].map(concern => (
                                    <button
                                        key={concern}
                                        onClick={() => toggleConcern(concern)}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.concerns.includes(concern) ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                    >
                                        <span className="font-medium">{concern}</span>
                                        {formData.concerns.includes(concern) && <CheckCircle className="w-5 h-5" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Cost Calibration</h2>
                            <p className="text-zinc-400 mb-8 leading-relaxed">We use these to calculate "Friction Cost"—your monthly loss due to architectural debt.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 text-center">Average Consultant/Dev Rate ($/hr)</label>
                                    <input
                                        type="range" min="50" max="300" step="5"
                                        value={formData.hourlyRate}
                                        onChange={e => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="text-3xl font-mono font-bold text-center mt-4 text-white">${formData.hourlyRate}</div>
                                </div>
                                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-white font-bold">Audit Depth</h4>
                                            <p className="text-xs text-zinc-500">Number of AI-enabled employees</p>
                                        </div>
                                        <input
                                            type="number"
                                            value={formData.employees}
                                            onChange={e => setFormData({ ...formData, employees: Number(e.target.value) })}
                                            className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-right text-emerald-400 font-mono font-bold outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    {step > 1 ? (
                        <button onClick={handleBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            disabled={!formData.name && step === 1}
                            onClick={handleNext}
                            className="bg-zinc-100 hover:bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={finishOnboarding}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        >
                            Initialize Maestro Engine <CheckCircle className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
