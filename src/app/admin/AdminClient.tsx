"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, CheckSquare, Building, Users, AlertCircle, 
  MapPin, Calendar, Clock, Trash, Check, X, Sparkles, 
  BarChart, Layers, Trash2, Mail
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-context";
import { approveOpportunity, deleteOpportunity } from "@/app/actions";

interface Opportunity {
  id: string;
  title: string;
  organizationName: string;
  location: string;
  category: string;
  fundingType: string;
  isApproved: boolean;
  deadline: string;
}

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  membership: string;
  createdAt: string;
}

interface AdminClientProps {
  opportunities: Opportunity[];
  users: UserRecord[];
}

export default function AdminClient({ opportunities, users }: AdminClientProps) {
  const { user } = useAuth();
  const { showToast } = useNotification();
  
  const [activeTab, setActiveTab] = useState<"pending" | "orgs" | "users">("pending");
  
  // Dynamic lists updated via server actions
  const [oppList, setOppList] = useState<Opportunity[]>(opportunities);
  const [userList, setUserList] = useState<UserRecord[]>(users);

  // Simulated partner orgs
  const [orgs, setOrgs] = useState([
    { id: "o1", name: "Stanford University", type: "University", verified: true, count: 2 },
    { id: "o2", name: "Google DeepMind", type: "Corporation", verified: true, count: 1 },
    { id: "o3", name: "Global Innovation Org", type: "NGO / Non-Profit", verified: false, count: 1 },
    { id: "o4", name: "CERN Physics Lab", type: "Government Research", verified: true, count: 1 }
  ]);

  // --- ACTIONS ---
  const handleApprove = async (id: string, title: string) => {
    const res = await approveOpportunity(id);
    if (res.success) {
      setOppList(prev => prev.map(o => o.id === id ? { ...o, isApproved: true } : o));
      showToast(`Approved opportunity: "${title}"`, "success");
    } else {
      showToast("Failed to approve listing", "error");
    }
  };

  const handleReject = async (id: string, title: string) => {
    const res = await deleteOpportunity(id);
    if (res.success) {
      setOppList(prev => prev.filter(o => o.id !== id));
      showToast(`Rejected and deleted: "${title}"`, "info");
    } else {
      showToast("Failed to reject listing", "error");
    }
  };

  const handleToggleVerifyOrg = (orgId: string, name: string, currentVal: boolean) => {
    setOrgs(prev => prev.map(o => o.id === orgId ? { ...o, verified: !currentVal } : o));
    showToast(
      !currentVal 
        ? `Organization "${name}" is now VERIFIED!` 
        : `Removed verification for "${name}".`, 
      "info"
    );
  };

  // Helper subsets
  const pendingOpps = oppList.filter(o => !o.isApproved);
  const totalApproved = oppList.filter(o => o.isApproved).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/20 mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          System Administration Hub
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Administrator Command Panel
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Moderate listings queue, check partner registrations, audit platform accounts, and view telemetry metrics.
        </p>
      </div>

      {/* Admin Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-left">
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Pending Approvals</span>
            <span className="text-xl font-black text-rose-500 mt-1 block">
              {pendingOpps.length}
            </span>
          </div>
          <div className="p-2 rounded bg-rose-500/10 text-rose-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Live Listings</span>
            <span className="text-xl font-black text-emerald-500 mt-1 block">
              {totalApproved}
            </span>
          </div>
          <div className="p-2 rounded bg-emerald-500/10 text-emerald-500">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Organizations</span>
            <span className="text-xl font-black text-blue-500 mt-1 block">
              {orgs.length}
            </span>
          </div>
          <div className="p-2 rounded bg-blue-500/10 text-blue-500">
            <Building className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Platform Users</span>
            <span className="text-xl font-black text-purple-500 mt-1 block">
              {userList.length}
            </span>
          </div>
          <div className="p-2 rounded bg-purple-500/10 text-purple-500">
            <Users className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Navigation Tabs (Left 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "pending" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Approvals Queue
            {pendingOpps.length > 0 && (
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white animate-pulse">
                {pendingOpps.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("orgs")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "orgs" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <Building className="w-4 h-4" />
            Partner Organizations
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "users" 
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/10" 
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <Users className="w-4 h-4" />
            User Database
          </button>
        </div>

        {/* Content Workspace (Right 9 cols) */}
        <div className="lg:col-span-9 p-6 rounded-2xl glass-card border border-lightborder dark:border-darkborder min-h-[500px]">
          
          {/* TAB 1: PENDING APPROVALS */}
          {activeTab === "pending" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  Opportunity Moderation Queue ({pendingOpps.length})
                </span>
              </div>

              <div className="space-y-3">
                {pendingOpps.map(opp => (
                  <div 
                    key={opp.id}
                    className="p-4 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                          {opp.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {opp.organizationName}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {opp.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Location: {opp.location} • Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Moderation Controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleApprove(opp.id, opp.title)}
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(opp.id, opp.title)}
                        className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-500/5 font-bold text-[10px] flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {pendingOpps.length === 0 && (
                  <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <CheckSquare className="w-8 h-8 mx-auto opacity-50 mb-2 text-slate-300" />
                    <p className="text-xs">No pending items. All postings are moderate and live!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PARTNER ORGS */}
          {activeTab === "orgs" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  Registered Partner Organizations ({orgs.length})
                </span>
              </div>

              <div className="space-y-3">
                {orgs.map(org => (
                  <div 
                    key={org.id}
                    className="p-4 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-left"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        {org.name}
                        {org.verified && (
                          <span className="text-[8px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded leading-none">
                            VERIFIED
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Type: {org.type} • Active listings: {org.count}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleVerifyOrg(org.id, org.name, org.verified)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] border transition-colors ${
                        org.verified 
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-800" 
                          : "bg-emerald-600 text-white border-emerald-600"
                      }`}
                    >
                      {org.verified ? "Revoke Verification" : "Verify Org"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PLATFORM USERS */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  Audited Platform Users ({userList.length})
                </span>
              </div>

              <div className="space-y-3">
                {userList.map(u => (
                  <div 
                    key={u.id}
                    className="p-4 rounded-xl border border-lightborder dark:border-darkborder bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-left"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">
                        {u.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold leading-none">
                        <Mail className="w-3 h-3 text-brand-500" />
                        {u.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-505 uppercase">
                        {u.role}
                      </span>
                      {u.membership === "PREMIUM" && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
