import { useState, useCallback } from "react";
import { PayloadFile } from "../types/episode";

interface UseFileSelectionProps {
  files?: PayloadFile[];
}

interface UseFileSelectionReturn {
  selectedFiles: Set<string>;
  handleFileToggle: (fileId: string) => void;
  handleSelectAll: () => void;
  isAllSelected: boolean;
  selectedCount: number;
}

/**
 * Custom hook for managing file selection state
 * Handles individual file selection and select all functionality
 */
export function useFileSelection({ files }: UseFileSelectionProps): UseFileSelectionReturn {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const handleFileToggle = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(fileId)) {
        newSelection.delete(fileId);
      } else {
        newSelection.add(fileId);
      }
      return newSelection;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!files) return;
    
    setSelectedFiles(prev => {
      if (prev.size === files.length) {
        // Deselect all
        return new Set();
      } else {
        // Select all
        return new Set(files.map(file => file.id));
      }
    });
  }, [files]);

  const isAllSelected = files ? selectedFiles.size === files.length : false;
  const selectedCount = selectedFiles.size;

  return {
    selectedFiles,
    handleFileToggle,
    handleSelectAll,
    isAllSelected,
    selectedCount,
  };
}
