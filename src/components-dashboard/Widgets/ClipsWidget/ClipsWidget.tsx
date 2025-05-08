import { useEffect, useState } from "react";
import { FiExternalLink, FiScissors, FiAlertCircle } from "react-icons/fi";
import ClipsCard from "./ClipCard";
import { getAuthToken } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

interface Clip {
  id: string;
  text: string;
  sourceUrl: string;
  imageUrl?: string;
  createdAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

export default function ClipsWidget() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentClips = async () => {
      try {
        const token = getAuthToken();

        const response = await fetch(`${API_BASE_URL}/clips?page=1&limit=3`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch clips");
        }

        const data = await response.json();
        if (data.success) {
          setClips(data.clips);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch clips");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentClips();
  }, []);

  return (
    <div className="h-full w-full rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
              <FiScissors className="h-5 w-5 text-[var(--commandly-primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white/90">
                Recent Clips
              </h3>
              <p className="text-sm text-white/60">
                Save and organize text snippets
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard?clip=true")}
            className="px-3 py-2 rounded-lg bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary)]/90 text-white transition-all duration-200 flex items-center gap-2 group shadow-lg shadow-[var(--commandly-primary)]/20"
          >
            <span className="text-sm font-medium">View All</span>
            <FiExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 min-h-0 overflow-hidden">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <FiAlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-white/70">{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
          </div>
        ) : clips.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/50 gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <FiScissors className="h-6 w-6" />
            </div>
            <p className="text-sm">No clips found</p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-full pr-2 custom-scrollbar">
            {clips.map((clip) => (
              <ClipsCard
                key={clip.id}
                id={clip.id}
                sourceUrl={clip.sourceUrl}
                createdAt={clip.createdAt}
                text={clip.text}
                imageUrl={clip.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
