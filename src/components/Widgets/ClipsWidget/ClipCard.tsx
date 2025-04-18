import { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiLink,
  FiCopy,
} from "react-icons/fi";
import { format } from "date-fns";

interface ClipProps {
  id: string;
  sourceUrl: string;
  createdAt: string;
  text: string;
  imageUrl?: string;
}

export default function ClipsCard({
  id,
  sourceUrl,
  createdAt,
  text,
  imageUrl,
}: ClipProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = format(new Date(createdAt), "MMM d, yyyy");
  const formattedTime = format(new Date(createdAt), "h:mm a");

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[var(--commandly-border)] bg-[var(--commandly-hover)] shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-3 pb-0">
        <div className="rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-2 py-1">
          <span className="font-mono text-xs text-[var(--commandly-text-secondary)]">
            {id.substring(0, 8)}...
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--commandly-text-secondary)]">
          <FiCalendar className="h-3 w-3" />
          <span>{formattedDate}</span>
          <FiClock className="ml-2 h-3 w-3" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 pt-2">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[var(--commandly-text-primary)]">
            {text}
          </h3>
          <button
            onClick={() => copyToClipboard(text)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--commandly-text-secondary)] hover:bg-[var(--commandly-background)] hover:text-[var(--commandly-primary)]"
            title={copied ? "Copied!" : "Copy text"}
          >
            <FiCopy className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-2 flex items-center gap-2 text-xs text-[var(--commandly-text-secondary)]">
          <FiLink className="h-4 w-4" />
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:text-[var(--commandly-primary)] hover:underline"
          >
            {sourceUrl}
          </a>
        </div>

        {imageUrl && (
          <div className="relative mt-3 overflow-hidden rounded-md border border-[var(--commandly-border)]">
            <div className="aspect-[16/7] w-full overflow-hidden bg-[var(--commandly-background)]">
              <img
                src={imageUrl}
                alt="Clip preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="rounded-md bg-[var(--commandly-primary)]/90 px-2 py-1">
                  <span className="text-xs text-white">Preview</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t border-[var(--commandly-border)] p-1">
        <button
          onClick={() => window.open(sourceUrl, "_blank")}
          className="flex h-7 items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-[var(--commandly-text-secondary)] transition-colors hover:bg-[var(--commandly-background)] hover:text-[var(--commandly-primary)]"
        >
          <FiExternalLink className="h-3 w-3" />
          Visit Source
        </button>
      </div>
    </div>
  );
}
