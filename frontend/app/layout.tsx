// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "../components/Navbar";
// import ThemeProviderWrapper from "../components/ThemeProviderWrapper";
// import Footer from "@/components/Footer";
// import GoogleProvider from "@/components/GoogleProvider";
// import { AuthProvider } from "components/AuthContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Civil Service Review | 3D Interactive Prep",
//   description:
//     "Master the Civil Service Exam with tactile, 3D interactive quizzes.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         {/* Keeping Google GSI as requested */}
//         <script
//           src="https://accounts.google.com/gsi/client"
//           async
//           defer
//         ></script>
//       </head>

//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-blue-500/30`}
//       >
//         <AuthProvider>
//           <ThemeProviderWrapper>
//             {/* 🌈 3D MESH BACKGROUND - This makes glassmorphism look real */}
//             <div className="mesh-bg" aria-hidden="true" />

//             <GoogleProvider />

//             {/* Navbar is fixed, so it doesn't need to be inside <main> */}
//             <Navbar />

//             {/* The 'pt-12' ensures content starts below the floating nav,
//                and animate-fadeIn gives it that premium Apple entry.
//             */}
//             <main className="relative min-h-screen pt-12 animate-fadeIn px-4 sm:px-6 lg:px-8">
//               <div className="max-w-7xl mx-auto">{children}</div>
//             </main>

//             <Footer />
//           </ThemeProviderWrapper>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import CSRFInit from "@/components/CSRFInit";
import ThemeProviderWrapper from "../components/ThemeProviderWrapper";
import GoogleProvider from "@/components/GoogleProvider";
import { AuthProvider } from "components/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Civil Service Review | 3D Interactive Prep",
  description:
    "Master the Civil Service Exam with tactile, 3D interactive quizzes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Identity Services */}
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>

      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-[var(--background)]
          text-[var(--foreground)]
          selection:bg-[var(--accent)]/25
        `}
      >
        <AuthProvider>
          <CSRFInit />
          <ThemeProviderWrapper>
            {/* 🌈 Mesh background — required for glass depth */}
            <div className="mesh-bg" aria-hidden="true" />

            <GoogleProvider />

            {/* Floating glass navbar */}
            <Navbar />

            {/* 
              Main content shell
              - pt-16 aligns with floating nav height
              - relative enables glass layering
              - perspective enhances 3D hover effects
            */}
            <main className="relative min-h-screen pt-16 perspective-1000">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>

            <Footer />
          </ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
