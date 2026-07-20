"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sun, Moon, Compass, Cpu, Users, ChevronDown, 
  Menu, X, Sparkles, LayoutDashboard, ShieldCheck, 
  Building2, GraduationCap, Briefcase
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useNotification } from "@/lib/notification-context";

export default function Navbar() {
  const pathname = usePathname() || "";
  const { user, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useNotification();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "AI Hub", href: "/ai", icon: Cpu },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Community", href: "/community", icon: Users },
  ];

  const handleRoleSwitch = (role: "CANDIDATE" | "EMPLOYER" | "ADMIN") => {
    switchRole(role);
    setRoleDropdownOpen(false);
    showToast(`Switched workspace role to ${role}!`, "info");
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "ADMIN": return <ShieldCheck className="w-4 h-4 text-rose-500" />;
      case "EMPLOYER": return <Building2 className="w-4 h-4 text-emerald-500" />;
      default: return <GraduationCap className="w-4 h-4 text-brand-500" />;
    }
  };

  const activeClass = (href: string) => {
    const isExact = pathname === href || pathname.startsWith(href + "/");
    return isExact
      ? "text-brand-600 dark:text-brand-400 font-semibold bg-brand-50/50 dark:bg-brand-950/20"
      : "text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/40";
  };

  return (
    <nav className="sticky top-0 z-40 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-350 bg-white shadow-sm border border-slate-100 dark:border-slate-800">
                <img
                  src="/logo.png"
                  alt="The Opportunity Registry Logo"
                  className="w-full h-full object-cover scale-[1.3] translate-y-[-1px]"
                />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 dark:from-white dark:via-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
                The Opportunity Registry
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all duration-200 ${activeClass(item.href)}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Role Switcher / Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-brand-500/20"
                />
                <div className="text-left leading-none">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[80px] truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    {getRoleIcon(user.role)}
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-40 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                        View Workspace As:
                      </p>
                    </div>
                    <button
                      onClick={() => handleRoleSwitch("CANDIDATE")}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        user.role === "CANDIDATE" 
                          ? "bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 font-medium" 
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-brand-500" />
                      Candidate Workspace
                      {user.membership === "PREMIUM" && user.role === "CANDIDATE" && (
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white leading-none">
                          PRO
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch("EMPLOYER")}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        user.role === "EMPLOYER" 
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-medium" 
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-emerald-500" />
                      Employer Portal
                    </button>
                    <button
                      onClick={() => handleRoleSwitch("ADMIN")}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        user.role === "ADMIN" 
                          ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-medium" 
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-500" />
                      Admin Control
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base ${activeClass(item.href)}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          
          <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
            <p className="text-[10px] uppercase font-semibold text-slate-400 px-3 pb-1">
              Switch Workspace Role
            </p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { handleRoleSwitch("CANDIDATE"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm rounded-lg ${
                  user.role === "CANDIDATE" ? "bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-semibold" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <GraduationCap className="w-5 h-5 text-brand-500" />
                Candidate Workspace
              </button>
              <button
                onClick={() => { handleRoleSwitch("EMPLOYER"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm rounded-lg ${
                  user.role === "EMPLOYER" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-500" />
                Employer Portal
              </button>
              <button
                onClick={() => { handleRoleSwitch("ADMIN"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm rounded-lg ${
                  user.role === "ADMIN" ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-rose-500" />
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Custom spinning Globe Icon
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
