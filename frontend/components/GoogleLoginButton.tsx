"use client";

import { useEffect } from "react";
import Script from "next/script";
import api from "@/app/lib/apiClient";
import { tokenService } from "@/app/lib/auth";

export default function GoogleLoginButton() {
  useEffect(() => {
    const tryInit = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
      });

      const btn = document.getElementById("googleBtn");
      if (btn)
        window.google.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
        });
    };

    tryInit();
    const interval = setInterval(tryInit, 250);
    return () => clearInterval(interval);
  }, []);

  async function handleCredentialResponse(response: any) {
    const idToken = response.credential;
    if (!idToken) return alert("No credential returned by Google.");

    try {
      const res = await api.post("/users/auth/google/", {
        credential: idToken,
      });

      console.log("Backend Success:", res.data);

      // ✅ store tokens using tokenService
      tokenService.save(res.data.access, res.data.refresh);

      // ✅ verify storage
      console.log("Saved access:", tokenService.get());
      console.log("Saved refresh:", localStorage.getItem("refresh"));

      window.location.href = "/";
    } catch (error: any) {
      console.error("Google Login Error:", error.response?.data || error);
      alert("Google Login Failed");
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
      <div id="googleBtn"></div>
    </>
  );
}
