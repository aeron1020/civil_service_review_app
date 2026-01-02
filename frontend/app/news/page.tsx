"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  Loader2,
  ArrowLeft,
  Terminal,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import FeaturedPost from "@/components/FeaturedPost";

const API_BASE_URL = "http://localhost:8000/api";

export default function NewsArchivePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/blog/posts/`)
      .then((res) => res.json())
      .then((data) => {
        const actualPosts = Array.isArray(data) ? data : data.results;
        if (actualPosts) setPosts(actualPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // ---  LOGIC: Remove redundancy ---
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white">
      {/*  DYNAMIC BACKGROUND GRADIENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[var(--accent)]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* ---  HIGH-END MINIMALIST HEADER --- */}
        <header className="pt-28 pb-16 px-6">
          <div className="max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="group inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 hover:border-[var(--accent)]/30 transition-all mb-12 text-[9px] font-black uppercase tracking-[0.3em]"
              >
                <ArrowLeft
                  size={12}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Return to Command
              </Link>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <Terminal size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-80">
                    Intelligence Archive
                  </span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.75] italic">
                  RECENT <br /> <span className="text-gradient">BRIEFS.</span>
                </h1>
              </div>

              {/* Data Status Chips */}
              <div className="flex flex-wrap gap-4">
                <div className="px-8 py-5 glass-card-3d border-white/5 flex flex-col items-center justify-center min-w-[140px]">
                  <span className="text-[8px] font-black uppercase opacity-30 tracking-widest mb-1">
                    Database Entries
                  </span>
                  <span className="text-3xl font-black italic tabular-nums">
                    {posts.length}
                  </span>
                </div>
                <div className="px-8 py-5 glass-card-3d border-white/5 flex flex-col items-center justify-center min-w-[140px]">
                  <span className="text-[8px] font-black uppercase opacity-30 tracking-widest mb-1">
                    Status
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--accent)] animate-pulse">
                    Live Sync
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- 🌟 FEATURED SECTION --- */}
        <div className="max-w-[1600px] mx-auto px-6">
          <AnimatePresence mode="wait">
            {!loading && featuredPost && <FeaturedPost post={featuredPost} />}
          </AnimatePresence>
        </div>

        {/* --- 📰 GRID SECTION --- */}
        <section className="max-w-[1600px] mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] whitespace-nowrap opacity-40">
              Extended Briefings
            </h2>
            <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
            <LayoutGrid size={16} className="opacity-20" />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <Loader2
                className="animate-spin text-[var(--accent)]"
                size={40}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 animate-pulse">
                Accessing Encrypted Records...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {remainingPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: (index % 4) * 0.1,
                  }}
                  /* --- 🎨 FANCY STAGGER: Even columns are slightly offset down --- */
                  className={
                    index % 4 === 1 || index % 4 === 3 ? "xl:mt-12" : ""
                  }
                >
                  <BlogCard post={post} index={index} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && remainingPosts.length === 0 && (
            <div className="text-center py-40 bg-white/[0.01] rounded-[48px] border border-dashed border-white/5">
              <Newspaper size={48} className="mx-auto mb-6 opacity-5" />
              <span className="text-[10px] font-black uppercase opacity-20 tracking-[0.5em]">
                No Intelligence Data Found
              </span>
            </div>
          )}
        </section>

        {/* --- FOOTER DECORATION --- */}
        <footer className="max-w-[1600px] mx-auto px-6 pb-32">
          <div className="flex flex-col items-center gap-8">
            <div className="w-[1px] h-32 bg-gradient-to-b from-white/20 to-transparent" />
            <span className="text-[8px] font-black uppercase tracking-[1em] opacity-20">
              End of Transmission
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
