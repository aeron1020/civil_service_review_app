"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, ArrowUpRight, Newspaper, Calendar, Loader2 } from "lucide-react";

interface BlogCardProps {
  post: any;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Thumbnail is now always proxied by the serializer
  const thumbnail = post.thumbnail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="h-full"
    >
      <Link href={`/news/${post.slug}`} className="block h-full group">
        <div className="glass-card-3d h-full flex flex-col p-4 border-white/5 hover:border-[var(--accent)]/30 transition-all duration-500 bg-[var(--glass-bg)]">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/20 dark:bg-white/5 mb-6">
            {thumbnail && !error ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/5 z-10">
                    <Loader2
                      className="animate-spin text-[var(--accent)] opacity-40"
                      size={24}
                    />
                  </div>
                )}

                <img
                  src={thumbnail}
                  alt={post.title}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                    imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-xl"
                  }`}
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.error("Image load failed:", thumbnail);
                    setError(true);
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-20 bg-gradient-to-br from-transparent to-[var(--accent)]/10">
                <Newspaper size={32} />
                <span className="text-[8px] font-black uppercase tracking-widest mt-2">
                  No Preview
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="px-1 flex flex-col flex-grow">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-[var(--foreground)] leading-[1.1] mb-4 group-hover:text-gradient transition-all line-clamp-2">
              {post.title}
            </h3>

            {/* Meta */}
            <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 opacity-40">
                  <User size={10} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {post.author || "Strategist"}
                  </span>
                </div>
                {post.created_at && (
                  <div className="flex items-center gap-2 opacity-20">
                    <Calendar size={10} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">
                      {new Date(post.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="relative w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[var(--accent)] bg-white/5 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-500 group-hover:rotate-45 shadow-lg">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
