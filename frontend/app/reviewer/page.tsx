"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/apiClient";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ReviewerPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const getDocs = async () => {
      try {
        const res = await api.get("/quizzes/reviewers/");
        setMaterials(res.data);
      } catch (err) {
        // Redirect if not logged in
        router.push("/login?next=/reviewer");
      } finally {
        setLoading(false);
      }
    };
    getDocs();
  }, []);

  if (loading)
    return <div className="p-20 text-center">Checking Credentials...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black uppercase mb-10 tracking-tighter">
        Study Materials
      </h1>

      <div className="grid grid-cols-1 gap-12">
        {materials.map((doc: any) => (
          <div
            key={doc.id}
            className="glass-card-3d p-6 rounded-3xl border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-4 text-[var(--accent)]">
              {doc.title}
            </h2>
            <div className="h-[800px] w-full bg-black/20 rounded-xl overflow-hidden shadow-inner">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={doc.pdf_file}
                  plugins={[defaultLayoutPluginInstance]}
                  theme="dark"
                />
              </Worker>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
