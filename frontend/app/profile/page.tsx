"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getUserProfile } from "../lib/api";
import {
  Trophy,
  Target,
  Calendar,
  Activity,
  Mail,
  User as UserIcon,
  Award,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

/* --- TYPES (Kept Original) --- */
interface QuizResult {
  id: number;
  quiz_title: string;
  quiz_type: string;
  score: number;
  correct: number;
  total: number;
  submitted_at: string;
}

interface UserProfileData {
  user: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    date_joined?: string;
  };
  quiz_results: QuizResult[];
}

interface QuizSummary {
  code: string;
  name: string;
  average_score: number;
  best_score: number;
  total_quizzes: number;
}

const QUIZ_TYPE_LABELS: Record<string, string> = {
  NUM: "Numerical Ability",
  VER: "Verbal Ability",
  ANA: "Analytical Ability",
  CLE: "Clerical Ability",
  GEN: "General Information",
};

export default function ProfileDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "details" | "history">(
    "summary"
  );

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err: any) {
        if (err?.response?.status === 401) router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  /* --- DATA LOGIC (Kept Original) --- */
  const fullName = useMemo(() => {
    if (!profile?.user) return "";
    const { first_name, last_name, username } = profile.user;
    return first_name || last_name
      ? `${first_name} ${last_name}`.trim()
      : username;
  }, [profile]);

  const quizSummary = useMemo<QuizSummary[]>(() => {
    if (!profile) return [];
    const map: Record<string, QuizSummary> = {};
    profile.quiz_results.forEach((q) => {
      if (!map[q.quiz_type]) {
        map[q.quiz_type] = {
          code: q.quiz_type,
          name: QUIZ_TYPE_LABELS[q.quiz_type] || q.quiz_type,
          average_score: 0,
          best_score: 0,
          total_quizzes: 0,
        };
      }
      const t = map[q.quiz_type];
      t.total_quizzes++;
      t.average_score += q.score;
      t.best_score = Math.max(t.best_score, q.score);
    });
    return Object.values(map).map((t) => ({
      ...t,
      average_score: Number((t.average_score / t.total_quizzes).toFixed(1)),
    }));
  }, [profile]);

  const examReadiness = useMemo(() => {
    if (!quizSummary.length) return 0;
    return Math.min(
      100,
      quizSummary.reduce((a, b) => a + b.average_score, 0) / quizSummary.length
    );
  }, [quizSummary]);

  const progressTrend = useMemo(() => {
    if (!profile || profile.quiz_results.length < 2) {
      return {
        status: "Neutral",
        value: "New",
        color: "text-slate-400",
        icon: <Minus size={14} />,
      };
    }
    const results = profile.quiz_results;
    const last5 = results.slice(-5);
    const last5Avg = last5.reduce((s, q) => s + q.score, 0) / last5.length;
    const diff = last5Avg - examReadiness;
    if (diff > 2)
      return {
        status: "Improving",
        value: `+${diff.toFixed(1)}%`,
        color: "text-emerald-500",
        icon: <TrendingUp size={14} />,
      };
    if (diff < -2)
      return {
        status: "Declining",
        value: `${diff.toFixed(1)}%`,
        color: "text-red-500",
        icon: <TrendingDown size={14} />,
      };
    return {
      status: "Stable",
      value: "Steady",
      color: "text-blue-500",
      icon: <Minus size={14} />,
    };
  }, [examReadiness, profile]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,113,227,0.2)]" />
        <p className="mt-6 opacity-40 font-black text-[10px] uppercase tracking-[0.3em]">
          Analyzing Performance...
        </p>
      </div>
    );

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative group"
        >
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[var(--accent)] to-violet-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-[var(--accent)]/30 group-hover:rotate-3 transition-transform duration-500">
            {profile.user.username[0].toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-[var(--background)] w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={18} />
          </div>
        </motion.div>

        <div className="text-center md:text-left">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black tracking-tighter mb-3 italic"
          >
            {fullName}
          </motion.h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-5 text-[10px] font-black uppercase tracking-widest opacity-50">
            <span className="flex items-center gap-2">
              <Mail size={14} /> {profile.user.email}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} /> Joined{" "}
              {new Date(profile.user.date_joined || "").toLocaleDateString()}
            </span>
            <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
              ID: #{profile.user.id}
            </span>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Quizzes"
          value={profile.quiz_results.length}
          icon={<Activity size={20} />}
        />
        <StatCard
          label="Exam Readiness"
          value={`${examReadiness.toFixed(0)}%`}
          icon={<Target size={20} />}
        />
        <StatCard
          label="Personal Best"
          value={`${Math.max(...profile.quiz_results.map((r) => r.score), 0)}%`}
          icon={<Award size={20} />}
        />

        <div className="glass-card-3d p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
                Trend
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-2xl font-black ${progressTrend.color}`}>
                  {progressTrend.value}
                </span>
                {progressTrend.icon}
              </div>
            </div>
            <Sparkline
              data={profile.quiz_results.slice(-10).map((r) => r.score)}
              color={progressTrend.color}
            />
          </div>
          <p className="text-[9px] font-black opacity-30 uppercase mt-4">
            {progressTrend.status} Strategy
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex p-1.5 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-2xl w-fit mb-10 border border-white/10">
        <TabButton
          active={activeTab === "summary"}
          onClick={() => setActiveTab("summary")}
          label="Overview"
          icon={<BarChart3 size={16} />}
        />
        <TabButton
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
          label="History"
          icon={<Clock size={16} />}
        />
        <TabButton
          active={activeTab === "details"}
          onClick={() => setActiveTab("details")}
          label="Account"
          icon={<UserIcon size={16} />}
        />
      </div>

      {/* TAB CONTENT AREA */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          {activeTab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {quizSummary.map((q) => (
                <div key={q.code} className="glass-card-3d p-8 group">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-black text-xl tracking-tight italic">
                      {q.name}
                    </h3>
                    <span className="text-[9px] font-black px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full uppercase opacity-40">
                      {q.total_quizzes} attempts
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">
                      <span>Proficiency</span>
                      <span className="text-[var(--accent)]">
                        {q.average_score}%
                      </span>
                    </div>
                    <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${q.average_score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[var(--accent)] to-violet-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {[...profile.quiz_results].reverse().map((q) => (
                <div
                  key={q.id}
                  className="glass-card-3d p-5 flex items-center justify-between group cursor-default"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        q.score >= 75
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      <Trophy size={20} />
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-tight">
                        {q.quiz_title}
                      </p>
                      <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                        {QUIZ_TYPE_LABELS[q.quiz_type] || q.quiz_type} •{" "}
                        {new Date(q.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p
                        className={`text-xl font-black ${
                          q.score >= 75 ? "text-emerald-500" : "text-amber-500"
                        }`}
                      >
                        {q.score}%
                      </p>
                      <p className="text-[9px] font-black opacity-20 uppercase tracking-tighter">
                        Final Score
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="opacity-20 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <DetailBox label="Identity Profile">
                <InfoRow label="Full Legal Name" value={fullName} />
                <InfoRow label="Username" value={profile.user.username} />
                <InfoRow label="Email Address" value={profile.user.email} />
              </DetailBox>
              <DetailBox label="System Metadata">
                <InfoRow
                  label="Registration"
                  value={new Date(
                    profile.user.date_joined || ""
                  ).toLocaleDateString()}
                />
                <InfoRow
                  label="Total Sessions"
                  value={profile.quiz_results.length.toString()}
                />
              </DetailBox>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* --- RE-STYLED SUB-COMPONENTS --- */

function StatCard({ label, value, icon }: any) {
  return (
    <div className="glass-card-3d p-6 flex items-center gap-5">
      <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
          {label}
        </p>
        <p className="text-2xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
        active
          ? "bg-white dark:bg-[var(--accent)] text-[var(--accent)] dark:text-white shadow-xl"
          : "opacity-40 hover:opacity-100"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function DetailBox({ label, children }: any) {
  return (
    <div className="glass-card-3d p-8">
      <h3 className="text-sm font-black uppercase tracking-[0.3em] opacity-30 mb-8 border-b border-white/5 pb-4">
        {label}
      </h3>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, badge }: any) {
  return (
    <div className="flex justify-between items-center group">
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className="font-bold text-sm tracking-tight">{value}</span>
        {badge && (
          <span className="bg-emerald-500/10 text-emerald-500 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2)
    return <div className="text-[8px] font-black opacity-20">NO DATA</div>;
  const width = 80;
  const height = 30;
  const points = data
    .map(
      (d, i) =>
        `${(i / (data.length - 1)) * width},${height - (d / 100) * height}`
    )
    .join(" ");
  const strokeColor = color.includes("emerald")
    ? "#10b981"
    : color.includes("red")
    ? "#ef4444"
    : "#3b82f6";

  return (
    <svg width={width} height={height} className="overflow-visible opacity-50">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
