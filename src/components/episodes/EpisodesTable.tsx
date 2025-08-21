import { Badge } from "@/components/ui/badge";
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

  const formatDataSize = useCallback((sizeInMB?: number): string => {
    if (!sizeInMB) return "-";
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  }, []);

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
                    {formatDateTime(episode.startTime)}
                  </p>
                </div>
                <Badge className={`ml-2 ${getStatusBadge(episode.status)}`}>
                  {episode.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-1 font-medium">
                    {formatDuration(episode.duration)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Data:</span>
                  <span className="ml-1 font-medium">
                    {formatDataSize(episode.dataProcessed)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Records:</span>
                  <span className="ml-1 font-medium">
                    {episode.recordsProcessed?.toLocaleString() || "-"}
                  </span>
                </div>
                {episode.errorMessage && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Error:</span>
                    <span className="ml-1 text-red-600 text-xs">
                      {episode.errorMessage}
                    </span>
                  </div>
                )}
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
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[100px]">
                Episode ID
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[120px]">
                Status
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[160px]">
                Start Time
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[160px]">
                End Time
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[100px]">
                Duration
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[120px]">
                Data Processed
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[120px]">
                Records
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[200px]">
                Error Message
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {episodes.map((episode) => (
              <TableRow
                key={episode.id}
                className="border-b border-gray-100 hover:bg-gray-50/50"
              >
                <TableCell className="py-3 lg:py-4 font-medium text-blue-600">
                  {episode.id}
                </TableCell>
                <TableCell className="py-3 lg:py-4">
                  <Badge className={getStatusBadge(episode.status)}>
                    {episode.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 lg:py-4 text-sm text-gray-600">
                  {formatDateTime(episode.startTime)}
                </TableCell>
                <TableCell className="py-3 lg:py-4 text-sm text-gray-600">
                  {episode.endTime ? formatDateTime(episode.endTime) : "-"}
                </TableCell>
                <TableCell className="py-3 lg:py-4 text-sm text-gray-900 font-medium">
                  {formatDuration(episode.duration)}
                </TableCell>
                <TableCell className="py-3 lg:py-4 text-sm text-gray-600">
                  {formatDataSize(episode.dataProcessed)}
                </TableCell>
                <TableCell className="py-3 lg:py-4 text-sm text-gray-600">
                  {episode.recordsProcessed?.toLocaleString() || "-"}
                </TableCell>
                <TableCell className="py-3 lg:py-4 text-sm text-red-600 max-w-[200px] truncate">
                  {episode.errorMessage || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
