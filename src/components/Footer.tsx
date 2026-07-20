"use client";

import React from "react";
import Link from "next/link";
import { Globe, Heart, Sparkles, Send } from "lucide-react";
import { useNotification } from "@/lib/notification-context";

export default function Footer() {
  const { showToast } = useNotification();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Subscribed! You will receive early opportunity alerts.", "success");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg text-slate-600 dark:text-slate-400 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Vision */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shrink-0">
                <img
                  src="/logo.png"
                  alt="The Opportunity Registry Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-sm bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 dark:from-white dark:via-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
                The Opportunity Registry
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The world's premium AI-powered global opportunity ecosystem helping students, graduates, and professionals discover life-changing scholarships, fellowships, and careers.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Popular Tracks
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore?cat=scholarship" className="hover:text-brand-500 transition-colors">
                  🎓 Global Scholarships
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=job" className="hover:text-brand-500 transition-colors">
                  💼 Tech & Remote Jobs
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=fellowship" className="hover:text-brand-500 transition-colors">
                  🌍 Elite Fellowships
                </Link>
              </li>
              <li>
                <Link href="/explore?cat=competition" className="hover:text-brand-500 transition-colors">
                  🏆 Startup Hackathons
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Ecosystem
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ai" className="hover:text-brand-500 transition-colors">
                  ✨ AI Resume Optimizer
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-brand-500 transition-colors">
                  💬 Success Stories
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-brand-500 transition-colors">
                  🔍 Smart Filters
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-500 transition-colors">
                  📅 Deadline Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Premium Subscription */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Early Alert Registry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Get notified of fully funded fellowships & scholarships 48 hours before general publication.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="email@domain.com"
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-brand-500/20 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-500 dark:text-slate-500 flex items-center gap-1">
            © {new Date().getFullYear()} The Opportunity Registry. Engineered with 
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> globally.
          </p>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Sparkles className="w-3 h-3 text-brand-500" />
              AI MATCH ACTIVE
            </span>
            <Link href="#" className="hover:text-brand-500">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-brand-500">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
