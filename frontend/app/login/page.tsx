// "use client";

// import { useEffect, useRef, useState } from "react";
// import Script from "next/script";
// import { useRouter } from "next/navigation";

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
// const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// export default function LoginPage() {
//   const router = useRouter();
//   const btnRef = useRef<HTMLDivElement | null>(null);

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // OPTIONAL: check auth by calling backend
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
//         credentials: "include", // 🔥 REQUIRED
//         body: JSON.stringify({ credential: response.credential }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || data.detail || "Google login failed");
//       }

//       // ✅ Cookies are already set — just redirect
//       window.dispatchEvent(new Event("auth-changed"));
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
//         credentials: "include", // 🔥 REQUIRED
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.detail || "Invalid credentials");
//       }

//       // ✅ Cookies set — redirect
//       window.dispatchEvent(new Event("auth-changed"));
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

declare global {
  interface Window {
    google: any;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth(); // ✅ ADD THIS
  const btnRef = useRef<HTMLDivElement | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optional auto-redirect if already logged in
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
      width: 250,
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
      if (!res.ok) {
        throw new Error(data.error || data.detail || "Google login failed");
      }

      // ✅ SYNC AUTH CONTEXT
      await refreshUser();
      router.push("/");
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
      if (!res.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      // ✅ SYNC AUTH CONTEXT
      await refreshUser();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogle}
      />

      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleLocalLogin}
        disabled={loading}
        className="w-full p-2 bg-green-500 text-white rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="my-4 flex items-center">
        <hr className="flex-grow" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="flex-grow" />
      </div>

      <div ref={btnRef} className="flex justify-center" />

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
