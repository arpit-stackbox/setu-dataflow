import { Suspense } from "react";
import {
  getEpisodeStatusTypes,
  episodesApiClient,
  EpisodesView,
  EpisodesLoadingSkeleton,
} from "@/features/episodes";
import { routinesApiClient } from "@/features/routines/api/routines-client";
import { mapApiEpisodeToEpisode } from "@/features/routines/types/api-types";

interface EpisodePageProps {
  params: Promise<{
    routineId: string;
  }>;
  searchParams: Promise<{
    returnPage?: string;
    routineName?: string;
  }>;
}

/**
 * Episodes Page - Server Component
 * Uses direct episodes API for better performance
 */
export default async function EpisodePage({
  params,
  searchParams,
}: EpisodePageProps) {
  const { routineId } = await params;
  const { routineName } = await searchParams;

  // Server-side data fetching using direct APIs
  const [episodeStatusTypes, episodesResponse] = await Promise.all([
    getEpisodeStatusTypes(),
    // Get episodes directly from episodes API
    episodesApiClient.getEpisodesForRoutine({
      routineId,
      limit: 50,
      offset: 0,
      reverse: true,
    }),
  ]);

  // Use routine name from URL params (from RoutinesTable) or fallback to episode data
  const finalRoutineName =
    routineName ||
    (episodesResponse.episodes.length > 0
      ? episodesResponse.episodes[0].fallback_title ||
        `Routine ${routineId.slice(-8)}`
      : `Routine ${routineId.slice(-8)}`);

  // Create routine info object
  const routineInfo = { id: routineId, name: finalRoutineName };

  if (!routineInfo) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Routine Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The requested routine could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Map episodes to internal format
  const mappedEpisodes = episodesResponse.episodes.map((apiEpisode) =>
    mapApiEpisodeToEpisode(apiEpisode, routineInfo.name)
  );

  const initialEpisodes = {
    episodes: mappedEpisodes,
    totalCount: episodesResponse.totalCount,
    currentPage: 1,
    totalPages: Math.ceil(episodesResponse.totalCount / 50),
    routineInfo: { id: routineId, name: routineInfo.name },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
      {/* Episodes View with suspense */}
      <Suspense fallback={<EpisodesLoadingSkeleton />}>
        <EpisodesView
          initialData={initialEpisodes}
          episodeStatusTypes={episodeStatusTypes}
          routineInfo={{ id: routineId, name: routineInfo.name }}
        />
      </Suspense>
    </div>
  );
}
