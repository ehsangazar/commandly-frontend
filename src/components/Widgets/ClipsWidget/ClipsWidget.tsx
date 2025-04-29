import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import ClipsCard from "./ClipCard";
import { getAuthToken } from "@/utils/auth";

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
      <div className="flex items-center justify-center p-6 text-white/85">
        <div className="w-6 h-6 border-4 border-white/30 border-t-white/85 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 text-red-400">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white/95">Recent Clips</h2>
        <Link
          to="/dashboard/clips"
          className="flex items-center space-x-2 text-white/85 hover:text-white/95 transition-colors duration-200"
        >
          <span className="text-sm font-medium">View All</span>
          <FiExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {clips.length === 0 ? (
        <div className="text-center py-8 text-white/85 font-medium">
          No clips found
        </div>
      ) : (
        <div className="space-y-4">
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
  );
}
