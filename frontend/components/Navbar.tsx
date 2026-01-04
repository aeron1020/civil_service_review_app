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
  Newspaper,
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
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pt-2">
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
            FREE CSE <span className="text-[var(--accent)]">REVIEWER</span>
          </Link>

          {/* -------- DESKTOP -------- */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
              {isLoggedIn ? (
                <>
                  <NavLink href="/" icon={<Home size={16} />} label="Home" />
                  <NavLink
                    href="/news"
                    icon={<Newspaper size={16} />}
                    label="News"
                  />
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
                  <NavLink
                    href="/news"
                    icon={<Newspaper size={16} />}
                    label="News"
                  />
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
                      href="/news"
                      label="News"
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
                      href="/news"
                      label="News"
                      onClick={() => setMobileOpen(false)}
                    />
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
