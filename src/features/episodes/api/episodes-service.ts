import { mockEpisodes } from '@/__mocks__/mock-episodes';
import { episodesApiClient } from './episodes-client';
import type { EpisodesFilters, EpisodesResponse, RoutineInfo } from './types';

/**
 * Episodes Service Layer
 * Provides high-level functions for episodes operations
 */

/**
 * Fetch episodes with server-side filtering and pagination
 * Now uses real API integration with the staging environment
 */
export const getEpisodes = async (params: EpisodesFilters & { routineName?: string }): Promise<EpisodesResponse> => {
  return episodesApiClient.getEpisodes(params);
};

/**
 * Get routine info by ID
 * Now uses real API instead of mock data
 */
export const getRoutineInfo = async (routineId: string): Promise<RoutineInfo | null> => {
  return episodesApiClient.getRoutineInfo(routineId);
};

/**
 * Get episode status types for filter dropdown
 */
export async function getEpisodeStatusTypes(): Promise<string[]> {
  // In a real app, this might come from a separate API endpoint
  const statuses = Array.from(new Set(mockEpisodes.map(episode => episode.status)));
  return ['All Types', ...statuses];
}
