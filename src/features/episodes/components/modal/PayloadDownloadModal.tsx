"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Episode } from "../../types/episode";
import { useModalKeyboard } from "../../hooks/useModalKeyboard";
import { useFileSelection } from "../../hooks/useFileSelection";
import { downloadFiles } from "../../utils/fileUtils";
import { ModalBackdrop, ModalHeader, ModalContent, ModalFooter } from "./Modal";
import { FileSelectionSection } from "./FileSelectionSection";

interface PayloadDownloadModalProps {
  episode: Episode;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PayloadDownloadModal component - Modal for selecting and downloading payload files
 * Shows list of payload files with checkboxes for selection
 */
export function PayloadDownloadModal({
  episode,
  isOpen,
  onClose,
}: PayloadDownloadModalProps) {
  const {
    selectedFiles,
    handleFileToggle,
    handleSelectAll,
    isAllSelected,
    selectedCount,
  } = useFileSelection({ files: episode.payloadFiles });

  useModalKeyboard({ isOpen, onClose });

  const handleDownload = () => {
    if (!episode.payloadFiles || selectedCount === 0) return;

    const filesToDownload = episode.payloadFiles.filter((file) =>
      selectedFiles.has(file.id)
    );

    downloadFiles(filesToDownload);
    onClose();
  };

  const modalTitle = `Episode #${episode.id} Payload`;

  if (!isOpen) return null;

  if (!episode.payloadFiles || episode.payloadFiles.length === 0) {
    return (
      <ModalBackdrop onClose={onClose}>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <ModalHeader title={modalTitle} onClose={onClose} />
          <div className="py-4 text-center text-gray-500">
            No payload files available for this episode.
          </div>
        </div>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        <ModalHeader title={modalTitle} onClose={onClose} />

        <ModalContent>
          <FileSelectionSection
            files={episode.payloadFiles}
            selectedFiles={selectedFiles}
            onFileToggle={handleFileToggle}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          />
        </ModalContent>

        <ModalFooter>
          <Button
            onClick={handleDownload}
            disabled={selectedCount === 0}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Payload ({selectedCount} file
            {selectedCount !== 1 ? "s" : ""})
          </Button>
        </ModalFooter>
      </div>
    </ModalBackdrop>
  );
}
