import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../Modal/Modal";
import styles from "./EditClipModal.module.css";

interface EditClipModalProps {
  clip: {
    id: string;
    text: string;
    sourceUrl: string;
    imageUrl?: string;
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

interface FormData {
  text: string;
  imageUrl: string;
  sourceUrl: string;
}

export default function EditClipModal({
  clip,
  onClose,
  onSave,
}: EditClipModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      text: clip.text,
      imageUrl: clip.imageUrl || "",
      sourceUrl: clip.sourceUrl,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");

    try {
      await onSave(clip.id, {
        text: data.text !== clip.text ? data.text : undefined,
        imageUrl: data.imageUrl !== clip.imageUrl ? data.imageUrl : undefined,
        sourceUrl:
          data.sourceUrl !== clip.sourceUrl ? data.sourceUrl : undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Clip">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="text" data-required="true">
            Text
          </label>
          <textarea
            id="text"
            className={`${styles.input} ${
              errors.text ? styles.inputError : ""
            }`}
            {...register("text", {
              required: "Text is required",
              maxLength: {
                value: 100000,
                message: "Text must be less than 100,000 characters",
              },
            })}
            rows={4}
          />
          {errors.text && (
            <span className={styles.errorMessage}>{errors.text.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            className={`${styles.input} ${
              errors.imageUrl ? styles.inputError : ""
            }`}
            placeholder="https://..."
            {...register("imageUrl", {
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: "Please enter a valid URL",
              },
              maxLength: {
                value: 500,
                message: "URL must be less than 500 characters",
              },
            })}
          />
          {errors.imageUrl && (
            <span className={styles.errorMessage}>
              {errors.imageUrl.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="sourceUrl" data-required="true">
            Source URL
          </label>
          <input
            type="url"
            id="sourceUrl"
            disabled={true}
            className={`${styles.input} ${
              errors.sourceUrl ? styles.inputError : ""
            }`}
            placeholder="https://..."
            {...register("sourceUrl", {
              required: "Source URL is required",
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: "Please enter a valid URL",
              },
              maxLength: {
                value: 500,
                message: "URL must be less than 500 characters",
              },
            })}
          />
          {errors.sourceUrl && (
            <span className={styles.errorMessage}>
              {errors.sourceUrl.message}
            </span>
          )}
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
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
