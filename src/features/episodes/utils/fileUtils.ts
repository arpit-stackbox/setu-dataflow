import { PayloadFile } from "../types/episode";

/**
 * Utility functions for file operations
 */

/**
 * Downloads a file by creating a temporary anchor element
 */
export function downloadFile(file: PayloadFile): void {
  const link = document.createElement("a");
  link.href = file.downloadUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads multiple files sequentially
 */
export function downloadFiles(files: PayloadFile[]): void {
  files.forEach(downloadFile);
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Gets CSS classes for file type badge
 */
export function getFileTypeColor(type: PayloadFile["type"]): string {
  const colorMap: Record<PayloadFile["type"], string> = {
    input: "text-blue-600 bg-blue-50",
    output: "text-green-600 bg-green-50",
    error: "text-red-600 bg-red-50",
  };
  
  return colorMap[type] || "text-gray-600 bg-gray-50";
}
