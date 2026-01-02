"use client";

import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Settings as SettingsIcon,
  Save,
  ShieldAlert,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
  // --- State for Data ---
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- UI State ---
  const [showPassword, setShowPassword] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // --- Password Validation Logic ---
  const checks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };
  const allMet = Object.values(checks).every(Boolean);

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/profile/`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.user.username);
          // Use .trim() for JS instead of .strip()
          const fullName = `${data.user.first_name || ""} ${
            data.user.last_name || ""
          }`.trim();
          setName(fullName);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Submit Handler
  const handleUpdate = async (
    e: React.FormEvent,
    type: "profile" | "security"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    // Logic to handle full name splitting for Django
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const payload =
      type === "profile"
        ? { username, first_name: firstName, last_name: lastName }
        : { password: newPassword };

    try {
      const res = await fetch(`${API_BASE_URL}/users/profile/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        setToast({ type: "success", message: "Account updated successfully!" });
        if (type === "security") {
          setNewPassword("");
          setCurrentPassword("");
          setIsTouched(false);
        }
      } else {
        const errorMsg =
          typeof result === "object"
            ? (Object.values(result).flat()[0] as string)
            : "Update failed";
        setToast({ type: "error", message: errorMsg });
      }
    } catch (err) {
      setToast({
        type: "error",
        message: "Connection error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-0 min-h-screen relative">
      <header className="mb-10 flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <SettingsIcon size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Configuration
            </span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Account Settings
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PROFILE SECTION */}
        <div className="lg:col-span-7">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-3d p-8 space-y-6"
          >
            <div className="flex items-center gap-3 opacity-40">
              <User size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">
                Profile Identity
              </h2>
            </div>

            <form
              onSubmit={(e) => handleUpdate(e, "profile")}
              className="p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.01] space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={setName}
                  placeholder="John Doe"
                />
                <Input
                  label="Username"
                  value={username}
                  onChange={setUsername}
                  placeholder="username"
                />
              </div>
              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-3d flex items-center gap-2"
                >
                  <Save size={14} />
                  <span className="text-[10px] uppercase font-black">
                    {isSubmitting ? "Saving..." : "Update Profile"}
                  </span>
                </button>
              </div>
            </form>
          </motion.section>
        </div>

        {/* SECURITY SECTION */}
        <div className="lg:col-span-5">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-3d p-8 space-y-6"
          >
            <div className="flex items-center gap-3 text-red-500/50">
              <Lock size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">
                Security Access
              </h2>
            </div>

            <form
              onSubmit={(e) => handleUpdate(e, "security")}
              className="p-6 rounded-2xl border border-red-500/10 bg-red-500/[0.02] space-y-5"
            >
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />

              <div className="relative">
                <Input
                  label="New Secure Password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(v: any) => {
                    setNewPassword(v);
                    setIsTouched(true);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] opacity-20 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-white/5">
                <Requirement label="8+ Chars" met={checks.length} />
                <Requirement label="Uppercase" met={checks.upper} />
                <Requirement label="Lowercase" met={checks.lower} />
                <Requirement label="Number" met={checks.number} />
                <Requirement label="Special" met={checks.special} />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={(!allMet && isTouched) || isSubmitting}
                  className={`w-full btn-3d flex items-center justify-center gap-2 transition-all 
                    ${
                      !allMet && isTouched
                        ? "!opacity-50 !grayscale cursor-not-allowed"
                        : "!bg-red-600 !shadow-red-900/30"
                    }`}
                >
                  <ShieldAlert size={14} />
                  <span className="text-[10px] uppercase font-black">
                    {isSubmitting ? "Rotating..." : "Rotate Credentials"}
                  </span>
                </button>
              </div>
            </form>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed bottom-10 right-10 z-50 p-4 rounded-2xl glass-card-3d border-none shadow-2xl flex items-center gap-3 ${
              toast.type === "success" ? "text-emerald-500" : "text-red-500"
            }`}
          >
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Requirement({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-tighter transition-all ${
        met ? "text-emerald-500" : "opacity-20"
      }`}
    >
      {met ? (
        <CheckCircle2 size={10} />
      ) : (
        <div className="w-1.5 h-1.5 rounded-full border border-current" />
      )}
      {label}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all duration-300 placeholder:opacity-20 w-full"
      />
    </div>
  );
}
