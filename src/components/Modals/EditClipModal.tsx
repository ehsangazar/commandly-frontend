import { useState } from "react";
import styles from "./EditClipModal.module.css";

interface EditClipModalProps {
  clip: {
    id: string;
    text: string;
    source_url: string;
    image_url?: string;
  };
  onClose: () => void;
  onSave: (
    clipId: string,
    data: {
      text?: string;
      imageUrl?: string;
      sourceUrl?: string;
    }
  ) => Promise<void>;
}

export default function EditClipModal({
  clip,
  onClose,
  onSave,
}: EditClipModalProps) {
  const [text, setText] = useState(clip.text);
  const [imageUrl, setImageUrl] = useState(clip.image_url || "");
  const [sourceUrl, setSourceUrl] = useState(clip.source_url);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSave(clip.id, {
        text: text !== clip.text ? text : undefined,
        imageUrl: imageUrl !== clip.image_url ? imageUrl : undefined,
        sourceUrl: sourceUrl !== clip.source_url ? sourceUrl : undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit Clip</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="text">Text</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={100000}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              maxLength={500}
              placeholder="https://..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="sourceUrl">Source URL</label>
            <input
              type="url"
              id="sourceUrl"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              maxLength={500}
              placeholder="https://..."
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
