import { X, ExternalLink, Info, ShieldCheck, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpertBriefProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    analogy: string; // For 15-year old
    rationale: string; // For 50-year old security expert
    frameworkReference?: {
        label: string;
        url: string;
    };
    infographic?: React.ReactNode;
}

export function ExpertBrief({
    isOpen,
    onClose,
    title,
    analogy,
    rationale,
    frameworkReference,
    infographic
}: ExpertBriefProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <Microscope className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">Technical Deep Dive</div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-8 space-y-10 overflow-y-auto max-h-[70vh]">
                        {/* Infographic Placeholder / Visual */}
                        {infographic && (
                            <div className="p-10 bg-zinc-950/50 rounded-3xl border border-zinc-800 flex items-center justify-center">
                                {infographic}
                            </div>
                        )}

                        {/* Accessible Explanation (Analogy) */}
                        <div className="relative p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl group">
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg shadow-lg">SIMPLE ANALOGY</div>
                            <div className="flex gap-4">
                                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                                <p className="text-zinc-300 leading-relaxed text-sm italic">
                                    "{analogy}"
                                </p>
                            </div>
                        </div>

                        {/* Expert Rationale */}
                        <div className="relative p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-zinc-700 text-white text-[10px] font-black rounded-lg shadow-lg">SECURITY RATIONALE</div>
                            <div className="flex gap-4">
                                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                <div className="space-y-4">
                                    <p className="text-zinc-200 leading-relaxed text-sm font-medium">
                                        {rationale}
                                    </p>

                                    {frameworkReference && (
                                        <a
                                            href={frameworkReference.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold underline underline-offset-4"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Evidence Source: {frameworkReference.label}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
                        <p className="text-[10px] text-zinc-500 font-mono italic">
                            Verified against global AI security standards.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all"
                        >
                            Got it
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
