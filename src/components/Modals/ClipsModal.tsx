import { useEffect, useState } from "react";
import { FiTrash2, FiEdit2, FiSearch, FiX, FiCheck } from "react-icons/fi";
import Modal from "../Modal/Modal";
import { getAuthToken } from "@/utils/auth";

interface Clip {
  id: string;
  text: string;
  sourceUrl: string;
  imageUrl?: string;
  createdAt: string;
}

interface ClipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClipsModal({ isOpen, onClose }: ClipsModalProps) {
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
    if (isOpen) {
      setPage(1);
      fetchClips();
    }
  }, [isOpen, searchQuery]);

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
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Clips" size="xlarge">
      <div className="space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search clips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-black/40 rounded-lg pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/50"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
        </div>

        {loading && page === 1 ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-4 border-white/30 border-t-white/85 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-4 font-medium">
            {error}
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
              {clips.length === 0 ? (
                <div className="text-center text-white/70 py-8 font-medium">
                  {searchQuery
                    ? "No clips found matching your search"
                    : "No clips found"}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {clips.map((clip) => (
                    <div
                      key={clip.id}
                      className="bg-black/50 rounded-lg p-5 space-y-4 hover:bg-black/60 transition-all duration-200 border border-white/[0.08] shadow-lg"
                    >
                      {editingClip?.id === clip.id ? (
                        <div className="space-y-4">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[120px] resize-y font-medium"
                            placeholder="Enter clip text..."
                          />
                          <input
                            type="url"
                            value={editSourceUrl}
                            onChange={(e) => setEditSourceUrl(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium"
                            placeholder="Enter source URL..."
                          />
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setEditingClip(null)}
                              className="px-4 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors duration-200 flex items-center space-x-2 font-medium"
                              disabled={saving}
                            >
                              <FiX className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors duration-200 flex items-center space-x-2 font-medium"
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
                          <div className="flex justify-between items-start">
                            <div className="flex-1 break-words">
                              <p className="text-white text-base leading-relaxed font-medium tracking-[0.01em]">
                                {clip.text}
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => handleEdit(clip)}
                                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors duration-200"
                                title="Edit clip"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              {deleteConfirmId === clip.id ? (
                                <button
                                  onClick={() => handleDelete(clip.id)}
                                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors duration-200 flex items-center"
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
                                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors duration-200"
                                  title="Delete clip"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          {clip.imageUrl && (
                            <div className="relative rounded-lg overflow-hidden bg-black/30">
                              <img
                                src={clip.imageUrl}
                                alt="Clip preview"
                                className="rounded-lg max-h-48 w-full object-cover hover:opacity-95 transition-opacity duration-200"
                              />
                            </div>
                          )}
                          <div className="flex justify-between items-center text-sm font-medium">
                            <a
                              href={clip.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/70 hover:text-white transition-colors duration-200"
                            >
                              {new URL(clip.sourceUrl).hostname}
                            </a>
                            <span className="text-white/70">
                              {formatDate(clip.createdAt)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors duration-200 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white/85 rounded-full animate-spin" />
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
