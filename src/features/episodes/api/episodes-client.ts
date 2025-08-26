import { routinesApiClient } from '@/features/routines/api/routines-client';
import { mapApiEpisodeToEpisode } from '@/features/routines/types/api-types';
import { mockRoutines } from '@/__mocks__/mock-routines';
import type { EpisodesFilters, EpisodesResponse, RoutineInfo } from './types';

/**
 * Episodes API Client
 * Handles all episodes-related API interactions
 */
export class EpisodesApiClient {
  /**
   * Fetch episodes with server-side filtering and pagination
   * Now uses real API integration with the staging environment
   */
  async getEpisodes({
    routineId,
    page = 1,
    limit = 50,
    search = '',
    status = 'All Types',
    dateRange,
    routineName = 'Unknown Routine'
  }: EpisodesFilters & { routineName?: string }): Promise<EpisodesResponse> {
    try {
      const offset = (page - 1) * limit;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Episodes Service] Fetching episodes for routine ${routineId}: page=${page}, limit=${limit}, offset=${offset}`);
      }

      // Fetch episodes from the real API
      const apiResponse = await routinesApiClient.getEpisodesForRoutine({
        routineId,
        limit,
        offset,
        reverse: true
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Episodes Service] API returned ${apiResponse.episodes.length} episodes (total: ${apiResponse.totalCount})`);
      }

      // Map API episodes to internal Episode format
      const mappedEpisodes = apiResponse.episodes.map(apiEpisode => 
        mapApiEpisodeToEpisode(apiEpisode, routineName)
      );

      // Apply client-side filters if needed (search, status, dateRange)
      const filteredEpisodes = mappedEpisodes.filter((episode) => {
        // Search filter
        const matchesSearch = search === '' ||
          episode.id.toLowerCase().includes(search.toLowerCase()) ||
          episode.status.toLowerCase().includes(search.toLowerCase()) ||
          episode.errorDetails?.toLowerCase().includes(search.toLowerCase());
        
        // Status filter
        const matchesStatus = status === 'All Types' || episode.status === status;
        
        // Date range filter
        const matchesDateRange = !dateRange || (() => {
          const episodeDate = new Date(episode.startTime);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          endDate.setHours(23, 59, 59, 999);
          return episodeDate >= startDate && episodeDate <= endDate;
        })();
        
        return matchesSearch && matchesStatus && matchesDateRange;
      });

      // For now, we'll use the filtered episodes length for total count
      // In a real implementation, the API should support server-side filtering
      const totalCount = apiResponse.totalCount;
      const totalPages = Math.ceil(totalCount / limit);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Episodes Service] Returning ${filteredEpisodes.length} episodes (page ${page}/${totalPages})`);
      }

      // Create pagination slice
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedEpisodes = filteredEpisodes.slice(startIndex, endIndex);

      // Set routine info if episodes exist
      const routineInfo = paginatedEpisodes.length > 0 ? {
        id: routineId,
        name: paginatedEpisodes[0].routineName
      } : { id: routineId, name: 'Unknown Routine' };

      return {
        episodes: paginatedEpisodes,
        totalCount,
        currentPage: page,
        totalPages,
        routineInfo
      };
    } catch (error) {
      console.error(`[Episodes Service] Failed to fetch episodes for routine ${routineId}:`, error);
      
      // Return empty response on error
      return {
        episodes: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        routineInfo: { id: routineId, name: 'Unknown Routine' }
      };
    }
  }

  /**
   * Get routine info by ID
   * Now uses real API instead of mock data
   */
  async getRoutineInfo(routineId: string): Promise<RoutineInfo | null> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Episodes Service] Fetching routine info for ${routineId}`);
      }

      // Fetch routine info from real API
      const routinesResponse = await routinesApiClient.getRoutines({
        nodeCode: process.env.NEXT_PUBLIC_DEFAULT_NODE_CODE || 'test',
        includeDeleted: false,
        offset: 0,
        limit: 1000, // Get all routines to find our specific one
        sortMethod: 'title_asc',
      });
      
      const routine = routinesResponse.data.find(r => r.id === routineId);
      
      if (routine) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Episodes Service] Found routine: ${routine.title}`);
        }
        return { id: routineId, name: routine.title };
      } else {
        console.warn(`[Episodes Service] Routine ${routineId} not found in API response`);
        return null;
      }
    } catch (error) {
      console.error(`[Episodes Service] Failed to fetch routine info for ${routineId}:`, error);
      
      // Fall back to mock data
      const routine = mockRoutines.find(routine => routine.id === routineId);
      return routine ? { id: routineId, name: routine.name } : null;
    }
  }
}

// Export singleton instance
export const episodesApiClient = new EpisodesApiClient();
