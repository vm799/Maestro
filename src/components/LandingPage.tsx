import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Globe, LayoutGrid, CheckCircle } from 'lucide-react';

export function LandingPage({ onLogin }: { onLogin: () => void }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary selection:text-black font-sans">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold tracking-tight text-lg">Maestro OS</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-sm text-zinc-400 hover:text-white transition-colors">Framework</button>
                        <button className="text-sm text-zinc-400 hover:text-white transition-colors">Case Studies</button>
                        <button
                            onClick={onLogin}
                            className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
                        >
                            Enter Console <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        v2.4 System Online
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                        The Operating System for <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Sovereign Consultants</span>
                    </h1>

                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Auditing, Governance, and Orchestration in a single pane of glass.
                        Move from "Time & Materials" to "Outcome Architecture".
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                        <button
                            onClick={onLogin}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-base font-bold rounded-lg hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2"
                        >
                            Initialize Engagement <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-700 text-white text-base font-bold rounded-lg hover:bg-zinc-800 transition-all">
                            View Documentation
                        </button>
                    </div>
                </div>
            </section>

            {/* Grid Features */}
            <section className="py-24 border-t border-white/5 relative bg-zinc-900/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Governance HUD"
                            desc="7-Layer security model enforcing PII redaction and sovereign compute pinning."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Friction Audit"
                            desc="Quantify the cost of chaos. Turn technical debt into board-level metrics."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Sovereign Architect"
                            desc="Deploy local, private agent swarms that you own. No vendor lock-in."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">{desc}</p>
        </div>
    )
}
