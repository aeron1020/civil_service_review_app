import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import ThemeProviderWrapper from "../components/ThemeProviderWrapper";
import Footer from "@/components/Footer";
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
  title: "CSE Review App",
  description: "Take quizzes and practice for the Civil Service Exam",
};

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         <script
//           src="https://accounts.google.com/gsi/client"
//           async
//           defer
//         ></script>
//       </head>

//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300`}
//       >
//         <AuthProvider>
//           <ThemeProviderWrapper>
//             <GoogleProvider />
//             <Navbar />
//             <main className="min-h-screen">{children}</main>
//             <Footer />
//           </ThemeProviderWrapper>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>

      <body className="...">
        <AuthProvider>
          <ThemeProviderWrapper>
            <GoogleProvider />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
