import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Clips.module.css";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import EditClipModal from "../../../components/Modals/EditClipModal";

interface Clip {
  id: string;
  text: string;
  source_url: string;
  image_url?: string;
  createdAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";
const ITEMS_PER_PAGE = 12;

export default function Clips() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingClip, setEditingClip] = useState<Clip | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClips();
  }, [currentPage]);

  const fetchClips = async () => {
    try {
      const token = Cookies.get("commandly_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/clips?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch clips");
      }

      const data = await response.json();
      if (data.success) {
        setClips(data.clips);
        setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch clips:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch clips");
      setLoading(false);
    }
  };

  const handleDelete = async (clipId: string) => {
    if (!confirm("Are you sure you want to delete this clip?")) {
      return;
    }

    try {
      const token = Cookies.get("commandly_token");
      const response = await fetch(`${API_BASE_URL}/clips/${clipId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete clip");
      }

      // Refresh clips list
      fetchClips();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete clip");
    }
  };

  const handleEdit = (clip: Clip) => {
    setEditingClip(clip);
  };

  const handleSaveEdit = async (
    clipId: string,
    data: {
      text?: string;
      imageUrl?: string;
      sourceUrl?: string;
    }
  ) => {
    const token = Cookies.get("commandly_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/clips/${clipId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update clip");
    }

    const responseData = await response.json();
    if (responseData.success) {
      // Update the clip in the local state
      setClips(
        clips.map((clip) =>
          clip.id === clipId
            ? {
                ...clip,
                text: data.text ?? clip.text,
                image_url: data.imageUrl ?? clip.image_url,
                source_url: data.sourceUrl ?? clip.source_url,
              }
            : clip
        )
      );
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading clips...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Clips</h1>
      </div>

      {clips.length === 0 ? (
        <div className={styles.empty}>No clips found</div>
      ) : (
        <>
          <div className={styles.grid}>
            {clips.map((clip) => (
              <div key={clip.id} className={styles.clipCard}>
                {clip.image_url && (
                  <div className={styles.imageContainer}>
                    <img src={clip.image_url} alt="" className={styles.image} />
                  </div>
                )}
                <div className={styles.content}>
                  <p className={styles.clipText}>{clip.text}</p>
                  <div className={styles.meta}>
                    <a
                      href={clip.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sourceLink}
                    >
                      {(() => {
                        try {
                          return new URL(clip.source_url).hostname;
                        } catch {
                          return clip.source_url;
                        }
                      })()}
                    </a>
                    <span className={styles.date}>
                      {(() => {
                        try {
                          const date = new Date(clip.createdAt);
                          if (isNaN(date.getTime())) {
                            return "Invalid date";
                          }
                          return date.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });
                        } catch {
                          return "Invalid date";
                        }
                      })()}
                    </span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() => handleEdit(clip)}
                    className={styles.editButton}
                    title="Edit clip"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => handleDelete(clip.id)}
                    className={styles.deleteButton}
                    title="Delete clip"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      )}

      {editingClip && (
        <EditClipModal
          clip={editingClip}
          onClose={() => setEditingClip(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
