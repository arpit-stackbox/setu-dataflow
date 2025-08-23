"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Check } from "lucide-react";
import { Episode, PayloadFile } from "../types/episode";

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
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // Handle escape key
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

  const handleFileToggle = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const handleSelectAll = () => {
    if (!episode.payloadFiles) return;

    if (selectedFiles.size === episode.payloadFiles.length) {
      // Deselect all
      setSelectedFiles(new Set());
    } else {
      // Select all
      setSelectedFiles(new Set(episode.payloadFiles.map((file) => file.id)));
    }
  };

  const handleDownload = () => {
    if (!episode.payloadFiles || selectedFiles.size === 0) return;

    // Filter selected files
    const filesToDownload = episode.payloadFiles.filter((file) =>
      selectedFiles.has(file.id)
    );

    // Download each selected file
    filesToDownload.forEach((file) => {
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = file.downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Close modal after download
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeColor = (type: PayloadFile["type"]) => {
    switch (type) {
      case "input":
        return "text-blue-600 bg-blue-50";
      case "output":
        return "text-green-600 bg-green-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (!isOpen) return null;

  if (!episode.payloadFiles || episode.payloadFiles.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Episode #{episode.id} Payload
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="py-4 text-center text-gray-500">
            No payload files available for this episode.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Episode #{episode.id} Payload
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="space-y-4">
            {/* Select All Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <label className="text-sm font-medium text-gray-700">
                Input Payload Files:
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectedFiles.size === episode.payloadFiles.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            {/* File List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {episode.payloadFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleFileToggle(file.id)}
                >
                  {/* Custom Checkbox */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedFiles.has(file.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedFiles.has(file.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getFileTypeColor(
                          file.type
                        )}`}
                      >
                        {file.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <Button
            onClick={handleDownload}
            disabled={selectedFiles.size === 0}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Payload ({selectedFiles.size} file
            {selectedFiles.size !== 1 ? "s" : ""})
          </Button>
        </div>
      </div>
    </div>
  );
}
