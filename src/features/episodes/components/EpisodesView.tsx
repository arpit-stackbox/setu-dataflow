"use client";

import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EpisodesResponse } from "../api";
import { EpisodesTable } from "./EpisodesTable";
import { EpisodeSearchAndFilter } from "./EpisodeSearchAndFilter";
import { CompactPaginationComponent } from "@/components/layout/CompactPaginationComponent";
import { DEFAULT_EPISODES_PER_PAGE } from "@/lib/constants";
import { episodesApiClient } from "../api/episodes-client";
import { mapApiEpisodeToEpisode } from "../types/api-types";
import { Episode } from "../types/episode";

interface EpisodesViewProps {
  initialData: EpisodesResponse;
  episodeStatusTypes: string[];
  routineInfo: {
    id: string;
    name: string;
  };
}

/**
 * EpisodesView - Simplified for server-side pagination only
 * No client-side filtering - just pure server-side pagination
 */
export function EpisodesView({ initialData, routineInfo }: EpisodesViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>(initialData.episodes);
  const [isLoading, setIsLoading] = useState(false);

  // Handle back navigation
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  // Handle page change with server-side loading
  const handlePageChange = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const offset = (page - 1) * DEFAULT_EPISODES_PER_PAGE;
        console.log(`[Episodes] Loading page ${page}, offset: ${offset}`);

        const episodesResponse = await episodesApiClient.getEpisodesForRoutine({
          routineId: routineInfo.id,
          limit: DEFAULT_EPISODES_PER_PAGE,
          offset,
          reverse: true,
        });

        const mappedEpisodes = episodesResponse.episodes.map((apiEpisode) =>
          mapApiEpisodeToEpisode(apiEpisode, routineInfo.name)
        );

        console.log(
          `[Episodes] Loaded ${mappedEpisodes.length} episodes for page ${page}`
        );
        setEpisodes(mappedEpisodes);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to load episodes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [routineInfo.id, routineInfo.name]
  );

  // Handle filters change (no-op for now)
  const handleFiltersChange = useCallback(
    (query: string, type: string, range?: { start: string; end: string }) => {
      console.log("[Episodes] Filter change (no-op):", { query, type, range });
      // TODO: Implement filtering logic later
    },
    []
  );

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
              {routineInfo.name} • Page {currentPage} of{" "}
              {Math.ceil(initialData.totalCount / DEFAULT_EPISODES_PER_PAGE)}
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
          totalItems={initialData.totalCount}
          onPageChange={handlePageChange}
          itemsPerPage={DEFAULT_EPISODES_PER_PAGE}
        />
      </div>

      {/* Episodes Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading episodes...</div>
        </div>
      ) : (
        <EpisodesTable
          episodes={episodes}
          hasAnyEpisodes={initialData.totalCount > 0}
        />
      )}
    </>
  );
}
