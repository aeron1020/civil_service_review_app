"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired, refreshToken, getToken } from "../app/lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = getToken();

      // ❌ No token → redirect to login
      if (!token) {
        router.replace("/login");
        return;
      }

      // ⏳ Token expired? Try refresh
      if (isTokenExpired()) {
        const newToken = await refreshToken();
        if (!newToken) {
          router.replace("/login");
          return;
        }
      }

      setIsChecking(false);
    };

    verifyAuth();
  }, [router]);

  if (isChecking)
    return <p className="text-center mt-20">Checking authentication...</p>;

  return <>{children}</>;
}
