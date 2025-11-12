// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { saveToken } from "../lib/auth";

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// export default function LoginPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async () => {
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE_URL}/token/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         saveToken(data.access);
//         localStorage.setItem("refresh", data.refresh);

//         router.push("/");

//         setTimeout(() => {
//           window.location.reload();
//         }, 100);
//       } else {
//         setError("Invalid credentials");
//       }
//     } catch (err) {
//       setError("Login failed");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded">
//       <h1 className="text-xl font-bold mb-4">Login</h1>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         className="w-full mb-3 p-2 border rounded"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full mb-3 p-2 border rounded"
//       />
//       <button
//         onClick={handleLogin}
//         className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
//       >
//         Login
//       </button>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       <p className="text-sm text-center mt-4">
//         Don't have an account?{" "}
//         <a href="/register" className="text-blue-600 hover:underline">
//           Sign up
//         </a>
//       </p>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenService } from "../lib/auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto-redirect if user is already logged in
  useEffect(() => {
    const token = tokenService.get();
    if (token && !tokenService.expired()) {
      router.replace("/"); // skip login page
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      // Save tokens using the same service used by your interceptors
      tokenService.save(data.access, data.refresh);

      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      <div className="space-y-3">
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
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

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
