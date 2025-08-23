import { Episode } from "../types/episode";
import { ProgressBar } from "./ProgressBar";

interface ExecutionProgressCardProps {
  episode: Episode;
}

/**
 * ExecutionProgressCard component - Shows execution progress details
 * Used in expandable episode rows for both desktop and mobile views
 */
export function ExecutionProgressCard({ episode }: ExecutionProgressCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
        Execution Progress
      </h4>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{episode.progress}%</span>
          </div>
          <ProgressBar progress={episode.progress} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Steps Completed</span>
            <div className="font-medium">
              {episode.steps.completed}/{episode.steps.total}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
