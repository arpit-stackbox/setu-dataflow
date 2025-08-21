import { EpisodesPage } from "@/components/episodes/EpisodesPage";

interface EpisodePageProps {
  params: Promise<{
    routineId: string;
  }>;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { routineId } = await params;
  return <EpisodesPage routineId={routineId} />;
}
