// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { tokenService } from "../lib/auth";

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// export default function LoginPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Auto-redirect if user is already logged in
//   useEffect(() => {
//     const token = tokenService.get();
//     if (token && !tokenService.expired()) {
//       router.replace("/"); // skip login page
//     }
//   }, [router]);

//   const handleLogin = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/token/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.detail || "Invalid credentials");
//       }

//       // Save tokens using the same service used by your interceptors
//       tokenService.save(data.access, data.refresh);

//       router.push("/");
//     } catch (err: any) {
//       console.error("Login failed:", err);
//       setError(err.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

//       <div className="space-y-3">
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full p-2 border rounded"
//           disabled={loading}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded"
//           disabled={loading}
//         />

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className={`w-full p-2 text-white rounded ${
//             loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <p className="text-sm text-center mt-4">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-600 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { tokenService } from "../lib/auth";
// import { signIn } from "next-auth/react";

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// export default function LoginPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Auto-redirect if user is already logged in
//   useEffect(() => {
//     const token = tokenService.get();
//     if (token && !tokenService.expired()) {
//       router.replace("/"); // skip login page
//     }
//   }, [router]);

//   const handleLogin = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/users/login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.detail || "Invalid credentials");
//       }

//       // Save tokens using the same service used by your interceptors
//       tokenService.save(data.access, data.refresh);

//       router.push("/");
//     } catch (err: any) {
//       console.error("Login failed:", err);
//       setError(err.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       // Open Google OAuth flow
//       await signIn("google", { callbackUrl: "/" });
//     } catch (err) {
//       console.error("Google login error:", err);
//       setError("Google login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

//       <div className="space-y-3">
//         {/* Username / Password */}
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full p-2 border rounded"
//           disabled={loading}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded"
//           disabled={loading}
//         />

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className={`w-full p-2 text-white rounded ${
//             loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {/* OR Divider */}
//         <div className="flex items-center my-3">
//           <hr className="flex-grow border-gray-300" />
//           <span className="px-2 text-gray-500 text-sm">OR</span>
//           <hr className="flex-grow border-gray-300" />
//         </div>

//         {/* Google Login Button */}

//         <button
//           onClick={handleGoogleLogin}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-800 border rounded-full shadow hover:shadow-md transition"
//         >
//           <img src="/google-logo.svg" alt="Google Logo" className="w-5 h-5" />
//           Continue with Google
//         </button>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <p className="text-sm text-center mt-4">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-600 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// "use client";

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { tokenService } from "../lib/auth";

// import Script from "next/script";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// export default function LoginPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Auto-redirect if already logged in
//   useEffect(() => {
//     const token = tokenService.get();
//     if (token && !tokenService.expired()) {
//       router.replace("/"); // skip login page
//     }
//   }, [router]);

//   // Normal username/password login
//   const handleLogin = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/users/login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || "Invalid credentials");

//       tokenService.save(data.access, data.refresh);
//       router.push("/");
//     } catch (err: any) {
//       console.error("Login failed:", err);
//       setError(err.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google login
//   const handleGoogleLogin = async () => {
//     try {
//       if (!window.google) throw new Error("Google script not loaded.");

//       window.google.accounts.id.initialize({
//         client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//         callback: async (response: any) => {
//           const idToken = response.credential;

//           // POST credential to your backend
//           const res = await fetch(`${API_BASE_URL}/users/auth/google/`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ credential: idToken }),
//           });

//           const data = await res.json();
//           if (!res.ok) throw new Error(data.error || "Google login failed");

//           tokenService.save(data.tokens.access, data.tokens.refresh);
//           router.push("/");
//         },
//       });

//       window.google.accounts.id.prompt(); // show Google popup
//     } catch (err: any) {
//       console.error("Google login error:", err);
//       setError(err.message || "Google login failed.");
//     }
//   };

//   <Script
//     src="https://accounts.google.com/gsi/client"
//     onLoad={() => {
//       console.log("Google script loaded!");
//     }}
//   />;

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

//       <div className="space-y-3">
//         {/* Username / Password */}
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full p-2 border rounded"
//           disabled={loading}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded"
//           disabled={loading}
//         />

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className={`w-full p-2 text-white rounded ${
//             loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {/* OR Divider */}
//         <div className="flex items-center my-3">
//           <hr className="flex-grow border-gray-300" />
//           <span className="px-2 text-gray-500 text-sm">OR</span>
//           <hr className="flex-grow border-gray-300" />
//         </div>

//         {/* Google Login Button */}
//         <button
//           onClick={handleGoogleLogin}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-800 border rounded-full shadow hover:shadow-md transition"
//         >
//           <img src="/google-logo.svg" alt="Google Logo" className="w-5 h-5" />
//           Continue with Google
//         </button>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <p className="text-sm text-center mt-4">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-600 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// "use client";

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// import { useEffect, useRef, useState } from "react";
// import Script from "next/script";
// import { useRouter } from "next/navigation";
// import { tokenService } from "../lib/auth";
// import GoogleLoginButton from "@/components/GoogleLoginButton";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
// const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// export default function LoginPage() {
//   const router = useRouter();
//   const btnRef = useRef<HTMLDivElement | null>(null);

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // redirect if already logged in
//   useEffect(() => {
//     const token = tokenService.get();
//     if (token && !tokenService.expired()) router.replace("/");
//   }, [router]);

//   // initialize Google Identity Services
//   const initGoogle = () => {
//     if (!GOOGLE_CLIENT_ID || !window.google || !btnRef.current) return;

//     try {
//       window.google.accounts.id.initialize({
//         client_id: GOOGLE_CLIENT_ID,
//         callback: handleCredentialResponse,
//       });

//       // Render the button inline in the form
//       window.google.accounts.id.renderButton(btnRef.current, {
//         theme: "outline",
//         size: "large",
//         width: 250, // optional: control width
//         text: "signin_with", // shows "Sign in with Google"
//       });
//     } catch (e) {
//       console.warn("Google Identity init failed", e);
//     }
//   };

//   async function handleCredentialResponse(response: any) {
//     console.log("GOOGLE RESPONSE:", response);
//     console.log("GOOGLE CREDENTIAL:", response.credential);

//     setError(null);
//     const credential = response?.credential;
//     if (!credential) {
//       setError("Google credential not returned");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/users/auth/google/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ credential }),
//       });

//       // parse JSON safely
//       let data: any;
//       try {
//         data = await res.json();
//       } catch {
//         throw new Error("Invalid JSON response from backend.");
//       }

//       if (!res.ok) {
//         throw new Error(data?.error || data?.detail || "Google login failed");
//       }

//       // Always extract tokens safely
//       const access =
//         data.access ?? data.tokens?.access ?? data.tokens?.access_token;
//       const refresh =
//         data.refresh ?? data.tokens?.refresh ?? data.tokens?.refresh_token;

//       console.log("BACKEND RESPONSE:", data);
//       console.log("ACCESS:", access);
//       console.log("REFRESH:", refresh);

//       if (!access || !refresh) {
//         throw new Error(
//           "Backend did not return access/refresh tokens properly."
//         );
//       }

//       // Save tokens in tokenService
//       tokenService.save(access, refresh);

//       // Redirect to home after login
//       router.push("/");
//     } catch (err: any) {
//       console.error("Google login error", err);
//       setError(err.message || "Login failed");
//     }
//   }

//   async function handleLocalLogin() {
//     setError(null);
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/users/login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });
//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data.detail || data.error || "Invalid credentials");

//       const access = data.access || data.access_token || data.tokens?.access;

//       const refresh =
//         data.refresh || data.refresh_token || data.tokens?.refresh;

//       if (!access || !refresh) {
//         console.error("LOCAL LOGIN TOKEN MISSING", data);
//         setError("Login successful but no token received");
//         return;
//       }
//       console.error("LOCAL LOGIN TOKEN MISSING means OK", data);
//       tokenService.save(access, refresh);

//       router.push("/");
//     } catch (err: any) {
//       console.error("Login failed:", err);
//       setError(err.message || "Login failed. Please try again.");
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

//       <div className="space-y-3">
//         {/* Local login form */}
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full p-2 border rounded"
//           disabled={loading}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded"
//           disabled={loading}
//         />
//         <button
//           onClick={handleLocalLogin}
//           disabled={loading}
//           className={`w-full p-2 text-white rounded ${
//             loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <div className="flex items-center my-3">
//           <hr className="flex-grow border-gray-300" />
//           <span className="px-2 text-gray-500 text-sm">OR</span>
//           <hr className="flex-grow border-gray-300" />
//         </div>
//         {/* Inline Google button */}
//         <div ref={btnRef} className="flex justify-center" />

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <p className="text-sm text-center mt-4">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-600 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

declare global {
  interface Window {
    google: any;
  }
}

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { tokenService } from "../lib/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const router = useRouter();
  const btnRef = useRef<HTMLDivElement | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // redirect if already logged in
  useEffect(() => {
    const token = tokenService.get();
    if (token && !tokenService.expired()) router.replace("/");
  }, [router]);

  // initialize Google Identity Services
  const initGoogle = () => {
    if (!GOOGLE_CLIENT_ID || !window.google || !btnRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      // Render the button inline in the form
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: "outline",
        size: "large",
        width: 250, // optional: control width
        text: "signin_with", // shows "Sign in with Google"
      });
    } catch (e) {
      console.warn("Google Identity init failed", e);
    }
  };

  async function handleCredentialResponse(response: any) {
    console.log("GOOGLE RESPONSE:", response);
    console.log("GOOGLE CREDENTIAL:", response.credential);

    setError(null);
    const credential = response?.credential;
    if (!credential) {
      setError("Google credential not returned");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/auth/google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      // parse JSON safely
      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid JSON response from backend.");
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.detail || "Google login failed");
      }

      // Always extract tokens safely
      const access =
        data.access ?? data.tokens?.access ?? data.tokens?.access_token;
      const refresh =
        data.refresh ?? data.tokens?.refresh ?? data.tokens?.refresh_token;

      console.log("BACKEND RESPONSE:", data);
      console.log("ACCESS:", access);
      console.log("REFRESH:", refresh);

      if (!access || !refresh) {
        throw new Error(
          "Backend did not return access/refresh tokens properly."
        );
      }

      // Save tokens in tokenService
      tokenService.save(access, refresh);

      // Redirect to home after login
      router.push("/");
    } catch (err: any) {
      console.error("Google login error", err);
      setError(err.message || "Login failed");
    }
  }

  async function handleLocalLogin() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.detail || data.error || "Invalid credentials");

      const access = data.access || data.access_token || data.tokens?.access;

      const refresh =
        data.refresh || data.refresh_token || data.tokens?.refresh;

      if (!access || !refresh) {
        console.error("LOCAL LOGIN TOKEN MISSING", data);
        setError("Login successful but no token received");
        return;
      }
      console.error("LOCAL LOGIN TOKEN MISSING means OK", data);
      tokenService.save(access, refresh);

      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please try again.");
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

      <div className="space-y-3">
        {/* Local login form */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={loading}
        />
        <button
          onClick={handleLocalLogin}
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center my-3">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        {/* Inline Google button */}
        <div ref={btnRef} className="flex justify-center" />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
