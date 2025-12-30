// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import ThemeToggle from "./ThemeToggle";
// import { Menu, X, Home, User, LogOut, ArrowRight } from "lucide-react";
// import { useAuth } from "./AuthContext";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Navbar() {
//   const { user, loading, logout } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const isLoggedIn = !!user;

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -30, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-6xl px-5 py-2.5
//           flex justify-between items-center transition-all duration-500
//           ${scrolled ? "glass-card scale-[0.98] top-4" : "glass-card"}
//         `}
//         style={{
//           backdropFilter: "blur(20px) saturate(180%)",
//           WebkitBackdropFilter: "blur(20px) saturate(180%)",
//         }}
//       >
//         <Link
//           href="/"
//           className="text-xl font-extrabold tracking-tighter hover:scale-105 transition-transform"
//           style={{ color: "var(--foreground)" }}
//         >
//           Civil Service Review
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-2">
//           {isLoggedIn ? (
//             <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
//               <NavLink href="/" icon={<Home size={16} />} label="Home" />
//               <NavLink
//                 href="/profile"
//                 icon={<User size={16} />}
//                 label="Profile"
//               />

//               <div className="w-[1px] h-6 bg-current opacity-10 mx-2" />

//               <button
//                 onClick={logout}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-all active:translate-y-0.5"
//               >
//                 <LogOut size={16} />
//                 <span>Logout</span>
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-6">
//               <Link
//                 href="/login"
//                 className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/register"
//                 className="btn-primary text-sm py-2 px-6 flex items-center gap-2"
//               >
//                 Join Now <ArrowRight size={14} />
//               </Link>
//             </div>
//           )}

//           <div className="ml-2 pl-3 border-l border-white/10">
//             <ThemeToggle />
//           </div>
//         </div>

//         {/* Mobile Toggle */}
//         <button
//           className="md:hidden p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 shadow-sm active:scale-90 transition-all"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </motion.nav>

//       {/* Mobile Menu Overlay */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <>
//             <motion.div
//               key="backdrop"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setMobileOpen(false)}
//               className="fixed inset-0 bg-black/20 backdrop-blur-md z-[110] md:hidden"
//             />
//             <motion.div
//               key="menu"
//               initial={{ opacity: 0, scale: 0.95, y: 10 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 10 }}
//               className="glass-card fixed top-24 left-1/2 -translate-x-1/2 z-[120] w-[92%] p-6 flex flex-col gap-4 md:hidden border-white/30 shadow-2xl"
//             >
//               {isLoggedIn ? (
//                 <>
//                   <MobileNavLink
//                     href="/"
//                     label="Home"
//                     onClick={() => setMobileOpen(false)}
//                   />
//                   <MobileNavLink
//                     href="/profile"
//                     label="Profile"
//                     onClick={() => setMobileOpen(false)}
//                   />
//                   <div className="pt-2 flex items-center justify-between px-4">
//                     <span className="text-sm font-bold opacity-50 uppercase tracking-widest">
//                       Theme
//                     </span>
//                     <ThemeToggle />
//                   </div>
//                   <button
//                     onClick={() => {
//                       logout();
//                       setMobileOpen(false);
//                     }}
//                     className="w-full mt-2 flex items-center justify-center gap-2 p-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg"
//                   >
//                     <LogOut size={18} /> Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <MobileNavLink
//                     href="/login"
//                     label="Login"
//                     onClick={() => setMobileOpen(false)}
//                   />
//                   <MobileNavLink
//                     href="/register"
//                     label="Sign Up"
//                     onClick={() => setMobileOpen(false)}
//                   />
//                   <div className="pt-2">
//                     <ThemeToggle />
//                   </div>
//                 </>
//               )}
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       <div className="h-28" />
//     </>
//   );
// }

// /* --- HELPER COMPONENTS --- */

// function NavLink({
//   href,
//   icon,
//   label,
// }: {
//   href: string;
//   icon: React.ReactNode;
//   label: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/50 dark:hover:bg-white/10 transition-all active:scale-95"
//     >
//       {icon}
//       {label}
//     </Link>
//   );
// }

// function MobileNavLink({
//   href,
//   label,
//   onClick,
// }: {
//   href: string;
//   label: string;
//   onClick: () => void;
// }) {
//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className="text-xl font-bold p-5 bg-black/5 dark:bg-white/5 rounded-2xl flex justify-between items-center group active:scale-[0.98] transition-all"
//     >
//       {label}
//       <ArrowRight className="opacity-40 group-hover:opacity-100 transition-opacity" />
//     </Link>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import ThemeToggle from "./ThemeToggle";
// import {
//   Menu,
//   X,
//   Home,
//   User,
//   LogOut,
//   ArrowRight,
//   LogIn,
//   UserPlus,
// } from "lucide-react";
// import { useAuth } from "./AuthContext";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleAuthNavigation = (
//     e: React.MouseEvent<HTMLAnchorElement>,
//     href: string
//   ) => {
//     e.preventDefault();
//     window.location.href = href;
//   };

//   const isLoggedIn = !!user;

//   return (
//     <>
//       {/* 1. FIXED WRAPPER */}
//       <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pt-6">
//         <motion.nav
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className={`
//             pointer-events-auto
//             w-[92%] max-w-6xl px-5 py-2.5
//             flex justify-between items-center
//             transition-all duration-500 rounded-[2rem]
//             ${
//               scrolled
//                 ? "glass-card-3d scale-[0.98] shadow-2xl"
//                 : "glass-card-3d"
//             }
//           `}
//         >
//           <Link
//             href="/"
//             className="text-xl font-black tracking-tighter hover:scale-105 transition-transform italic pl-2"
//           >
//             CIVIL<span className="text-[var(--accent)]">SERVICE</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-2">
//             <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
//               {isLoggedIn ? (
//                 <>
//                   <NavLink href="/" icon={<Home size={16} />} label="Home" />
//                   <NavLink
//                     href="/profile"
//                     icon={<User size={16} />}
//                     label="Profile"
//                   />
//                   <div className="w-[1px] h-6 bg-current opacity-10 mx-2" />
//                   <button
//                     onClick={logout}
//                     className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all active:translate-y-0.5"
//                   >
//                     <LogOut size={14} />
//                     <span>Logout</span>
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     href="/login"
//                     onClick={(e) => handleAuthNavigation(e, "/login")}
//                     className="flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:bg-white/10 transition-all"
//                   >
//                     <LogIn size={14} />
//                     Login
//                   </Link>
//                   <Link
//                     href="/register"
//                     onClick={(e) => handleAuthNavigation(e, "/register")}
//                     className="flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 hover:scale-[1.05] active:translate-y-0.5 transition-all"
//                   >
//                     <UserPlus size={14} />
//                     Join Now
//                   </Link>
//                 </>
//               )}
//             </div>

//             <div className="ml-2 pl-3 border-l border-white/10">
//               <ThemeToggle />
//             </div>
//           </div>

//           {/* Mobile Toggle */}
//           <button
//             className="md:hidden p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 shadow-sm active:scale-90 transition-all"
//             onClick={() => setMobileOpen(!mobileOpen)}
//           >
//             {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//           </button>
//         </motion.nav>
//       </div>
//       {/* 2. MOBILE MENU */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <>
//             <motion.div
//               key="backdrop"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setMobileOpen(false)}
//               className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-md z-[110] md:hidden"
//             />
//             <motion.div
//               key="menu"
//               /* CENTERED 3D ANIMATION FIX */
//               initial={{
//                 x: "-50%",
//                 y: -20,
//                 opacity: 0,
//                 rotateX: -15,
//                 scale: 0.95,
//               }}
//               animate={{ x: "-50%", y: 0, opacity: 1, rotateX: 0, scale: 1 }}
//               exit={{ x: "-50%", y: 20, opacity: 0, rotateX: 15, scale: 0.95 }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="glass-card-3d fixed top-24 left-1/2 z-[120] w-[92%] p-6 flex flex-col gap-3 md:hidden"
//               style={{ perspective: "1000px" }}
//             >
//               {isLoggedIn ? (
//                 <>
//                   <MobileNavLink
//                     href="/"
//                     label="Home"
//                     onClick={() => setMobileOpen(false)}
//                   />
//                   <MobileNavLink
//                     href="/profile"
//                     label="Profile"
//                     onClick={() => setMobileOpen(false)}
//                   />
//                   <button
//                     onClick={() => {
//                       logout();
//                       setMobileOpen(false);
//                     }}
//                     className="w-full mt-2 flex items-center justify-center gap-2 p-5 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs shadow-inner transition-transform active:scale-95"
//                   >
//                     <LogOut size={18} /> Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <MobileNavLink
//                     href="/login"
//                     label="Login"
//                     onClick={(e) => {
//                       handleAuthNavigation(e, "/login");
//                       setMobileOpen(false);
//                     }}
//                   />
//                   <MobileNavLink
//                     href="/register"
//                     label="Create Account"
//                     onClick={(e) => {
//                       handleAuthNavigation(e, "/register");
//                       setMobileOpen(false);
//                     }}
//                   />
//                 </>
//               )}
//               <div className="flex items-center justify-between px-4 mt-2 border-t border-white/10 pt-4">
//                 <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
//                   Appearance
//                 </span>
//                 <ThemeToggle />
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//       <div className="h-28" />
//     </>
//   );
// }

// /* --- HELPERS --- */
// function NavLink({
//   href,
//   icon,
//   label,
// }: {
//   href: string;
//   icon: React.ReactNode;
//   label: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/50 dark:hover:bg-white/10 transition-all active:scale-95"
//     >
//       {icon}
//       {label}
//     </Link>
//   );
// }

// function MobileNavLink({
//   href,
//   label,
//   onClick,
// }: {
//   href: string;
//   label: string;
//   onClick: (e: any) => void;
// }) {
//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className="text-sm font-black uppercase tracking-widest p-5 bg-black/5 dark:bg-white/5 rounded-2xl flex justify-between items-center group active:scale-[0.98] transition-all border border-white/5 shadow-sm"
//     >
//       {label}
//       <ArrowRight
//         size={16}
//         className="opacity-20 group-hover:translate-x-1 transition-transform"
//       />
//     </Link>
//   );
// }

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import {
  Menu,
  X,
  Home,
  User,
  LogOut,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ---------------- SCROLL DETECTION ---------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- BODY SCROLL LOCK (CRITICAL FIX) ---------------- */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleAuthNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    window.location.href = href;
  };

  const isLoggedIn = !!user;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pt-6">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            pointer-events-auto
            w-[92%] max-w-6xl px-5 py-2.5 
            flex justify-between items-center 
            transition-all duration-500 rounded-[2rem]
            ${
              scrolled
                ? "glass-card-3d scale-[0.98] shadow-2xl"
                : "glass-card-3d"
            }
          `}
        >
          <Link
            href="/"
            className="text-xl font-black tracking-tighter italic pl-2"
          >
            CIVIL<span className="text-[var(--accent)]">SERVICE</span>
          </Link>

          {/* -------- DESKTOP -------- */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
              {isLoggedIn ? (
                <>
                  <NavLink href="/" icon={<Home size={16} />} label="Home" />
                  <NavLink
                    href="/profile"
                    icon={<User size={16} />}
                    label="Profile"
                  />
                  <div className="w-[1px] h-6 bg-current opacity-10 mx-2" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={(e) => handleAuthNavigation(e, "/login")}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100"
                  >
                    <LogIn size={14} />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={(e) => handleAuthNavigation(e, "/register")}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[var(--accent)] text-white"
                  >
                    <UserPlus size={14} />
                    Join Now
                  </Link>
                </>
              )}
            </div>

            <div className="ml-2 pl-3 border-l border-white/10">
              <ThemeToggle />
            </div>
          </div>

          {/* -------- MOBILE TOGGLE -------- */}
          <button
            className="md:hidden p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.nav>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* FULL PAGE OVERLAY */}
            <motion.div
              key="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-md md:hidden"
            />

            {/* SLIDE-IN PANEL */}
            <motion.aside
              key="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed inset-0 z-[130] md:hidden flex flex-col bg-[var(--background)] text-[var(--foreground)]"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <span className="text-lg font-black tracking-tight">
                  CIVIL<span className="text-[var(--accent)]">SERVICE</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl bg-black/10 dark:bg-white/10"
                >
                  <X size={22} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto">
                {isLoggedIn ? (
                  <>
                    <MobileNavLink
                      href="/"
                      label="Home"
                      onClick={() => setMobileOpen(false)}
                    />
                    <MobileNavLink
                      href="/profile"
                      label="Profile"
                      onClick={() => setMobileOpen(false)}
                    />
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="mt-4 p-5 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink
                      href="/login"
                      label="Login"
                      onClick={(e) => {
                        handleAuthNavigation(e, "/login");
                        setMobileOpen(false);
                      }}
                    />
                    <MobileNavLink
                      href="/register"
                      label="Create Account"
                      onClick={(e) => {
                        handleAuthNavigation(e, "/register");
                        setMobileOpen(false);
                      }}
                    />
                  </>
                )}
              </div>

              {/* FOOTER */}
              <div className="p-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Appearance
                </span>
                <ThemeToggle />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="h-28" />
    </>
  );
}

/* ================= HELPERS ================= */

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: (e: any) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 font-black uppercase tracking-widest flex justify-between items-center"
    >
      {label}
      <ArrowRight size={16} className="opacity-30" />
    </Link>
  );
}
