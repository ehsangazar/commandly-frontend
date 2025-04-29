import { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import ClipsCard from "./ClipCard";
import { getAuthToken } from "@/utils/auth";
import ClipsModal from "../../Modals/ClipsModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="h-full w-full rounded-2xl bg-black/25 backdrop-blur-2xl border border-white/30 shadow-lg p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-white/30 border-t-white/85 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full rounded-2xl bg-black/25 backdrop-blur-2xl border border-white/30 shadow-lg p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-red-400">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full rounded-2xl bg-black/25 backdrop-blur-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
        <div className="flex-none p-4 pb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Clips</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 text-white/85 hover:text-white/95 transition-colors duration-200"
          >
            <span className="text-sm font-medium">View All</span>
            <FiExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 p-4 pt-2">
          {clips.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/85 font-medium">
              No clips found
            </div>
          ) : (
            <div className="h-full overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
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

      <ClipsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
