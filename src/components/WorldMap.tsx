"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Globe, Sparkles, GraduationCap, Briefcase, Award } from "lucide-react";

interface Connection {
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
  progress: number;
  speed: number;
}

interface FloatingCard {
  id: number;
  x: number;
  y: number;
  title: string;
  category: string;
  location: string;
  icon: string;
}

const PIN_POINTS = [
  { x: 180, y: 110, label: "San Francisco", org: "OpenAI" },
  { x: 280, y: 130, label: "New York", org: "Columbia Univ" },
  { x: 480, y: 100, label: "London", org: "Univ of Cambridge" },
  { x: 500, y: 115, label: "Geneva", org: "CERN" },
  { x: 670, y: 130, label: "Tokyo", org: "MEXT Japan" },
  { x: 690, y: 260, label: "Sydney", org: "USyd Scholarship" },
  { x: 530, y: 240, label: "Nairobi", org: "UNEP Fellowship" },
  { x: 380, y: 220, label: "Rio de Janeiro", org: "Youth Grant" },
  { x: 620, y: 170, label: "Singapore", org: "A*STAR PhD" },
];

const OPPORTUNITIES_TABS = [
  { title: "Gates Cambridge", cat: "SCHOLARSHIP", loc: "UK", icon: "cap", x: 490, y: 80 },
  { title: "OpenAI AI Engineer", cat: "JOB", loc: "USA", icon: "brief", x: 190, y: 130 },
  { title: "CERN Fellowship", cat: "FELLOWSHIP", loc: "Switzerland", icon: "cap", x: 510, y: 140 },
  { title: "Google DeepMind ML", cat: "INTERNSHIP", loc: "UK", icon: "brief", x: 450, y: 70 },
  { title: "Global AI Hackathon", cat: "COMPETITION", loc: "Online", icon: "award", x: 630, y: 190 },
];

export default function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeCard, setActiveCard] = useState<number>(0);

  useEffect(() => {
    // Rotation of active card
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % OPPORTUNITIES_TABS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 420;
      }
    };
    window.addEventListener("resize", handleResize);

    // Setup active connections
    const connections: Connection[] = [];
    // Populate some connections
    for (let i = 0; i < PIN_POINTS.length - 1; i++) {
      connections.push({
        from: PIN_POINTS[i],
        to: PIN_POINTS[(i + 3) % PIN_POINTS.length],
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
      });
    }

    const drawMap = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint dot grid background representing world map coordinates
      ctx.fillStyle = "rgba(139, 92, 246, 0.03)";
      const isDark = document.documentElement.classList.contains("dark");
      
      ctx.fillStyle = isDark 
        ? "rgba(139, 92, 246, 0.08)" 
        : "rgba(139, 92, 246, 0.12)";

      const cols = 45;
      const rows = 22;
      const xSpacing = width / cols;
      const ySpacing = height / rows;

      // Draw simulated continents
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const px = c * xSpacing;
          const py = r * ySpacing;
          
          // Simple mathematical formulas to represent landmass shapes (Americas, Eurasia, Africa, Australia)
          const isNorthAmerica = (c > 4 && c < 15 && r > 3 && r < 10);
          const isSouthAmerica = (c > 9 && c < 16 && r >= 10 && r < 19 && c - r < 2 && r - c < 6);
          const isEurope = (c >= 18 && c < 26 && r > 3 && r < 9);
          const isAfrica = (c >= 20 && c < 28 && r >= 9 && r < 17 && c - r < 12);
          const isAsia = (c >= 26 && c < 40 && r > 3 && r < 14);
          const isAustralia = (c >= 36 && c < 43 && r >= 14 && r < 19);
          
          if (isNorthAmerica || isSouthAmerica || isEurope || isAfrica || isAsia || isAustralia) {
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Connection Arcs
      connections.forEach((conn) => {
        const fromX = (conn.from.x / 800) * width;
        const fromY = (conn.from.y / 400) * height;
        const toX = (conn.to.x / 800) * width;
        const toY = (conn.to.y / 400) * height;

        // Quadratic curve control point (gives arc curvature height)
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2 - 50;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(midX, midY, toX, toY);
        ctx.strokeStyle = isDark 
          ? "rgba(139, 92, 246, 0.15)" 
          : "rgba(139, 92, 246, 0.22)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animate pulse dot along the curve
        conn.progress += conn.speed;
        if (conn.progress > 1) {
          conn.progress = 0;
        }

        // Calculate position along quadratic curve
        const t = conn.progress;
        const pulseX = (1 - t) * (1 - t) * fromX + 2 * (1 - t) * t * midX + t * t * toX;
        const pulseY = (1 - t) * (1 - t) * fromY + 2 * (1 - t) * t * midY + t * t * toY;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#8b5cf6";
        ctx.shadowColor = "#a78bfa";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw static glowing nodes
      PIN_POINTS.forEach((pt) => {
        const px = (pt.x / 800) * width;
        const py = (pt.y / 400) * height;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(124, 58, 237, 0.6)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#7c3aed";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawMap);
    };

    drawMap();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeOpp = OPPORTUNITIES_TABS[activeCard];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {/* Canvas for connection lines */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

      {/* Floating Active Opportunity Card Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: `calc(${activeOpp.x}% - 80px)`,
              y: `calc(${activeOpp.y}% - 40px)`
            }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="absolute z-20 pointer-events-auto bg-white/95 dark:bg-slate-900/95 shadow-xl rounded-xl p-3 border border-brand-500/20 backdrop-blur-md flex items-center gap-3 w-56 cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shrink-0">
              {activeOpp.icon === "cap" ? (
                <GraduationCap className="w-4 h-4" />
              ) : activeOpp.icon === "brief" ? (
                <Briefcase className="w-4 h-4" />
              ) : (
                <Award className="w-4 h-4" />
              )}
            </div>
            <div className="overflow-hidden leading-tight text-left">
              <p className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">
                {activeOpp.cat}
              </p>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {activeOpp.title}
              </h4>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {activeOpp.loc}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-500/5 dark:bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />
    </div>
  );
}
