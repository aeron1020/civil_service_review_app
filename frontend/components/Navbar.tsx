// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("access");
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     setIsLoggedIn(false);
//     window.location.href = "/";
//   };

//   return (
//     <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto mt-2 w-[95%] px-6 py-3 flex justify-between items-center">
//       <Link href="/" className="text-xl font-semibold">
//         Civil Service Review
//       </Link>

//       <div className="space-x-4 flex items-center">
//         <Link href="/" className="hover:text-[var(--accent)] transition">
//           Home
//         </Link>
//         <Link href="/about" className="hover:text-[var(--accent)] transition">
//           About
//         </Link>

//         {isLoggedIn ? (
//           <button onClick={handleLogout} className="btn-primary text-sm">
//             Logout
//           </button>
//         ) : (
//           <Link href="/login" className="btn-primary text-sm">
//             Login
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on load and when storage changes
  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);

    // Listen for changes in localStorage (e.g., logout in another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem("access");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto mt-2 w-[95%] px-6 py-3 flex justify-between items-center animate-fadeIn bg-white/70 backdrop-blur-md shadow-md z-50">
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
              href="/about"
              className="hover:text-[var(--accent)] transition font-medium"
            >
              About
            </Link>
            <button onClick={handleLogout} className="btn-primary text-sm">
              Logout
            </button>
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
          </>
        )}
      </div>
    </nav>
  );
}
