// "use client";

// import { useEffect, useState, useMemo } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import RandomQuizCard from "@/components/RandomQuizCard";
// import {
//   BookOpen,
//   ChevronRight,
//   Sparkles,
//   Layers,
//   CheckCircle,
//   Clock,
// } from "lucide-react";
// import ExamScope from "@/components/ExamScope";

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// type Quiz = {
//   id: number;
//   title: string;
//   description: string;
//   quiz_type: string;
//   quiz_type_display?: string;
//   is_random: boolean;
//   questions?: number[];
// };

// export default function HomePage() {
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedType, setSelectedType] = useState<string>("");

//   useEffect(() => {
//     async function fetchAllQuizzes(
//       url = `${API_BASE_URL}/quizzes/`,
//       all: Quiz[] = []
//     ): Promise<Quiz[]> {
//       try {
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`Error ${response.status}`);
//         const data = await response.json();
//         const combined = [...all, ...(data.results || data)];
//         if (data.next) return fetchAllQuizzes(data.next, combined);
//         return combined;
//       } catch (error) {
//         return all;
//       }
//     }

//     fetchAllQuizzes()
//       .then((allQuizzes) => {
//         const normalQuizzes = allQuizzes.filter((q) => !q.is_random);
//         setQuizzes(normalQuizzes);
//         if (normalQuizzes.length > 0) {
//           setSelectedType(
//             normalQuizzes[0].quiz_type_display ||
//               normalQuizzes[0].quiz_type ||
//               "Other"
//           );
//         }
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const grouped = useMemo(() => {
//     return quizzes.reduce((acc: Record<string, Quiz[]>, quiz) => {
//       const type = quiz.quiz_type_display || quiz.quiz_type || "Other";
//       if (!acc[type]) acc[type] = [];
//       acc[type].push(quiz);
//       return acc;
//     }, {});
//   }, [quizzes]);

//   const quizTypes = Object.keys(grouped);

//   const typeIcons: Record<string, any> = {
//     "Numerical Ability": <Layers size={18} />,
//     "Verbal Ability": <BookOpen size={18} />,
//     "Analytical Ability": <Sparkles size={18} />,
//     "Clerical Ability": <Clock size={18} />,
//     "General Information": <CheckCircle size={18} />,
//   };

//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,113,227,0.2)]"
//         />
//         <p className="mt-6 opacity-40 font-bold tracking-[0.2em] text-[10px] uppercase animate-pulse">
//           Syncing Review Modules...
//         </p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen pb-20 overflow-x-hidden">
//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-8 pb-12 px-6">
//         <div className="max-w-4xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 backdrop-blur-md shadow-sm text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] mb-6"
//           >
//             <Sparkles size={12} className="animate-pulse" /> Civil Service
//             Portal
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tighter"
//           >
//             Master the Exam <br />
//             <span className="text-gradient">with Precision.</span>
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="text-base md:text-lg opacity-60 max-w-2xl mx-auto leading-relaxed font-medium"
//           >
//             High-fidelity review modules designed to replicate the logic and
//             intensity of the actual Civil Service Exam.
//           </motion.p>
//         </div>
//       </section>

//       {/* --- CATEGORY TABS (Floating Tactile Switch) --- */}
//       <div className="sticky top-20 z-30 py-4 mb-10">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           {/* 1. Recognition Header: Tells the user what this bar does */}
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-4"
//           >
//             Select Study Dimension
//           </motion.p>

//           <div className="flex flex-wrap justify-center gap-2.5 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 backdrop-blur-2xl border border-white/10 shadow-inner">
//             {quizTypes.map((type) => {
//               const isActive = selectedType === type;

//               return (
//                 <button
//                   key={type}
//                   onClick={() => setSelectedType(type)}
//                   className={`relative flex flex-col items-center min-w-[110px] gap-1 px-4 py-3 rounded-xl transition-all duration-300 group
//               ${
//                 isActive
//                   ? "bg-white dark:bg-[var(--accent)] shadow-2xl scale-[1.05] -translate-y-1"
//                   : "hover:bg-white/40 dark:hover:bg-white/5 opacity-50 hover:opacity-100"
//               }`}
//                 >
//                   {/* 2. Visual Recognition: Large Icon + Active Glow */}
//                   <div
//                     className={`transition-transform duration-300 ${
//                       isActive ? "scale-110" : "group-hover:scale-110"
//                     }`}
//                   >
//                     {typeIcons[type] ? (
//                       <span
//                         className={
//                           isActive
//                             ? "text-[var(--accent)] dark:text-white"
//                             : "text-current"
//                         }
//                       >
//                         {typeIcons[type]}
//                       </span>
//                     ) : (
//                       <BookOpen size={18} />
//                     )}
//                   </div>

//                   {/* 3. Textual Recognition: Label */}
//                   <span
//                     className={`text-[10px] font-black uppercase tracking-wider ${
//                       isActive ? "text-[var(--accent)] dark:text-white" : ""
//                     }`}
//                   >
//                     {type.split(" ")[0]}{" "}
//                     {/* Shows "Numerical" instead of "Numerical Ability" for cleaner UI */}
//                   </span>

//                   {/* 4. Active State Indicator: A small physical 'dot' */}
//                   {isActive && (
//                     <motion.div
//                       layoutId="active-dot"
//                       className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--accent)] dark:bg-white"
//                     />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-6">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={selectedType}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="flex items-end justify-between mb-10 border-b border-black/5 dark:border-white/5 pb-5">
//               <h2 className="text-3xl font-black tracking-tight">
//                 {selectedType}
//               </h2>
//               <span className="text-[10px] font-black opacity-30 tracking-[0.2em] uppercase">
//                 {grouped[selectedType]?.length || 0} Modules Available
//               </span>
//             </div>

//             {/* --- QUIZ GRID --- */}
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {grouped[selectedType]?.map((quiz, index) => (
//                 <motion.div
//                   key={quiz.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                 >
//                   <Link href={`/quiz/${quiz.id}`}>
//                     <div className="glass-card-3d flex flex-col h-full p-8 relative group cursor-pointer">
//                       <div className="mb-6 p-4 rounded-2xl bg-[var(--accent)] text-white w-fit shadow-lg shadow-[var(--accent)]/30 group-hover:scale-110 transition-transform duration-500">
//                         {typeIcons[selectedType] || <BookOpen size={24} />}
//                       </div>

//                       <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-[var(--accent)] transition-colors">
//                         {quiz.title}
//                       </h3>

//                       <p className="text-sm opacity-50 leading-relaxed mb-10 flex-grow font-medium">
//                         {quiz.description ||
//                           "Comprehensive review module featuring calibrated questions for exam readiness."}
//                       </p>

//                       <div className="mt-auto flex items-center justify-between text-[var(--accent)]">
//                         <span className="font-black uppercase text-[10px] tracking-widest">
//                           Start Module
//                         </span>
//                         <div className="w-8 h-8 rounded-full border border-[var(--accent)]/20 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
//                           <ChevronRight size={18} />
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </AnimatePresence>

//         {/* --- RANDOM SECTION --- */}
//         <div className="  border-t border-black/5 dark:border-white/5">
//           <RandomQuizCard />
//         </div>
//         <div className="  border-t border-black/5 dark:border-white/5">
//           <ExamScope />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RandomQuizCard from "@/components/RandomQuizCard";
import BlogCard from "@/components/BlogCard";
import FeaturedPost from "@/components/FeaturedPost";

import {
  BookOpen,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import ExamScope from "@/components/ExamScope";

const API_BASE_URL = "http://127.0.0.1:8000/api";

type Quiz = {
  id: number;
  title: string;
  description: string;
  quiz_type: string;
  quiz_type_display?: string;
  is_random: boolean;
  questions?: number[];
};

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/blog/posts/")
      .then((res) => res.json())
      .then((data) => {
        // Check if data is an array or if it's hidden inside 'results'
        const actualPosts = Array.isArray(data) ? data : data.results;

        if (actualPosts) {
          setPosts(actualPosts.slice(0, 3));
        } else {
          console.error("Data received but 'results' not found:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Extract the latest and the rest
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  useEffect(() => {
    async function fetchAllQuizzes(
      url = `${API_BASE_URL}/quizzes/`,
      all: Quiz[] = []
    ): Promise<Quiz[]> {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        const combined = [...all, ...(data.results || data)];
        if (data.next) return fetchAllQuizzes(data.next, combined);
        return combined;
      } catch (error) {
        return all;
      }
    }

    fetchAllQuizzes()
      .then((allQuizzes) => {
        const normalQuizzes = allQuizzes.filter((q) => !q.is_random);
        setQuizzes(normalQuizzes);
        if (normalQuizzes.length > 0) {
          setSelectedType(
            normalQuizzes[0].quiz_type_display ||
              normalQuizzes[0].quiz_type ||
              "Other"
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    return quizzes.reduce((acc: Record<string, Quiz[]>, quiz) => {
      const type = quiz.quiz_type_display || quiz.quiz_type || "Other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(quiz);
      return acc;
    }, {});
  }, [quizzes]);

  const quizTypes = Object.keys(grouped);

  const typeIcons: Record<string, any> = {
    "Numerical Ability": <Layers size={18} />,
    "Verbal Ability": <BookOpen size={18} />,
    "Analytical Ability": <Sparkles size={18} />,
    "Clerical Ability": <Clock size={18} />,
    "General Information": <CheckCircle size={18} />,
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full shadow-[0_0_20px_rgba(55,48,163,0.3)]"
        />
        <p className="mt-6 opacity-40 font-bold tracking-[0.2em] text-[10px] uppercase animate-pulse">
          Syncing Review Modules...
        </p>
      </div>
    );

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden">
      {/* --- ✨ AMBIENT LIGHTING --- */}
      <div className="mesh-bg opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />
      {featuredPost && <FeaturedPost post={featuredPost} />}
      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-white/20 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={12} className="animate-pulse" /> Civil Service
            Portal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black leading-[1] mb-8 tracking-tighter"
          >
            Master the Exam <br />
            <span className="text-gradient">with Precision.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg opacity-50 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            High-fidelity review modules designed to replicate the logic and
            intensity of the actual Civil Service Exam.
          </motion.p>
        </div>
      </section>

      {/* --- CATEGORY TABS (Sliding Tactile Switch) --- */}
      <div className="sticky top-20 z-40 py-6 mb-12">
        <div className="max-w-fit mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl glass-card-3d border-white/10 shadow-2xl">
            {quizTypes.map((type) => {
              const isActive = selectedType === type;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 group
                    ${
                      isActive
                        ? "text-white"
                        : "hover:bg-white/10 opacity-60 hover:opacity-100"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] rounded-xl shadow-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <span
                    className={`relative z-10 transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    {typeIcons[type] || <BookOpen size={18} />}
                  </span>

                  <span className="relative z-10 text-[11px] font-black uppercase tracking-wider">
                    {type.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-end justify-between mb-10 border-b border-white/5 pb-5 px-2">
              <h2 className="text-4xl font-black tracking-tight uppercase">
                {selectedType}
              </h2>
              <span className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase">
                {grouped[selectedType]?.length || 0} Dimensions
              </span>
            </div>

            {/* --- QUIZ GRID --- */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {grouped[selectedType]?.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/quiz/${quiz.id}`}>
                    <div className="glass-card-3d flex flex-col h-full p-8 relative group cursor-pointer border-white/5 hover:border-[var(--accent)]/30">
                      {/* Floating Ghost Icon */}
                      <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
                        {typeIcons[selectedType] ? (
                          <div className="scale-[4]">
                            {typeIcons[selectedType]}
                          </div>
                        ) : (
                          <BookOpen size={100} />
                        )}
                      </div>

                      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white w-fit shadow-xl shadow-indigo-900/20 group-hover:rotate-6 transition-transform duration-500">
                        {typeIcons[selectedType] || <BookOpen size={24} />}
                      </div>

                      <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-gradient transition-all">
                        {quiz.title}
                      </h3>

                      <p className="text-sm opacity-40 leading-relaxed mb-12 flex-grow font-medium">
                        {quiz.description ||
                          "Executive-level module featuring calibrated logic and patterns."}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-black uppercase text-[10px] tracking-[0.2em] text-[var(--accent)]">
                          Start Quiz
                        </span>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-500">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- BOTTOM SECTIONS --- */}
        <div className="mt-12 space-y-12">
          <div className="pt-12 border-t border-white/5">
            <RandomQuizCard />
          </div>
          <div className="pt-12 border-t border-white/5">
            <ExamScope />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts && posts.length > 0 ? (
              posts.map((post: any, index: number) => (
                <BlogCard key={post.id || index} post={post} index={index} />
              ))
            ) : (
              <p>No posts found. Check console.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
