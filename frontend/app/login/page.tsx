// "use client";

// import { useEffect, useRef, useState } from "react";
// import Script from "next/script";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/components/AuthContext";

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
// const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// export default function LoginPage() {
//   const router = useRouter();
//   const { refreshUser } = useAuth(); // ✅ ADD THIS
//   const btnRef = useRef<HTMLDivElement | null>(null);

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Optional auto-redirect if already logged in
//   useEffect(() => {
//     fetch(`${API_BASE}/users/profile/`, {
//       credentials: "include",
//     }).then((res) => {
//       if (res.ok) router.replace("/");
//     });
//   }, [router]);

//   const initGoogle = () => {
//     if (!GOOGLE_CLIENT_ID || !window.google || !btnRef.current) return;

//     window.google.accounts.id.initialize({
//       client_id: GOOGLE_CLIENT_ID,
//       callback: handleGoogleLogin,
//     });

//     window.google.accounts.id.renderButton(btnRef.current, {
//       theme: "outline",
//       size: "large",
//       width: 250,
//     });
//   };

//   async function handleGoogleLogin(response: any) {
//     setError(null);

//     try {
//       const res = await fetch(`${API_BASE}/users/auth/google/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ credential: response.credential }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.error || data.detail || "Google login failed");
//       }

//       // ✅ SYNC AUTH CONTEXT
//       await refreshUser();
//       router.push("/");
//     } catch (err: any) {
//       setError(err.message || "Google login failed");
//     }
//   }

//   async function handleLocalLogin() {
//     setError(null);
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/users/auth/login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.detail || "Invalid credentials");
//       }

//       // ✅ SYNC AUTH CONTEXT
//       await refreshUser();
//       router.push("/");
//     } catch (err: any) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <Script
//         src="https://accounts.google.com/gsi/client"
//         strategy="afterInteractive"
//         onLoad={initGoogle}
//       />

//       <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         className="w-full p-2 border rounded mb-2"
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <button
//         onClick={handleLocalLogin}
//         disabled={loading}
//         className="w-full p-2 bg-green-500 text-white rounded"
//       >
//         {loading ? "Logging in..." : "Login"}
//       </button>

//       <div className="my-4 flex items-center">
//         <hr className="flex-grow" />
//         <span className="px-2 text-gray-500">OR</span>
//         <hr className="flex-grow" />
//       </div>

//       <div ref={btnRef} className="flex justify-center" />

//       {error && <p className="text-red-500 text-center mt-4">{error}</p>}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { motion } from "framer-motion";
import { Lock, User, LogIn, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const btnRef = useRef<HTMLDivElement | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/users/profile/`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) router.replace("/");
    });
  }, [router]);

  const initGoogle = () => {
    if (!GOOGLE_CLIENT_ID || !window.google || !btnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      shape: "pill",
    });
  };

  async function handleGoogleLogin(response: any) {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users/auth/google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.detail || "Google login failed");
      await refreshUser();
      window.location.href = "/"; // Force reload on success for clean auth state
    } catch (err: any) {
      setError(err.message || "Google login failed");
    }
  }

  async function handleLocalLogin() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid credentials");
      await refreshUser();
      window.location.href = "/"; // Force reload on success
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogle}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card-3d w-full max-w-md p-10 relative overflow-hidden"
      >
        {/* Subtle Background Decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--accent)]/10 blur-3xl rounded-full" />

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] mb-6 shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">
            Welcome Back
          </h1>
          <p className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase mt-2">
            Secure Portal Access
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
              size={18}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 outline-none focus:border-[var(--accent)]/50 transition-all font-medium text-sm"
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"
              size={18}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 outline-none focus:border-[var(--accent)]/50 transition-all font-medium text-sm"
            />
          </div>

          <button
            onClick={handleLocalLogin}
            disabled={loading}
            className="w-full py-4 bg-[var(--accent)] text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                <LogIn size={16} /> Login
              </>
            )}
          </button>
        </div>

        <div className="my-10 flex items-center gap-4">
          <div className="h-[1px] flex-grow bg-white/10" />
          <span className="text-[10px] font-black opacity-20 tracking-widest uppercase">
            Social Authentication
          </span>
          <div className="h-[1px] flex-grow bg-white/10" />
        </div>

        <div
          ref={btnRef}
          className="flex justify-center transition-all hover:scale-[1.02]"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mt-6 text-[11px] font-black uppercase tracking-wider"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
