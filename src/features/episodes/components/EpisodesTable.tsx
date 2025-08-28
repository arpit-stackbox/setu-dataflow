"use client";

import { useState, useCallback } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Episode } from "../types/episode";
import { EpisodeTableHeader } from "./EpisodeTableHeader";
import { EpisodeTableRow } from "./EpisodeTableRow";
import { EpisodeCard } from "./EpisodeCard";
import { PayloadDownloadModal } from "./modal/PayloadDownloadModal";

interface EpisodesTableProps {
  episodes: Episode[];
  hasAnyEpisodes: boolean;
}

/**
 * EpisodesTable component - Displays episode data in responsive format
 * Uses extracted components for maintainability
 * Desktop: Table format, Mobile: Card format
 */
export function EpisodesTable({
  episodes,
  hasAnyEpisodes,
}: EpisodesTableProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    episode: Episode | null;
  }>({
    isOpen: false,
    episode: null,
  });

  // Handle modal open/close
  const handleOpenModal = useCallback((episode: Episode) => {
    setModalState({ isOpen: true, episode });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ isOpen: false, episode: null });
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-lg border border-gray-200 bg-white shadow-sm">
          <Table>
            <EpisodeTableHeader />
            <TableBody>
              {episodes.map((episode) => (
                <EpisodeTableRow
                  key={episode.id}
                  episode={episode}
                  onOpenModal={handleOpenModal}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>

        {/* Empty State */}
        {episodes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {hasAnyEpisodes ? (
              <>
                <p className="text-lg font-medium">No episodes found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">No episodes yet</p>
                <p className="text-sm">
                  This routine hasn&apos;t run any episodes
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal rendered outside table structure */}
      {modalState.episode && (
        <PayloadDownloadModal
          episode={modalState.episode}
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
