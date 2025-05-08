import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "default" | "large" | "xlarge";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "default",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    default: "max-w-lg",
    large: "max-w-5xl",
    xlarge: "max-w-[90rem]", // ~1440px
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4 sm:p-6 md:p-8"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-xl bg-[var(--commandly-hover)] shadow-2xl transform transition-all duration-200 scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 mb-4 flex items-center justify-between border-b border-white/10 p-6 pb-4">
          <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--commandly-text-secondary)] hover:bg-[var(--commandly-background)] hover:text-[var(--commandly-primary)] transition-colors duration-200"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 pt-0 text-[var(--commandly-text-primary)]">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
