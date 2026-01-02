"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Bookmark,
  Loader2,
  Check,
} from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function PostDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // --- Reading Progress Logic ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // --- 🧠 SHARE LOGIC ---
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch (err) {
        console.error(err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- ⏱️ READING TIME ESTIMATOR ---
  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/blog/posts/${slug}/`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const renderContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        // Check for Image (Handles Unsplash/CDN query params)
        const isImage = part.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i);
        if (isImage) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="my-12 glass-card-3d p-2 border-white/5 overflow-hidden group shadow-2xl"
            >
              <img
                src={part}
                alt="Editorial content"
                className="w-full h-auto rounded-[20px] group-hover:scale-[1.01] transition-transform duration-1000"
              />
            </motion.div>
          );
        }

        // Check for YouTube
        const ytMatch = part.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
        );
        if (ytMatch) {
          return (
            <div
              key={i}
              className="my-12 aspect-video glass-card-3d p-2 border-white/5 shadow-2xl"
            >
              <iframe
                className="w-full h-full rounded-[20px]"
                src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                allowFullScreen
              />
            </div>
          );
        }

        // Standard Link
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] font-bold underline decoration-2 underline-offset-4 hover:text-[var(--accent-secondary)] transition-colors"
          >
            {part}
          </a>
        );
      }

      return (
        <span key={i} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full shadow-[0_0_20px_rgba(67,56,202,0.2)]"
        />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 animate-pulse">
          Loading Briefing...
        </p>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter opacity-20">
            Intelligence Not Found
          </h1>
          <button onClick={() => router.back()} className="btn-3d text-xs">
            Return Home
          </button>
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen pb-32 overflow-x-hidden">
      {/* --- Ambient Lighting --- */}
      <div className="mesh-bg opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[var(--accent)]/5 to-transparent blur-3xl pointer-events-none" />

      {/* --- Reading Progress Bar --- */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] z-50 origin-left"
      />

      <div className="max-w-4xl mx-auto px-6 pt-24 md:pt-32">
        {/* --- Back Navigation --- */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-all mb-12 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <ArrowLeft size={14} /> Back to Bulletin
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mb-6"
        >
          <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[9px] font-black uppercase tracking-widest">
            {getReadingTime(post.content)} Min Read
          </span>
        </motion.div>

        {/* --- Header Section --- */}
        <header className="mb-16 space-y-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-gradient italic"
          >
            {post.title}
          </motion.h1>

          <div className="flex items-center justify-between py-8 border-y border-white/5">
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-lg">
                  <User size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em]">
                    Strategist
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {post.author}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                  <Calendar size={16} className="opacity-40" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em]">
                    Deployed
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex gap-3">
              <button
                onClick={handleShare}
                className={`p-3 rounded-full transition-all border flex items-center justify-center
      ${
        copied
          ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)] opacity-100"
          : "opacity-30 hover:opacity-100 border-transparent hover:border-white/10 hover:bg-white/5"
      }`}
              >
                {/* Change icon based on copy status */}
                {copied ? <Check size={18} /> : <Share2 size={18} />}
              </button>

              <button className="p-3 rounded-full hover:bg-white/5 transition-all opacity-30 hover:opacity-100 border border-transparent hover:border-white/10">
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* --- Article Content --- */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card-3d p-8 md:p-16 border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
        >
          <div className="relative z-10 text-[var(--foreground)] text-lg md:text-xl leading-[1.8] font-medium opacity-90 selection:bg-[var(--accent)] selection:text-white">
            {renderContent(post.content)}
          </div>

          {/* Subtle bottom decorative glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20" />
        </motion.article>

        {/* --- Footer --- */}
        <footer className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-4 px-8 py-3 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm text-[10px] font-black uppercase tracking-[0.4em] opacity-30"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            End of Intelligence Transmission
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
