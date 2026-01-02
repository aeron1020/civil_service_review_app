"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  CheckCircle2,
  Info,
  Clock,
  FileText,
  ShieldCheck,
} from "lucide-react";

export default function ExamScope() {
  return (
    <section className="mt-32 mb-20 px-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="h-[2px] w-8 bg-[var(--accent)]" />
              <span className="text-[var(--accent)] font-black text-[10px] uppercase tracking-[0.4em]">
                CSC Official Syllabus
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-[0.85]">
              Exam <span className="text-gradient">Scope</span>
            </h2>
          </div>
          <p className="opacity-40 font-medium max-w-sm text-xs md:text-sm leading-relaxed border-l border-white/10 pl-6">
            Verified for the 2026 Career Service Examination. Passing rate: 80%
            General Weighted Average.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* TACTICAL SUMMARY CARD */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card-3d p-6 bg-[var(--accent)]/5 border-[var(--accent)]/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[var(--accent)] rounded-xl text-white">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                  Time Limit
                </p>
                <p className="text-lg font-black uppercase">3h 10m (Prof)</p>
              </div>
            </div>
            <div className="space-y-4">
              <StatRow label="Passing Score" value="80.00%" />
              <StatRow label="Total Items" value="170 (Prof) / 165 (Sub)" />
              <StatRow label="Question Type" value="Multiple Choice" />
            </div>
          </div>

          <div className="p-6 rounded-[32px] border border-white/5 bg-white/[0.02]">
            <div className="flex gap-4">
              <Info size={16} className="text-[var(--accent)] shrink-0" />
              <p className="text-[11px] opacity-50 leading-relaxed font-medium">
                Professional eligibility qualifies for both first and second
                level positions in the government. Sub-professional is for first
                level (clerical) only.
              </p>
            </div>
          </div>
        </div>

        {/* COMPARISON CARDS */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          {/* PROFESSIONAL */}
          <div className="glass-card-3d p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight">
                  Professional
                </h3>
                <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest mt-1">
                  2nd Level Eligibility
                </p>
              </div>
              <Trophy size={20} className="opacity-20" />
            </div>

            <ul className="space-y-5">
              <ScopeItem
                title="Numerical Ability"
                desc="Number Sequence, Basic Ops, Word Problems"
                priority="High"
              />
              <ScopeItem
                title="Analytical Ability"
                desc="Logic, Data Interpretation, Abstract Reasoning"
                priority="Critical"
              />
              <ScopeItem
                title="Verbal Ability"
                desc="Reading Comprehension, Vocabulary, Analogy"
                priority="High"
              />
              <ScopeItem
                title="General Information"
                desc="RA 6713, PH Constitution, Environmental Policy"
                priority="Standard"
              />
            </ul>
          </div>

          {/* SUB-PROFESSIONAL */}
          <div className="glass-card-3d p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight">
                  Sub-Prof
                </h3>
                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mt-1">
                  1st Level Eligibility
                </p>
              </div>
              <Award size={20} className="opacity-20" />
            </div>

            <ul className="space-y-5">
              <ScopeItem
                title="Numerical Ability"
                desc="Number Sequence, Arithmetic, Word Problems"
                priority="High"
              />
              <ScopeItem
                title="Clerical Ability"
                desc="Filing, Spelling, Clerical Operations"
                priority="Critical"
              />
              <ScopeItem
                title="Verbal Ability"
                desc="Grammar, Vocabulary, Paragraph Organization"
                priority="High"
              />
              <ScopeItem
                title="General Information"
                desc="RA 6713, PH Constitution, Peace & Human Rights"
                priority="Standard"
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScopeItem({
  title,
  desc,
  priority,
}: {
  title: string;
  desc: string;
  priority: string;
}) {
  const isCritical = priority === "Critical";

  return (
    <li className="group flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-1 h-1 rounded-full ${
              isCritical ? "bg-[var(--accent)] animate-pulse" : "bg-white/20"
            }`}
          />
          <p className="text-xs font-black uppercase tracking-tight">{title}</p>
        </div>
        <span
          className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
            isCritical
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
              : "border-white/10 opacity-30"
          }`}
        >
          {priority}
        </span>
      </div>
      <p className="text-[10px] opacity-40 font-medium leading-relaxed pl-3">
        {desc}
      </p>
    </li>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">
        {label}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-tighter">
        {value}
      </span>
    </div>
  );
}
