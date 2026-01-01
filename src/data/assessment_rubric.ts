import { Shield, Brain, Zap, Target } from 'lucide-react';

export interface AssessmentSection {
    id: string;
    title: string;
    icon: any;
    description: string;
    questions: Question[];
}

export interface Question {
    id: string;
    text: string;
    consultantContext: string; // The "Why" this matters (PhD level)
    scoringGuide: {
        nonExistent: string; // Level 1
        emerging: string; // Level 2
        systematic: string; // Level 3
        optimized: string; // Level 4
    };
}

export const ASSESSMENT_RUBRIC: AssessmentSection[] = [
    {
        id: "literacy",
        title: "Pillar 1: AI Literacy & Culture",
        icon: Brain,
        description: "Moving beyond 'Prompt Engineering' to 'Intelligent Augmentation' and Change Management.",
        questions: [
            {
                id: "lit_1",
                text: "How is the organization's 'Augmentation Mindset' distributed across the hierarchy?",
                consultantContext: "Pascal Bornet argues that 'Intelligent Automation' fails without cultural buy-in. We aren't looking for 'users'; we are looking for 'architects' of their own workflows. A high score requires bottom-up innovation meeting top-down strategy.",
                scoringGuide: {
                    nonExistent: "Fear/Resistance. 'AI will take my job' sentiment prevails. No usage.",
                    emerging: "Silos of Innovation. A few 'power users' exist but stay hidden (Shadow AI).",
                    systematic: "Formal Training Programs exist. 'AI Champion' network established in each dept.",
                    optimized: "'AI Native' Culture. KPI incentives aligned with Agentic adoption. Failure is depenalized to encourage experimentation."
                }
            },
            {
                id: "lit_2",
                text: "To what extent is Executive Leadership aligned on the 'AI Reality' vs 'AI Hype'?",
                consultantContext: "Nate B. Jones emphasizes 'Realistic Optimism'. Executives often demand 'Magic' without understanding the probabilistic nature of LLMs. You must assess if they are ready for 'Probabilistic Outcomes' vs 'Deterministic Software'.",
                scoringGuide: {
                    nonExistent: "Magic Thinking. 'Just install ChatGPT and fix revenue.'",
                    emerging: "Curiosity. Pilot programs founded on FOMO rather than ROI.",
                    systematic: "Strategic Understanding. Execs distinguish between GenAI, Predictive AI, and Robotics.",
                    optimized: "Board-Level Governance. AI Risk/Opportunity is a standing agenda item. Build vs Buy strategy is clear."
                }
            }
        ]
    },
    {
        id: "governance",
        title: "Pillar 2: Governance & Security (ISO 42001)",
        icon: Shield,
        description: "From 'Wild West' Shadow AI to verifiable Risk Management Frameworks.",
        questions: [
            {
                id: "gov_1",
                text: "Does the organization maintain a verifiable 'AI Bill of Materials' (AI-BOM) for all active models?",
                consultantContext: "You cannot govern what you cannot see. ISO 42001 requires traceability. Does the client know if their Marketing agency is using OpenAI or Anthropic? Where is the data flowing?",
                scoringGuide: {
                    nonExistent: "Zero Visibility. 'We don't use AI' (but they do).",
                    emerging: "Manual Spreadsheets. IT tracks simple SaaS approvals but misses API calls.",
                    systematic: "Automated discovery. Agentic logging of all LLM ingress/egress.",
                    optimized: "Real-time Dashboard (Maestro). Full lineage tracing involving PII redaction and model versioning."
                }
            },
            {
                id: "gov_2",
                text: "What is the protocol for 'Human-in-the-Loop' (HITL) validation?",
                consultantContext: "Automated decisions without review create liability. The EU AI Act categorizes 'High Risk' systems. We need to assess the ratio of Autonomous vs. Supervised actions.",
                scoringGuide: {
                    nonExistent: "Implicit Trust. Outputs are copy-pasted directly to clients.",
                    emerging: "Ad-hoc Review. 'Check it if it looks weird.'",
                    systematic: "Process Gates. Defined workflows where AI drafts, Human signs off.",
                    optimized: "Statistical Sampling. Random audits of Agent interactions + 100% review for high-confidence threshold failures."
                }
            }
        ]
    },
    {
        id: "infrastructure",
        title: "Pillar 3: Adaptive Infrastructure",
        icon: Zap,
        description: "Vector stores, RAG pipelines, and the transition from 'Static' to 'Agentic' Data.",
        questions: [
            {
                id: "inf_1",
                text: "Is the organization's Knowledge Base ready for RAG (Retrieval Augmented Generation)?",
                consultantContext: "Garbage In, Garbage Out. Most enterprises have unstructured, messy SharePoints. A LLM cannot reason over messy data. Infrastructure maturity = Data Hygiene.",
                scoringGuide: {
                    nonExistent: "Data Swamps. PDFs scans, hand-written notes, inaccessible silos.",
                    emerging: "Digital Archives. OCR'd documents, but no semantic indexing.",
                    systematic: "Vectorized Knowledge. Docs are chunked and embedded (Pinecone/Weaviate).",
                    optimized: "GraphRAG. Knowledge Graph combined with Vector search for multi-hop reasoning."
                }
            }
        ]
    },
    {
        id: "strategy",
        title: "Pillar 4: Strategic Value Chain",
        icon: Target,
        description: "Defining ROI: Is AI a 'Utility' or a 'Competitive Advantage'?",
        questions: [
            {
                id: "str_1",
                text: "Where does AI sit in the Porter's Value Chain?",
                consultantContext: "Are we optimising 'Support Activities' (HR/IT) or 'Primary Activities' (Logistics/Sales)? High value consulting moves focus from backend efficiency to frontend revenue generation.",
                scoringGuide: {
                    nonExistent: "Novelty/Toy. Usage limited to writing emails.",
                    emerging: "Cost Reduction. Focused on reducing headcount in Support centers.",
                    systematic: "Product Enhancement. AI features added to existing products.",
                    optimized: "Business Model Innovation. Selling outcomes (Agentic Services) instead of software."
                }
            }
        ]
    }
];
