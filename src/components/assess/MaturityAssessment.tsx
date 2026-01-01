import React, { useState } from 'react';
import { ASSESSMENT_RUBRIC, AssessmentSection, Question } from '../../data/assessment_rubric';
import { ChevronRight, Info, BookOpen, AlertCircle, FileText } from 'lucide-react';

export function MaturityAssessment() {
    const [activeTab, setActiveTab] = useState<string>("literacy");
    const [answers, setAnswers] = useState<Record<string, number>>({});

    const activeSection = ASSESSMENT_RUBRIC.find(s => s.id === activeTab) as AssessmentSection;

    const handleScore = (qId: string, score: number) => {
        setAnswers(prev => ({ ...prev, [qId]: score }));
    };

    const calculateTotal = () => {
        const values = Object.values(answers);
        if (values.length === 0) return 0;
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    };

    return (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <header className="px-8 py-6 border-b border-border bg-card flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Deep-Dive Maturity Audit</h1>
                    <p className="text-muted-foreground text-sm">PhD-Level Diagnostic • {calculateTotal()} / 4.0 Score</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Generate Audit Report
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: Pillars */}
                <div className="w-64 border-r border-border bg-card overflow-y-auto">
                    <div className="p-4 space-y-2">
                        {ASSESSMENT_RUBRIC.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveTab(section.id)}
                                className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === section.id
                                        ? "bg-primary/10 text-primary border-primary/20 border"
                                        : "hover:bg-secondary text-muted-foreground"
                                    }`}
                            >
                                <section.icon className="w-5 h-5 shrink-0" />
                                <div>
                                    <div className="text-sm font-bold">{section.title.split(":")[0]}</div>
                                    <div className="text-[10px] opacity-70 truncate">{section.title.split(":")[1]}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main: Analysis Canvas */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Center: Questions */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <activeSection.icon className="w-6 h-6 text-primary" />
                                {activeSection.title}
                            </h2>
                            <p className="text-muted-foreground mt-1">{activeSection.description}</p>
                        </div>

                        {activeSection.questions.map((q, idx) => (
                            <div key={q.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                <div className="flex gap-4">
                                    <span className="text-xs font-mono font-bold text-muted-foreground mt-1">Q{idx + 1}</span>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-lg mb-4">{q.text}</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                            {[1, 2, 3, 4].map((score) => (
                                                <button
                                                    key={score}
                                                    onClick={() => handleScore(q.id, score)}
                                                    className={`p-3 rounded-lg border text-left text-sm transition-all h-full ${answers[q.id] === score
                                                            ? "ring-2 ring-primary border-transparent bg-primary/5"
                                                            : "border-border hover:border-primary/50"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${score === 1 ? "text-red-500" :
                                                                score === 2 ? "text-amber-500" :
                                                                    score === 3 ? "text-blue-500" : "text-emerald-500"
                                                            }`}>
                                                            {score === 1 ? "Level 1: Ad-Hoc" :
                                                                score === 2 ? "Level 2: Emerging" :
                                                                    score === 3 ? "Level 3: Systematic" : "Level 4: Optimized"}
                                                        </span>
                                                        {answers[q.id] === score && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                    </div>
                                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                                        {score === 1 ? q.scoringGuide.nonExistent :
                                                            score === 2 ? q.scoringGuide.emerging :
                                                                score === 3 ? q.scoringGuide.systematic :
                                                                    q.scoringGuide.optimized}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Consultant Guidance (The PhD Notes) */}
                    <div className="w-80 border-l border-border bg-zinc-50/50 dark:bg-zinc-900/50 overflow-y-auto p-6">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Consultant Playbook</span>
                        </div>

                        <div className="space-y-6">
                            {activeSection.questions.map((q, idx) => (
                                <div key={q.id} className="relative pl-4 border-l-2 border-primary/20">
                                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary/20" />
                                    <h4 className="text-xs font-bold text-foreground mb-1">Guidance for Q{idx + 1}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                                        "{q.consultantContext}"
                                    </p>
                                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded w-fit">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>Assess evidence, not claims.</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <h4 className="font-bold text-sm mb-2 text-primary">Expert Reference</h4>
                            <p className="text-xs text-muted-foreground">
                                "True maturity isn't tool adoption; it's the shift from deterministic software to probabilistic reasoning."
                            </p>
                            <p className="text-xs text-right mt-2 font-medium">- Nate B. Jones</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
