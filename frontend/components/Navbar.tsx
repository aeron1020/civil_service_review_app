// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if a token exists in localStorage
//     const token = localStorage.getItem("access");
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     setIsLoggedIn(false);
//     window.location.href = "/"; // redirect to home after logout
//   };

//   return (
//     <nav className="bg-emerald-600 text-white px-6 py-3 flex justify-between items-center">
//       <Link href="/" className="text-xl font-semibold">
//         Civil Service Review
//       </Link>

//       <div className="space-x-4">
//         <Link href="/quizzes" className="hover:underline">
//           Quizzes
//         </Link>
//         <Link href="/about" className="hover:underline">
//           About
//         </Link>

//         {isLoggedIn ? (
//           <button
//             onClick={handleLogout}
//             className="bg-white text-emerald-600 px-3 py-1 rounded hover:bg-gray-100"
//           >
//             Logout
//           </button>
//         ) : (
//           <Link
//             href="/login"
//             className="bg-white text-emerald-600 px-3 py-1 rounded hover:bg-gray-100"
//           >
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

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 mx-auto mt-2 w-[95%] px-6 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-semibold">
        Civil Service Review
      </Link>

      <div className="space-x-4 flex items-center">
        <Link href="/quizzes" className="hover:text-[var(--accent)] transition">
          Quizzes
        </Link>
        <Link href="/about" className="hover:text-[var(--accent)] transition">
          About
        </Link>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn-primary text-sm">
            Logout
          </button>
        ) : (
          <Link href="/login" className="btn-primary text-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
