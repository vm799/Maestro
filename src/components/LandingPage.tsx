import { ArrowRight, Zap, CheckCircle, ShieldCheck, Globe } from 'lucide-react';
import { Entropy } from './Entropy';

interface LandingPageProps {
    onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-purple-500/30">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className="w-8 h-8 bg-gradient-to-br from-white to-zinc-500 rounded-lg flex items-center justify-center">
                            <span className="text-black font-serif italic">S</span>
                        </div>
                        Sovereign Architect
                    </div>
                    <button
                        onClick={onLogin}
                        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Copy */}
                    <div className="z-10 flex flex-col justify-center">

                        {/* Elongated Pill / Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-8 relative">
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-zinc-950 pr-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                    Consultant Operating System v2.0
                                </span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
                            Bring Order to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 animate-pulse">
                                Digital Chaos.
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                            The comprehensive platform for AI Governance, Stack Discovery, and Strategic Maturity auditing.
                            Turn ad-hoc tools into a sovereign architecture.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                            <button
                                onClick={onLogin}
                                className="group relative px-8 py-4 bg-white text-black rounded-lg font-bold text-lg flex items-center justify-center gap-2 overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                                <span className="relative z-10 flex items-center gap-2 group-hover:text-purple-600 transition-colors duration-300">
                                    Start Engagement <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                            <button
                                onClick={onLogin}
                                className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg font-bold text-lg hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                View Demo
                            </button>
                        </div>
                        <div className="mt-12 flex items-center gap-8 text-sm text-zinc-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Enterprise Ready
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> MAESTRO Framework Compliance
                            </div>
                        </div>
                    </div>

                    {/* Right: Entropy Animation */}
                    {/* User Req: "longer from text to end of page" -> Increased size + tighter left alignment */}
                    <div className="relative flex flex-col justify-center items-start h-[600px] lg:-ml-20 w-full">
                        {/* Gradient Glow */}
                        <div className="absolute top-1/2 left-[400px] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] opacity-40" />

                        {/* The Component - Larger Dimension */}
                        <div className="relative z-10 animate-in zoom-in duration-1000 delay-300">
                            <Entropy size={800} />
                        </div>

                        {/* Caption */}
                        <div className="relative z-10 mt-4 text-center w-[800px] animate-in fade-in duration-1000 delay-700 pointer-events-none">
                            <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 font-mono opacity-80">
                                Order and Chaos Dance
                            </p>
                            <p className="text-[10px] text-zinc-600 font-serif italic mt-1 font-light">
                                Digital poetry in motion. by <span className="text-zinc-400">KainXu</span>
                            </p>
                        </div>
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
