import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Shield, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    isQuestion?: boolean;
}

// The "Shield & Spear" Question Bank
const QUESTIONS = [
    // Shield (Security)
    {
        type: "shield",
        text: "Reviewing your Stack Map... I see 3 tools connected to email. Be precise: Do you have a DLP (Data Loss Prevention) policy for them?"
    },
    // Spear (Culture/Literacy)
    {
        type: "spear",
        text: "Let's talk about the team. When you rolled out that last tool, did employees ignore it? (Honest answer: Yes/No)"
    },
    // Shield (Governance)
    {
        type: "shield",
        text: "Who has the 'Kill Switch' if an agent starts halluncinating at 2 AM? Is there a human on call?"
    },
    // Spear (Strategy)
    {
        type: "spear",
        text: "Are you using AI to cut costs (Survival) or creates new revenue (Growth)? Most companies lie about this."
    }
];

export function AuditScout() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'bot', text: "I've analyzed your Stack Map. I have 4 questions to determine your Risk Profile vs. Growth Potential.", isQuestion: true }
    ]);
    const [inputText, setInputText] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [isTyping, setIsTyping] = useState(false);
    const [shieldScore, setShieldScore] = useState(0); // Risk detected
    const [spearScore, setSpearScore] = useState(0);   // Opportunity detected

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        // User message
        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Analyze Answer (Simulated)
        // In a real app, we'd use an LLM here to classify the sentiment/content
        if (currentQuestionIndex >= 0) {
            const type = QUESTIONS[currentQuestionIndex].type;
            if (type === 'shield' && (inputText.toLowerCase().includes('no') || inputText.toLowerCase().includes('don\'t'))) {
                setShieldScore(s => s + 1); // High Risk
            }
            if (type === 'spear' && (inputText.toLowerCase().includes('ignore') || inputText.toLowerCase().includes('cost'))) {
                setSpearScore(s => s + 1); // Low Maturity
            }
        }

        // Simulate bot thinking delay
        setTimeout(() => {
            let nextMsgText = "";
            let nextIndex = currentQuestionIndex + 1;

            if (currentQuestionIndex === -1) {
                nextMsgText = QUESTIONS[0].text;
            } else if (currentQuestionIndex < QUESTIONS.length - 1) {
                nextMsgText = QUESTIONS[nextIndex].text;
            } else {
                nextMsgText = "Analysis Complete. I'm generating your 'Shield & Spear' report now.";
                nextIndex = currentQuestionIndex;
            }

            const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: nextMsgText, isQuestion: true };
            setMessages(prev => [...prev, botMsg]);
            setCurrentQuestionIndex(nextIndex);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex h-full bg-zinc-50 dark:bg-zinc-950 p-8 gap-8">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col max-w-3xl mx-auto bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">The Audit Scout</h3>
                            <p className="text-xs text-muted-foreground">Orchestration Integrity Check</p>
                        </div>
                    </div>
                    <div className="text-xs uppercase font-bold tracking-widest text-muted-foreground bg-secondary px-2 py-1 rounded">
                        Interviewing
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.sender === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-secondary text-secondary-foreground rounded-tl-none'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-75" />
                                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce delay-150" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-muted/10">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex items-center gap-2"
                    >
                        <input
                            autoFocus
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Type your answer... be honest."
                            className="flex-1 bg-background border border-input rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || isTyping}
                            className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 transition-all"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Live "Shield & Spear" Analysis */}
            <div className="w-80 hidden xl:block space-y-6">

                {/* Shield Card (Security) */}
                <div className={`bg-card border rounded-xl p-6 transition-all duration-500 ${shieldScore > 0 ? "border-red-500/50 shadow-lg shadow-red-500/10" : "border-border"}`}>
                    <h4 className="font-bold text-sm mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2"><Shield className={`w-4 h-4 ${shieldScore > 0 ? "text-red-500" : "text-muted-foreground"}`} /> Shield Status</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${shieldScore > 0 ? "bg-red-500/20 text-red-500" : "bg-secondary text-muted-foreground"}`}>
                            {shieldScore > 0 ? "Vulnerable" : "Scanning"}
                        </span>
                    </h4>
                    <div className="space-y-4">
                        {shieldScore > 0 && (
                            <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg border border-red-500/20 animate-in slide-in-from-right fade-in">
                                <div className="text-xs font-bold uppercase mb-1">Gaps Detected</div>
                                <p className="text-xs">Missing DLP Policy. Shadow AI active w/o Kill Switch.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Spear Card (Culture) */}
                <div className={`bg-card border rounded-xl p-6 transition-all duration-500 ${spearScore > 0 ? "border-amber-500/50 shadow-lg shadow-amber-500/10" : "border-border"}`}>
                    <h4 className="font-bold text-sm mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2"><Zap className={`w-4 h-4 ${spearScore > 0 ? "text-amber-500" : "text-muted-foreground"}`} /> Spear Status</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${spearScore > 0 ? "bg-amber-500/20 text-amber-500" : "bg-secondary text-muted-foreground"}`}>
                            {spearScore > 0 ? "Resistance" : "Scanning"}
                        </span>
                    </h4>
                    <div className="space-y-4">
                        {spearScore > 0 && (
                            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/20 animate-in slide-in-from-right fade-in">
                                <div className="text-xs font-bold uppercase mb-1">Adoption Friction</div>
                                <p className="text-xs">Team ignoring tools. Strategy focused on cutting costs vs growth.</p>
                            </div>
                        )}
                    </div>
                </div>

                {currentQuestionIndex >= 4 && (
                    <button className="w-full mt-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
                        <CheckCircle className="w-4 h-4" /> View Remediation Plan
                    </button>
                )}

            </div>
        </div>
    );
}
