"use client";

import { useState, useMemo, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EpisodesTable } from "@/components/episodes/EpisodesTable";
import { PaginationComponent } from "@/components/layout/PaginationComponent";
import { EpisodeSearchAndFilter } from "@/components/episodes/EpisodeSearchAndFilter";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [dateRange, setDateRange] = useState<
    { start: string; end: string } | undefined
  >();

  // Filter episodes by routine ID, search query, type, and date range - memoized for performance
  const filteredEpisodes = useMemo(() => {
    return mockEpisodes.filter((episode) => {
      const matchesRoutine = episode.routineId === routineId;
      const matchesSearch =
        episode.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.status.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "All Types" || episode.status === selectedType;

      // Date range filtering
      const matchesDateRange =
        !dateRange ||
        (() => {
          const episodeDate = new Date(episode.startTime);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          endDate.setHours(23, 59, 59, 999); // Include the entire end date
          return episodeDate >= startDate && episodeDate <= endDate;
        })();

      return matchesRoutine && matchesSearch && matchesType && matchesDateRange;
    });
  }, [routineId, searchQuery, selectedType, dateRange]);

  // Handle filter changes including date range
  const handleFiltersChange = useCallback(
    (
      query: string,
      type: string,
      newDateRange?: { start: string; end: string }
    ) => {
      setSearchQuery(query);
      setSelectedType(type);
      setDateRange(newDateRange);
      setCurrentPage(1);
    },
    []
  );

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
              {routineName} • {filteredEpisodes.length} episodes
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <EpisodeSearchAndFilter onFiltersChange={handleFiltersChange} />
      </div>

      <EpisodesTable episodes={paginatedEpisodes} />

      <PaginationComponent
        currentPage={currentPage}
        totalItems={filteredEpisodes.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
