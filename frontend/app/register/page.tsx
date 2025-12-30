// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signup } from "../lib/api";
// import {
//   Eye,
//   EyeOff,
//   Lock,
//   Mail,
//   User,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Contact, // Added for name fields
// } from "lucide-react";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     username: "",
//     first_name: "", // Added
//     last_name: "", // Added
//     email: "",
//     password: "",
//     confirm: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [error, setError] = useState<string | string[] | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isTouched, setIsTouched] = useState(false);

//   const checks = {
//     length: formData.password.length >= 8,
//     upper: /[A-Z]/.test(formData.password),
//     lower: /[a-z]/.test(formData.password),
//     number: /[0-9]/.test(formData.password),
//     special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === "password") setIsTouched(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!formData.password) {
//       setError("Password cannot be empty.");
//       return;
//     }

//     if (Object.values(checks).some((check) => check === false)) {
//       setError("Please meet all password requirements.");
//       return;
//     }

//     if (formData.password !== formData.confirm) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       setLoading(true);
//       // Now passing all 5 arguments to match your updated api.ts
//       await signup(
//         formData.username,
//         formData.email,
//         formData.password,
//         formData.first_name,
//         formData.last_name
//       );

//       setSuccess(true);
//       // Wait 2 seconds so they see the success message, then redirect
//       setTimeout(() => router.push("/login"), 2000);
//     } catch (err: any) {
//       const backendErrors = err.response?.data;
//       if (backendErrors && typeof backendErrors === "object") {
//         const messages = Object.values(backendErrors).flat() as string[];
//         setError(messages);
//       } else {
//         setError(err.message || "An unexpected error occurred.");
//       }
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="max-w-md mx-auto p-12 border rounded-xl shadow-lg mt-20 bg-white text-center animate-in fade-in duration-500">
//         <CheckCircle2 className="text-emerald-500 h-16 w-16 mx-auto mb-4" />
//         <h1 className="text-2xl font-bold text-gray-800">Account Created!</h1>
//         <p className="text-gray-600 mt-2">Redirecting to login page...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto p-8 border rounded-xl shadow-xl mt-10 bg-white">
//       <div className="text-center mb-6">
//         <h1 className="text-3xl font-extrabold text-gray-900">Sign Up</h1>
//         <p className="text-gray-500 text-sm mt-1">
//           Join us to start your journey
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r flex gap-2">
//           <AlertCircle className="h-5 w-5 shrink-0" />
//           <div>
//             {Array.isArray(error) ? (
//               <ul className="list-disc pl-4 space-y-1">
//                 {error.map((msg, i) => (
//                   <li key={i}>{msg}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p>{error}</p>
//             )}
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Names Row */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="relative">
//             <Contact className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <input
//               name="first_name"
//               placeholder="First Name"
//               onChange={handleChange}
//               className="pl-10 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>
//           <div className="relative">
//             <Contact className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <input
//               name="last_name"
//               placeholder="Last Name"
//               onChange={handleChange}
//               className="pl-10 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>
//         </div>

//         {/* Username */}
//         <div className="relative">
//           <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <input
//             name="username"
//             placeholder="Username"
//             onChange={handleChange}
//             className="pl-10 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
//             required
//           />
//         </div>

//         {/* Email */}
//         <div className="relative">
//           <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <input
//             name="email"
//             type="email"
//             placeholder="Email Address"
//             onChange={handleChange}
//             className="pl-10 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
//           />
//         </div>

//         {/* Password Section */}
//         <div className="space-y-3">
//           <div className="relative">
//             <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               onChange={handleChange}
//               className={`pl-10 pr-10 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 ${
//                 isTouched && !formData.password
//                   ? "border-red-500 ring-1 ring-red-200"
//                   : ""
//               }`}
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3 text-gray-400 hover:text-emerald-600"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {isTouched && !formData.password && (
//             <p className="text-red-500 text-xs flex items-center gap-1 font-semibold italic">
//               <XCircle size={12} /> Password cannot be empty!
//             </p>
//           )}

//           <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
//             <Requirement label="8+ Characters" met={checks.length} />
//             <Requirement label="One Uppercase" met={checks.upper} />
//             <Requirement label="One Lowercase" met={checks.lower} />
//             <Requirement label="One Number" met={checks.number} />
//             <Requirement label="Special Char" met={checks.special} />
//           </div>
//         </div>

//         {/* Confirm Password */}
//         <div className="relative">
//           <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <input
//             name="confirm"
//             type={showConfirm ? "text" : "password"}
//             placeholder="Confirm Password"
//             onChange={handleChange}
//             className="pl-10 pr-10 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirm(!showConfirm)}
//             className="absolute right-3 top-3 text-gray-400 hover:text-emerald-600"
//           >
//             {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg w-full transition shadow-md disabled:opacity-50 mt-2 transform active:scale-[0.98]"
//         >
//           {loading ? "Creating Account..." : "Create Account"}
//         </button>
//       </form>

//       <div className="mt-6 text-center text-sm text-gray-600">
//         Already have an account?{" "}
//         <a href="/login" className="text-emerald-600 font-bold hover:underline">
//           Log in
//         </a>
//       </div>
//     </div>
//   );
// }

// function Requirement({ label, met }: { label: string; met: boolean }) {
//   return (
//     <div
//       className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
//         met ? "text-emerald-600" : "text-gray-400"
//       }`}
//     >
//       {met ? (
//         <CheckCircle2 size={12} />
//       ) : (
//         <div className="w-3 h-3 rounded-full border border-gray-300" />
//       )}
//       {label}
//     </div>
//   );
// }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.password) {
      setError("Password cannot be empty.");
      return;
    }

    if (Object.values(checks).some((check) => check === false)) {
      setError("Please meet all password requirements.");
      return;
    }

    if (formData.password !== formData.confirm) {
      setError("Passwords do not match.");
      return;
    }

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
        window.location.href = "/login"; // Force reload for clean state
      }, 2000);
    } catch (err: any) {
      const backendErrors = err.response?.data;
      if (backendErrors && typeof backendErrors === "object") {
        const messages = Object.values(backendErrors).flat() as string[];
        setError(messages);
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
      setLoading(false);
    }
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

          <div className="relative">
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
