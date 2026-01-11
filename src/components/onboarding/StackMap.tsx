import React, { useState, useRef } from 'react';
import { Share2, MessageSquare, Database, ArrowRight, X, Cloud, Code, Server } from 'lucide-react';
import { useClient, type ToolNode } from '../../context/ClientContext';

// Icon mapping for dynamic tools
const ICON_MAP: Record<string, any> = {
    Share2, MessageSquare, Database, ArrowRight, X, Cloud, Code, Server
};

export function StackMap() {
    const {
        stack, connections, addTool: ctxAddTool, updateToolPosition,
        removeTool: ctxRemoveTool, addConnection, frictionCost,
        liveTechInventory
    } = useClient();
    const [isDragging, setIsDragging] = useState(false);
    const [draggedToolId, setDraggedToolId] = useState<string | null>(null);
    const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Custom Tool State
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [customToolName, setCustomToolName] = useState("");
    const [selectedLayer, setSelectedLayer] = useState(7);

    // ARCHITECT: Canvas Connection Logic
    const drawEdge = (fromId: string, toId: string) => {
        addConnection(fromId, toId);
        console.log(`[CanvasContainer] Persistent edge drawn: ${fromId} -> ${toId}`);
    };

    // Dragging logic
    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (e.shiftKey || selectedToolId) {
            // Connection Mode
            if (selectedToolId && selectedToolId !== id) {
                drawEdge(selectedToolId, id);
                setSelectedToolId(null);
            } else {
                setSelectedToolId(id);
            }
            return;
        }
        setIsDragging(true);
        setDraggedToolId(id);
        setSelectedToolId(id); // Select on drag too
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !draggedToolId || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 40;
        const y = e.clientY - rect.top - 20;
        updateToolPosition(draggedToolId, x, y);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedToolId(null);
    };

    const handleAnalyze = () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'maestro' }));
    };

    const handleAddTool = (toolTemplate: any) => {
        const newTool: ToolNode = {
            ...toolTemplate,
            id: `${toolTemplate.id}-${Date.now()}`,
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
            category: toolTemplate.category as any, // Cast to match ToolCategory
            risky: toolTemplate.risky || false
        };
        ctxAddTool(newTool);
    };

    const submitCustomTool = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customToolName.trim()) return;

        const newTool = {
            id: `custom-${Date.now()}`,
            name: customToolName,
            category: 'other' as any,
            icon: Server,
            risky: true,
            layer: selectedLayer,
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50
        };
        ctxAddTool(newTool);
        setCustomToolName("");
        setIsCustomModalOpen(false);
    };

    return (
        <div
            className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden relative"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <header className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 flex-wrap gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="text-blue-500 font-mono">Phase 1:</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Stack Discovery</span>
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Map your data flows. Shift+Click two tools to connect them.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Projected Friction</div>
                        <div className={`text-xl font-bold font-mono ${frictionCost > 0 ? "text-red-500" : "text-emerald-500"}`}>
                            ${frictionCost.toLocaleString()}/mo
                        </div>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={stack.length === 0}
                        className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
                    >
                        Analyze Architecture <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Tool Palette */}
                <div className="w-72 border-r border-zinc-800 bg-zinc-900 overflow-y-auto p-4 z-20 flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Discovery Library</h3>
                    <div className="space-y-2 flex-1">
                        {liveTechInventory.map(tool => {
                            const IconComp = ICON_MAP[tool.icon as string] || Server;
                            return (
                                <button
                                    key={tool.id}
                                    onClick={() => handleAddTool({ ...tool, icon: IconComp })}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-700 group-hover:border-blue-500/50">
                                        <IconComp className="w-5 h-5 text-zinc-400 group-hover:text-blue-400" />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <div className="text-sm font-bold text-zinc-200 truncate">{tool.name}</div>
                                        <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                                            Layer {tool.layer} • {tool.category}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setIsCustomModalOpen(true)}
                        className="mt-4 w-full p-3 border border-dashed border-zinc-700 rounded-lg text-xs font-bold text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors"
                    >
                        + Add Custom Service
                    </button>
                </div>

                {/* Main Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 overflow-hidden relative bg-zinc-950 flex flex-col"
                    onClick={() => setSelectedToolId(null)}
                >
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

                    {/* Render Connections */}
                    <svg className="absolute inset-0 pointer-events-none z-0">
                        {connections.map((conn, idx) => {
                            const t1 = stack.find(t => t.id === conn.fromId);
                            const t2 = stack.find(t => t.id === conn.toId);
                            if (!t1 || !t2) return null;
                            return (
                                <line
                                    key={idx}
                                    x1={(t1.x || 0) + 40} y1={(t1.y || 0) + 30}
                                    x2={(t2.x || 0) + 40} y2={(t2.y || 0) + 30}
                                    stroke={t1.risky || t2.risky ? "#ef4444" : "#3b82f6"}
                                    strokeWidth="2"
                                    strokeDasharray="6,4"
                                    className="opacity-40 animate-[dash_20s_linear_infinite]"
                                />
                            );
                        })}
                    </svg>

                    {stack.map((tool) => (
                        <div
                            key={tool.id}
                            onMouseDown={(e) => handleMouseDown(e, tool.id)}
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute p-4 rounded-xl border-2 shadow-2xl cursor-grab active:cursor-grabbing backdrop-blur-md transition-all group ${selectedToolId === tool.id
                                ? "border-blue-500 ring-4 ring-blue-500/20 bg-blue-900/20"
                                : tool.risky
                                    ? "bg-red-950/40 border-red-500/50"
                                    : "bg-zinc-800/80 border-zinc-700 shadow-black/50 hover:border-zinc-500"
                                }`}
                            style={{
                                left: tool.x,
                                top: tool.y,
                                zIndex: draggedToolId === tool.id ? 100 : 10
                            }}
                        >
                            <div className="flex items-center gap-3 pointer-events-none">
                                {tool.icon && React.createElement(tool.icon, { className: `w-5 h-5 ${tool.risky ? "text-red-400" : "text-blue-400"}` })}
                                <div className="select-none">
                                    <div className="font-bold text-sm text-white">{tool.name}</div>
                                    <div className="text-[10px] text-zinc-500 uppercase font-mono">L{tool.layer} Architect</div>
                                </div>
                            </div>

                            <button
                                onMouseDown={(e) => { e.stopPropagation(); ctxRemoveTool(tool.id); }}
                                className="absolute -top-2 -right-2 bg-zinc-800 border border-zinc-600 rounded-full p-1 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {stack.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-700 pointer-events-none">
                            <div className="text-center animate-pulse">
                                <Database className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                <p className="text-xl font-light tracking-widest uppercase">Ecosystem Map Empty</p>
                                <p className="text-xs mt-2 text-zinc-600">Drag services from the library to begin mapping</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Modal */}
            {
                isCustomModalOpen && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-[450px] shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                Identify Legacy / Custom Asset
                            </h3>
                            <form onSubmit={submitCustomTool} className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">Internal Service Name</label>
                                    <input
                                        autoFocus
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. Athena-v3-Core-API"
                                        value={customToolName}
                                        onChange={e => setCustomToolName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">Target Architecture Layer</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7].map(l => (
                                            <button
                                                key={l}
                                                type="button"
                                                onClick={() => setSelectedLayer(l)}
                                                className={`py-2 rounded-lg text-xs font-bold border transition-all ${selectedLayer === l
                                                    ? "bg-blue-600 border-blue-500 text-white"
                                                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                                                    }`}
                                            >
                                                Layer {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsCustomModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-zinc-400 hover:bg-zinc-800 rounded-xl">Cancel</button>
                                    <button type="submit" disabled={!customToolName} className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-900/20">Add to Ecosystem</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <style>{`
                @keyframes dash {
                    to { stroke-dashoffset: -1000; }
                }
            `}</style>
        </div >
    );
}

