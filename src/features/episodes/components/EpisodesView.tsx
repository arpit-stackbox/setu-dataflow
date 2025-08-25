"use client";

import { useState, useCallback, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EpisodesResponse } from "../episodes-api";
import { EpisodesTable } from "./EpisodesTable";
import { CompactPaginationComponent } from "@/components/layout/CompactPaginationComponent";
import { DEFAULT_EPISODES_PER_PAGE } from "@/lib/constants";

interface EpisodesViewProps {
  initialData: EpisodesResponse;
  episodeStatusTypes: string[];
  routineInfo: {
    id: string;
    name: string;
  };
}

/**
 * EpisodesView - Client Component for interactive functionality
 * Handles the header, back navigation, and episode table with pagination
 */
export function EpisodesView({ initialData, routineInfo }: EpisodesViewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Handle back navigation
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  // Filter episodes by current page for pagination
  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * DEFAULT_EPISODES_PER_PAGE;
    const endIndex = startIndex + DEFAULT_EPISODES_PER_PAGE;
    return initialData.episodes.slice(startIndex, endIndex);
  }, [initialData.episodes, currentPage]);

  return (
    <>
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="default"
            onClick={handleBack}
            className="p-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Episodes
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {routineInfo.name} • {initialData.totalCount} episodes
            </p>
          </div>
        </div>
      </div>

      {/* Compact pagination - Gmail style */}
      <div className="flex justify-end mb-4">
        <CompactPaginationComponent
          currentPage={currentPage}
          totalItems={initialData.totalCount}
          onPageChange={setCurrentPage}
          itemsPerPage={DEFAULT_EPISODES_PER_PAGE}
        />
      </div>

      {/* Episodes Table with built-in search and filtering */}
      <EpisodesTable
        episodes={paginatedEpisodes}
        hasAnyEpisodes={initialData.totalCount > 0}
      />
    </>
  );
}
