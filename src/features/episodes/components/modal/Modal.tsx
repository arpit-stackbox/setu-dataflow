import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalBackdropProps {
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Reusable modal backdrop component
 * Provides backdrop blur and click-to-close functionality
 */
export function ModalBackdrop({ onClose, children }: ModalBackdropProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {children}
    </div>
  );
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

/**
 * Reusable modal header component
 * Standard header with title and close button
 */
export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface ModalContentProps {
  children: React.ReactNode;
}

/**
 * Reusable modal content wrapper
 * Provides scrollable content area with proper spacing
 */
export function ModalContent({ children }: ModalContentProps) {
  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface ModalFooterProps {
  children: React.ReactNode;
}

/**
 * Reusable modal footer component
 * Provides consistent footer styling and spacing
 */
export function ModalFooter({ children }: ModalFooterProps) {
  return <div className="p-6 border-t">{children}</div>;
}
