import { Button } from "@/components/ui/button";
import { PayloadFile } from "../../types/episode";
import { FileListItem } from "./FileListItem";

interface FileSelectionSectionProps {
  files: PayloadFile[];
  selectedFiles: Set<string>;
  onFileToggle: (fileId: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

/**
 * File selection section component
 * Contains the file list and select all functionality
 */
export function FileSelectionSection({
  files,
  selectedFiles,
  onFileToggle,
  onSelectAll,
  isAllSelected,
}: FileSelectionSectionProps) {
  return (
    <>
      {/* Select All Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <label className="text-sm font-medium text-gray-700">
          Payload files:
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          className="text-xs"
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>

      {/* File List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map((file) => (
          <FileListItem
            key={file.id}
            file={file}
            isSelected={selectedFiles.has(file.id)}
            onToggle={() => onFileToggle(file.id)}
          />
        ))}
      </div>
    </>
  );
}
