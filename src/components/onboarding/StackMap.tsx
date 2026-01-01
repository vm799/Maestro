import React, { useState } from 'react';
import { Share2, MessageSquare, Database, Mail, AlertTriangle, ArrowRight, X } from 'lucide-react';

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

import { useClient } from '../../context/ClientContext';

export function StackMap() {
    const { stack, addTool: ctxAddTool, removeTool: ctxRemoveTool, frictionCost, identifiedRisks } = useClient();
    // We keep the "template" tool logic local for the palette, but state goes to context

    const handleAddTool = (toolTemplate: any) => {
        const newTool = {
            ...toolTemplate,
            id: `${toolTemplate.id}-${Date.now()}`,
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50
        };
        ctxAddTool(newTool);
    };

    const handleRemoveTool = (id: string) => {
        ctxRemoveTool(id);
    };

    return (
        <div className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden">
            <header className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="text-red-500">Day 1:</span> The Stack Map
                    </h1>
                    <p className="text-zinc-400 text-sm">Drag your tools onto the canvas. Be honest.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Projected Friction</div>
                        <div className={`text-xl font-bold font-mono ${frictionCost > 0 ? "text-red-500" : "text-emerald-500"}`}>
                            ${frictionCost.toLocaleString()}/mo
                        </div>
                    </div>
                    <button className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        Analyze Risks <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Tool Palette */}
                <div className="w-64 border-r border-zinc-800 bg-zinc-900 overflow-y-auto p-4">
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
                <div className="flex-1 relative bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden">
                    {stack.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 pointer-events-none">
                            <p className="text-lg font-medium">Drag tools here to map your silos.</p>
                        </div>
                    )}

                    {/* Render Connections (Simulated Manual Bridges) */}
                    <svg className="absolute inset-0 pointer-events-none">
                        {stack.map((t1, i) =>
                            stack.slice(i + 1).map((t2) => (
                                <line
                                    key={`${t1.id}-${t2.id}`}
                                    x1={t1.x! + 20} y1={t1.y! + 20}
                                    x2={t2.x! + 20} y2={t2.y! + 20}
                                    stroke={t1.category !== t2.category ? "#b91c1c" : "#27272a"} // Red if cross-category (Manual Bridge assumption)
                                    strokeWidth="2"
                                    strokeDasharray={t1.category !== t2.category ? "5,5" : "0"}
                                    className="opacity-50"
                                />
                            ))
                        )}
                    </svg>

                    {/* Render Nodes */}
                    {stack.map((tool) => (
                        <div
                            key={tool.id}
                            className={`absolute p-4 rounded-xl border-2 shadow-2xl cursor-grab active:cursor-grabbing backdrop-blur-sm transition-all animate-in zoom-in duration-300 ${tool.risky
                                ? "bg-red-950/40 border-red-500/50 shadow-red-900/20"
                                : "bg-zinc-800/80 border-zinc-600 shadow-black/50"
                                }`}
                            style={{ left: tool.x, top: tool.y }}
                        >
                            <div className="flex items-center gap-3">
                                <tool.icon className={`w-5 h-5 ${tool.risky ? "text-red-500" : "text-zinc-400"}`} />
                                <span className="font-bold text-sm text-white">{tool.name}</span>
                                <button onClick={() => ctxRemoveTool(tool.id)} className="text-zinc-500 hover:text-white ml-2">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            {tool.risky && (
                                <div className="absolute -bottom-6 left-0 right-0 text-center">
                                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Shadow AI</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Contextual Insight Bubble */}
                    {identifiedRisks.length > 0 && (
                        <div className="absolute bottom-8 right-8 max-w-sm bg-zinc-900 border border-red-500/30 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-red-400 mb-1">Risk Detected</h4>
                                    <p className="text-xs text-zinc-400">
                                        {identifiedRisks.length} critical issues found. Total Impact: <span className="text-white font-mono">${frictionCost}/mo</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
