"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/apiClient";
import dynamic from "next/dynamic"; // Import dynamic for SSR fix

// 1. Dynamically import the PDF components with SSR disabled
const PDFViewerContent = dynamic(
  async () => {
    const { Worker, Viewer } = await import("@react-pdf-viewer/core");
    const { defaultLayoutPlugin } = await import(
      "@react-pdf-viewer/default-layout"
    );

    // Create a wrapper component to use inside the dynamic import
    return ({ fileUrl, title, description }: any) => {
      const defaultLayoutPluginInstance = defaultLayoutPlugin();
      return (
        <div className="mb-20">
          <div className="border-l-4 border-[var(--accent)] pl-6 mb-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="opacity-70 mt-2 italic">{description}</p>
            )}
          </div>
          <div className="glass-card-3d p-2 rounded-[2rem] border border-white/10 bg-black/40 overflow-hidden shadow-2xl">
            <div className="h-[850px] w-full rounded-2xl overflow-hidden">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={fileUrl}
                  plugins={[defaultLayoutPluginInstance]}
                  theme="dark"
                />
              </Worker>
            </div>
          </div>
        </div>
      );
    };
  },
  { ssr: false } // This tells Next.js: "Do not touch this during build"
);

export default function ReviewerPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getDocs = async () => {
      try {
        const res = await api.get("/quizzes/reviewers/");
        setMaterials(res.data);
      } catch (err) {
        router.push("/login?next=/reviewer");
      } finally {
        setLoading(false);
      }
    };
    getDocs();
  }, [router]);

  if (loading)
    return (
      <div className="p-20 text-center font-bold">Loading Materials...</div>
    );

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 max-w-7xl mx-auto">
      <h1 className="text-5xl font-black uppercase mb-16 tracking-tighter">
        Reviewer <span className="text-[var(--accent)]">Hub</span>
      </h1>

      {materials.length > 0 ? (
        materials.map((doc: any) => (
          <PDFViewerContent
            key={doc.id}
            fileUrl={doc.pdf_file}
            title={doc.title}
            description={doc.description}
          />
        ))
      ) : (
        <div className="p-20 text-center opacity-30">
          No materials available yet.
        </div>
      )}
    </div>
  );
}
