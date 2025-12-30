// "use client";

// import { useEffect } from "react";
// import Script from "next/script";
// import api from "@/app/lib/apiClient";

// export default function GoogleLoginButton() {
//   useEffect(() => {
//     const tryInit = () => {
//       if (!window.google) return;

//       window.google.accounts.id.initialize({
//         client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//         callback: handleCredentialResponse,
//       });

//       const btn = document.getElementById("googleBtn");
//       if (btn)
//         window.google.accounts.id.renderButton(btn, {
//           theme: "outline",
//           size: "large",
//         });
//     };

//     tryInit();
//     const interval = setInterval(tryInit, 250);
//     return () => clearInterval(interval);
//   }, []);

//   async function handleCredentialResponse(response: any) {
//     const idToken = response.credential;
//     if (!idToken) return alert("No credential returned by Google.");

//     try {
//       // 🔥 Make sure to include credentials to receive/set cookies
//       const res = await api.post(
//         "/users/auth/google/",
//         { credential: idToken },
//         { withCredentials: true } // include cookies
//       );

//       console.log("Backend Success:", res.data);

//       // No need to store in localStorage; cookie will be used automatically
//       window.dispatchEvent(new Event("auth-changed")); // update Navbar
//       window.location.href = "/"; // redirect to home/profile
//     } catch (error: any) {
//       console.error("Google Login Error:", error.response?.data || error);
//       alert("Google Login Failed");
//     }
//   }

//   return (
//     <>
//       <Script
//         src="https://accounts.google.com/gsi/client"
//         strategy="beforeInteractive"
//       />
//       <div id="googleBtn"></div>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import api from "@/app/lib/apiClient";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

export default function GoogleLoginButton() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const tryInit = () => {
      if (!window.google) return;
      setIsLoaded(true);

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        // Enhanced UI: Automatically signs in if the user has a single account
        auto_select: false,
      });

      const btn = document.getElementById("googleBtn");
      if (btn) {
        window.google.accounts.id.renderButton(btn, {
          theme: "outline", // Matches glassmorphism better than 'filled_blue'
          size: "large",
          shape: "pill", // Matches your rounded-xl/full aesthetic
          width: "300",
          logo_alignment: "left",
        });
      }
    };

    const interval = setInterval(() => {
      if (window.google) {
        tryInit();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  async function handleCredentialResponse(response: any) {
    const idToken = response.credential;
    if (!idToken) return;

    try {
      const res = await api.post(
        "/users/auth/google/",
        { credential: idToken },
        { withCredentials: true }
      );
      window.dispatchEvent(new Event("auth-changed"));
      window.location.href = "/";
    } catch (error: any) {
      console.error("Google Login Error:", error.response?.data || error);
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-3d p-8 flex flex-col items-center justify-center max-w-sm mx-auto"
      >
        {/* Subtle Branding Icon */}
        <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 text-[var(--accent)] shadow-inner">
          <Chrome size={24} />
        </div>

        <h2 className="text-xl font-black tracking-tight mb-2 uppercase text-center">
          Secure Access
        </h2>
        <p className="text-[10px] font-black opacity-30 tracking-[0.2em] uppercase mb-8 text-center">
          Continue with your Google Account
        </p>

        {/* The Google Button Container */}
        <div className="relative group">
          {/* A soft glow behind the button */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

          <div
            id="googleBtn"
            className={`relative transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>

        {!isLoaded && (
          <div className="h-[44px] flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <p className="mt-8 text-[9px] opacity-20 font-bold uppercase tracking-tighter max-w-[200px] text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </>
  );
}
