// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// import ThemeToggle from "./ThemeToggle";

// export default function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check login status on load and when storage changes
//   useEffect(() => {
//     const token = localStorage.getItem("access");
//     setIsLoggedIn(!!token);

//     // Listen for changes in localStorage (e.g., logout in another tab)
//     const handleStorageChange = () => {
//       const token = localStorage.getItem("access");
//       setIsLoggedIn(!!token);
//     };
//     window.addEventListener("storage", handleStorageChange);

//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     setIsLoggedIn(false);
//     window.location.href = "/";
//   };

//   return (
//     <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto mt-2 w-[95%] px-6 py-3 flex justify-between items-center animate-fadeIn bg-white/70 backdrop-blur-md shadow-md z-50">
//       <Link href="/" className="text-xl font-semibold tracking-tight">
//         Civil Service Review
//       </Link>

//       <div className="space-x-4 flex items-center">
//         {isLoggedIn ? (
//           <>
//             <Link
//               href="/"
//               className="hover:text-[var(--accent)] transition font-medium"
//             >
//               Home
//             </Link>
//             <Link
//               href="/about"
//               className="hover:text-[var(--accent)] transition font-medium"
//             >
//               About
//             </Link>
//             <button onClick={handleLogout} className="btn-primary text-sm">
//               Logout
//             </button>
//             <ThemeToggle />
//           </>
//         ) : (
//           <>
//             <Link
//               href="/login"
//               className="btn-primary text-sm shadow-sm hover:shadow-md"
//             >
//               Login
//             </Link>
//             <Link
//               href="/register"
//               className="btn-primary text-sm shadow-sm hover:shadow-md"
//             >
//               Sign Up
//             </Link>
//             <ThemeToggle />
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import ThemeToggle from "./ThemeToggle";
// import { tokenService } from "app/lib/auth";

// export default function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // ✅ Check token validity on mount
//     const checkLoginStatus = () => {
//       const token = tokenService.get();
//       setIsLoggedIn(!!token && !tokenService.expired());
//     };

//     checkLoginStatus();

//     // ✅ Listen for token changes in other tabs or windows
//     const handleStorageChange = () => checkLoginStatus();
//     window.addEventListener("storage", handleStorageChange);

//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLogout = () => {
//     tokenService.clear(); // centralized logout
//     setIsLoggedIn(false);
//     router.push("/login");
//   };

//   return (
//     <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto mt-2 w-[95%] px-6 py-3 flex justify-between items-center bg-white/70 backdrop-blur-md shadow-md animate-fadeIn">
//       <Link href="/" className="text-xl font-semibold tracking-tight">
//         Civil Service Review
//       </Link>

//       <div className="space-x-4 flex items-center">
//         {isLoggedIn ? (
//           <>
//             <Link
//               href="/"
//               className="hover:text-[var(--accent)] transition font-medium"
//             >
//               Home
//             </Link>
//             <Link
//               href="/profile"
//               className="hover:text-[var(--accent)] transition font-medium"
//             >
//               Profile
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="btn-primary text-sm bg-red-500 hover:bg-red-600"
//             >
//               Logout
//             </button>
//             <ThemeToggle />
//           </>
//         ) : (
//           <>
//             <Link
//               href="/login"
//               className="btn-primary text-sm shadow-sm hover:shadow-md"
//             >
//               Login
//             </Link>
//             <Link
//               href="/register"
//               className="btn-primary text-sm shadow-sm hover:shadow-md"
//             >
//               Sign Up
//             </Link>
//             <ThemeToggle />
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { tokenService } from "app/lib/auth";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();

  // NextAuth session (Google login)
  const { data: session } = useSession();

  // Your custom JWT login
  const [localLoggedIn, setLocalLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = tokenService.get();
      setLocalLoggedIn(!!token && !tokenService.expired());
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // 🔥 Final login state = Google login OR local login
  const isLoggedIn = session?.user || localLoggedIn;

  const handleLogout = () => {
    // Logout both systems
    tokenService.clear();
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto mt-2 w-[95%] px-6 py-3 flex justify-between items-center bg-white/70 backdrop-blur-md shadow-md animate-fadeIn">
      <Link href="/" className="text-xl font-semibold tracking-tight">
        Civil Service Review
      </Link>

      <div className="space-x-4 flex items-center">
        {isLoggedIn ? (
          <>
            <Link
              href="/"
              className="hover:text-[var(--accent)] transition font-medium"
            >
              Home
            </Link>

            <Link
              href="/profile"
              className="hover:text-[var(--accent)] transition font-medium"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="btn-primary text-sm bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>

            <ThemeToggle />
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="btn-primary text-sm shadow-sm hover:shadow-md"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </nav>
  );
}
