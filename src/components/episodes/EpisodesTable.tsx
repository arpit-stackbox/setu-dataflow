import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Episode } from "@/types/episode";
import { STATUS_BADGE_CONFIG, DEFAULT_STATUS_BADGE } from "@/lib/constants";
import { useCallback } from "react";
import { RotateCcw, Eye, Play, Download } from "lucide-react";

interface EpisodesTableProps {
  episodes: Episode[];
}

/**
 * EpisodesTable component - Displays episode data in responsive table format
 * Includes internal utilities and formatting functions
 * Follows copilot instructions: under 200 lines, optimized performance
 */
export function EpisodesTable({ episodes }: EpisodesTableProps) {
  // Memoized utility functions for better performance
  const getStatusBadge = useCallback((status: string): string => {
    return STATUS_BADGE_CONFIG.get(status) || DEFAULT_STATUS_BADGE;
  }, []);

  const formatDateTime = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }, []);

  const formatDuration = useCallback((duration?: number): string => {
    if (!duration) return "-";

    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }, []);

  const formatDurationWithStatus = useCallback(
    (episode: Episode): string => {
      if (!episode.duration) return "-";

      const formattedDuration = formatDuration(episode.duration);

      if (episode.status === "Running") {
        return `${formattedDuration} (ongoing)`;
      }

      return formattedDuration;
    },
    [formatDuration]
  );

  const formatRetryInfo = useCallback(
    (retryInfo: Episode["retryInfo"]): string => {
      return `${retryInfo.currentAttempt}/${retryInfo.maxAttempts}`;
    },
    []
  );

  const ProgressBar = useCallback(
    ({ progress }: { progress: number }) => (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    ),
    []
  );

  return (
    <Card className="overflow-hidden">
      {/* Mobile card view for small screens */}
      <div className="block sm:hidden">
        <div className="divide-y divide-gray-200">
          {episodes.map((episode) => (
            <div key={episode.id} className="p-4 space-y-3">
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
                          {new Date(
                            episode.retryInfo.nextRetryAt
                          ).toLocaleTimeString()}
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
          ))}
        </div>
      </div>

      {/* Desktop table view for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[80px]">
                Episode
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[100px]">
                Status
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[120px]">
                Progress
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[200px]">
                Error Details
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[100px]">
                Duration
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[100px]">
                Retry Info
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[120px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {episodes.map((episode) => (
              <TableRow
                key={episode.id}
                className="border-b border-gray-100 hover:bg-gray-50/50"
              >
                <TableCell className="py-3 lg:py-4">
                  <div className="space-y-1">
                    <div className="font-medium text-blue-600">
                      #{episode.id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(episode.startTime).toLocaleString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 lg:py-4">
                  <Badge className={getStatusBadge(episode.status)}>
                    {episode.status}
                  </Badge>
                </TableCell>
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
                <TableCell className="py-3 lg:py-4 text-sm text-gray-900 font-medium">
                  {formatDurationWithStatus(episode)}
                </TableCell>
                <TableCell className="py-3 lg:py-4 text-sm text-gray-600">
                  <div className="space-y-1">
                    <div>{formatRetryInfo(episode.retryInfo)}</div>
                    {episode.retryInfo.nextRetryAt && (
                      <div className="text-xs text-blue-600">
                        Next:{" "}
                        {new Date(
                          episode.retryInfo.nextRetryAt
                        ).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
