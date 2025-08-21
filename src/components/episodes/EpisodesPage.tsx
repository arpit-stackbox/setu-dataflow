"use client";

import { useState, useMemo, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EpisodesTable } from "@/components/episodes/EpisodesTable";
import { PaginationComponent } from "@/components/layout/PaginationComponent";
import { mockEpisodes } from "@/lib/mock-episodes";
import { DEFAULT_ITEMS_PER_PAGE } from "@/lib/constants";

interface EpisodesPageProps {
  routineId?: string;
  routineName?: string;
  onBack?: () => void;
}

/**
 * EpisodesPage component - Display episodes for a specific routine
 * Includes back navigation and pagination
 * Follows copilot instructions: under 200 lines, responsive design
 */
export function EpisodesPage({
  routineId = "1",
  routineName = "Customer Data Sync",
  onBack,
}: EpisodesPageProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter episodes by routine ID and memoize for performance
  const filteredEpisodes = useMemo(() => {
    return mockEpisodes.filter((episode) => episode.routineId === routineId);
  }, [routineId]);

  // Pagination logic - memoized for performance
  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE;
    const endIndex = startIndex + DEFAULT_ITEMS_PER_PAGE;
    return filteredEpisodes.slice(startIndex, endIndex);
  }, [filteredEpisodes, currentPage]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      // Default back navigation (could use router.back() in a real app)
      window.history.back();
    }
  }, [onBack]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Episodes
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {routineName} • {filteredEpisodes.length} episodes
            </p>
          </div>
        </div>
      </div>

      {/* Episodes Table */}
      <EpisodesTable episodes={paginatedEpisodes} />

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalItems={filteredEpisodes.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
