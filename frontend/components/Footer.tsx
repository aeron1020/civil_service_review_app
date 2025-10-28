"use client";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-16">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Civil Service Review App
          </h3>
          <p className="text-sm text-blue-100 leading-relaxed">
            Your smart companion for passing the Civil Service Exam. Practice
            with curated quizzes across all subjects — from Numerical to Verbal,
            General Information, and Clerical Ability.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-300 transition">
                🏠 Home
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-blue-300 transition">
                👤 My Profile
              </a>
            </li>
            <li>
              <a href="/quizzes" className="hover:text-blue-300 transition">
                🧩 Quizzes
              </a>
            </li>
            <li>
              <a href="/results" className="hover:text-blue-300 transition">
                📊 Results
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-300 transition">
                ℹ️ About
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact & Support</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>
              Email:{" "}
              <a
                href="mailto:support@civilserviceapp.ph"
                className="hover:text-blue-300"
              >
                support@civilserviceapp.ph
              </a>
            </li>
            <li>
              Facebook:{" "}
              <a href="#" className="hover:text-blue-300">
                Civil Service Review PH
              </a>
            </li>
            <li>
              Developer: <span className="font-medium">Olsen Aeron Paduit</span>
            </li>
            <li>
              Version: <span className="text-blue-300">v1.0.0</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-950 text-center py-3 text-xs text-blue-200 border-t border-blue-800">
        © {new Date().getFullYear()} Civil Service Review App. All rights
        reserved.
        <br />
        <span className="text-[11px] opacity-80">
          Built with ❤️ using Django & Next.js
        </span>
      </div>
    </footer>
  );
}
