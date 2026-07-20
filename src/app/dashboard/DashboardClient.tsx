"use client";

import React, { useState } from "react";
import { 
  FileText, Calendar as CalendarIcon, ClipboardList, Sparkles, 
  MapPin, Clock, Plus, Trash, Globe, ArrowRight, 
  User, CheckCircle2, Award, Download, UploadCloud, ChevronRight, Play
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";
import { updateApplicationStatus, uploadUserDocument, toggleSaveOpportunity } from "@/app/actions";

interface Opportunity {
  id: string;
  title: string;
  organizationName: string;
  location: string;
  deadline: string;
  fundingType: string;
}

interface Application {
  id: string;
  opportunityId: string;
  status: string;
  notes: string | null;
  opportunity: Opportunity;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Document {
  id: string;
  name: string;
  fileType: string;
  sizeBytes: number;
  createdAt: string;
}

interface DashboardClientProps {
  initialApplications: Application[];
  badges: Badge[];
  documents: Document[];
  allOpportunities: Opportunity[];
}

const STAGES = [
  { id: "SAVED", label: "Saved Listings", color: "border-t-brand-500 bg-brand-50/50 dark:bg-brand-950/5" },
  { id: "APPLIED", label: "Applied", color: "border-t-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/5" },
  { id: "INTERVIEW", label: "Interviews", color: "border-t-amber-500 bg-amber-50/50 dark:bg-amber-950/5" },
  { id: "OFFERED", label: "Offers", color: "border-t-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/5" },
  { id: "REJECTED", label: "Archived", color: "border-t-rose-500 bg-rose-50/50 dark:bg-rose-950/5" }
];

export default function DashboardClient({ 
  initialApplications, 
  badges, 
  documents,
  allOpportunities 
}: DashboardClientProps) {
  const { user } = useAuth();
  const { showToast } = useNotification();
  
  const [activeSubTab, setActiveSubTab] = useState<"tracker" | "calendar" | "vault" | "recommendations">("tracker");
  
  // Dynamic states updated via server actions
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [docList, setDocList] = useState<Document[]>(documents);

  // --- KANBAN LOGIC ---
  const handleMoveStatus = async (oppId: string, title: string, nextStatus: string) => {
    const res = await updateApplicationStatus(user.id, oppId, nextStatus);
    if (res.success) {
      setApplications(prev => prev.map(app => 
        app.opportunityId === oppId ? { ...app, status: nextStatus } : app
      ));
      showToast(`Moved "${title}" to ${nextStatus}!`, "success");
    } else {
      showToast("Failed to update status", "error");
    }
  };

  const handleRemoveApplication = async (oppId: string, title: string) => {
    const res = await toggleSaveOpportunity(user.id, oppId);
    if (res.success) {
      setApplications(prev => prev.filter(app => app.opportunityId !== oppId));
      showToast(`Removed "${title}" from board.`, "info");
    }
  };

  // --- DOCUMENT VAULT LOGIC ---
  const handleSimulatedDocUpload = async () => {
    const docNames = [
      "Recommendation_Letter_Stanford.pdf",
      "Personal_Statement_Draft.docx",
      "IELTS_Certificate_Official.pdf",
      "Climate_ML_Project_Presentation.pdf"
    ];
    
    // Select a random name that doesn't exist yet
    const existingNames = docList.map(d => d.name);
    const availableNames = docNames.filter(n => !existingNames.includes(n));
    
    if (availableNames.length === 0) {
      showToast("All simulated documents have already been uploaded!", "info");
      return;
    }
    
    const targetName = availableNames[0];
    const size = Math.floor(100000 + Math.random() * 500000);
    const type = targetName.endsWith(".pdf") ? "pdf" : "docx";

    showToast(`Uploading secure file ${targetName}...`, "info");
    
    const res = await uploadUserDocument(user.id, targetName, size, type);
    if (res.success && res.data) {
      const newDoc: Document = {
        id: res.data.id,
        name: res.data.name,
        fileType: res.data.fileType,
        sizeBytes: res.data.sizeBytes,
        createdAt: new Date().toISOString()
      };
      setDocList(prev => [newDoc, ...prev]);
      showToast(`Successfully added ${targetName} to vault!`, "success");
    } else {
      showToast("Upload failed.", "error");
    }
  };

  // --- RECS LOGIC ---
  // Compile opportunities not currently in tracker
  const trackerOppIds = applications.map(a => a.opportunityId);
  const recOpportunities = allOpportunities
    .filter(opp => !trackerOppIds.includes(opp.id))
    .slice(0, 3); // top 3 recommendations

  // --- CALENDAR LOGIC ---
  // Build a simple July 2026 Calendar
  const getDaysInMonth = () => {
    const days = [];
    // July 1, 2026 was a Wednesday (3 padding days)
    for (let i = 0; i < 3; i++) {
      days.push({ dayNum: null, dateStr: null });
    }
    for (let d = 1; d <= 31; d++) {
      const dateStr = `2026-07-${d < 10 ? "0" + d : d}`;
      days.push({ dayNum: d, dateStr });
    }
    return days;
  };

  const calendarDays = getDaysInMonth();
  
  // Map applications to July 2026 deadlines
  const getDeadlineOnDay = (dateStr: string | null) => {
    if (!dateStr) return null;
    return applications.find(app => {
      const dl = new Date(app.opportunity.deadline);
      const dlStr = `${dl.getFullYear()}-${(dl.getMonth() + 1) < 10 ? "0" + (dl.getMonth() + 1) : dl.getMonth() + 1}-${dl.getDate() < 10 ? "0" + dl.getDate() : dl.getDate()}`;
      return dlStr === dateStr;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Column: Profile Bio & Badges */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl glass-card border border-lightborder dark:border-darkborder">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-800">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-brand-500/20 mb-4"
              />
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider">
                {user.membership} Member
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                B.S. in Computer Science, Stanford University
              </p>
            </div>

            <div className="py-6 border-b border-slate-100 dark:border-slate-800 space-y-4 text-xs">
              <div>
                <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                  Bio / Focus
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Passionate about applying machine learning to climate modeling and sustainable engineering. Seeking fully funded PhD fellowships or Remote AI software roles.
                </p>
              </div>

              <div>
                <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                  Core Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Next.js", "Python", "PyTorch", "SQL", "TypeScript", "Git"].map(s => (
                    <span 
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="pt-6">
              <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-3">
                Achievement Badges ({badges.length})
              </span>
              <div className="flex flex-col gap-2.5 text-xs">
                {badges.map(b => (
                  <div 
                    key={b.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 shrink-0 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{b.name}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Tabs Container */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          
          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
            <button
              onClick={() => setActiveSubTab("tracker")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeSubTab === "tracker" 
                  ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Application Board
            </button>
            <button
              onClick={() => setActiveSubTab("calendar")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeSubTab === "calendar" 
                  ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Deadline Calendar
            </button>
            <button
              onClick={() => setActiveSubTab("vault")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeSubTab === "vault" 
                  ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Secure Vault
            </button>
            <button
              onClick={() => setActiveSubTab("recommendations")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeSubTab === "recommendations" 
                  ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              AI Recommendations
            </button>
          </div>

          {/* TAB CONTENT: KANBAN TRACKER */}
          {activeSubTab === "tracker" && (
            <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[480px]">
              {STAGES.map((stage) => {
                const stageApps = applications.filter((app) => app.status === stage.id);
                return (
                  <div 
                    key={stage.id} 
                    className="flex-grow shrink-0 w-64 p-4 rounded-xl border border-lightborder dark:border-darkborder bg-white/40 dark:bg-slate-900/10 min-h-[420px]"
                  >
                    {/* Header */}
                    <div className={`border-t-2 ${stage.color} pt-2 mb-4 flex items-center justify-between`}>
                      <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        {stage.label}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {stageApps.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3">
                      {stageApps.map((app) => (
                        <div 
                          key={app.id}
                          className="p-3.5 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow group/card text-xs text-left"
                        >
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2 inline-block">
                            {app.opportunity.fundingType.replace("_", " ")}
                          </span>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                            {app.opportunity.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
                            {app.opportunity.organizationName}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-brand-500" />
                              {app.opportunity.location}
                            </span>
                            <span className="flex items-center gap-0.5 font-medium">
                              <Clock className="w-3 h-3 text-amber-500" />
                              {new Date(app.opportunity.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>

                          {/* Quick stage movements */}
                          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1 text-[9px]">
                            <button
                              onClick={() => handleRemoveApplication(app.opportunityId, app.opportunity.title)}
                              className="text-rose-500 hover:underline font-semibold"
                            >
                              Unsave
                            </button>
                            <select
                              value={app.status}
                              onChange={(e) => handleMoveStatus(app.opportunityId, app.opportunity.title, e.target.value)}
                              className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[9px] text-slate-600 focus:outline-none"
                            >
                              <option value="SAVED">Saved</option>
                              <option value="APPLIED">Applied</option>
                              <option value="INTERVIEW">Interview</option>
                              <option value="OFFERED">Offered</option>
                              <option value="REJECTED">Archived</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      {stageApps.length === 0 && (
                        <div className="py-8 text-center text-[10px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          No items
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB CONTENT: CALENDAR */}
          {activeSubTab === "calendar" && (
            <div className="p-6 rounded-2xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 text-center">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  July 2026 Deadlines
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Candidate view calendar
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-[10px] font-bold text-slate-400 uppercase">
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, idx) => {
                  const deadlineApp = getDeadlineOnDay(day.dateStr);
                  return (
                    <div 
                      key={idx}
                      className={`relative min-h-[50px] rounded-lg p-1.5 border border-slate-100 dark:border-slate-800/80 flex flex-col items-start text-[10px] ${
                        day.dayNum ? "bg-slate-50/50 dark:bg-slate-950/20" : "bg-transparent border-none"
                      }`}
                    >
                      <span className="text-slate-400 font-bold">{day.dayNum}</span>
                      {deadlineApp && (
                        <div 
                          className="absolute bottom-1.5 left-1 right-1 py-0.5 px-1 rounded bg-rose-500/10 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 leading-none truncate cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => showToast(`Deadline: "${deadlineApp.opportunity.title}" on July ${day.dayNum}!`, "info")}
                        >
                          Closing
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-left p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                <span>
                  The red <strong>Closing</strong> dots overlay application tracker item deadlines. Add more saved programs in the Explore tab to overlay them on the calendar scheduler.
                </span>
              </div>
            </div>
          )}

          {/* TAB CONTENT: VAULT */}
          {activeSubTab === "vault" && (
            <div className="p-6 rounded-2xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                    Secure Documents Vault
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Store and parse transcripts, recommendations, and portfolios.
                  </p>
                </div>
                
                <button
                  onClick={handleSimulatedDocUpload}
                  className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-600 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-brand-500/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Simulate Upload
                </button>
              </div>

              <div className="space-y-3">
                {docList.map(doc => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{doc.name}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">
                          {doc.fileType} • {Math.round(doc.sizeBytes / 1024)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        VERIFIED BY AI
                      </span>
                      <button 
                        onClick={() => showToast(`Downloaded "${doc.name}" securely.`, "success")}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {docList.length === 0 && (
                  <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <UploadCloud className="w-8 h-8 mx-auto opacity-50 mb-2" />
                    <p className="text-xs">No documents uploaded. Click "Simulate Upload" to add transcripts or CVs.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: RECOMMENDATIONS */}
          {activeSubTab === "recommendations" && (
            <div className="p-6 rounded-2xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    AI Profile Matches
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Programs matching Stanford CS pedigree, climate ML research, and software expertise.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {recOpportunities.map(opp => (
                  <div 
                    key={opp.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-gradient-to-tr from-brand-600/5 to-transparent dark:from-brand-600/10 dark:to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                          95% Profile Match
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {opp.location}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">
                        {opp.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {opp.organizationName}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        handleMoveStatus(opp.id, opp.title, "SAVED");
                        // remove from rec list by updating active array
                        setApplications(prev => [...prev, {
                          id: Math.random().toString(),
                          opportunityId: opp.id,
                          status: "SAVED",
                          notes: "",
                          opportunity: opp
                        }]);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-[10px] flex items-center gap-1 shadow-md shadow-brand-500/10 shrink-0 self-end md:self-center"
                    >
                      Save to Dashboard
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {recOpportunities.length === 0 && (
                  <div className="py-12 text-center text-slate-400">
                    No recommendations found. All opportunities are already in your tracking board!
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
