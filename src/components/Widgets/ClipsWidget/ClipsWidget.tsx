import { useEffect, useState } from "react";
import styles from "./ClipsWidget.module.css";
import Cookies from "js-cookie";

interface Clip {
  id: string;
  text?: string;
  imageUrl?: string;
  sourceUrl: string;
  createdAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const ClipsWidget = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecentClips = async () => {
      try {
        const token = Cookies.get("commandly_token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/clips?take=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setClips(data.clips);
        }
      } catch (err) {
        setError("Failed to fetch recent clips");
        console.error("Error fetching clips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentClips();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.header}>
          <h3>Recent Clips</h3>
        </div>
        <div className={styles.loading}>Loading clips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.widget}>
        <div className={styles.header}>
          <h3>Recent Clips</h3>
        </div>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3>Recent Clips</h3>
        <a href="/dashboard/clips" className={styles.viewAll}>
          View All
        </a>
      </div>
      <div className={styles.content}>
        {clips.length === 0 ? (
          <div className={styles.empty}>No clips yet</div>
        ) : (
          <div className={styles.clipsList}>
            {clips.map((clip) => (
              <div key={clip.id} className={styles.clipItem}>
                <div className={styles.clipContent}>
                  {clip.imageUrl ? (
                    <img
                      src={clip.imageUrl}
                      alt="Clip"
                      className={styles.clipImage}
                    />
                  ) : (
                    <p className={styles.clipText}>{clip.text || "No text"}</p>
                  )}
                </div>
                <div className={styles.clipMeta}>
                  <a
                    href={clip.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceLink}
                  >
                    {new URL(clip.sourceUrl).hostname}
                  </a>
                  <span className={styles.date}>
                    {formatDate(clip.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClipsWidget;
