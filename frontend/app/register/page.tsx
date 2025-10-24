"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, login } from "../lib/api";
import { saveToken } from "../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({ label: "", color: "" });

  // Password strength check logic
  const evaluatePassword = (pwd: string) => {
    let score = 0;

    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 0:
      case 1:
        setStrength({ label: "Very Weak", color: "bg-red-500" });
        break;
      case 2:
        setStrength({ label: "Weak", color: "bg-orange-500" });
        break;
      case 3:
        setStrength({ label: "Medium", color: "bg-yellow-500" });
        break;
      case 4:
        setStrength({ label: "Strong", color: "bg-green-500" });
        break;
      case 5:
        setStrength({ label: "Very Strong", color: "bg-emerald-600" });
        break;
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    evaluatePassword(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const result = await signup(username, password);

      if (result?.error) {
        setError(result.error);
        return;
      }

      const data = await login(username, password);
      saveToken(data.access);

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4 text-center">
        Create an Account
      </h1>

      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      {success && <p className="text-green-600 mb-2 text-sm">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="border p-2 w-full mb-1 rounded"
          required
        />

        {/* Password strength meter */}
        {password && (
          <div className="mb-2">
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${strength.color}`}
                style={{
                  width: `${
                    strength.label === "Very Weak"
                      ? 20
                      : strength.label === "Weak"
                      ? 40
                      : strength.label === "Medium"
                      ? 60
                      : strength.label === "Strong"
                      ? 80
                      : 100
                  }%`,
                }}
              ></div>
            </div>
            <p
              className={`text-xs mt-1 ${strength.color.replace(
                "bg-",
                "text-"
              )}`}
            >
              {strength.label}
            </p>
          </div>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-semibold">Password requirements:</p>
        <ul className="list-disc ml-5 text-xs">
          <li>At least 8 characters long</li>
          <li>Includes uppercase & lowercase letters</li>
          <li>Has at least one number</li>
          <li>Has one special character (e.g. @, #, %)</li>
        </ul>
      </div>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
