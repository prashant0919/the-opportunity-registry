"use client";

import React, { useState } from "react";
import { 
  Building2, PlusCircle, BarChart2, Users, FileText, CheckCircle, 
  MapPin, Calendar, Clock, Sparkles, Send, Trash2, ArrowUpRight,
  Building, Plus, BarChart3, Users2, FileCheck2, Trash, 
  Check, Eye, MousePointer, Award, Globe, HelpCircle 
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";
import { createOpportunity, toggleFeaturedOpportunity, deleteOpportunity } from "@/app/actions";

interface Opportunity {
  id: string;
  title: string;
  organizationName: string;
  location: string;
  category: string;
  fundingType: string;
  isApproved: boolean;
  isFeatured: boolean;
  views: number;
  applicationsCount: number;
  deadline: string;
}

interface Applicant {
  id: string;
  userName: string;
  userEmail: string;
  userTitle: string;
  oppTitle: string;
  score: number;
  status: string;
  resumeText: string;
}

interface EmployerClientProps {
  opportunities: Opportunity[];
  applicants: Applicant[];
}

export default function EmployerClient({ opportunities, applicants }: EmployerClientProps) {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<"post" | "listings" | "applicants">("listings");
  
  // Dynamic list of listings
  const [oppList, setOppList] = useState<Opportunity[]>(opportunities);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    organizationName: user.name, // autofill
    location: "Global",
    isRemote: true,
    category: "SCHOLARSHIP",
    subCategory: "Fully Funded",
    fundingType: "FULLY_FUNDED",
    degreeLevel: "NONE",
    deadline: "2026-10-31",
    applyUrl: "https://global-innovations.org/apply",
    description: "",
    requirements: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resume Review Modal
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // --- ACTIONS ---
  const handleCreateOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showToast("Please fill in required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    
    // Automatically pre-approve if poster is admin role for testing, otherwise pending
    const autoApprove = user.role === "ADMIN";
    
    const res = await createOpportunity({
      ...formData,
      isApproved: autoApprove
    });

    if (res.success && res.data) {
      const newOpp: Opportunity = {
        id: res.data.id,
        title: res.data.title,
        organizationName: res.data.organizationName,
        location: res.data.location,
        category: res.data.category,
        fundingType: res.data.fundingType,
        isApproved: res.data.isApproved,
        isFeatured: res.data.isFeatured,
        views: 0,
        applicationsCount: 0,
        deadline: res.data.deadline.toISOString()
      };
      
      setOppList(prev => [newOpp, ...prev]);
      
      // Reset form
      setFormData({
        title: "",
        organizationName: user.name,
        location: "Global",
        isRemote: true,
        category: "SCHOLARSHIP",
        subCategory: "Fully Funded",
        fundingType: "FULLY_FUNDED",
        degreeLevel: "NONE",
        deadline: "2026-10-31",
        applyUrl: "https://global-innovations.org/apply",
        description: "",
        requirements: ""
      });
      
      showToast(
        autoApprove 
          ? "Opportunity posted and auto-approved!" 
          : "Opportunity submitted! Pending Admin verification.", 
        "success"
      );
      
      setActiveTab("listings");
    } else {
      showToast("Failed to post opportunity.", "error");
    }
    setIsSubmitting(false);
  };

  const handleToggleFeatured = async (id: string, currentVal: boolean) => {
    const res = await toggleFeaturedOpportunity(id, !currentVal);
    if (res.success) {
      setOppList(prev => prev.map(o => o.id === id ? { ...o, isFeatured: !currentVal } : o));
      showToast(
        !currentVal 
          ? "Listing is now FEATURED on the Homepage!" 
          : "Removed from featured carousel.", 
        "success"
      );
    }
  };

  const handleDeleteListing = async (id: string, title: string) => {
    const res = await deleteOpportunity(id);
    if (res.success) {
      setOppList(prev => prev.filter(o => o.id !== id));
      showToast(`Deleted listing: "${title}"`, "info");
    }
  };

  // Analytics helper counts
  const totalViews = oppList.reduce((acc, curr) => acc + curr.views, 0);
  const totalApplications = oppList.reduce((acc, curr) => acc + curr.applicationsCount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
          <Building className="w-3.5 h-3.5" />
          Partner Organization Console
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Employer & Publisher Portal
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Publish global educational programs, verify listings, toggle featured status, and view applicant statistics.
        </p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
        <div className="p-5 rounded-2xl glass-card border border-lightborder dark:border-darkborder flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Listing Views</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalViews}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-lightborder dark:border-darkborder flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Indexed Applications</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalApplications || applicants.length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Users2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-lightborder dark:border-darkborder flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Sponsored Status</span>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              VERIFIED ORGANIZATION
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Navigation Tabs (Left 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "listings" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Active Listings
          </button>
          <button
            onClick={() => setActiveTab("post")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "post" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <Plus className="w-4 h-4" />
            Publish Program
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "applicants" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <Users2 className="w-4 h-4" />
            Candidate Applications
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">
              {applicants.length}
            </span>
          </button>
        </div>

        {/* Content Workspace (Right 9 cols) */}
        <div className="lg:col-span-9 p-6 rounded-2xl glass-card border border-lightborder dark:border-darkborder min-h-[500px]">
          
          {/* TAB 1: LISTINGS */}
          {activeTab === "listings" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  Published Listings ({oppList.length})
                </span>
              </div>

              <div className="space-y-3">
                {oppList.map(opp => (
                  <div 
                    key={opp.id}
                    className="p-4 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-405 uppercase tracking-wider">
                          {opp.category}
                        </span>
                        {!opp.isApproved && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            PENDING APPROVAL
                          </span>
                        )}
                        {opp.isApproved && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            LIVE
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {opp.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {opp.location} • Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex items-center gap-4 text-[10px] text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3.5 h-3.5" />
                          {opp.views} views
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MousePointer className="w-3.5 h-3.5" />
                          {opp.applicationsCount} clicks
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFeatured(opp.id, opp.isFeatured)}
                          disabled={!opp.isApproved}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-colors border ${
                            opp.isFeatured 
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/30" 
                              : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                          title={!opp.isApproved ? "Only approved listings can be featured" : ""}
                        >
                          {opp.isFeatured ? "Featured" : "Feature"}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteListing(opp.id, opp.title)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-500/5 transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {oppList.length === 0 && (
                  <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No active listings. Click "Publish Program" to post one!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: POST FORM */}
          {activeTab === "post" && (
            <form onSubmit={handleCreateOpp} className="space-y-4 text-xs text-left">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  Publish a Global Opportunity
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Master's in Artificial Intelligence at Stanford"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="SCHOLARSHIP">SCHOLARSHIP</option>
                    <option value="JOB">JOB</option>
                    <option value="INTERNSHIP">INTERNSHIP</option>
                    <option value="FELLOWSHIP">FELLOWSHIP</option>
                    <option value="COMPETITION">COMPETITION</option>
                    <option value="GRANT">GRANT</option>
                    <option value="EXCHANGE">EXCHANGE PROGRAM</option>
                    <option value="CONFERENCE">CONFERENCE</option>
                    <option value="COURSE">COURSE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Funding Type *
                  </label>
                  <select
                    value={formData.fundingType}
                    onChange={(e) => setFormData(prev => ({ ...prev, fundingType: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="FULLY_FUNDED">Fully Funded</option>
                    <option value="PARTIAL">Partial Scholarship</option>
                    <option value="PAID">Paid / Salary</option>
                    <option value="UNPAID">Unpaid / Volunteer</option>
                    <option value="FREE">Free Program</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Minimum Degree Level *
                  </label>
                  <select
                    value={formData.degreeLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, degreeLevel: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="NONE">Any / No Degree Required</option>
                    <option value="UNDERGRADUATE">Undergraduate / Bachelors</option>
                    <option value="MASTERS">Master's Degree</option>
                    <option value="PHD">PhD / Doctorate</option>
                    <option value="POSTDOC">Postdoctoral Fellowship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Location (Country/Global) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-855 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6 pl-2">
                  <input
                    type="checkbox"
                    id="isRemote"
                    checked={formData.isRemote}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRemote: e.target.checked }))}
                    className="w-4.5 h-4.5 accent-brand-600 rounded"
                  />
                  <label htmlFor="isRemote" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Remote / Online Accessible
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Description & Program Details *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter detailed description of what the opportunity covers, stipend details, etc..."
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Eligibility & Requirements *
                  </label>
                  <textarea
                    required
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Enter required skills, academic level, nationality requirements, language constraints..."
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 min-h-[120px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  "Submitting for Admin Verification..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Listing
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: CANDIDATE APPLICATIONS */}
          {activeTab === "applicants" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  Applicants Registry ({applicants.length})
                </span>
              </div>

              <div className="space-y-3">
                {applicants.map(app => (
                  <div 
                    key={app.id}
                    className="p-4 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-left"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                          {app.userName}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {app.score}% Profile Fit
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                        Applied to: <strong className="text-slate-700 dark:text-slate-300">{app.oppTitle}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedApplicant(app)}
                      className="px-3.5 py-2 rounded-lg bg-brand-500/5 hover:bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 font-bold transition-all flex items-center gap-1 text-[10px] shrink-0 self-end md:self-center"
                    >
                      Review Resume
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {applicants.length === 0 && (
                  <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No applications received yet.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Review Resume Modal Popup */}
      {selectedApplicant && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedApplicant(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-y-auto p-6 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    Candidate Profile Review
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Submissions matches for: {selectedApplicant.oppTitle}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedApplicant(null)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <Check className="w-5 h-5 text-brand-500" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Candidate Details</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedApplicant.userName}</p>
                  <p className="text-slate-400">{selectedApplicant.userEmail}</p>
                </div>

                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-2 pl-1">Extracted Resume Text</p>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 font-mono text-[10px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                    {selectedApplicant.resumeText}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 flex gap-2">
              <button
                onClick={() => {
                  showToast(`Accepted application from ${selectedApplicant.userName}! Notification sent.`, "success");
                  setSelectedApplicant(null);
                }}
                className="flex-grow py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors text-center"
              >
                Accept Candidate
              </button>
              <button
                onClick={() => {
                  showToast(`Candidate application archived.`, "info");
                  setSelectedApplicant(null);
                }}
                className="flex-grow py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors text-center"
              >
                Archive Profile
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
