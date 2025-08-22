import { Suspense } from "react";
import {
  getEpisodes,
  getEpisodeStatusTypes,
  getRoutineInfo,
  EpisodesView,
  EpisodesLoadingSkeleton,
} from "@/features/episodes";

interface EpisodePageProps {
  params: Promise<{
    routineId: string;
  }>;
}

/**
 * Episodes Page - Server Component
 * Fetches episode data on the server for better performance and SEO
 */
export default async function EpisodePage({ params }: EpisodePageProps) {
  const { routineId } = await params;

  // Server-side data fetching
  const [initialEpisodes, episodeStatusTypes, routineInfo] = await Promise.all([
    getEpisodes({ routineId, page: 1, limit: 1000 }), // Get all episodes for client-side filtering
    getEpisodeStatusTypes(),
    getRoutineInfo(routineId),
  ]);

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
      {/* Episodes View with suspense */}
      <Suspense fallback={<EpisodesLoadingSkeleton />}>
        <EpisodesView
          initialData={initialEpisodes}
          episodeStatusTypes={episodeStatusTypes}
          routineInfo={routineInfo}
        />
      </Suspense>
    </div>
  );
}
