// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import ThemeToggle from "./ThemeToggle";
// import { Menu, X } from "lucide-react";
// import { useAuth } from "./AuthContext";

// export default function Navbar() {
//   const { user, loading, logout } = useAuth(); // ✅ Get auth state from context
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const isLoggedIn = !!user;

//   // Show placeholder while loading auth state
//   if (loading)
//     return (
//       <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto w-[95%] mt-2 px-6 py-3 flex justify-between items-center bg-white/70 dark:bg-black/60 backdrop-blur-md shadow-md border border-white/30 rounded-xl">
//         <span className="text-xl font-semibold">Civil Service Review</span>
//         <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
//       </nav>
//     );

//   return (
//     <>
//       {/* Navbar */}
//       <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto w-[95%] mt-2 px-6 py-3 flex justify-between items-center bg-white/70 dark:bg-black/60 backdrop-blur-md shadow-md border border-white/30 rounded-xl animate-fadeIn">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="text-xl font-semibold tracking-tight whitespace-nowrap"
//         >
//           Civil Service Review
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center space-x-4">
//           {isLoggedIn ? (
//             <>
//               <Link
//                 href="/"
//                 className="hover:text-[var(--accent)] transition font-medium"
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/profile"
//                 className="hover:text-[var(--accent)] transition font-medium"
//               >
//                 Profile
//               </Link>
//               <button
//                 onClick={logout}
//                 className="btn-primary text-sm bg-red-500 hover:bg-red-600"
//               >
//                 Logout
//               </button>
//               <ThemeToggle />
//             </>
//           ) : (
//             <>
//               <Link
//                 href="/login"
//                 className="btn-primary text-sm shadow-sm hover:shadow-md"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/register"
//                 className="btn-primary text-sm shadow-sm hover:shadow-md"
//               >
//                 Sign Up
//               </Link>
//               <ThemeToggle />
//             </>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </nav>

//       {/* Mobile Dropdown */}
//       {mobileOpen && (
//         <div className="md:hidden mt-24 glass-card w-[90%] mx-auto rounded-2xl p-4 border border-white/20 animate-fadeIn space-y-3">
//           {isLoggedIn ? (
//             <>
//               <Link
//                 href="/"
//                 onClick={() => setMobileOpen(false)}
//                 className="block py-2 font-medium hover:text-[var(--accent)]"
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/profile"
//                 onClick={() => setMobileOpen(false)}
//                 className="block py-2 font-medium hover:text-[var(--accent)]"
//               >
//                 Profile
//               </Link>
//               <button
//                 onClick={() => {
//                   logout();
//                   setMobileOpen(false);
//                 }}
//                 className="btn-primary text-sm bg-red-500 hover:bg-red-600 w-full text-left"
//               >
//                 Logout
//               </button>
//               <ThemeToggle />
//             </>
//           ) : (
//             <>
//               <Link
//                 href="/login"
//                 onClick={() => setMobileOpen(false)}
//                 className="block py-2 font-medium hover:text-[var(--accent)]"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/register"
//                 onClick={() => setMobileOpen(false)}
//                 className="block py-2 font-medium hover:text-[var(--accent)]"
//               >
//                 Sign Up
//               </Link>
//               <ThemeToggle />
//             </>
//           )}
//         </div>
//       )}

//       {/* Spacer */}
//       <div className="h-[90px]" />
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!user;

  if (loading)
    return (
      <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto w-[95%] mt-2 px-6 py-3 flex justify-between items-center bg-white/70 dark:bg-black/60 backdrop-blur-md shadow-md border border-white/30 rounded-xl">
        <span className="text-xl font-semibold">Civil Service Review</span>
        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
      </nav>
    );

  return (
    <>
      <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto w-[95%] mt-2 px-6 py-3 flex justify-between items-center bg-white/70 dark:bg-black/60 backdrop-blur-md shadow-md border border-white/30 rounded-xl animate-fadeIn">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight whitespace-nowrap"
        >
          Civil Service Review
        </Link>

        <div className="hidden md:flex items-center space-x-4">
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
                onClick={logout}
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

        <button
          className="md:hidden p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden mt-24 glass-card w-[90%] mx-auto rounded-2xl p-4 border border-white/20 animate-fadeIn space-y-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium hover:text-[var(--accent)]"
              >
                Home
              </Link>

              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium hover:text-[var(--accent)]"
              >
                Profile
              </Link>

              <button
                onClick={logout}
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
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium hover:text-[var(--accent)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-medium hover:text-[var(--accent)]"
              >
                Sign Up
              </Link>

              <ThemeToggle />
            </>
          )}
        </div>
      )}

      <div className="h-[90px]" />
    </>
  );
}
