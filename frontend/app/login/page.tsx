// login/page.tsx
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

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
