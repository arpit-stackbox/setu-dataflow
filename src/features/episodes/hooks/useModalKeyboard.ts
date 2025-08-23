import { useEffect } from "react";

interface UseModalKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Custom hook for handling modal keyboard interactions and body scroll
 * Manages escape key and body overflow when modal is open
 */
export function useModalKeyboard({ isOpen, onClose }: UseModalKeyboardProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);
}
