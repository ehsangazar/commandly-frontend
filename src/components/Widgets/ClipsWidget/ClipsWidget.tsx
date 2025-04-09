import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./ClipsWidget.module.css";
import { FaExternalLinkAlt } from "react-icons/fa";

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
    return <div className={styles.loading}>Loading recent clips...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h2>Recent Clips</h2>
        <Link to="/dashboard/clips" className={styles.viewAll}>
          View All
        </Link>
      </div>

      {clips.length === 0 ? (
        <div className={styles.empty}>No clips found</div>
      ) : (
        <div className={styles.clipsList}>
          {clips.map((clip) => (
            <div key={clip.id} className={styles.clipItem}>
              <div className={styles.clipContent}>
                <p className={styles.clipText}>{clip.text}</p>
                <div className={styles.clipMeta}>
                  <button
                    onClick={() => {
                      window.open(
                        clip.sourceUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className={styles.sourceButton}
                    title={clip.sourceUrl}
                  >
                    <FaExternalLinkAlt className={styles.sourceIcon} />
                    <span className={styles.sourceText}>
                      {new URL(clip.sourceUrl).hostname}
                    </span>
                  </button>
                  <span className={styles.date}>
                    {new Date(clip.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
