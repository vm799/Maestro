import React, { useState, useRef, useEffect } from 'react';
import { Share2, MessageSquare, Database, Mail, AlertTriangle, ArrowRight, X, Cloud, Code, ShoppingBag, Server, Shield } from 'lucide-react';
import { useClient } from '../../context/ClientContext';

interface ToolNode {
    id: string;
    name: string;
    category: 'comm' | 'crm' | 'ai' | 'email' | 'hosting' | 'other';
    icon: any;
    x: number;
    y: number;
    risky?: boolean;
}

const AVAILABLE_TOOLS = [
    // Enterprise Giants
    { id: 'azure', name: 'Azure Cloud', category: 'hosting', icon: Cloud },
    { id: 'aws', name: 'AWS', category: 'hosting', icon: Cloud },
    { id: 'gcp', name: 'Google Cloud', category: 'hosting', icon: Cloud },

    // AI & Productivity
    { id: 'copilot', name: 'MS 365 Copilot', category: 'ai', icon: Share2 },
    { id: 'chatgpt_ent', name: 'ChatGPT Enterprise', category: 'ai', icon: Share2 },
    { id: 'glean', name: 'Glean', category: 'ai', icon: Database },

    // Core Business
    { id: 'salesforce', name: 'Salesforce', category: 'crm', icon: Database },
    { id: 'oracle', name: 'Oracle ERP', category: 'crm', icon: Server },
    { id: 'shopify', name: 'Shopify Plus', category: 'other', icon: ShoppingBag },

    // Communication
    { id: 'teams', name: 'MS Teams', category: 'comm', icon: MessageSquare },
    { id: 'slack', name: 'Slack Enterprise', category: 'comm', icon: MessageSquare },
    { id: 'outlook', name: 'Outlook', category: 'email', icon: Mail },
];

export function StackMap() {
    const { stack, addTool: ctxAddTool, updateToolPosition, removeTool: ctxRemoveTool, frictionCost, identifiedRisks } = useClient();
    const [isDragging, setIsDragging] = useState(false);
    const [draggedToolId, setDraggedToolId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Custom Tool State
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [customToolName, setCustomToolName] = useState("");
    const [isInternalTool, setIsInternalTool] = useState(false);

    // Dragging logic
    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent canvas click
        setIsDragging(true);
        setDraggedToolId(id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !draggedToolId || !canvasRef.current) return;

        // Calculate relative position
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 40; // Center the cursor roughly
        const y = e.clientY - rect.top - 20;

        updateToolPosition(draggedToolId, x, y);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedToolId(null);
    };

    // Analyze Logic
    const handleAnalyze = () => {
        const event = new CustomEvent('navigate', { detail: 'scout' });
        window.dispatchEvent(event);
    };

    const handleAddTool = (toolTemplate: any) => {
        const newTool = {
            ...toolTemplate,
            id: `${toolTemplate.id}-${Date.now()}`,
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50
        };
        ctxAddTool(newTool);
    };

    const submitCustomTool = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customToolName.trim()) return;

        const newTool = {
            id: `custom-${Date.now()}`,
            name: customToolName,
            category: 'other',
            icon: isInternalTool ? Code : Server, // Code icon for internal apps
            risky: isInternalTool, // Assumption: Home-built tools often lack governance
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50
        };
        ctxAddTool(newTool);
        setCustomToolName("");
        setIsInternalTool(false);
        setIsCustomModalOpen(false);
    };

    return (
        <div
            className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden relative"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <header className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="text-blue-500 font-mono">Phase 1:</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Stack Discovery</span>
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Map your Enterprise Ecosystem. Drag to connect integrations.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center justify-end gap-1">
                            Projected Friction <span className="text-zinc-600">(Est.)</span>
                        </div>
                        <div className={`text-xl font-bold font-mono ${frictionCost > 0 ? "text-red-500" : "text-emerald-500"}`}>
                            ${frictionCost.toLocaleString()}/mo
                        </div>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                        Generate Insights <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Tool Palette */}
                <div className="w-64 border-r border-zinc-800 bg-zinc-900 overflow-y-auto p-4 z-10 flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Enterprise Library</h3>
                    <div className="space-y-2 flex-1 overflow-y-auto">
                        {AVAILABLE_TOOLS.map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => handleAddTool(tool)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800 hover:border-zinc-500 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-primary/50 transition-colors">
                                    <tool.icon className="w-5 h-5 text-zinc-300 group-hover:text-primary" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-zinc-200">{tool.name}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">{tool.category}</div>
                                </div>
                                {tool.risky && (
                                    <AlertTriangle className="w-4 h-4 text-amber-500 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-zinc-900/50 border border-dashed border-zinc-700 rounded-lg text-center">
                        <p className="text-xs text-zinc-400 mb-2">Can't find a tool?</p>
                        <button
                            onClick={() => setIsCustomModalOpen(true)}
                            className="text-xs text-primary font-bold hover:underline hover:text-white transition-colors"
                        >
                            + Add Custom / Legacy Tool
                        </button>
                    </div>
                </div>

                {/* Main Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 overflow-hidden relative bg-zinc-950 flex flex-col"
                >
                    {/* Ambient Glows */}
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute top-[30%] left-[40%] translate-x-[-50%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                    <div className="relative z-10 p-6 flex justify-between items-center pointer-events-none">
                        <div className="pointer-events-auto">
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-2">Stack Discovery</h2>
                            <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
                                Drag detected tools onto the canvas to map data flows.
                                Identify <span className="text-red-400 font-bold">"Shadow AI"</span> by looking for unencrypted API endpoints.
                            </p>
                        </div>
                        <div className="pointer-events-auto flex gap-3">
                            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 px-4 py-2 rounded-lg flex items-center gap-3">
                                <span className="text-xs font-bold text-zinc-400 uppercase">Risks Detected</span>
                                <span className="text-red-500 font-mono font-bold text-lg">{stack.filter(n => n.risky).length}</span>
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={stack.length === 0}
                                className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:shadow-none"
                            >
                                Analyze Risks &rarr;
                            </button>
                        </div>
                    </div>

                    {stack.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 pointer-events-none">
                            <div className="text-center">
                                <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Drag-and-drop tools to build your Architecture</p>
                            </div>
                        </div>
                    )}

                    {/* Render Connections (Dynamic Lines) */}
                    <svg className="absolute inset-0 pointer-events-none">
                        {stack.map((t1, i) =>
                            stack.slice(i + 1).map((t2) => (
                                <line
                                    key={`${t1.id}-${t2.id}`}
                                    x1={(t1.x || 0) + 40} y1={(t1.y || 0) + 30}
                                    x2={(t2.x || 0) + 40} y2={(t2.y || 0) + 30}
                                    stroke={t1.category !== t2.category ? "#b91c1c" : "#3f3f46"}
                                    strokeWidth={t1.category !== t2.category ? "2" : "1"}
                                    strokeDasharray={t1.category !== t2.category ? "5,5" : "0"}
                                    className="opacity-50"
                                />
                            ))
                        )}
                    </svg>

                    {/* Render Tools */}
                    {stack.map((tool) => (
                        <div
                            key={tool.id}
                            onMouseDown={(e) => handleMouseDown(e, tool.id)}
                            className={`absolute p-4 rounded-xl border-2 shadow-2xl cursor-grab active:cursor-grabbing backdrop-blur-sm transition-shadow duration-200 group ${tool.risky
                                ? "bg-red-950/40 border-red-500/50 shadow-red-900/20"
                                : "bg-zinc-800/80 border-zinc-600 shadow-black/50"
                                }`}
                            style={{ left: tool.x, top: tool.y, zIndex: draggedToolId === tool.id ? 50 : 10 }}
                        >
                            <div className="flex items-center gap-3 pointer-events-none">
                                {tool.icon && React.createElement(tool.icon, { className: `w-5 h-5 ${tool.risky ? "text-red-500" : "text-zinc-400"}` })}
                                {!tool.icon && <Database className="w-5 h-5 text-zinc-400" />}

                                <span className="font-bold text-sm text-white select-none">{tool.name}</span>
                            </div>
                            <button
                                onMouseDown={(e) => { e.stopPropagation(); ctxRemoveTool(tool.id); }}
                                className="absolute -top-2 -right-2 bg-zinc-800 border border-zinc-600 rounded-full p-1 text-zinc-400 hover:text-white hover:bg-red-500 hover:border-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            {/* "Legacy Code" Indicator for Internal Tools */}
                            {tool.category === 'other' && tool.risky && (
                                <div className="absolute -bottom-6 left-0 right-0 text-center">
                                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 whitespace-nowrap">
                                        Legacy / Internal
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Tool Modal */}
            {isCustomModalOpen && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-96 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Add Custom Tool</h3>
                        <form onSubmit={submitCustomTool} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase block mb-2">Tool Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-primary outline-none"
                                    placeholder="e.g. Legacy Payroll V2"
                                    value={customToolName}
                                    onChange={e => setCustomToolName(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                <input
                                    type="checkbox"
                                    id="internal"
                                    checked={isInternalTool}
                                    onChange={e => setIsInternalTool(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-primary"
                                />
                                <label htmlFor="internal" className="text-sm text-zinc-300 cursor-pointer">
                                    This is a "Home-Built" / Internal tool
                                    <p className="text-[10px] text-zinc-500">Flags as 'High Risk' for maintenance & governance audit.</p>
                                </label>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCustomModalOpen(false)}
                                    className="flex-1 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!customToolName}
                                    className="flex-1 py-2 bg-primary text-black font-bold text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                >
                                    Add Tool
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
