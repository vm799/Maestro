import React, { useState } from 'react';
import { PenTool, Mic, Share2, FileText, Sparkles, Download } from 'lucide-react';

export function ContentStudio() {
    const [activeTab, setActiveTab] = useState<'social' | 'speech' | 'handout'>('social');

    return (
        <div className="h-full flex flex-col bg-zinc-50/50 dark:bg-zinc-950/50">
            <header className="px-8 py-6 border-b border-border bg-card">
                <h1 className="text-2xl font-bold tracking-tight mb-4">Content Studio</h1>
                <div className="flex items-center gap-2">
                    <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={Share2} label="Social & Blog" />
                    <TabButton active={activeTab === 'speech'} onClick={() => setActiveTab('speech')} icon={Mic} label="Keynotes" />
                    <TabButton active={activeTab === 'handout'} onClick={() => setActiveTab('handout')} icon={FileText} label="Workshop Handouts" />
                </div>
            </header>

            <div className="flex-1 p-8 overflow-auto">
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'social' && <SocialGenerator />}
                    {activeTab === 'speech' && <SpeechGenerator />}
                    {activeTab === 'handout' && <HandoutGenerator />}
                </div>
            </div>
        </div>
    );
}

function SocialGenerator() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="bg-card p-4 rounded-xl border border-border">
                    <label className="text-sm font-bold mb-2 block">Topic / Angle</label>
                    <textarea className="w-full h-32 bg-secondary/50 rounded-lg p-3 text-sm resize-none outline-none focus:ring-1 ring-primary" placeholder="e.g. Why 'Prompt Engineering' is a dead skill..." />
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                        LinkedIn Post
                    </button>
                    <button className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                        Substack Article
                    </button>
                </div>
            </div>
            {/* Preview Area */}
            <div className="bg-card border border-border rounded-xl p-6 min-h-[300px] flex items-center justify-center text-muted-foreground border-dashed">
                <div className="text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">AI Draft will appear here...</p>
                </div>
            </div>
        </div>
    )
}

function SpeechGenerator() {
    return (
        <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Mic className="w-4 h-4" /> Keynote Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                    <select className="p-2 rounded-md bg-secondary text-sm"><option>Audience: C-Suite (Formal)</option><option>Audience: Tech Conf (Energy)</option></select>
                    <select className="p-2 rounded-md bg-secondary text-sm"><option>Duration: 15 min</option><option>Duration: 45 min</option></select>
                </div>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg">Generate Script</button>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 h-[400px] overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
                [WAITING FOR INPUT...]
            </div>
        </div>
    )
}

function HandoutGenerator() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["AI Opportunity Map", "Risk Mitigation Framework", "2026 Strategy One-Pager"].map(template => (
                <div key={template} className="bg-card hover:border-primary/50 transition-colors border border-border rounded-xl p-6 cursor-pointer group">
                    <div className="h-32 bg-secondary/50 rounded-lg mb-4 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{template}</h3>
                    <p className="text-xs text-muted-foreground mb-4">Standard Consultant Template</p>
                    <button className="w-full py-1.5 text-xs bg-primary/10 text-primary rounded-md font-bold flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" /> Create PDF
                    </button>
                </div>
            ))}
        </div>
    )
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${active ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent text-muted-foreground"
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    )
}
