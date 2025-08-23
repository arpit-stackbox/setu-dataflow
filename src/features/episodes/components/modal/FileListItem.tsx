import { PayloadFile } from "../../types/episode";
import { formatFileSize, getFileTypeColor } from "../../utils/fileUtils";
import { CustomCheckbox } from "./CustomCheckbox";

interface FileListItemProps {
  file: PayloadFile;
  isSelected: boolean;
  onToggle: () => void;
}

/**
 * Individual file list item component
 * Displays file information with selection checkbox
 */
export function FileListItem({
  file,
  isSelected,
  onToggle,
}: FileListItemProps) {
  const fileTypeColorClass = getFileTypeColor(file.type);

  return (
    <div
      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
      onClick={onToggle}
    >
      <CustomCheckbox
        checked={isSelected}
        onChange={onToggle}
        id={`file-${file.id}`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span
            id={`file-${file.id}`}
            className="text-sm font-medium text-gray-900 truncate"
          >
            {file.name}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${fileTypeColorClass}`}
          >
            {file.type}
          </span>
        </div>
        <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
      </div>
    </div>
  );
}
