"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm text-gray-600 dark:text-gray-300">
        {/* About */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Civil Service Review
          </h3>
          <p className="leading-relaxed text-gray-500 dark:text-gray-400">
            Your smart companion for Civil Service Exam success. Practice with
            curated quizzes across all subjects — Numerical, Verbal, General
            Info, and Clerical Ability.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              { href: "/", label: "Home" },
              { href: "/profile", label: "My Profile" },
              { href: "/quizzes", label: "Quizzes" },
              { href: "/results", label: "Results" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-[var(--accent)] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Contact
          </h3>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400">
            <li>
              <a
                href="mailto:support@civilserviceapp.ph"
                className="hover:text-[var(--accent)]"
              >
                support@civilserviceapp.ph
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[var(--accent)]">
                Civil Service Review PH
              </a>
            </li>
            <li>Developer: Olsen Aeron Paduit</li>
            <li className="text-xs text-gray-400 dark:text-gray-500">
              Version v1.0.0
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-100 dark:border-gray-800 text-center py-6 text-xs text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} Civil Service Review. All rights reserved.
        <br />
        <span className="text-[11px] opacity-70">
          Built with ❤️ using Django & Next.js
        </span>
      </div>
    </footer>
  );
}
