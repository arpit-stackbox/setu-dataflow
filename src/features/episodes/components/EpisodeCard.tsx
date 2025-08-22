import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Episode } from "../types/episode";
import { STATUS_BADGE_CONFIG, DEFAULT_STATUS_BADGE } from "@/lib/constants";
import { formatDurationWithStatus, formatRetryInfo } from "@/lib/episode-utils";
import { ProgressBar } from "./ProgressBar";

interface EpisodeCardProps {
  episode: Episode;
}

/**
 * EpisodeCard component - Mobile card view for episodes
 * Displays episode information in a compact card format
 */
export function EpisodeCard({ episode }: EpisodeCardProps) {
  const getStatusBadge = (status: string): string => {
    return STATUS_BADGE_CONFIG.get(status) || DEFAULT_STATUS_BADGE;
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            Episode {episode.id}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(episode.startTime).toLocaleString()}
          </p>
        </div>
        <Badge className={`ml-2 ${getStatusBadge(episode.status)}`}>
          {episode.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Progress:</span>
            <span className="font-medium">{episode.progress}%</span>
          </div>
          <ProgressBar progress={episode.progress} />
          <div className="text-xs text-gray-500 mt-1">
            {episode.steps.completed}/{episode.steps.total} steps
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Duration:</span>
            <span className="ml-1 font-medium">
              {formatDurationWithStatus(episode)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Retry Info:</span>
            <div className="ml-1">
              <span className="font-medium">
                {formatRetryInfo(episode.retryInfo)}
              </span>
              {episode.retryInfo.nextRetryAt && (
                <div className="text-xs text-blue-600 mt-1">
                  Next:{" "}
                  {new Date(episode.retryInfo.nextRetryAt).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          {episode.errorDetails && (
            <div>
              <span className="text-gray-500">Error:</span>
              <div
                className="ml-1 text-red-600 text-xs block mt-1 leading-relaxed"
                title={episode.errorDetails}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {episode.errorDetails}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            title="Download Payload"
          >
            <Download className="w-3 h-3 mr-1" />
            Payload
          </Button>
        </div>
      </div>
    </div>
  );
}
