"use client"; // make sure this is a client component

import { useEffect } from "react";
import api from "../lib/apiClient"; // adjust the path to your apiClient

export default function TestConnection() {
  useEffect(() => {
    api
      .get("/quizzes/") // any endpoint that exists in your backend
      .then((res) => {
        console.log("✅ Connected to backend:", res.data);
      })
      .catch((err) => {
        console.error("❌ Connection failed:", err.message);
      });
  }, []);

  return <div>Testing backend connection… Open console!</div>;
}
