import { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-lg bg-[var(--commandly-hover)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[var(--commandly-text-secondary)] hover:bg-[var(--commandly-background)] hover:text-[var(--commandly-primary)]"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="text-[var(--commandly-text-primary)]">{children}</div>
      </div>
    </div>
  );
}
