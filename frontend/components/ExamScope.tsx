"use client";

import { motion } from "framer-motion";
import { Trophy, Award, CheckCircle2 } from "lucide-react";

export default function ExamScope() {
  return (
    <section className="mt-32 mb-20">
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[var(--accent)] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block"
        >
          Study Roadmap
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic">
          Exam Coverage
        </h2>
        <p className="opacity-50 font-medium max-w-xl mx-auto text-sm md:text-base">
          A comprehensive breakdown of topics for both Professional and
          Sub-Professional levels.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* PROFESSIONAL LEVEL */}
        <div className="glass-card-3d p-8 relative group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black tracking-tight">
                Professional
              </h3>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">
                Level 2 Eligibility
              </p>
            </div>
            <Trophy size={24} className="opacity-20" />
          </div>

          <ul className="space-y-6">
            <ScopeItem
              title="Numerical Ability"
              desc="Arithmetic, Algebra, Word Problems"
            />
            <ScopeItem
              title="Analytical Ability"
              desc="Logic, Data Interpretation, Pattern Recognition"
            />
            <ScopeItem
              title="Verbal Ability"
              desc="Grammar, Vocabulary, Comprehension"
            />
            <ScopeItem
              title="General Information"
              desc="Constitution, RA 6713, Environment"
            />
          </ul>
        </div>

        {/* SUB-PROFESSIONAL LEVEL */}
        <div className="glass-card-3d p-8 relative group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black tracking-tight">
                Sub-Professional
              </h3>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">
                Level 1 Eligibility
              </p>
            </div>
            <Award size={24} className="opacity-20" />
          </div>

          <ul className="space-y-6">
            <ScopeItem
              title="Numerical Ability"
              desc="Arithmetic, Algebra, Word Problems"
            />
            <ScopeItem
              title="Clerical Ability"
              desc="Filing, Spelling, Office Operations"
            />
            <ScopeItem
              title="Verbal Ability"
              desc="Grammar, Vocabulary, Comprehension"
            />
            <ScopeItem
              title="General Information"
              desc="Constitution, RA 6713, Environment"
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

function ScopeItem({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-4">
      <div className="mt-1">
        <CheckCircle2 size={16} className="opacity-20" />
      </div>
      <div>
        <p className="text-sm font-black tracking-tight">{title}</p>
        <p className="text-[11px] opacity-40 font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </li>
  );
}
