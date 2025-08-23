import { Episode } from "../types/episode";

interface FullErrorDetailsCardProps {
  episode: Episode;
}

/**
 * FullErrorDetailsCard component - Shows complete error details for failed episodes
 * Used in expandable episode rows after other cards
 */
export function FullErrorDetailsCard({ episode }: FullErrorDetailsCardProps) {
  if (!episode.errorDetails) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-red-200 p-4">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        Full Error Details
      </h4>
      <div className="text-sm text-red-600 p-3 bg-red-50 rounded border border-red-100 leading-relaxed">
        {episode.errorDetails}
      </div>
    </div>
  );
}
