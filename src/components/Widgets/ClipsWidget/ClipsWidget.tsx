import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FiExternalLink } from "react-icons/fi";
import ClipsCard from "./ClipCard";

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
        const token = Cookies.get("commandly_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

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
      <div className="flex items-center justify-center p-6 text-[var(--commandly-text-secondary)]">
        Loading recent clips...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[var(--commandly-hover)] rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
          Recent Clips
        </h2>
        <Link
          to="/dashboard/clips"
          className="flex items-center space-x-2 text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)] transition-colors duration-200"
        >
          <span>View All</span>
          <FiExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {clips.length === 0 ? (
        <div className="text-center py-8 text-[var(--commandly-text-secondary)]">
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
