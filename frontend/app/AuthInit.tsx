"use client";
import { useEffect } from "react";
import { tokenService } from "./lib/auth";

export default function AuthInit() {
  useEffect(() => {
    const access = tokenService.get();
    const refresh = tokenService.getRefresh();

    // No tokens at all → nothing to restore
    if (!access || !refresh) return;

    // If access expired → refresh it
    if (tokenService.expired()) {
      tokenService.refresh();
    }
  }, []);

  return null;
}
