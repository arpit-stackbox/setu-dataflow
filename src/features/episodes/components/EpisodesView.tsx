"use client";

import { useState, useCallback, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EpisodesResponse } from "../api";
import { EpisodesTable } from "./EpisodesTable";
import { EpisodeSearchAndFilter } from "./EpisodeSearchAndFilter";
import { CompactPaginationComponent } from "@/components/layout/CompactPaginationComponent";
import { DEFAULT_EPISODES_PER_PAGE } from "@/lib/constants";
import { formatEpisodeTitle } from "@/lib/episode-utils";

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
 * Handles the header, back navigation, search/filtering, and episode table with pagination
 */
export function EpisodesView({ initialData, routineInfo }: EpisodesViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>();

  // Handle back navigation
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  // Handle filter changes from search component
  const handleFiltersChange = useCallback(
    (query: string, type: string, range?: { start: string; end: string }) => {
      setSearchQuery(query);
      setSelectedType(type);
      setDateRange(range);
      setCurrentPage(1); // Reset to first page when filters change
    },
    []
  );

  // Filter episodes based on search criteria
  const filteredEpisodes = useMemo(() => {
    return initialData.episodes.filter((episode) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        episode.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatEpisodeTitle(episode)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        episode.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.errorDetails?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        selectedType === "All Types" || episode.status === selectedType;

      // Date range filter
      const episodeDate = new Date(episode.startTime);
      const matchesDateRange =
        !dateRange ||
        (episodeDate >= new Date(dateRange.start) &&
          episodeDate <= new Date(dateRange.end));

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [initialData.episodes, searchQuery, selectedType, dateRange]);

  // Filter episodes by current page for pagination
  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * DEFAULT_EPISODES_PER_PAGE;
    const endIndex = startIndex + DEFAULT_EPISODES_PER_PAGE;
    return filteredEpisodes.slice(startIndex, endIndex);
  }, [filteredEpisodes, currentPage]);

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
              {routineInfo.name} • {filteredEpisodes.length} of{" "}
              {initialData.totalCount} episodes
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6">
        <EpisodeSearchAndFilter onFiltersChange={handleFiltersChange} />
      </div>

      {/* Compact pagination - Gmail style */}
      <div className="flex justify-end mb-4">
        <CompactPaginationComponent
          currentPage={currentPage}
          totalItems={filteredEpisodes.length}
          onPageChange={setCurrentPage}
          itemsPerPage={DEFAULT_EPISODES_PER_PAGE}
        />
      </div>

      {/* Episodes Table */}
      <EpisodesTable
        episodes={paginatedEpisodes}
        hasAnyEpisodes={initialData.totalCount > 0}
      />
    </>
  );
}
