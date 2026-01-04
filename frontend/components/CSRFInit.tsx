"use client";

import { useEffect } from "react";
import api from "@/app/lib/apiClient";

export default function CSRFInit() {
  useEffect(() => {
    const initSession = async () => {
      try {
        // This wakes up the Django CSRF middleware
        await api.get("/users/auth/csrf/");
      } catch (err) {
        // We expect a 404 or 403 sometimes if the endpoint isn't made,
        // but even a failed request usually drops the cookie.
        console.log("CSRF probe sent");
      }
    };
    initSession();
  }, []);

  return null; // This component renders nothing
}
