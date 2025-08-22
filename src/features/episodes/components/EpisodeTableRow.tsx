import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Episode } from "../types/episode";
import { STATUS_BADGE_CONFIG, DEFAULT_STATUS_BADGE } from "@/lib/constants";
import { formatDurationWithStatus, formatRetryInfo } from "@/lib/episode-utils";
import { ProgressBar } from "./ProgressBar";

interface EpisodeTableRowProps {
  episode: Episode;
}

/**
 * EpisodeTableRow component - Desktop table row for episodes
 * Displays episode information in table format
 */
export function EpisodeTableRow({ episode }: EpisodeTableRowProps) {
  const getStatusBadge = (status: string): string => {
    return STATUS_BADGE_CONFIG.get(status) || DEFAULT_STATUS_BADGE;
  };

  return (
    <TableRow
      key={episode.id}
      className="border-b border-gray-100 hover:bg-gray-50/50"
    >
      {/* Episode Column */}
      <TableCell className="py-3 lg:py-4">
        <div className="space-y-1">
          <div className="font-medium text-blue-600">#{episode.id}</div>
          <div className="text-xs text-gray-500">
            {new Date(episode.startTime).toLocaleString()}
          </div>
        </div>
      </TableCell>

      {/* Status Column */}
      <TableCell className="py-3 lg:py-4">
        <Badge className={getStatusBadge(episode.status)}>
          {episode.status}
        </Badge>
      </TableCell>

      {/* Progress Column */}
      <TableCell className="py-3 lg:py-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>{episode.progress}%</span>
          </div>
          <ProgressBar progress={episode.progress} />
          <div className="text-xs text-gray-500">
            {episode.steps.completed}/{episode.steps.total} steps
          </div>
        </div>
      </TableCell>

      {/* Error Details Column */}
      <TableCell className="py-3 lg:py-4 text-sm text-red-600 max-w-[200px]">
        <div
          className="line-clamp-3 leading-relaxed"
          title={episode.errorDetails}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {episode.errorDetails || "-"}
        </div>
      </TableCell>

      {/* Duration Column */}
      <TableCell className="py-3 lg:py-4 text-sm text-gray-900 font-medium">
        {formatDurationWithStatus(episode)}
      </TableCell>

      {/* Retry Info Column */}
      <TableCell className="py-3 lg:py-4 text-sm text-gray-600">
        <div className="space-y-1">
          <div>{formatRetryInfo(episode.retryInfo)}</div>
          {episode.retryInfo.nextRetryAt && (
            <div className="text-xs text-blue-600">
              Next:{" "}
              {new Date(episode.retryInfo.nextRetryAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      </TableCell>

      {/* Actions Column */}
      <TableCell className="py-3 lg:py-4">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs"
          title="Download Payload"
        >
          <Download className="w-4 h-4 mr-1" />
          Payload
        </Button>
      </TableCell>
    </TableRow>
  );
}
