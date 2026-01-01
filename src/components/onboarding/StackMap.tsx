import React, { useState, useRef, useEffect } from 'react';
import { Share2, MessageSquare, Database, Mail, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { MainLayout } from '../layout/MainLayout'; // Hack for quick navigation access if needed, though usually better to have global nav context

// We need a way to change the view from here. Ideally, MainLayout passes a callback or we use a routing library.
// For now, let's assume we can trigger a global event or the user manually navigates, BUT the request was to make it work.
// Let's add a specialized "onAnalyze" prop if we were being strict, but since we are inside a context-wrapped app,
// we might iterate on the architecture later. For now, I will add a simple callback prop pattern OR assume context can switch views? 
// No, the activeView is in MainLayout. 
// Let's assume for this specific user request ("Analyze risks doesnt work") we need it to do SOMETHING visible.
// I will persist the data (done in context) and then show a "toast" or "modal" directing them to the Scout, 
// OR I will inject a "setView" into the context? No, that's messy.
// Better: Dispatch a custom event that MainLayout listens to? 
// Simplest: The "Analyze" button just shows a "Processing..." state and then tells the user to go to the Audit Scout tab.

interface ToolNode {
    id: string;
    name: string;
    category: 'comm' | 'crm' | 'ai' | 'email';
    icon: any;
    x: number;
    y: number;
    risky?: boolean;
}

const AVAILABLE_TOOLS = [
    { id: 'slack', name: 'Slack', category: 'comm', icon: MessageSquare },
    { id: 'teams', name: 'Teams', category: 'comm', icon: MessageSquare },
    { id: 'salesforce', name: 'Salesforce', category: 'crm', icon: Database },
    { id: 'hubspot', name: 'HubSpot', category: 'crm', icon: Database },
    { id: 'chatgpt', name: 'ChatGPT (Personal)', category: 'ai', icon: Share2, risky: true },
    { id: 'midjourney', name: 'MidJourney', category: 'ai', icon: Share2, risky: true },
    { id: 'outlook', name: 'Outlook', category: 'email', icon: Mail },
];

export function StackMap() {
    const { stack, addTool: ctxAddTool, updateToolPosition, removeTool: ctxRemoveTool, frictionCost, identifiedRisks } = useClient();
    const [isDragging, setIsDragging] = useState(false);
    const [draggedToolId, setDraggedToolId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

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
        // In a real router, we'd navigate('/scout')
        // Here, we'll trigger a browser event that MainLayout can listen to, or just alert for now as per instructions "go step by step"
        // Actually, let's use a CustomEvent so MainLayout can pick it up.
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

    return (
        <div
            className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <header className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="text-primary">Phase 1:</span> Stack Discovery
                    </h1>
                    <p className="text-zinc-400 text-sm">Drag to arrange via integration flow (Left to Right).</p>
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
                        className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                        Analyze Risks <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Tool Palette */}
                <div className="w-64 border-r border-zinc-800 bg-zinc-900 overflow-y-auto p-4 z-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Your Stack</h3>
                    <div className="space-y-3">
                        {AVAILABLE_TOOLS.map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => handleAddTool(tool)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800 hover:border-zinc-500 transition-all group"
                            >
                                <div className={`p-2 rounded-md ${tool.risky ? "bg-red-500/20 text-red-500" : "bg-zinc-700 text-zinc-300"}`}>
                                    <tool.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{tool.name}</span>
                                {tool.risky && <AlertTriangle className="w-4 h-4 text-red-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-zinc-900/50 border border-dashed border-zinc-700 rounded-lg text-center">
                        <p className="text-xs text-zinc-500 mb-2">Can't find a tool?</p>
                        <button className="text-xs text-blue-400 hover:underline">Add Custom Tool</button>
                    </div>
                </div>

                {/* The Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 relative bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden cursor-crosshair"
                >
                    {stack.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 pointer-events-none">
                            <p className="text-lg font-medium">Drag-and-drop tools to build your "Mess"</p>
                        </div>
                    )}

                    {/* Render Connections (Dynamic Lines) */}
                    <svg className="absolute inset-0 pointer-events-none">
                        {stack.map((t1, i) =>
                            stack.slice(i + 1).map((t2) => (
                                <line
                                    key={`${t1.id}-${t2.id}`}
                                    x1={(t1.x || 0) + 40} y1={(t1.y || 0) + 30} // Improved centers
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
                            <div className="flex items-center gap-3 pointer-events-none"> {/* Prevent text selection */}
                                {/* We handle Icon rendering carefully if it was passed as Any */}
                                {tool.icon && React.createElement(tool.icon, { className: `w-5 h-5 ${tool.risky ? "text-red-500" : "text-zinc-400"}` })}
                                {!tool.icon && <Database className="w-5 h-5 text-zinc-400" />} {/* Fallback */}

                                <span className="font-bold text-sm text-white select-none">{tool.name}</span>
                            </div>
                            {/* Delete acts as a button, need to stop propagation of drag */}
                            <button
                                onMouseDown={(e) => { e.stopPropagation(); ctxRemoveTool(tool.id); }}
                                className="absolute -top-2 -right-2 bg-zinc-800 border border-zinc-600 rounded-full p-1 text-zinc-400 hover:text-white hover:bg-red-500 hover:border-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}
