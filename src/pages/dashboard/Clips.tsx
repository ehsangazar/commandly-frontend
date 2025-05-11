import { useEffect, useState } from "react";
import {
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiCheck,
  FiScissors,
  FiAlertCircle,
  FiExternalLink,
  FiX,
} from "react-icons/fi";
import { getAuthToken } from "@/utils/auth";

interface Clip {
  id: string;
  text: string;
  sourceUrl: string;
  imageUrl?: string;
  createdAt: string;
}

const Clips = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClip, setEditingClip] = useState<Clip | null>(null);
  const [editText, setEditText] = useState("");
  const [editSourceUrl, setEditSourceUrl] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const limit = 15;

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

  useEffect(() => {
    setPage(1);
    fetchClips();
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1) {
      fetchClips();
    }
  }, [page]);

  const fetchClips = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";
      const response = await fetch(
        `${API_BASE_URL}/clips?page=${page}&limit=${limit}${searchParam}`,
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
        if (page === 1) {
          setClips(data.clips);
        } else {
          setClips((prev) => [...prev, ...data.clips]);
        }
        setHasMore(data.clips.length === limit);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch clips");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (clip: Clip) => {
    setEditingClip(clip);
    setEditText(clip.text);
    setEditSourceUrl(clip.sourceUrl);
  };

  const handleSaveEdit = async () => {
    if (!editingClip) return;

    try {
      setSaving(true);
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/clips/${editingClip.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editText,
          sourceUrl: editSourceUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update clip");
      }

      const data = await response.json();
      if (data.success) {
        setClips(
          clips.map((clip) =>
            clip.id === editingClip.id
              ? { ...clip, text: editText, sourceUrl: editSourceUrl }
              : clip
          )
        );
        setEditingClip(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update clip");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSaving(true);
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/clips/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete clip");
      }

      const data = await response.json();
      if (data.success) {
        setClips(clips.filter((clip) => clip.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete clip");
    } finally {
      setSaving(false);
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className=" border-b border-white/20 pb-4 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
              <FiScissors className="h-6 w-6 text-[var(--commandly-primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white/90">
                Manage Clips
              </h2>
              <p className="text-sm text-white/60 mt-1">
                View and manage your saved text snippets
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search clips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 rounded-lg pl-11 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]/20 focus:bg-black/30 transition-all duration-200"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          height: "calc(100% - 150px)",
        }}
      >
        {loading && page === 1 ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-white/50 gap-4">
            <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center">
              <FiAlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-1 text-red-400">{error}</p>
              <p className="text-sm text-white/50">Please try again later</p>
            </div>
          </div>
        ) : clips.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-white/50 gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
              <FiScissors className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-1">
                {searchQuery
                  ? "No clips found matching your search"
                  : "No clips found"}
              </p>
              <p className="text-sm">Start saving clips to see them here</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className="rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 p-5 transition-all duration-200 space-y-4"
                >
                  {editingClip?.id === clip.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-4 py-3 bg-black/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]/20 min-h-[120px] resize-y font-medium"
                        placeholder="Enter clip text..."
                      />
                      <input
                        type="url"
                        value={editSourceUrl}
                        onChange={(e) => setEditSourceUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-black/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]/20 font-medium"
                        placeholder="Enter source URL..."
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingClip(null)}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 flex items-center gap-2"
                          disabled={saving}
                        >
                          <FiX className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 rounded-lg bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary)]/90 text-white transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[var(--commandly-primary)]/20"
                          disabled={saving}
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white/85 rounded-full animate-spin" />
                          ) : (
                            <>
                              <FiCheck className="w-4 h-4" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-white/90 text-base leading-relaxed font-medium tracking-[0.01em] flex-1 break-words">
                          {clip.text}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(clip)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
                            title="Edit clip"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          {deleteConfirmId === clip.id ? (
                            <button
                              onClick={() => handleDelete(clip.id)}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-all duration-200"
                              disabled={saving}
                            >
                              {saving ? (
                                <div className="w-4 h-4 border-2 border-red-300/30 border-t-red-300/85 rounded-full animate-spin" />
                              ) : (
                                <FiCheck className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(clip.id)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
                              title="Delete clip"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {clip.imageUrl && (
                        <div className="relative rounded-xl overflow-hidden bg-black/30">
                          <img
                            src={clip.imageUrl}
                            alt="Clip preview"
                            className="w-full h-48 object-cover hover:opacity-95 transition-opacity duration-200"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-medium">
                        <a
                          href={clip.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-2"
                        >
                          {new URL(clip.sourceUrl).hostname}
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                        <span className="text-white/60">
                          {formatDate(clip.createdAt)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 rounded-lg bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary)]/90 text-white transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[var(--commandly-primary)]/20"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white/85 rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Load More</span>
                      <FiCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Clips;
