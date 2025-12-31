"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";

interface FeaturedPostProps {
  post: any;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!post) return null;

  return (
    <section className="relative w-full mb-24 py-12 px-2">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />

      <Link href={`/news/${post.slug}`} className="relative block group">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16"
        >
          {/* --- 🖼️ IMAGE: Floating Minimalist Frame --- */}
          <div className="relative w-full md:w-[55%] aspect-[4/3] md:aspect-square lg:aspect-[16/10] group-hover:scale-[1.02] transition-transform duration-1000">
            {/* Animated Border Glow */}
            <div className="absolute -inset-[1px] bg-gradient-to-tr from-[var(--accent)]/40 via-transparent to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative h-full w-full rounded-3xl overflow-hidden bg-black/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
              {post.thumbnail && !error ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                      <Loader2
                        className="animate-spin text-[var(--accent)] opacity-20"
                        size={24}
                      />
                    </div>
                  )}
                  <img
                    src={post.thumbnail}
                    alt=""
                    className={`w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 ${
                      imageLoaded
                        ? "opacity-100 grayscale-0"
                        : "opacity-0 grayscale"
                    }`}
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setError(true)}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5 opacity-10">
                  <Sparkles size={48} />
                </div>
              )}
              {/* Subtle Noise/Overlay */}
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
            </div>
          </div>

          {/* --- 📝 CONTENT: Typography-First Section --- */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            {/* Ultra-minimal Badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center md:justify-start gap-3"
            >
              <span className="h-px w-8 bg-[var(--accent)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] opacity-80">
                Editorial Choice
              </span>
            </motion.div>

            <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] text-[var(--foreground)] group-hover:tracking-tight transition-all duration-700">
              {post.title}
            </h2>

            <p className="text-sm md:text-base text-[var(--foreground)] opacity-40 font-medium leading-relaxed max-w-md line-clamp-2 md:line-clamp-3">
              {post.content
                ?.replace(/https?:\/\/[^\s]+/g, "")
                .substring(0, 140)}
              ...
            </p>

            {/* Meta & Button Group */}
            <div className="flex flex-col md:flex-row items-center gap-8 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black opacity-20 uppercase tracking-[0.3em]">
                    Written by
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {post.author || "Admin"}
                  </span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black opacity-20 uppercase tracking-[0.3em]">
                    Date
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl group-hover:scale-110">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
