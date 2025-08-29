import { Episode } from "@/features/episodes/types/episode";

/**
 * Utility functions for formatting episode data
 * Centralized formatting logic for consistency across components
 */

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const formatDuration = (duration?: number): string => {
  if (!duration) return "-";

  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const formatDurationWithStatus = (episode: Episode): string => {
  if (!episode.duration) return "-";

  const formattedDuration = formatDuration(episode.duration);
  
  if (episode.status === 'Running') {
    return `${formattedDuration} (ongoing)`;
  }
  
  return formattedDuration;
};

export const formatRetryInfo = (retryInfo: Episode["retryInfo"]): string => {
  return `${retryInfo.currentAttempt}/${retryInfo.maxAttempts}`;
};

/**
 * Format episode title with fallback logic
 * Priority: title → fallback_title → last 6 characters of ID
 */
export const formatEpisodeTitle = (episode: Episode): string => {
  // First priority: title
  if (episode.title && episode.title.trim()) {
    return episode.title;
  }
  
  // Second priority: fallback_title
  if (episode.fallbackTitle && episode.fallbackTitle.trim()) {
    return episode.fallbackTitle;
  }
  
  // Final fallback: last 6 characters of ID
  return `#${episode.id.slice(-6)}`;
};
