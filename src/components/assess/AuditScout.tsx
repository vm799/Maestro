import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, AlertTriangle, CheckCircle } from 'lucide-react';

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    isQuestion?: boolean;
}

const QUESTIONS = [
    "Let's be brutally honest. How many different AI tools are you *actually* using right now? (Include the 'Shadow AI'—stuff on personal cards).",
    "When your main bot finishes a task, do you have to manually copy-paste that info into another tool? If yes, how many hours a week is that costing you?",
    "How often does the AI get stuck in a loop or hallucinate, forcing you to jump in? Is there a formal 'panic button' for this?",
    "Can you show me a single dashboard that proves the ROI of these tools, or is everyone just saying 'it's going great'?",
    "On a scale of 1-10, how much 'tool fatigue' are you feeling? Is the AI making you productive or just busy?"
];

export function AuditScout() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'bot', text: "I'm the Audit Scout. I'm here to find out if your AI is actually working or just making noise. Ready to be honest?", isQuestion: true }
    ]);
    const [inputText, setInputText] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 means intro
    const [isTyping, setIsTyping] = useState(false);
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

        // Simulate bot thinking delay
        setTimeout(() => {
            let nextMsgText = "";
            let nextIndex = currentQuestionIndex + 1;

            if (currentQuestionIndex === -1) {
                // First actual question
                nextMsgText = QUESTIONS[0];
            } else if (currentQuestionIndex < QUESTIONS.length - 1) {
                // Next question
                nextMsgText = QUESTIONS[nextIndex];
            } else {
                // End of interview
                nextMsgText = "Thanks. I've seen enough. I'm generating your 'Friction Scorecard' now. It's... eye-opening.";
                nextIndex = currentQuestionIndex; // Stay at end
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
                            placeholder="Type your answer..."
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

            {/* Live Analysis (The "Trojan Horse" reveal) */}
            <div className="w-80 hidden xl:block space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                    <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Friction Detected
                    </h4>
                    <div className="space-y-4">
                        {/* Faked dynamic detection based on progress */}
                        {messages.length > 2 && (
                            <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 animate-in slide-in-from-right fade-in">
                                <div className="text-xs font-bold uppercase mb-1">Alert: Shadow AI</div>
                                <p className="text-xs">Unregulated tools mentioned. Security Risk: High.</p>
                            </div>
                        )}
                        {messages.length > 4 && (
                            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/20 animate-in slide-in-from-right fade-in">
                                <div className="text-xs font-bold uppercase mb-1">Inefficiency: Manual Bridge</div>
                                <p className="text-xs">Human copying data between bots. Automation failure.</p>
                            </div>
                        )}
                    </div>
                    {currentQuestionIndex >= 4 && (
                        <button className="w-full mt-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
                            <CheckCircle className="w-4 h-4" /> View Solution Proposal
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
