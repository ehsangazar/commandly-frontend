import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../Modal/Modal";
import { FiX, FiSave } from "react-icons/fi";

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="text"
            className="block text-sm font-medium text-[var(--commandly-text-secondary)]"
          >
            Text <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text"
            className={`w-full rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-3 py-2 text-[var(--commandly-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)] ${
              errors.text ? "border-red-500" : ""
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
            <span className="text-sm text-red-500">{errors.text.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-[var(--commandly-text-secondary)]"
          >
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            className={`w-full rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-3 py-2 text-[var(--commandly-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)] ${
              errors.imageUrl ? "border-red-500" : ""
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
            <span className="text-sm text-red-500">
              {errors.imageUrl.message}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sourceUrl"
            className="block text-sm font-medium text-[var(--commandly-text-secondary)]"
          >
            Source URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="sourceUrl"
            disabled={true}
            className={`w-full rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-3 py-2 text-[var(--commandly-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)] ${
              errors.sourceUrl ? "border-red-500" : ""
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
            <span className="text-sm text-red-500">
              {errors.sourceUrl.message}
            </span>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-500">{error}</div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-4 py-2 text-sm font-medium text-[var(--commandly-text-primary)] hover:bg-[var(--commandly-hover)] disabled:opacity-50"
          >
            <FiX className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--commandly-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--commandly-primary-hover)] disabled:opacity-50"
          >
            <FiSave className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
