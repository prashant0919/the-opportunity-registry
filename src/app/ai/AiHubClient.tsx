"use client";

import React, { useState } from "react";
import { 
  Sparkles, Send, Brain, FileText, FileSpreadsheet, CheckSquare, 
  User, CheckCircle2, ChevronRight, Copy, Terminal, AlertCircle, RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";
import { motion } from "framer-motion";

interface Opportunity {
  id: string;
  title: string;
  organizationName: string;
  requirements: string;
  category: string;
}

interface AiHubClientProps {
  opportunities: Opportunity[];
}

export default function AiHubClient({ opportunities }: AiHubClientProps) {
  const { user } = useAuth();
  const { showToast } = useNotification();
  
  const [activeTab, setActiveTab] = useState<"chat" | "cv" | "sop" | "checklist">("chat");

  // --- 1. CHATBOT STATE ---
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello! I am your AI Opportunity Assistant. Ask me anything about career planning, scholarship eligibility, resume editing, or how to prepare for interviews!" }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const predefinedPrompts = [
    "Am I eligible for the Gates Cambridge Scholarship?",
    "What coding skills do I need for a Senior AI Engineer role?",
    "Suggest internships matching Next.js and PyTorch.",
    "Give me tips for writing a strong Statement of Purpose."
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: "user", text }]);
    setInputMsg("");
    setChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let reply = "";
      const lower = text.toLowerCase();
      
      if (lower.includes("gates") || lower.includes("cambridge")) {
        reply = `To be eligible for the Gates Cambridge Scholarship:
1. You must be an international citizen (not UK).
2. You must apply for a full-time PhD, MSc, or MPhil at the University of Cambridge.
3. As a Stanford CS graduate with a 3.9 GPA, you possess strong academic indicators. Focus your personal statement heavily on your leadership potential and commitment to social impact (e.g. how your machine learning work helps climate/society).`;
      } else if (lower.includes("ai engineer") || lower.includes("skills") || lower.includes("openai")) {
        reply = `For Senior AI roles (like the OpenAI listing):
- Core Technologies: PyTorch/TensorFlow, Python, Docker, Next.js (for model wrapper deployments).
- Deep Learning Theory: Transformer architectures, attention mechanisms, fine-tuning techniques (LoRA, QLoRA), RLHF, and inference optimization.
- Systems engineering: Managing distributed model training and GPU memory constraints.
You have solid baseline skills in PyTorch and Python. Focus on building portfolo projects displaying inference deployments.`;
      } else if (lower.includes("internship") || lower.includes("next.js") || lower.includes("pytorch")) {
        reply = `Based on your profile, I recommend:
1. Google DeepMind Summer Research Internship (UK): Matches your PyTorch and Stanford ML research background.
2. Vercel Labs Remote Frontend Developer Intern: Perfect fit for your Next.js and React capabilities.
Both are currently open for applications. Would you like me to draft a cover letter outline for either?`;
      } else if (lower.includes("sop") || lower.includes("statement of purpose")) {
        reply = `A winning Statement of Purpose (SOP) requires:
- **Hook (15%)**: A personal narrative relating to your research focus.
- **Academic Foundation (30%)**: Highlight your degree (Stanford CS) and major courses.
- **Practical Impact (35%)**: Detailed breakdown of your projects (e.g., your ML weather forecasting model).
- **Why Them (20%)**: Cite specific labs/professors at Cambridge or Stanford you want to collaborate with.`;
      } else {
        reply = `That is an excellent question. Regarding "${text}", as a premium member, I suggest aligning your resume keywords with the target listing's requirements. You can upload your PDF in the "CV Scanner" tab, and I will highlight matching parameters, or you can write a tailored cover letter in the "SOP Builder" tab.`;
      }

      setMessages(prev => [...prev, { sender: "ai", text: reply }]);
      setChatLoading(false);
    }, 1500);
  };

  // --- 2. CV SCANNER STATE ---
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvResult, setCvResult] = useState<{
    score: number;
    good: string[];
    improvements: string[];
  } | null>(null);

  const handleSimulateCvUpload = () => {
    setCvLoading(true);
    setCvResult(null);
    
    setTimeout(() => {
      setCvFile("Alex_Mercer_CV.pdf");
      setCvResult({
        score: 88,
        good: [
          "Strong academic pedigree (Stanford University CS)",
          "Excellent cumulative GPA (3.9 / 4.0)",
          "Demonstrated industrial engineering experience (Google Cloud AI Intern)",
          "Solid programming base matching key keywords (Python, PyTorch, React, Next.js)"
        ],
        improvements: [
          "Include quantitative metrics (e.g., 'Optimized ML data loading speed by 25%')",
          "Add cloud deployment details (AWS/GCP/Docker) directly in the work experience bullets rather than just in the skills array",
          "Clarify dates for the research projects to show timeline consistency"
        ]
      });
      setCvLoading(false);
      showToast("CV analysis compiled!", "success");
    }, 2200);
  };

  // --- 3. SOP / COVER LETTER STATE ---
  const [selectedOppId, setSelectedOppId] = useState("");
  const [sopType, setSopType] = useState<"sop" | "cover">("cover");
  const [userBackground, setUserBackground] = useState("");
  const [sopResult, setSopResult] = useState("");
  const [sopLoading, setSopLoading] = useState(false);

  const handleGenerateSop = () => {
    if (!selectedOppId) {
      showToast("Please choose an opportunity first", "info");
      return;
    }
    
    setSopLoading(true);
    setSopResult("");
    
    setTimeout(() => {
      const opp = opportunities.find(o => o.id === selectedOppId);
      if (!opp) return;
      
      let letter = "";
      if (sopType === "cover") {
        letter = `Dear Hiring Team at ${opp.organizationName},

I am writing to express my enthusiastic interest in the ${opp.title} opportunity. As a Computer Science graduate from Stanford University with practical experience in software development and machine learning, I am confident that my technical skills match the requirements of this role.

During my time at Stanford, I maintained a 3.9 GPA while focusing on machine learning models and web development. Specifically, my experience building scalable systems using Next.js, and training transformers using PyTorch matches the technical background you are seeking. Furthermore, my internship at Google Cloud AI allowed me to build features that directly support deep learning pipelines in production.

I am excited about the opportunity to contribute to ${opp.organizationName} and would love the chance to discuss how my background aligns with your team's goals.

Sincerely,
${user.name}
candidate@opportunity.com`;
      } else {
        letter = `STATEMENT OF PURPOSE
Target Program: ${opp.title} (${opp.organizationName})

My academic and professional journey has been driven by a passion to apply machine learning to solve complex global challenges. Applying for the ${opp.title} represents the ideal next step to deepen my research capacity.

Graduating from Stanford University with a B.S. in Computer Science, I built a strong foundation in computational models. My research under the Stanford ML Group allowed me to implement graph neural networks for weather forecasting. This project taught me how to navigate noisy, high-dimensional datasets and deploy models using PyTorch. 

The program at ${opp.organizationName} is particularly appealing due to its multidisciplinary approach and dedication to practical applications. I am excited to bring my coding and ML research foundation to your institution, and collaborate with leading minds on high-impact projects.

Sincerely,
${user.name}`;
      }

      setSopResult(letter);
      setSopLoading(false);
      showToast("Document generated successfully!", "success");
    }, 2000);
  };

  // --- 4. CHECKLIST STATE ---
  const [checklistType, setChecklistType] = useState("SCHOLARSHIP");
  const [checklist, setChecklist] = useState<Array<{ id: number; text: string; done: boolean }>>([]);
  const [checklistLoading, setChecklistLoading] = useState(false);

  const handleGenerateChecklist = () => {
    setChecklistLoading(true);
    setChecklist([]);

    setTimeout(() => {
      let list = [];
      if (checklistType === "SCHOLARSHIP") {
        list = [
          { id: 1, text: "Verify Academic GPA and Course Credits (Minimum 3.5 GPA)", done: true },
          { id: 2, text: "Register and sit for English Proficiency Test (IELTS / TOEFL)", done: true },
          { id: 3, text: "Draft Statement of Purpose (SOP) highlighting leadership achievements", done: false },
          { id: 4, text: "Secure two academic recommendation letters from university professors", done: false },
          { id: 5, text: "Acquire certified transcripts and graduation certificate copies", done: false },
          { id: 6, text: "Submit final application online before the official deadline", done: false }
        ];
      } else if (checklistType === "JOB") {
        list = [
          { id: 1, text: "Polish portfolio and host projects on GitHub", done: true },
          { id: 2, text: "Match CV keywords with target role specs (e.g. Next.js, PyTorch)", done: true },
          { id: 3, text: "Prepare 1-page Cover Letter highlighting commercial impact", done: false },
          { id: 4, text: "Complete mock coding questions (Algorithms & Systems Design)", done: false },
          { id: 5, text: "Update LinkedIn and mark profile as 'Open to Work'", done: false }
        ];
      } else {
        list = [
          { id: 1, text: "Draft project pitch deck (10-slide outline)", done: true },
          { id: 2, text: "Record 2-minute video demo of prototype or scientific concept", done: false },
          { id: 3, text: "Compile detailed operational budget statement", done: false },
          { id: 4, text: "Get endorsement or support letter from local incubator/lab", done: false }
        ];
      }

      setChecklist(list);
      setChecklistLoading(false);
      showToast("Checklist generated!", "success");
    }, 1200);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          AI Copilot Workspace
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          AI Career Assistant
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Personalized guides, eligibility checking, and application builders powered by deep semantic models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        
        {/* Navigation Tabs (Left 3 columns) */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "chat" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <Brain className="w-4 h-4" />
            AI Career Chatbot
          </button>
          <button
            onClick={() => setActiveTab("cv")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "cv" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            CV & Resume Scanner
          </button>
          <button
            onClick={() => setActiveTab("sop")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "sop" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            SOP & Cover Letter
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "checklist" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Checklist Generator
          </button>

          {/* Premium Account Banner */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-xs">
            <h4 className="font-bold text-amber-600 dark:text-amber-455 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              Premium Mode Active
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              You have unlimited AI tokens. Optimize resumes, generate draft motivation templates, and request review scores without restriction.
            </p>
          </div>
        </div>

        {/* Content Workspace (Right 9 columns) */}
        <div className="md:col-span-9 p-6 rounded-2xl glass-card border border-lightborder dark:border-darkborder min-h-[500px] flex flex-col justify-between">
          
          {/* TAB 1: CHATBOT */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.sender === "user" 
                        ? "bg-brand-600 text-white" 
                        : "bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400"
                    }`}>
                      {msg.sender === "user" ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-brand-600 text-white rounded-tr-none"
                        : "bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none"
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex gap-3 mr-auto items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-600 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 animate-pulse" />
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 animate-pulse">
                      AI Advisor is reviewing options...
                    </span>
                  </div>
                )}
              </div>

              {/* Predefined prompt helpers */}
              <div className="border-t border-slate-150 dark:border-slate-800 pt-4 mt-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Common Queries:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {predefinedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p)}
                      className="text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300 transition-colors text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Input block */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMsg); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Ask about resume checks, scholarship deadlines, remote roles..."
                    className="w-full text-xs px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-brand-500/25 transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: CV SCANNER */}
          {activeTab === "cv" && (
            <div className="flex flex-col h-full gap-6">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500/50 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-950/20 transition-colors">
                <FileText className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 mb-3" />
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  {cvFile ? cvFile : "Drag and drop your Resume / CV PDF here"}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4">
                  PDF, DOCX, or Text file format (Max 4MB)
                </p>
                <button
                  onClick={handleSimulateCvUpload}
                  disabled={cvLoading}
                  className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5 mx-auto"
                >
                  {cvLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Parsing Layout...
                    </>
                  ) : cvFile ? (
                    "Re-upload & Re-scan CV"
                  ) : (
                    "Select CV File from Disk"
                  )}
                </button>
              </div>

              {cvResult && (
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      AI Alignment Report
                    </span>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      Score: {cvResult.score} / 100
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Strengths */}
                    <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10">
                      <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Identified Strengths
                      </h4>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                        {cvResult.good.map((g, idx) => <li key={idx}>{g}</li>)}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10">
                      <h4 className="font-bold text-amber-600 dark:text-amber-455 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Improvement Advice
                      </h4>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                        {cvResult.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOP & COVER LETTER GENERATOR */}
          {activeTab === "sop" && (
            <div className="flex flex-col h-full gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Target Program / Opportunity
                    </label>
                    <select
                      value={selectedOppId}
                      onChange={(e) => setSelectedOppId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="">Select Opportunity...</option>
                      {opportunities.map(o => (
                        <option key={o.id} value={o.id}>{o.title} ({o.organizationName})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Document Objective
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSopType("cover")}
                        className={`flex-grow py-2 rounded-lg font-bold border transition-colors ${
                          sopType === "cover"
                            ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/35"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600"
                        }`}
                      >
                        💼 Cover Letter
                      </button>
                      <button
                        onClick={() => setSopType("sop")}
                        className={`flex-grow py-2 rounded-lg font-bold border transition-colors ${
                          sopType === "sop"
                            ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/35"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600"
                        }`}
                      >
                        🎓 Motivation / SOP
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Key Accomplishments (AI Customizer)
                    </label>
                    <textarea
                      value={userBackground}
                      onChange={(e) => setUserBackground(e.target.value)}
                      placeholder="e.g. CS Stanford GPA 3.9, Google ML Cloud experience, worked on climate transformer forecasting models..."
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 min-h-[90px]"
                    />
                  </div>

                  <button
                    onClick={handleGenerateSop}
                    disabled={sopLoading}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    {sopLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating Tailored Copy...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        Compile AI Document
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Output */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 relative flex flex-col justify-between min-h-[250px] max-h-[350px]">
                  {sopResult ? (
                    <>
                      <div className="overflow-y-auto whitespace-pre-wrap leading-relaxed pr-2 flex-grow text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                        {sopResult}
                      </div>
                      <button
                        onClick={() => handleCopyText(sopResult)}
                        className="mt-4 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 transition-colors shrink-0 max-w-[120px]"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Code
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <FileSpreadsheet className="w-8 h-8 mb-2 opacity-50" />
                      <p>Draft copy will be rendered here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHECKLIST GENERATOR */}
          {activeTab === "checklist" && (
            <div className="flex flex-col h-full gap-5">
              <div className="flex items-end gap-3 text-xs max-w-lg">
                <div className="flex-grow">
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Goal Category
                  </label>
                  <select
                    value={checklistType}
                    onChange={(e) => setChecklistType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="SCHOLARSHIP">🎓 Masters/PhD Scholarship Program</option>
                    <option value="JOB">💼 Remote tech Software Engineering Jobs</option>
                    <option value="GRANT">💰 Startup / Seed Funding Grants</option>
                  </select>
                </div>
                <button
                  onClick={handleGenerateChecklist}
                  disabled={checklistLoading}
                  className="px-5 py-2.5 h-[42px] rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  {checklistLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Compile checklist"
                  )}
                </button>
              </div>

              {checklist.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 animate-in fade-in duration-300">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">
                    AI Chronological Application Checklist:
                  </h4>
                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 text-xs"
                      >
                        <button
                          onClick={() => {
                            setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, done: !c.done } : c));
                          }}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            item.done 
                              ? "bg-brand-600 border-brand-600 text-white animate-pulse" 
                              : "border-slate-300 dark:border-slate-700 hover:border-brand-500"
                          }`}
                        >
                          {item.done && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <span className={`text-left leading-relaxed ${item.done ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300 font-medium"}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {checklist.length === 0 && !checklistLoading && (
                <div className="py-16 text-center text-slate-400">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Configure parameters above and compile checklist.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
