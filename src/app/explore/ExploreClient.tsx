"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, SlidersHorizontal, MapPin, Calendar, Clock, 
  Sparkles, CheckCircle2, Bookmark, BookmarkCheck, Globe, 
  X, Compass, GraduationCap, Briefcase, Award, 
  ArrowRight, ShieldCheck, ChevronRight, BarChart2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";
import { toggleSaveOpportunity, getUserSavedOpportunityIds } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  requirements: string;
  organizationName: string;
  logoUrl: string | null;
  category: string;
  subCategory: string | null;
  fundingType: string;
  degreeLevel: string;
  location: string;
  isRemote: boolean;
  deadline: Date;
  applyUrl: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  views: number;
  applicationsCount: number;
}

interface ExploreClientProps {
  initialOpportunities: Opportunity[];
}

export default function ExploreClient({ initialOpportunities }: ExploreClientProps) {
  const { user } = useAuth();
  const { showToast } = useNotification();
  
  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [selectedFunding, setSelectedFunding] = useState("ALL");
  const [selectedDegree, setSelectedDegree] = useState("ALL");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [isAiSearch, setIsAiSearch] = useState(false);
  
  // Saved state
  const [savedIds, setSavedIds] = useState<string[]>([]);
  
  // Details Modal
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    running: boolean;
    result: string | null;
    score: number | null;
  }>({ running: false, result: null, score: null });

  // Load user saved IDs
  useEffect(() => {
    async function loadSaved() {
      if (user) {
        const res = await getUserSavedOpportunityIds(user.id);
        if (res.success) {
          setSavedIds(res.ids);
        }
      }
    }
    loadSaved();
  }, [user]);

  // Sync state on save toggle
  const handleSaveToggle = async (oppId: string, title: string) => {
    if (!user) {
      showToast("Please log in to save opportunities.", "error");
      return;
    }

    const res = await toggleSaveOpportunity(user.id, oppId);
    if (res.success) {
      if (res.action === "saved") {
        setSavedIds((prev) => [...prev, oppId]);
        showToast(`"${title}" saved to your dashboard!`, "success");
      } else {
        setSavedIds((prev) => prev.filter((id) => id !== oppId));
        showToast(`Removed "${title}" from saved list.`, "info");
      }
    } else {
      showToast("Failed to update saved list.", "error");
    }
  };

  // Helper: calculate eligibility score based on Alex Mercer's profile
  const getMatchScore = (opp: Opportunity) => {
    // Alex Mercer: CS, Stanford, ML focus, PyTorch, React, Remote or US/UK PhD
    const text = (opp.title + " " + opp.description + " " + opp.requirements).toLowerCase();
    
    let score = 70; // Baseline
    
    if (text.includes("computer science") || text.includes("software") || text.includes("programming") || text.includes("developer")) {
      score += 15;
    }
    if (text.includes("machine learning") || text.includes("ai ") || text.includes("deepmind") || text.includes("pytorch")) {
      score += 10;
    }
    if (opp.location.toLowerCase() === "united states" || opp.location.toLowerCase() === "global") {
      score += 5;
    }
    
    // Limits
    if (opp.category === "COURSE") score = 98; // Courses are open to all
    if (text.includes("biology") || text.includes("chemistry") || text.includes("art")) {
      score = 45; // lower match for non-CS sciences/arts
    }
    
    return Math.min(score, 99);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500 stroke-emerald-500";
    if (score >= 75) return "text-brand-500 stroke-brand-500";
    return "text-slate-400 stroke-slate-400";
  };

  // Run Simulated AI Analysis
  const runAiAnalysis = (opp: Opportunity) => {
    setAiAnalysis({ running: true, result: null, score: null });
    
    setTimeout(() => {
      const score = getMatchScore(opp);
      let feedback = "";
      
      if (score >= 90) {
        feedback = `Excellent Match! Your CS background from Stanford and experience with PyTorch and Next.js align perfectly with this role's specifications. Recommendation: Highlight your Google Cloud AI internship and the weather forecasting ML research in your application letter.`;
      } else if (score >= 75) {
        feedback = `Good Match. You possess 80% of the required technical skills. We recommend tweaking your CV to emphasize database query experience and drafting a custom Motivation Letter matching their leadership parameters.`;
      } else {
        feedback = `Moderate/Low Match. This opportunity covers fields outside your primary study domain (Computer Science). If you wish to apply, you will need to emphasize transferable project management and programming skills.`;
      }

      setAiAnalysis({
        running: false,
        result: feedback,
        score
      });
    }, 1800);
  };

  // Reset AI analysis on opportunity switch
  useEffect(() => {
    setAiAnalysis({ running: false, result: null, score: null });
  }, [selectedOpp]);

  // AI Natural Language Search Parser Simulation
  const handleAiSearch = () => {
    if (!searchQuery.trim()) {
      showToast("Enter a query to run AI Search", "info");
      return;
    }
    
    setIsAiSearch(true);
    showToast("AI analyzing search intent...", "info");
    
    // Parse keywords to toggle select filters
    const query = searchQuery.toLowerCase();
    
    if (query.includes("scholarship")) setSelectedCategory("SCHOLARSHIP");
    else if (query.includes("job")) setSelectedCategory("JOB");
    else if (query.includes("fellowship")) setSelectedCategory("FELLOWSHIP");
    else if (query.includes("intern")) setSelectedCategory("INTERNSHIP");
    else if (query.includes("grant")) setSelectedCategory("GRANT");
    
    if (query.includes("uk") || query.includes("cambridge") || query.includes("england")) setSelectedCountry("United Kingdom");
    else if (query.includes("usa") || query.includes("us ") || query.includes("stanford") || query.includes("america")) setSelectedCountry("United States");
    else if (query.includes("japan") || query.includes("tokyo")) setSelectedCountry("Japan");
    else if (query.includes("europe")) setSelectedCountry("Europe");
    
    if (query.includes("remote")) setRemoteOnly(true);
    if (query.includes("funded") || query.includes("free")) setSelectedFunding("FULLY_FUNDED");
    
    setTimeout(() => {
      showToast("Filters successfully optimized by AI!", "success");
      setIsAiSearch(false);
    }, 800);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedCountry("ALL");
    setSelectedFunding("ALL");
    setSelectedDegree("ALL");
    setRemoteOnly(false);
    setSearchQuery("");
  };

  // Filter Logic
  const filteredOpps = initialOpportunities.filter((opp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      opp.title.toLowerCase().includes(query) ||
      opp.description.toLowerCase().includes(query) ||
      opp.organizationName.toLowerCase().includes(query) ||
      (opp.requirements && opp.requirements.toLowerCase().includes(query));
      
    const matchesCategory = selectedCategory === "ALL" || opp.category === selectedCategory;
    const matchesCountry = selectedCountry === "ALL" || opp.location === selectedCountry || (selectedCountry === "Global" && opp.location === "Global");
    const matchesFunding = selectedFunding === "ALL" || opp.fundingType === selectedFunding;
    const matchesDegree = selectedDegree === "ALL" || opp.degreeLevel === selectedDegree;
    const matchesRemote = !remoteOnly || opp.isRemote === true;

    return matchesSearch && matchesCategory && matchesCountry && matchesFunding && matchesDegree && matchesRemote;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Search Header Panel */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3">
          <span>🇳🇵</span> Nepal Opportunity Registry
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Nepal Career & Scholarship Directory
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Daily verified listings for Lok Sewa (लोक सेवा), INGO/NGO programs, Tech & Banking roles, and international scholarships for Nepali students.
        </p>

        {/* Premium Search Bar */}
        <div className="relative flex flex-col md:flex-row gap-3 max-w-4xl">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, e.g. 'Lok Sewa Officer', 'USAID Nepal', 'Full-stack Kathmandu', 'Fulbright'..."
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-red-500 text-sm focus:ring-1 focus:ring-red-500/20"
              onKeyDown={(e) => { if (e.key === "Enter") handleAiSearch(); }}
            />
          </div>
          <button
            onClick={handleAiSearch}
            disabled={isAiSearch}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-brand-600 text-white font-semibold text-sm hover:from-red-700 hover:to-brand-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-red-500/10 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isAiSearch ? "animate-spin" : "animate-pulse"}`} />
            {isAiSearch ? "Analyzing Intent..." : "AI Nepal Matcher"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Panel */}
        <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
          <div className="p-5 rounded-2xl glass-card border border-lightborder dark:border-darkborder text-left">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-red-500" />
                Nepal Filters
              </span>
              <button 
                onClick={resetFilters}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Category selection */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Opportunity Sector
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="ALL">All Sectors & Categories</option>
                <option value="JOB">💼 Jobs (Lok Sewa, INGO, Tech, Banking)</option>
                <option value="SCHOLARSHIP">🎓 Scholarships for Nepali Youth</option>
                <option value="INTERNSHIP">🚀 Internships & Fellowships</option>
                <option value="FELLOWSHIP">🌍 Research Fellowships</option>
                <option value="COMPETITION">🏆 Tech & Innovation Contests</option>
                <option value="GRANT">💰 Development & Research Grants</option>
              </select>
            </div>

            {/* Country / Nepal Location Selection */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Nepal Region / Location
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="ALL">All Locations (Nepal & Abroad)</option>
                <option value="Kathmandu Valley">🇳🇵 Kathmandu Valley</option>
                <option value="Kathmandu (Baluwatar)">🇳🇵 Kathmandu (Baluwatar)</option>
                <option value="Kathmandu (Hattisar) / Hybrid">🇳🇵 Kathmandu (Hattisar)</option>
                <option value="Lalitpur (Sanepa)">🇳🇵 Lalitpur (Sanepa)</option>
                <option value="Pokhara (Gandaki Province)">🇳🇵 Pokhara (Gandaki Province)</option>
                <option value="Chitwan / Bagmati Province">🇳🇵 Chitwan / Bagmati</option>
                <option value="Surkhet & Kathmandu">🇳🇵 Karnali & Surkhet</option>
                <option value="United States (For Nepali Citizens)">🎓 USA (For Nepali Citizens)</option>
                <option value="United Kingdom (For Nepali Citizens)">🎓 UK (For Nepali Citizens)</option>
                <option value="Australia (For Nepali Citizens)">🎓 Australia (For Nepali Citizens)</option>
              </select>
            </div>

            {/* Funding Type selection */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Funding Structure
              </label>
              <select
                value={selectedFunding}
                onChange={(e) => setSelectedFunding(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="ALL">All Funding</option>
                <option value="FULLY_FUNDED">Fully Funded</option>
                <option value="PARTIAL">Partial Scholarship</option>
                <option value="PAID">Paid Role / Salary</option>
                <option value="FREE">Free Program</option>
              </select>
            </div>

            {/* Degree Level selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Minimum Degree Track
              </label>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="ALL">Any Level</option>
                <option value="UNDERGRADUATE">Undergraduate / Bachelor</option>
                <option value="MASTERS">Master's</option>
                <option value="PHD">PhD / Research Doctorate</option>
                <option value="POSTDOC">Postdoctoral</option>
                <option value="NONE">No Degree Requirement</option>
              </select>
            </div>

            {/* Remote Toggles */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Remote Only
              </span>
              <button
                onClick={() => setRemoteOnly(!remoteOnly)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  remoteOnly ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    remoteOnly ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Opportunity Grid */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 text-left">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Showing {filteredOpps.length} opportunities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpps.map((opp) => {
              const score = getMatchScore(opp);
              const isSaved = savedIds.includes(opp.id);
              
              return (
                <div
                  key={opp.id}
                  className={`group flex flex-col justify-between p-5 rounded-xl glass-card border transition-all duration-300 cursor-pointer ${
                    selectedOpp?.id === opp.id 
                      ? "ring-2 ring-brand-500 border-brand-500/50" 
                      : "border-lightborder dark:border-darkborder hover:border-slate-300 dark:hover:border-slate-800 hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedOpp(opp)}
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 leading-none">
                        {opp.category}
                      </span>
                      
                      {/* Save Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToggle(opp.id, opp.title);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4.5 h-4.5 text-brand-500 fill-brand-500" />
                        ) : (
                          <Bookmark className="w-4.5 h-4.5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors mb-1">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-3">
                      {opp.organizationName}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-500/80" />
                        {opp.isRemote ? "Remote" : opp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500/80" />
                        {new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Footer Stats & AI Eligibility Ring */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                      {opp.fundingType.replace("_", " ")}
                    </span>
                    
                    {/* Ring score */}
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 py-1 px-2.5 rounded-xl border border-slate-150 dark:border-slate-800">
                      <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="10" cy="10" r="8" strokeWidth="2" stroke="rgba(139, 92, 246, 0.1)" fill="transparent" />
                          <circle 
                            cx="10" 
                            cy="10" 
                            r="8" 
                            strokeWidth="2" 
                            stroke="currentColor" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 8}
                            strokeDashoffset={2 * Math.PI * 8 * (1 - score / 100)}
                            className={getScoreColor(score)}
                          />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {score}% Match
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredOpps.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-950/10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Compass className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3 animate-spin-slow" />
                <p className="text-sm font-semibold">No opportunities match your current filters.</p>
                <button 
                  onClick={resetFilters} 
                  className="mt-2 text-xs text-brand-600 dark:text-brand-400 hover:underline font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Side Drawer Modal Overlay */}
      <AnimatePresence>
        {selectedOpp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOpp(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 overflow-y-auto p-6 text-left flex flex-col justify-between"
            >
              <div>
                {/* Header Close */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Opportunity Specs
                  </span>
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Titles */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2 inline-block">
                  {selectedOpp.category}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug mb-1">
                  {selectedOpp.title}
                </h2>
                <p className="text-sm font-semibold text-brand-600 dark:text-brand-455 mb-6">
                  {selectedOpp.organizationName}
                </p>

                {/* Quick specs grid */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-150 dark:border-slate-800 mb-6 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Location</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      {selectedOpp.isRemote ? "Remote / Online" : selectedOpp.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Deadline</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {new Date(selectedOpp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Funding Type</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                      {selectedOpp.fundingType.replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Degree Requirement</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                      {selectedOpp.degreeLevel.toLowerCase()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2">Program Description</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {selectedOpp.description}
                  </p>
                </div>

                {/* Requirements */}
                <div className="mb-8">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2">Eligibility & Requirements</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {selectedOpp.requirements}
                  </p>
                </div>

                {/* AI Review Checker Dashboard */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-tr from-brand-600/5 to-indigo-600/5 dark:from-brand-600/10 dark:to-indigo-600/10 border border-brand-500/20 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
                        AI Profile Fit Scan
                      </span>
                      <span className="text-[10px] bg-brand-500 text-white px-2 py-0.5 rounded font-bold uppercase leading-none">
                        Premium Matcher
                      </span>
                    </div>
                    
                    {!aiAnalysis.result && !aiAnalysis.running && (
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                          Scan your uploaded CV ({user.membership === "PREMIUM" ? "Alex_Mercer_CV.pdf" : "Guest Profile"}) against this program's requirements.
                        </p>
                        <button
                          onClick={() => runAiAnalysis(selectedOpp)}
                          className="text-xs font-semibold px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/10 transition-colors"
                        >
                          Run AI Alignment Check
                        </button>
                      </div>
                    )}

                    {aiAnalysis.running && (
                      <div className="flex flex-col items-center py-4 gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Parsing CV layout & running similarity match...
                        </span>
                      </div>
                    )}

                    {aiAnalysis.result && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-bold">Fit Score:</span>
                          <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                            {aiAnalysis.score}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {aiAnalysis.result}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-4 flex gap-3">
                <button
                  onClick={() => handleSaveToggle(selectedOpp.id, selectedOpp.title)}
                  className="flex-grow py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  {savedIds.includes(selectedOpp.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-brand-500 fill-brand-500" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      Save Draft
                    </>
                  )}
                </button>
                <a
                  href={selectedOpp.applyUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-all shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2 text-center"
                >
                  Apply Directly
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
