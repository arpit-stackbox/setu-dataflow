"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Download, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Episode } from "../types/episode";
import { STATUS_BADGE_CONFIG, DEFAULT_STATUS_BADGE } from "@/lib/constants";
import {
  formatDurationWithStatus,
  formatRetryInfo,
  formatDateTime,
  formatEpisodeTitle,
} from "@/lib/episode-utils";
import { ProgressBar } from "./ProgressBar";
import { ExecutionProgressCard } from "./ExecutionProgressCard";
import { RetryInfoCard } from "./RetryInfoCard";
import { FullErrorDetailsCard } from "./FullErrorDetailsCard";

interface EpisodeTableRowProps {
  episode: Episode;
  onOpenModal: (episode: Episode) => void;
}

/**
 * EpisodeTableRow component - Desktop table row for episodes
 * Displays episode information in table format with expandable details
 */
export function EpisodeTableRow({
  episode,
  onOpenModal,
}: EpisodeTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: string): string => {
    return STATUS_BADGE_CONFIG.get(status) || DEFAULT_STATUS_BADGE;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePayloadDownload = () => {
    onOpenModal(episode);
  };

  return (
    <>
      <TableRow
        key={episode.id}
        className="border-b border-gray-100 hover:bg-gray-50/50"
      >
        {/* Expand/Collapse Arrow */}
        <TableCell className="py-3 lg:py-4 w-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>

        {/* Episode Column */}
        <TableCell className="py-3 lg:py-4">
          <div className="space-y-1">
            <div className="font-medium text-blue-600">
              {formatEpisodeTitle(episode)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDateTime(episode.startTime)}
            </div>
          </div>
        </TableCell>

        {/* Status Column */}
        <TableCell className="py-3 lg:py-4">
          <Badge className={getStatusBadge(episode.state)}>
            {episode.state}
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
            onClick={handlePayloadDownload}
          >
            <Download className="w-4 h-4 mr-1" />
            Payload
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded Details Row */}
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={8} className="p-0 border-b border-gray-100">
            <div className="bg-gray-50 p-4 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Execution Progress Card - Always Present */}
                <ExecutionProgressCard episode={episode} />

                {/* Retry Info Card - Only for Failed Episodes */}
                <RetryInfoCard episode={episode} />
              </div>

              {/* Full Error Details Card - Spans full width */}
              <FullErrorDetailsCard episode={episode} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
