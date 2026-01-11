import { useState } from 'react';
import { ExecutiveReport } from './ExecutiveReport'; // Import the new component
import { FileText, BookOpen, AlertCircle } from 'lucide-react'; // Assuming these are used and need to be imported
import { useClient } from '../../context/ClientContext';

const ASSESSMENT_RUBRIC = [
    {
        id: "literacy",
        title: "I. AI Literacy: The Human OS",
        description: "Evaluating the workforce's ability to safely and effectively utilize AI tools.",
        icon: BookOpen,
        questions: [
            {
                id: "l1",
                text: "What percentage of your team uses AI daily?",
                scoringGuide: {
                    nonExistent: "< 5%: Initial experimental use only.",
                    emerging: "5-20%: Early adopters leading the way.",
                    systematic: "20-50%: Standardized tools in key workflows.",
                    optimized: "> 50%: AI is embedded in the DNA of operations."
                },
                consultantContext: "Look for shadow IT vs sanctioned usage. High usage without training is a risk."
            },
            {
                id: "l2",
                text: "Is there formal training on Prompt Engineering?",
                scoringGuide: {
                    nonExistent: "None: Learning by osmosis/Twitter.",
                    emerging: "Ad-hoc: Occasional workshops or shared docs.",
                    systematic: "Documented: Internal wiki + onboarding modules.",
                    optimized: "Certified: Certified courses & continuous learning."
                },
                consultantContext: "Quality of output depends on query quality. Check for 'lazy prompting' vs engineering."
            },
            {
                id: "l3",
                text: "Do employees understand 'Hallucinations'?",
                scoringGuide: {
                    nonExistent: "No clue: Blind trust in model outputs.",
                    emerging: "Vague: 'It sometimes makes mistakes.'",
                    systematic: "Aware: Verification protocols in place.",
                    optimized: "Expert: Techniques to ground and verify truth."
                },
                consultantContext: "Critical for risk. If financial/legal decisions are made on hallucinations, liability is high."
            }
        ]
    },
    {
        id: "policy",
        title: "II. Policy & Governance: The Shield",
        description: "Assessing the legal and ethical frameworks surrounding AI usage.",
        icon: AlertCircle,
        questions: [
            {
                id: "p1",
                text: "Is there a clear 'Acceptable Use Policy'?",
                scoringGuide: {
                    nonExistent: "No: Wild West.",
                    emerging: "Draft: Legal is looking at it.",
                    systematic: "Published: Accessible in Intranet.",
                    optimized: "Enforced: Technical guardrails prevent violations."
                },
                consultantContext: "A policy in a drawer is useless. Look for technical enforcement (CASB, blockers)."
            },
            {
                id: "p2",
                text: "Are confidential data flows monitored?",
                scoringGuide: {
                    nonExistent: "No: Data flows freely to public models.",
                    emerging: "Manual: Periodic audits or honors system.",
                    systematic: "DLP: Basic alerts on PII/Secrets.",
                    optimized: "Blocked: Real-time prevention of sensitive egress."
                },
                consultantContext: "The #1 enterprise risk. Check if employees paste customer/code data into ChatGPT."
            }
        ]
    }
];

export function MaturityAssessment() {
    const [activeTab, setActiveTab] = useState<string>("literacy");
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showReport, setShowReport] = useState(false);

    // Get the context to save scores globally
    const { setMaturityScores } = useClient();

    // Derived State
    const activeSection = ASSESSMENT_RUBRIC.find(s => s.id === activeTab) || ASSESSMENT_RUBRIC[0];

    const handleScore = (questionId: string, score: number) => {
        const newAnswers = { ...answers, [questionId]: score };
        setAnswers(newAnswers);

        // Calculate and save scores to global context
        const literacyIds = ['l1', 'l2', 'l3'];
        const govIds = ['p1', 'p2'];

        const literacyScores = literacyIds.map(id => newAnswers[id] || 0).filter(s => s > 0);
        const govScores = govIds.map(id => newAnswers[id] || 0).filter(s => s > 0);

        const literacy = literacyScores.length > 0
            ? Number((literacyScores.reduce((a, b) => a + b, 0) / literacyScores.length).toFixed(1))
            : 0;
        const governance = govScores.length > 0
            ? Number((govScores.reduce((a, b) => a + b, 0) / govScores.length).toFixed(1))
            : 0;

        setMaturityScores({ literacy, governance });
    };

    const calculateTotal = () => {
        const scores = Object.values(answers);
        if (scores.length === 0) return "0.0";
        const total = scores.reduce((a, b) => a + b, 0);
        return (total / scores.length).toFixed(1);
    };

    // Scale-specific score calculations
    const getLiteracyScore = () => {
        const literacyIds = ['l1', 'l2', 'l3'];
        const literacyScores = literacyIds.map(id => answers[id] || 0).filter(s => s > 0);
        if (literacyScores.length === 0) return 0;
        return Number((literacyScores.reduce((a, b) => a + b, 0) / literacyScores.length).toFixed(1));
    };

    const getGovernanceScore = () => {
        const govIds = ['p1', 'p2'];
        const govScores = govIds.map(id => answers[id] || 0).filter(s => s > 0);
        if (govScores.length === 0) return 0;
        return Number((govScores.reduce((a, b) => a + b, 0) / govScores.length).toFixed(1));
    };


    return (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
            {showReport && (
                <ExecutiveReport
                    onClose={() => setShowReport(false)}
                />
            )}

            <header className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Deep-Dive Maturity Audit</h1>
                    <p className="text-zinc-400 text-sm mt-1">PhD-Level Diagnostic • <span className="text-white font-bold">{calculateTotal()} / 4.0 Score</span></p>
                </div>
                <button
                    onClick={() => setShowReport(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
                >
                    <FileText className="w-4 h-4" /> Generate Audit Report
                </button>
            </header>

            {/* ... rest of the render code ... */}

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Sidebar: Pillars */}
                <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-card overflow-y-auto flex-shrink-0">
                    <div className="p-4 space-y-2">
                        {ASSESSMENT_RUBRIC.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveTab(section.id)}
                                className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === section.id
                                    ? "bg-primary/10 text-primary border-primary/20 border"
                                    : "hover:bg-secondary text-zinc-600 dark:text-zinc-400 hover:text-foreground"
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
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
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
                                                    <p className="text-zinc-400 text-xs leading-relaxed">
                                                        {score === 1 ? q.scoringGuide?.nonExistent :
                                                            score === 2 ? q.scoringGuide?.emerging :
                                                                score === 3 ? q.scoringGuide?.systematic :
                                                                    q.scoringGuide?.optimized}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Section Complete / Continue Button */}
                        {(() => {
                            const sectionQuestions = activeSection.questions.map(q => q.id);
                            const answeredInSection = sectionQuestions.filter(id => answers[id]).length;
                            const sectionComplete = answeredInSection === sectionQuestions.length;
                            const currentIndex = ASSESSMENT_RUBRIC.findIndex(s => s.id === activeTab);
                            const isLastSection = currentIndex === ASSESSMENT_RUBRIC.length - 1;
                            const allComplete = ASSESSMENT_RUBRIC.every(section =>
                                section.questions.every(q => answers[q.id])
                            );

                            return (
                                <div className="mt-8 pt-6 border-t border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-zinc-500">
                                            {answeredInSection}/{sectionQuestions.length} questions answered in this section
                                        </div>

                                        {sectionComplete && !isLastSection && (
                                            <button
                                                onClick={() => {
                                                    const nextSection = ASSESSMENT_RUBRIC[currentIndex + 1];
                                                    setActiveTab(nextSection.id);
                                                }}
                                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                                            >
                                                Continue to Stage {currentIndex + 2} →
                                            </button>
                                        )}

                                        {sectionComplete && isLastSection && allComplete && (
                                            <button
                                                onClick={() => {
                                                    window.dispatchEvent(new CustomEvent('navigate', { detail: 'roadmap' }));
                                                }}
                                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
                                            >
                                                Submit Assessment → View Remediation Plan
                                            </button>
                                        )}

                                        {!sectionComplete && (
                                            <div className="text-xs text-amber-500 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Answer all questions to continue
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Right: LIVE MATURITY SCALES */}
                    <div className="w-80 border-l border-border bg-zinc-900/80 overflow-y-auto p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live Scores</span>
                        </div>

                        {/* Overall Score */}
                        <div className="mb-8 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-sm text-zinc-400">Overall Maturity</span>
                                <span className="text-3xl font-bold text-white">{calculateTotal()}<span className="text-lg text-zinc-500">/4.0</span></span>
                            </div>
                            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${(Number(calculateTotal()) / 4) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Scale 1: AI Literacy */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase text-blue-400 flex items-center gap-2">
                                    <BookOpen className="w-3 h-3" /> AI Literacy
                                </span>
                                <span className="text-sm font-mono text-white">{getLiteracyScore()}</span>
                            </div>
                            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="absolute h-full bg-blue-500 transition-all duration-500"
                                    style={{ width: `${(getLiteracyScore() / 4) * 100}%` }}
                                />
                                <div className="absolute right-0 top-0 h-full w-0.5 bg-emerald-500" title="Target: 4.0" />
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-zinc-500">
                                <span>Ad-Hoc</span>
                                <span>Optimized</span>
                            </div>
                        </div>

                        {/* Scale 2: AI Governance */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" /> AI Governance
                                </span>
                                <span className="text-sm font-mono text-white">{getGovernanceScore()}</span>
                            </div>
                            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="absolute h-full bg-amber-500 transition-all duration-500"
                                    style={{ width: `${(getGovernanceScore() / 4) * 100}%` }}
                                />
                                <div className="absolute right-0 top-0 h-full w-0.5 bg-emerald-500" title="Target: 4.0" />
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-zinc-500">
                                <span>No Policy</span>
                                <span>Enforced</span>
                            </div>
                        </div>

                        {/* Gap Analysis Summary */}
                        <div className="mt-8 p-4 bg-red-950/30 rounded-xl border border-red-500/20">
                            <h4 className="font-bold text-sm mb-3 text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Gap to Target
                            </h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Literacy Gap</span>
                                    <span className="text-red-400 font-mono">{(4 - getLiteracyScore()).toFixed(1)} pts</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Governance Gap</span>
                                    <span className="text-red-400 font-mono">{(4 - getGovernanceScore()).toFixed(1)} pts</span>
                                </div>
                            </div>
                        </div>

                        {/* Answered Summary */}
                        <div className="mt-6 text-center text-xs text-zinc-500">
                            {Object.keys(answers).length} / {ASSESSMENT_RUBRIC.reduce((acc, s) => acc + s.questions.length, 0)} questions answered
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
