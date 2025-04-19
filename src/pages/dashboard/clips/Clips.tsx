import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPencilAlt, FaExternalLinkAlt } from "react-icons/fa";
import EditClipModal from "../../../components/Modals/EditClipModal";
import { FiLoader } from "react-icons/fi";
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
      const token = getAuthToken();
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
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

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
    const token = getAuthToken();
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
                imageUrl: data.imageUrl ?? clip.imageUrl,
                sourceUrl: data.sourceUrl ?? clip.sourceUrl,
              }
            : clip
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <FiLoader className="mx-auto h-8 w-8 animate-spin text-[var(--commandly-primary)]" />
          <p className="mt-2 text-[var(--commandly-text-secondary)]">
            Loading clips...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
          My Clips
        </h1>
      </div>

      {clips.length === 0 ? (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center rounded-lg border border-[var(--commandly-border)] bg-[var(--commandly-background)]">
          <p className="text-[var(--commandly-text-secondary)]">
            No clips found
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="flex flex-col overflow-hidden rounded-lg border border-[var(--commandly-border)] bg-[var(--commandly-background)]"
              >
                {clip.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={clip.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <p className="mb-4 flex-1 text-[var(--commandly-text-primary)]">
                    {clip.text}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--commandly-border)] pt-4">
                    <button
                      onClick={() => {
                        window.open(
                          clip.sourceUrl,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="flex items-center gap-2 text-sm text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                      title={clip.sourceUrl}
                    >
                      <FaExternalLinkAlt className="h-4 w-4" />
                      <span className="truncate max-w-[150px]">
                        {new URL(clip.sourceUrl).hostname}
                      </span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(clip)}
                        className="rounded-md p-2 text-[var(--commandly-text-secondary)] hover:bg-[var(--commandly-hover)]"
                        title="Edit clip"
                      >
                        <FaPencilAlt className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(clip.id)}
                        className="rounded-md p-2 text-red-500 hover:bg-red-50"
                        title="Delete clip"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--commandly-border)] pt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-4 py-2 text-sm font-medium text-[var(--commandly-text-primary)] hover:bg-[var(--commandly-hover)] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-[var(--commandly-text-secondary)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-4 py-2 text-sm font-medium text-[var(--commandly-text-primary)] hover:bg-[var(--commandly-hover)] disabled:opacity-50"
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
