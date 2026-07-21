import React from "react";
import Link from "next/link";
import { 
  GraduationCap, Briefcase, Terminal, Award, Coins, 
  MapPin, Calendar, Clock, ChevronRight, Sparkles, 
  Plane, Video, BookOpen, ShieldCheck, Heart
} from "lucide-react";
import { prisma } from "@/lib/db";
import WorldMap from "@/components/WorldMap";

// Disable caching for this route so seed updates show up immediately
export const revalidate = 0;

const CATEGORIES = [
  { name: "Scholarships", cat: "SCHOLARSHIP", icon: GraduationCap, color: "text-violet-500 bg-violet-500/10", count: "850+" },
  { name: "Jobs", cat: "JOB", icon: Briefcase, color: "text-emerald-500 bg-emerald-500/10", count: "1,200+" },
  { name: "Internships", cat: "INTERNSHIP", icon: Terminal, color: "text-amber-500 bg-amber-500/10", count: "640+" },
  { name: "Fellowships", cat: "FELLOWSHIP", icon: ShieldCheck, color: "text-blue-500 bg-blue-500/10", count: "310+" },
  { name: "Competitions", cat: "COMPETITION", icon: Award, color: "text-rose-500 bg-rose-500/10", count: "180+" },
  { name: "Grants", cat: "GRANT", icon: Coins, color: "text-cyan-500 bg-cyan-500/10", count: "450+" },
  { name: "Exchanges", cat: "EXCHANGE", icon: Plane, color: "text-pink-500 bg-pink-500/10", count: "120+" },
  { name: "Conferences", cat: "CONFERENCE", icon: Video, color: "text-teal-500 bg-teal-500/10", count: "290+" },
  { name: "Courses", cat: "COURSE", icon: BookOpen, color: "text-orange-500 bg-orange-500/10", count: "950+" },
];

export default async function HomePage() {
  // Fetch featured opportunities from SQLite database via Prisma
  let featuredOpps: any[] = [];
  try {
    featuredOpps = await prisma.opportunity.findMany({
      where: {
        isFeatured: true,
        isApproved: true,
      },
      take: 3,
      orderBy: {
        views: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch opportunities from DB:", error);
  }

  return (
    <div className="relative min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 flex flex-col items-center justify-center min-h-[85vh] text-center px-4 overflow-hidden border-b border-slate-200/50 dark:border-slate-800/50">
        <WorldMap />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-6 backdrop-blur-md animate-float">
            <span className="text-base">🇳🇵</span>
            Nepal's Daily Opportunity Hub: Lok Sewa, INGOs, Tech & Scholarships
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Nepal's Premier <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-red-600 via-brand-600 to-indigo-600 dark:from-red-400 dark:via-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Opportunity & Job Registry
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Everyday updates on Lok Sewa Commission vacancies, INGO/NGO projects, Tech & Banking careers, and fully funded international scholarships for Nepali youth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transform hover:-translate-y-0.5 transition-all text-center"
            >
              Explore Nepal Listings
            </Link>
            <Link
              href="/explore?tab=ai"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
              Try AI Nepal Matcher
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="relative z-10 py-10 bg-white/40 dark:bg-slate-950/20 border-b border-slate-200/50 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl font-extrabold text-red-600 dark:text-red-400">4,500+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Nepal Job & Scholarship Listings</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">7 Provinces</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Kathmandu, Pokhara, Chitwan & All Nepal</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">100% Verified</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Lok Sewa & INGO Direct Sourcing</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">Daily Updates</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Real-Time Sector Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Browse Core Categories
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Discover catalogued programs matching your educational background, professional skills, or leadership goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.cat}
                href={`/explore?category=${category.cat}`}
                className="group relative p-6 rounded-2xl glass-card hover:border-brand-500/40 hover:-translate-y-1 transition-all duration-350 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-xl shrink-0 ${category.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      Explore fully funded, partial & remote options
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                    {category.count}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED LISTINGS */}
      <section className="py-20 border-t border-slate-200/50 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Featured Global Opportunities
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Handpicked, high-impact opportunities closing soon. Apply early to increase your odds.
              </p>
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-350 transition-colors"
            >
              See all listings
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredOpps.map((opp) => (
              <div
                key={opp.id}
                className="group flex flex-col justify-between p-6 rounded-2xl glass-card border border-lightborder dark:border-darkborder hover:border-brand-500/30 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-455">
                      {opp.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {opp.location}
                    </span>
                  </div>

                  {/* Title & Org */}
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors mb-1.5">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-semibold">
                    {opp.organizationName}
                  </p>

                  {/* Snippet */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5">
                    {opp.description}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-500" />
                    {new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <Link
                    href={`/explore?id=${opp.id}`}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-350 flex items-center gap-0.5"
                  >
                    Quick Apply
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {featuredOpps.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400">
                No featured opportunities found. Make sure database is seeded!
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
