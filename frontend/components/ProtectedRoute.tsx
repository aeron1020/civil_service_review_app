"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      // Still checking session
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/login");
    } else {
      // Authenticated
      setIsChecking(false);
    }
  }, [status, router]);

  if (isChecking) {
    return (
      <p className="text-center mt-20 text-gray-500 dark:text-gray-400">
        Checking authentication...
      </p>
    );
  }

  return <>{children}</>;
}
