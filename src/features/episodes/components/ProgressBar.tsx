interface ProgressBarProps {
  progress: number;
}

/**
 * ProgressBar component - Simple progress bar for episode progress
 * Shows visual progress indicator with percentage-based width
 */
export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
