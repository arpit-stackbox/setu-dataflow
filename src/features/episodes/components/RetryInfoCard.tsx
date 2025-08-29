import { Episode } from "../types/episode";
import { formatDateTime } from "@/lib/episode-utils";

interface RetryInfoCardProps {
  episode: Episode;
}

/**
 * RetryInfoCard component - Shows retry information for failed episodes
 * Used in expandable episode rows for both desktop and mobile views
 */
export function RetryInfoCard({ episode }: RetryInfoCardProps) {
  if (episode.state !== "failed" || !episode.retryInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-red-200 p-4">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        Retry Information
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Retry Count</span>
            <div className="font-medium">
              {episode.retryInfo.currentAttempt}/{episode.retryInfo.maxAttempts}
            </div>
          </div>
        </div>
        {episode.retryInfo.nextRetryAt && (
          <div>
            <span className="text-gray-600 text-sm">Next Retry</span>
            <div className="font-medium text-sm text-blue-600">
              {formatDateTime(episode.retryInfo.nextRetryAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
