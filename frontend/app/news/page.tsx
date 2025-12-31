"use client";

import { useState, useEffect } from "react";
import { Newspaper, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";

const API_BASE_URL = "http://localhost:8000/api";

export default function NewsArchivePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/blog/posts/`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedPosts = Array.isArray(data) ? data : data.results;
        setPosts(fetchedPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* --- 🌌 AMBIENT OVERLAYS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-[var(--accent)]/10 blur-[100px] rounded-full" />
      </div>

      {/* --- 🏔️ MINIMALIST HEADER --- */}
      <header className="pt-24 pb-12 px-6">
        <div className="max-w-[1600px] mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 opacity-40 hover:opacity-100 transition-all mb-8 text-[9px] font-black uppercase tracking-[0.3em]"
            >
              <ArrowLeft size={10} /> Exit to Dashboard
            </Link>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-[var(--accent)] mb-4">
                <Newspaper size={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                  Bulletin Archive
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                LATEST <br /> <span className="text-gradient">INTEL.</span>
              </h1>
            </div>

            <div className="flex gap-4">
              <div className="px-6 py-4 glass-card-3d border-white/5">
                <span className="block text-[8px] font-black uppercase opacity-30 tracking-widest mb-1">
                  Total Articles
                </span>
                <span className="text-2xl font-black italic">
                  {posts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- 📰 4-COLUMN GRID --- */}
      <section className="max-w-[1600px] mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
              Decrypting Files...
            </span>
          </div>
        ) : (
          /* The 'xl:grid-cols-4' is what makes it 4 columns */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: (index % 4) * 0.05,
                }}
              >
                <BlogCard post={post} index={index} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-40 bg-white/[0.02] rounded-[40px] border border-dashed border-white/5">
            <span className="text-xs font-black uppercase opacity-20 tracking-widest">
              No Intelligence Data Found
            </span>
          </div>
        )}
      </section>

      {/* --- DECORATIVE LINE --- */}
      <div className="max-w-[1600px] mx-auto px-6 pb-20">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </main>
  );
}
