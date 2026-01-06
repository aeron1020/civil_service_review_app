"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/apiClient";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FileText, Info } from "lucide-react";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ReviewerPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // FIX: Initialize the plugin instance only once using useMemo
  // This prevents the PDF viewer from re-rendering/flickering unnecessarily
  const defaultLayoutPluginInstance = useMemo(() => defaultLayoutPlugin(), []);

  useEffect(() => {
    setIsMounted(true);
    const getDocs = async () => {
      try {
        const res = await api.get("/quizzes/reviewers/");
        setMaterials(res.data);
      } catch (err) {
        // Redirect to login if unauthorized
        router.push("/login?next=/reviewer");
      } finally {
        setLoading(false);
      }
    };
    getDocs();
  }, [router]);

  // Prevent rendering on server to avoid "window is not defined" or PDF worker errors
  if (!isMounted) return null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-black uppercase tracking-widest opacity-50">
          Loading Reviewer Hub...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 max-w-7xl mx-auto">
      <div className="mb-12 border-l-4 border-[var(--accent)] pl-6">
        <h1 className="text-5xl font-black uppercase mb-2 tracking-tighter">
          Study <span className="text-[var(--accent)]">Materials</span>
        </h1>
        <p className="opacity-50 text-sm font-bold uppercase tracking-widest">
          Premium CSE Reviewer Access
        </p>
      </div>

      <div className="grid grid-cols-1 gap-20">
        {materials.length > 0 ? (
          materials.map((doc: any) => (
            <div key={doc.id} className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="text-[var(--accent)]" />
                  <h2 className="text-3xl font-black uppercase tracking-tight">
                    {doc.title}
                  </h2>
                </div>
                {doc.description && (
                  <div className="flex items-start gap-2 max-w-3xl opacity-70 italic bg-white/5 p-4 rounded-xl">
                    <Info
                      size={18}
                      className="mt-1 flex-shrink-0 text-[var(--accent)]"
                    />
                    <p className="text-lg leading-relaxed">{doc.description}</p>
                  </div>
                )}
              </div>

              {/* Fancy PDF Container */}
              <div className="glass-card-3d p-2 rounded-[2.5rem] border border-white/10 overflow-hidden bg-black/40 shadow-2xl">
                <div className="h-[850px] w-full rounded-[2.2rem] overflow-hidden relative">
                  {/* Ensure the worker version matches the installed @react-pdf-viewer version */}
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer
                      fileUrl={doc.pdf_file}
                      plugins={[defaultLayoutPluginInstance]}
                      theme="dark"
                    />
                  </Worker>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card-3d p-20 text-center opacity-40 rounded-3xl">
            No materials found. Add them via Django Admin.
          </div>
        )}
      </div>
    </div>
  );
}
