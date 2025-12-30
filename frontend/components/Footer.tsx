// "use client";

// import Link from "next/link";
// import { Mail, Globe, Cpu, ArrowUpRight } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="w-full mt-32 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
//       <div className="max-w-6xl mx-auto px-8 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
//           {/* Brand Section */}
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-xl font-black tracking-tighter italic uppercase">
//                 CIVIL<span className="text-[var(--accent)]">SERVICE</span>
//               </h3>
//               <p className="text-[10px] font-black opacity-30 tracking-[0.2em] uppercase mt-1">
//                 Examination Portal
//               </p>
//             </div>
//             <p className="text-sm font-medium leading-relaxed opacity-50 max-w-xs">
//               A specialized platform designed to help Filipinos master the Civil
//               Service Exam through data-driven practice and analytics.
//             </p>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//               <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
//                 System Operational
//               </span>
//             </div>
//           </div>

//           {/* Navigation - Only Active Links */}
//           <div>
//             <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 mb-8">
//               Navigation
//             </h3>
//             <ul className="space-y-4">
//               {[
//                 { href: "/", label: "Home" },
//                 { href: "/profile", label: "Dashboard" },
//                 { href: "/login", label: "Login Portal" },
//               ].map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="text-sm font-bold opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all flex items-center gap-2 group"
//                   >
//                     {link.label}
//                     <ArrowUpRight
//                       size={14}
//                       className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
//                     />
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Connection Section */}
//           <div>
//             <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 mb-8">
//               Support & Dev
//             </h3>
//             <ul className="space-y-4">
//               <li className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-white/5">
//                   <Mail size={14} className="opacity-40" />
//                 </div>
//                 <a
//                   href="mailto:support@civilserviceapp.ph"
//                   className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity"
//                 >
//                   Contact Support
//                 </a>
//               </li>
//               <li className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-white/5">
//                   <Cpu size={14} className="opacity-40" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black uppercase tracking-tighter opacity-30">
//                     Developed by
//                   </p>
//                   <p className="text-sm font-bold opacity-60">OASP</p>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="mt-20 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
//           <p className="text-[10px] font-black opacity-20 uppercase tracking-widest">
//             © {new Date().getFullYear()} Civil Service Review. Philippine Civil
//             Service Commission is not affiliated.
//           </p>
//           <div className="flex gap-6">
//             <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">
//               v1.0.0 Stable
//             </span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
"use client";

import Link from "next/link";
import { Mail, Cpu, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Force reload navigation for auth clean state
  const handleAuthNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <footer className="w-full mt-32 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black tracking-tighter italic uppercase">
                CIVIL<span className="text-[var(--accent)]">SERVICE</span>
              </h3>
              <p className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase mt-1">
                2025 Examination Portal
              </p>
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-40 max-w-xs">
              A specialized platform designed to help Filipinos master the Civil
              Service Exam through data-driven practice and premium analytics.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/70">
                System Operational
              </span>
            </div>
          </div>

          {/* Navigation - Conditional Logic */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 mb-8">
              Navigation
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="group flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all"
                >
                  Home{" "}
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                  />
                </Link>
              </li>

              {isLoggedIn ? (
                <li>
                  <Link
                    href="/profile"
                    className="group flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all"
                  >
                    Dashboard{" "}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                    />
                  </Link>
                </li>
              ) : (
                <li>
                  <a
                    href="/login"
                    onClick={(e) => handleAuthNavigation(e, "/login")}
                    className="group flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all"
                  >
                    Login Portal{" "}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                    />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Connection Section */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 mb-8">
              Support & Dev
            </h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-white/5 shadow-inner group-hover:border-[var(--accent)]/30 transition-colors">
                  <Mail
                    size={16}
                    className="opacity-40 group-hover:text-[var(--accent)] group-hover:opacity-100 transition-all"
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-30">
                    Get in touch
                  </p>
                  <a
                    href="mailto:support@civilserviceapp.ph"
                    className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity"
                  >
                    Support Desk
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                  <Cpu size={16} className="opacity-40" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-30">
                    Developed by
                  </p>
                  <p className="text-sm font-bold opacity-70">OASP</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Tactile & Minimal */}
        <div className="mt-24 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <ShieldCheck size={16} className="opacity-20" />
            <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.15em] text-center md:text-left">
              © {new Date().getFullYear()} Civil Service Review. Philippine CSC
              is not affiliated.
            </p>
          </div>
          <div className="flex items-center gap-4 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-white/5">
            <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">
              v1.0.0 Stable Build
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
