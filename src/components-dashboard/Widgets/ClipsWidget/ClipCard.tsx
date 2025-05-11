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
    const newText = text.replace(/```html|```/g, "").replace(/<[^>]*>?/g, "");
    navigator.clipboard.writeText(newText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = format(new Date(createdAt), "MMM d, yyyy");
  const formattedTime = format(new Date(createdAt), "h:mm a");

  return (
    <div className="w-full overflow-hidden rounded-xl bg-black/25 backdrop-blur-xl border border-white/30 shadow-md hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <div className="rounded-lg bg-white/10 border border-white/30 px-2 py-0.5">
          <span className="font-mono text-xs text-white/85 font-medium">
            {id.substring(0, 8)}...
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/85">
          <FiCalendar className="h-3 w-3" />
          <span className="font-medium">{formattedDate}</span>
          <FiClock className="ml-2 h-3 w-3" />
          <span className="font-medium">{formattedTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-white line-clamp-2">
            {text}
          </h3>
          <button
            onClick={() => copyToClipboard(text)}
            className="flex-none flex h-7 w-7 items-center justify-center rounded-lg text-white/85 hover:bg-white/15 hover:text-white/95 transition-all duration-200"
            title={copied ? "Copied!" : "Copy text"}
          >
            <FiCopy className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-xs text-white/85">
          <FiLink className="h-3.5 w-3.5 flex-none" />
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:text-white/95 hover:underline transition-colors duration-200 font-medium"
          >
            {sourceUrl}
          </a>
        </div>

        {imageUrl && (
          <div className="relative mt-2 overflow-hidden rounded-lg border border-white/30">
            <div className="aspect-[16/7] w-full overflow-hidden bg-black/25">
              <img
                src={imageUrl}
                alt="Clip preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="rounded-lg bg-black/40 backdrop-blur-sm px-2 py-1">
                  <span className="text-xs text-white font-medium">
                    Preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-white/30 px-2 py-1.5">
        <button
          onClick={() => window.open(sourceUrl, "_blank")}
          className="flex h-6 items-center gap-1.5 rounded-lg px-2 text-xs text-white/85 hover:bg-white/15 hover:text-white/95 transition-all duration-200 font-medium"
        >
          <FiExternalLink className="h-3 w-3" />
          Visit Source
        </button>
      </div>
    </div>
  );
}
