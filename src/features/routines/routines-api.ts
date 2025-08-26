import { Routine } from './types/routine';
import { mockRoutines } from '@/__mocks__/mock-routines';
import { apiConfig } from '@/config/api';
import { routinesApiClient } from './api/routines-client';
import { mapApiRoutineToRoutine } from './types/api-types';

/**
 * Server-side data fetching for routines
 * In a real application, this would fetch from an API or database
 */

export interface RoutinesFilters {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface RoutinesResponse {
  routines: Routine[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Fetch routines with server-side filtering and pagination
 * Uses real API when feature flag is enabled, otherwise falls back to mock data
 */
export async function getRoutines(filters: RoutinesFilters = {}): Promise<RoutinesResponse> {
  const {
    search = '',
    type = 'All Types',
    page = 1,
    limit = 10
  } = filters;

  // Check feature flag for API usage
  if (apiConfig.useRealApi) {
    try {
      // Step 1: Fetch ONLY the current page of routines from API
      const apiResponse = await routinesApiClient.getRoutines({
        nodeCode: apiConfig.defaults.nodeCode,
        includeDeleted: false,
        offset: (page - 1) * limit,
        limit,
        sortMethod: 'title_asc'
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Routines Service] Page ${page}: Requested offset=${(page - 1) * limit}, limit=${limit}`);
        console.log(`[Routines Service] Page ${page}: API returned ${apiResponse.data.length} routines (total: ${apiResponse.totalCount})`);
      }

      // Step 2: Fetch episode data (latest episode + failed counts) in a single optimized call per routine
      const routineIds = apiResponse.data.map(routine => routine.id);
      const { episodeMap, failedCountsMap } = await routinesApiClient.getEpisodeDataForRoutines(routineIds);

      // Step 3: Map routines with their episode data and failed counts
      const routinesWithEpisodes = apiResponse.data.map(apiRoutine => {
        const latestEpisode = episodeMap.get(apiRoutine.id);
        const failedEpisodesCount = failedCountsMap.get(apiRoutine.id) || 0;
        return mapApiRoutineToRoutine(apiRoutine, latestEpisode, failedEpisodesCount);
      });

      // Step 4: For server-side pagination, return all routines from the page
      // Client-side filtering will be handled by the client component if needed
      const finalRoutines = routinesWithEpisodes;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Routines Service] Page ${page}: Returning ${finalRoutines.length} routines (optimized: ${episodeMap.size} episodes + ${failedCountsMap.size} failed counts)`);
      }

      return {
        routines: finalRoutines,
        totalCount: apiResponse.totalCount, // Use API total count
        currentPage: page,
        totalPages: Math.ceil(apiResponse.totalCount / limit)
      };
    } catch (error) {
      // Log error and fall back to mock data
      console.error('[Routines Service] API call failed, falling back to mock data:', error);
      // Continue to mock data logic below
    }
  }

  // Mock data fallback (original logic)
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Server-side filtering
  const filteredRoutines = mockRoutines.filter((routine) => {
    const matchesSearch = search === '' ||
      routine.name.toLowerCase().includes(search.toLowerCase()) ||
      routine.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = type === 'All Types' || routine.type === type;
    
    return matchesSearch && matchesType;
  });

  // Server-side pagination
  const totalCount = filteredRoutines.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedRoutines = filteredRoutines.slice(startIndex, endIndex);

  return {
    routines: paginatedRoutines,
    totalCount,
    currentPage: page,
    totalPages
  };
}

/**
 * Get routine types for filter dropdown
 * Uses real API data when available, otherwise falls back to mock data
 */
export async function getRoutineTypes(): Promise<string[]> {
  if (apiConfig.useRealApi) {
    try {
      // Fetch a reasonable sample to extract types (not all routines)
      const apiResponse = await routinesApiClient.getRoutines({
        nodeCode: apiConfig.defaults.nodeCode,
        includeDeleted: false,
        offset: 0,
        limit: 50, // Fetch 50 routines to get type diversity without fetching all
        sortMethod: 'title_asc'
      });

      const routines = apiResponse.data.map(apiRoutine => mapApiRoutineToRoutine(apiRoutine));
      const types = Array.from(new Set(routines.map(routine => routine.type)));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Routines Service] Extracted types from API sample (${apiResponse.data.length} routines):`, types);
      }
      
      return ['All Types', ...types.sort()];
    } catch (error) {
      console.error('[Routines Service] Failed to fetch types from API, using mock data:', error);
      // Fall back to mock data
    }
  }

  // Mock data fallback (original logic)
  const types = Array.from(new Set(mockRoutines.map(routine => routine.type)));
  return ['All Types', ...types];
}
