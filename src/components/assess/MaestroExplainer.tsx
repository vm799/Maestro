import { useState, useMemo, useEffect } from 'react';
import {
    Shield, ChevronLeft, AlertTriangle, Layers, Target, Zap,
    Lock, Eye, Activity, Box, Database, Cpu, Globe,
    BarChart3, ExternalLink
} from 'lucide-react';
import { useClient, type ToolNode, type Mitigation, type MaestroLayer, type AgenticPattern, type Threat, type Risk } from '../../context/ClientContext';
import { ExpertBrief } from '../shared/ExpertBrief';

const ICON_MAP: Record<string, any> = {
    Globe, Lock, Eye, Box, Activity, Database, Cpu, Shield, Zap, Target, Layers, BarChart3, ExternalLink
};

// --- Support Components ---
const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const Search = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

// --- Sub-Views ---

function TheoryView({ selectedLayer, setSelectedLayerId, maestroAudit, maestroLayers }: any) {
    const { vulnerabilities } = maestroAudit;

    return (
        <div className="max-w-4xl">
            <div className="mb-12">
                <h2 className="text-5xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                    The MAESTRO Reference Architecture
                </h2>
                <p className="text-zinc-500 max-w-xl">
                    A clinical breakdown of the modern Agentic AI stack, segmented into seven distinct layers of security and operational logic.
                </p>
            </div>

            <div className="relative pt-12">
                <div className="flex flex-col-reverse gap-3">
                    {maestroLayers.map((layer: MaestroLayer, idx: number) => {
                        const hasRisk = vulnerabilities.some((v: Risk) => v.layer === layer.id);
                        const isSelected = selectedLayer?.id === layer.id;
                        const IconComp = ICON_MAP[layer.icon as string] || Globe;

                        return (
                            <div
                                key={layer.id}
                                onClick={() => setSelectedLayerId(layer.id)}
                                className={`group relative h-20 flex items-center gap-6 px-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 ${isSelected
                                    ? "bg-emerald-600/10 border-emerald-500 scale-[1.02] z-20 shadow-[0_20px_50px_rgba(16,185,129,0.1)] translate-x-4"
                                    : hasRisk
                                        ? "bg-red-950/20 border-red-500/50 hover:bg-red-900/10"
                                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:translate-x-2"
                                    }`}
                                style={{
                                    transform: isSelected ? 'translateX(16px)' : `perspective(1000px) rotateX(10deg) translateY(${idx * -4}px)`,
                                    opacity: 1 - (idx * 0.05)
                                }}
                            >
                                <div className="text-4xl font-black text-white/5 absolute -left-12 select-none group-hover:text-emerald-500/10 transition-colors">
                                    0{layer.id}
                                </div>

                                <div className={`p-3 rounded-xl ${isSelected ? 'bg-emerald-500 text-black' : hasRisk ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-emerald-400'} transition-all`}>
                                    <IconComp className="w-6 h-6" />
                                </div>

                                <div className="flex-1">
                                    <h3 className={`font-bold transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                                        {layer.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                        <span>Threat Nodes: {hasRisk ? (vulnerabilities.filter((v: Risk) => v.layer === layer.id).length) : layer.threats.length}</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <span>Discovery Count: {vulnerabilities.filter((v: Risk) => v.layer === layer.id).length}</span>
                                    </div>
                                </div>

                                {hasRisk && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-black animate-pulse">
                                        <AlertTriangle className="w-3 h-3" /> RED FLAG
                                    </div>
                                )}

                                <ChevronLeft className={`w-5 h-5 transition-all ${isSelected ? 'rotate-180 text-emerald-500 opacity-100' : 'opacity-20 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function AuditView({ toolsByLayer, connections, vulnerabilities, maestroLayers }: any) {
    const steps = [
        { id: 1, label: "System Decomposition", status: "complete" },
        { id: 2, label: "Layer Threat Modeling", status: "complete" },
        { id: 3, label: "Cross-Layer ID", status: vulnerabilities?.length > 0 ? "complete" : "current" },
        { id: 4, label: "Risk Assessment", status: "current" },
        { id: 5, label: "Mitigation Planning", status: "pending" },
        { id: 6, label: "Continuous Monitoring", status: "pending" }
    ];

    return (
        <div className="max-w-6xl">
            <div className="mb-12 flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex-wrap">
                {steps.map(step => (
                    <div key={step.id} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${step.status === 'complete' ? 'bg-emerald-600 border-emerald-500 text-white' :
                            step.status === 'current' ? 'bg-blue-600 border-blue-500 text-white animate-pulse' :
                                'bg-zinc-800 border-zinc-700 text-zinc-500'
                            }`}>
                            {step.status === 'complete' ? <CheckCircle className="w-3 h-3" /> : step.id}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-zinc-600' : 'text-zinc-300'
                            }`}>{step.label}</span>
                        {step.id < 6 && <div className="w-8 h-px bg-zinc-800 hidden sm:block" />}
                    </div>
                ))}
            </div>

            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold mb-2">Ecosystem Correlation Audit</h2>
                    <p className="text-zinc-500 text-sm">Mapping detected assets to MAESTRO threats and identifying cross-layer causality.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex gap-8">
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Total Assets</div>
                        <div className="text-2xl font-bold">{Object.values(toolsByLayer).flat().length as number}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Active Links</div>
                        <div className="text-2xl font-bold text-blue-400">{connections.length}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Critical Vulnerabilities</div>
                        <div className="text-2xl font-bold text-red-500">{vulnerabilities?.length || 0}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {maestroLayers.map((layer: MaestroLayer) => {
                    const tools = toolsByLayer[layer.id] || [];
                    const layerRisks = vulnerabilities?.filter((v: Risk) => v.layer === layer.id) || [];

                    return (
                        <div key={layer.id} className={`p-6 bg-zinc-900/40 border rounded-2xl flex gap-10 items-center transition-all ${layerRisks.length > 0 ? "border-red-500/30 bg-red-950/5" : "border-zinc-800"
                            }`}>
                            <div className="w-48 shrink-0">
                                <div className="text-[10px] font-mono font-bold text-zinc-500">LAYER 0{layer.id}</div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    {(() => {
                                        const IconComp = ICON_MAP[layer.icon as string] || Globe;
                                        return <IconComp className={`w-4 h-4 ${layerRisks.length > 0 ? 'text-red-400' : 'text-zinc-600'}`} />;
                                    })()}
                                    {layer.name.split(': ')[1]}
                                </h3>
                            </div>

                            <div className="flex-1 flex gap-3 flex-wrap">
                                {tools.length > 0 ? (
                                    tools.map((t: ToolNode) => (
                                        <div key={t.id} className="px-4 py-2 bg-zinc-950 border border-zinc-700/50 rounded-xl flex items-center gap-3">
                                            <span className="text-sm font-bold text-zinc-300">{t.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-zinc-700 italic">No assets detected.</div>
                                )}
                            </div>

                            <div className="flex-1">
                                {layerRisks.map((risk: Risk) => (
                                    <div key={risk.id} className="flex items-start gap-2 text-xs text-red-400 animate-in slide-in-from-left-2">
                                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        <span>{risk.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MitigationView({ proposedMitigations, mitigationLibrary, maestroLayers, toggleMitigation }: any) {
    const allMitigations = useMemo(() => {
        const merged = [...mitigationLibrary];
        proposedMitigations?.forEach((pm: Mitigation) => {
            if (!merged.find(m => m.id === pm.id)) merged.push(pm);
        });
        return merged;
    }, [proposedMitigations, mitigationLibrary]);

    return (
        <div className="max-w-4xl">
            <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4 text-white">Strategic Mitigation Controls</h2>
                <p className="text-zinc-500">Validated remediation strategies aligned with NIST AI RMF Manage function.</p>
            </div>

            <div className="space-y-6">
                {allMitigations.map((strat: Mitigation) => {
                    const affectedLayers = maestroLayers.filter((l: MaestroLayer) => strat.layerRelevance.includes(l.id));

                    return (
                        <div key={strat.id} className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap className="w-32 h-32 text-emerald-400" />
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                            Priority Prescriber
                                        </span>
                                        <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold rounded-full uppercase">
                                            {strat.governancePillar}
                                        </span>
                                        <h3 className="text-2xl font-bold">{strat.title}</h3>
                                    </div>
                                    <p className="text-zinc-400 leading-relaxed max-w-xl">{strat.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Audit Status</div>
                                    <div className="text-2xl font-black text-emerald-400">ACTIVE RECOMMENDATION</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
                                        <Layers className="w-3 h-3" /> Mitigated Layers
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {affectedLayers.map((l: any) => (
                                            <span key={l.id} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-400">
                                                Layer {l.id}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/20">
                                        <div className="text-[10px] font-bold text-emerald-500 uppercase mb-2 flex items-center gap-2">
                                            <ExternalLink className="w-3 h-3" /> Technical Evidence
                                        </div>
                                        <p className="text-xs text-zinc-300 italic">"{strat.evidence}"</p>
                                    </div>
                                    <button
                                        onClick={() => toggleMitigation(strat.id)}
                                        className={`w-full py-3 rounded-xl text-xs font-black transition-all ${strat.status === 'implemented'
                                            ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700"
                                            }`}
                                    >
                                        {strat.status === 'implemented' ? "CONTROL ACTIVE" : "DEPLOY MITIGATION"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PatternView({ selectedPattern, agenticPatterns }: any) {
    return (
        <div className="max-w-5xl">
            <div className="mb-12">
                <h2 className="text-4xl font-bold mb-4">Agentic Architecture Patterns</h2>
                <p className="text-zinc-500">Analysis of autonomous interaction models detected in your architecture.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {agenticPatterns.map((pattern: AgenticPattern) => (
                    <div key={pattern.name} className={`p-8 bg-zinc-900 border rounded-3xl transition-all flex flex-col ${selectedPattern === pattern.name.split(' ')[0] || (selectedPattern === 'Multi-Agent' && pattern.name.includes('Multi'))
                        ? "border-emerald-500 bg-emerald-950/5 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        : "border-zinc-800"
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">{pattern.name}</h3>
                            {selectedPattern && (pattern.name.includes(selectedPattern) || (selectedPattern === 'Multi-Agent' && pattern.name.includes('Multi'))) && (
                                <span className="px-2 py-1 bg-emerald-500 text-black text-[10px] font-black rounded uppercase">Detected Pattern</span>
                            )}
                        </div>
                        <p className="text-zinc-400 text-sm mb-6 flex-1 leading-relaxed">{pattern.description}</p>

                        <div className="space-y-4 pt-6 border-t border-zinc-800">
                            <div>
                                <div className="text-[10px] font-bold text-red-400/80 uppercase mb-1 flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" /> Architecture Risk Profile
                                </div>
                                <div className="text-xs text-zinc-300 font-medium leading-relaxed italic">"{pattern.threat}"</div>
                            </div>
                            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                                <div className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Prescribed Mitigation</div>
                                <div className="text-xs text-zinc-400 leading-relaxed font-light">{pattern.mitigation}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Main Component ---

export function MaestroExplainer() {
    const {
        stack, connections, runMaestroAudit, maestroAudit,
        activeMeetingContext, clientRiskModel,
        maestroLayers, agenticPatterns, mitigationLibrary,
        toggleMitigation
    } = useClient();
    const [activeView, setActiveView] = useState<'theory' | 'audit' | 'mitigation' | 'patterns'>('theory');
    const [selectedLayerId, setSelectedLayerId] = useState<number | null>(7);
    const [isScanning, setIsScanning] = useState(false);
    const [briefData, setBriefData] = useState<any>(null);

    useEffect(() => {
        runMaestroAudit();
    }, [stack.length, connections.length, JSON.stringify(maestroAudit.mitigations.map(m => m.status))]);

    const selectedLayer = useMemo(() =>
        maestroLayers.find(l => l.id === selectedLayerId),
        [selectedLayerId, maestroLayers]);

    const toolsByLayer = useMemo(() => {
        const mapping: Record<number, ToolNode[]> = {};
        maestroLayers.forEach(l => {
            mapping[l.id] = stack.filter(t => t.layer === l.id);
        });
        return mapping;
    }, [stack, maestroLayers]);

    const handleRunScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            runMaestroAudit();
            setIsScanning(false);
            setActiveView('audit');
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden select-none">
            {/* Nav Header */}
            <header className="px-8 py-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'stackmap' }))}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            MAESTRO Strategic Audit
                        </h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Evidence-Based Risk Orchestration</p>
                    </div>
                </div>

                <div className="flex bg-zinc-800/50 p-1 rounded-xl border border-zinc-700">
                    {[
                        { id: 'theory', label: 'Framework View', icon: Layers },
                        { id: 'audit', label: 'Ecosystem Audit', icon: Target },
                        { id: 'mitigation', label: 'Strategic Mitigations', icon: Zap },
                        { id: 'patterns', label: 'Agentic Patterns', icon: Activity }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === tab.id
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleRunScan}
                    disabled={isScanning}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isScanning
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                        }`}
                >
                    {isScanning ? (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            Scanning...
                        </div>
                    ) : (
                        <>
                            <Search className="w-4 h-4" /> Run Deep Scan
                        </>
                    )}
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-zinc-950 p-10">
                    {activeView === 'theory' && (
                        <TheoryView
                            selectedLayer={selectedLayer}
                            setSelectedLayerId={setSelectedLayerId}
                            maestroAudit={maestroAudit}
                            maestroLayers={maestroLayers}
                        />
                    )}
                    {activeView === 'audit' && (
                        <AuditView
                            toolsByLayer={toolsByLayer}
                            connections={connections}
                            vulnerabilities={maestroAudit.vulnerabilities}
                            maestroLayers={maestroLayers}
                        />
                    )}
                    {activeView === 'mitigation' && (
                        <MitigationView
                            toolsByLayer={toolsByLayer}
                            proposedMitigations={maestroAudit.mitigations}
                            mitigationLibrary={mitigationLibrary}
                            maestroLayers={maestroLayers}
                            toggleMitigation={toggleMitigation}
                        />
                    )}
                    {activeView === 'patterns' && (
                        <PatternView
                            selectedPattern={maestroAudit.selectedPattern}
                            agenticPatterns={agenticPatterns}
                        />
                    )}
                </div>

                {activeView === 'theory' && selectedLayer && (
                    <div className="w-[450px] border-l border-zinc-800 bg-zinc-900/40 overflow-y-auto animate-in slide-in-from-right-8 duration-300">
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-4 rounded-2xl bg-zinc-800 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                    {(() => {
                                        const IconComp = ICON_MAP[selectedLayer.icon as string] || Globe;
                                        return <IconComp className="w-8 h-8 text-emerald-400" />;
                                    })()}
                                </div>
                                <div>
                                    <div className="text-xs font-mono font-bold text-emerald-500">LAYER 0{selectedLayer.id}</div>
                                    <h2 className="text-2xl font-bold">{selectedLayer.name.split(': ')[1]}</h2>
                                </div>
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-8 italic">
                                "{selectedLayer.description}"
                            </p>

                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" /> Layer Specific Risks
                            </h3>
                            <div className="space-y-3">
                                {selectedLayer.threats.map((threat: Threat) => (
                                    <button
                                        key={threat.id}
                                        onClick={() => setBriefData({
                                            title: threat.title,
                                            analogy: threat.analogy,
                                            rationale: threat.rationale,
                                            frameworkReference: { label: threat.source, url: threat.sourceUrl }
                                        })}
                                        className="w-full text-left p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-emerald-500 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{threat.title}</h4>
                                            <span className="text-[10px] font-mono text-zinc-600">{threat.id}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed font-light">{threat.description}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-blue-500/50 uppercase">
                                    Ref: {activeMeetingContext.meetingId || "SYS-001"}
                                </div>
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> NIST Strategic Indicator
                                </h4>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="text-2xl font-mono font-bold text-white">
                                        {(100 - (clientRiskModel.vulnerabilities.filter(v => v.layer === selectedLayerId).length * 15)).toFixed(0)}%
                                    </div>
                                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-1000"
                                            style={{ width: `${100 - (clientRiskModel.vulnerabilities.filter(v => v.layer === selectedLayerId).length * 15)}%` }}
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-500 leading-relaxed">
                                    Session context: <span className="text-zinc-300 font-bold">{activeMeetingContext.phaseId}</span>.
                                    Vulnerabilities detected at this layer impact the NIST MEASURE/MANAGE functions for <span className="text-blue-400 font-bold">{selectedLayer.name.split(': ')[1]}</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ExpertBrief
                isOpen={!!briefData}
                onClose={() => setBriefData(null)}
                {...briefData!}
            />
        </div>
    );
}
