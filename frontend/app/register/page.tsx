"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signup } from "../lib/api";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Contact,
  UserPlus,
  ArrowRight,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | string[] | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const checks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setIsTouched(true);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!formData.password) {
  //     setError("Password cannot be empty.");
  //     return;
  //   }

  //   if (Object.values(checks).some((check) => check === false)) {
  //     setError("Please meet all password requirements.");
  //     return;
  //   }

  //   if (formData.password !== formData.confirm) {
  //     setError("Passwords do not match.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await signup(
  //       formData.username,
  //       formData.email,
  //       formData.password,
  //       formData.first_name,
  //       formData.last_name
  //     );

  //     setSuccess(true);
  //     setTimeout(() => {
  //       window.location.href = "/login"; // Force reload for clean state
  //     }, 2000);
  //   } catch (err: any) {
  //     const backendErrors = err.response?.data;
  //     if (backendErrors && typeof backendErrors === "object") {
  //       const messages = Object.values(backendErrors).flat() as string[];
  //       setError(messages);
  //     } else {
  //       setError(err.message || "An unexpected error occurred.");
  //     }
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (formData.password !== formData.confirm) {
      setError("Passwords do not match.");
      return;
    }

    // try {
    //   setLoading(true);
    //   await signup(
    //     formData.username,
    //     formData.email,
    //     formData.password,
    //     formData.first_name,
    //     formData.last_name
    //   );

    //   setSuccess(true);
    //   setTimeout(() => {
    //     window.location.href = "/login";
    //   }, 2000);
    // } catch (err: any) {
    //   const backendErrors = err.response?.data;

    //   if (backendErrors && typeof backendErrors === "object") {
    //     // Flatten all error messages into an array
    //     const messages = Object.entries(backendErrors).map(([key, value]) => {
    //       const fieldName =
    //         key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ");
    //       return `${fieldName}: ${Array.isArray(value) ? value[0] : value}`;
    //     });
    //     setError(messages);
    //   } else {
    //     setError(err.message || "Connection to intelligence server failed.");
    //   }
    //   setLoading(false);
    // }
    try {
      setLoading(true);
      await signup(
        formData.username,
        formData.email,
        formData.password,
        formData.first_name,
        formData.last_name
      );

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      const backendErrors = err.response?.data;

      if (backendErrors && typeof backendErrors === "object") {
        // This turns {"username": ["Already exists"]} into ["Username: Already exists"]
        const messages = Object.entries(backendErrors).map(([key, value]) => {
          const fieldName =
            key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ");
          const message = Array.isArray(value) ? value[0] : value;
          return `${fieldName}: ${message}`;
        });
        setError(messages);
      } else {
        setError("Intelligence server connection failed.");
      }
      setLoading(false);
    }
  };

  // Helper to check if a specific field has an error (for UI highlighting)
  const hasError = (field: string) => {
    if (!error || !Array.isArray(error)) return false;
    return error.some((msg) => msg.toLowerCase().includes(field.toLowerCase()));
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card-3d p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic uppercase">
            Account Created
          </h1>
          <p className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase mt-2">
            Redirecting to Portal...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-0 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-3d w-full max-w-lg p-10 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full" />

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6 shadow-inner">
            <UserPlus size={28} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">
            Create Profile
          </h1>
          <p className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase mt-2">
            Civil Service Reviewer Access
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-wider rounded-xl flex gap-3">
                <AlertCircle size={16} className="shrink-0" />
                <div>
                  {Array.isArray(error) ? (
                    <ul className="space-y-1">
                      {error.map((msg, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{error}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Contact
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
                size={18}
              />
              <input
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
              />
            </div>
            <div className="relative">
              <Contact
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
                size={18}
              />
              <input
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
              />
            </div>
          </div>

          {/* <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
              size={18}
            />
            <input
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
            />
          </div> */}

          <div className="relative">
            <User
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                hasError("username") ? "text-red-500 opacity-100" : "opacity-20"
              }`}
              size={18}
            />
            <input
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 dark:bg-white/5 border outline-none transition-all font-medium text-sm ${
                hasError("username")
                  ? "border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                  : "border-white/10 focus:border-emerald-500/50"
              }`}
            />
            {hasError("username") && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-red-500 uppercase tracking-widest"
              >
                Taken
              </motion.span>
            )}
          </div>

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
              size={18}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
            />
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
                size={18}
              />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50 transition-all font-medium text-sm ${
                  isTouched && !formData.password ? "border-red-500/50" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-white/5">
              <Requirement label="8+ Chars" met={checks.length} />
              <Requirement label="Uppercase" met={checks.upper} />
              <Requirement label="Lowercase" met={checks.lower} />
              <Requirement label="Number" met={checks.number} />
              <Requirement label="Special" met={checks.special} />
            </div>
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
              size={18}
            />
            <input
              name="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? (
              "Creating Profile..."
            ) : (
              <>
                <UserPlus size={16} /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] font-black opacity-30 tracking-widest uppercase mb-4">
            Already registered?
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="text-emerald-500 font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 mx-auto hover:gap-3 transition-all"
          >
            Sign In to Portal <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Requirement({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter transition-all ${
        met ? "text-emerald-500 opacity-100" : "opacity-20"
      }`}
    >
      {met ? (
        <CheckCircle2 size={10} />
      ) : (
        <div className="w-2 h-2 rounded-full border border-current" />
      )}
      {label}
    </div>
  );
}
