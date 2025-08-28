/**
 * Routines Service
 * Service layer functions for routines operations
 */

import { mockRoutines } from '@/__mocks__/mock-routines';
import { apiConfig } from '@/config/api';
import { routinesApiClient } from './routines-client';
import { mapApiRoutineToRoutine } from '../types/api-types';
import { RoutinesFilters, RoutinesResponse } from './types';

/**
 * Fetch routines with server-side filtering and pagination
 * Uses real API when feature flag is enabled, otherwise falls back to mock data
 */
export async function getRoutines(filters: RoutinesFilters = {}): Promise<RoutinesResponse> {
  const {
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

  // Simple pagination without filtering (to match API behavior)
  const totalCount = mockRoutines.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedRoutines = mockRoutines.slice(startIndex, endIndex);

  return {
    routines: paginatedRoutines,
    totalCount,
    currentPage: page,
    totalPages
  };
}

/**
 * Get routine types for filter dropdown
 * Fetches a sample of routines only once to extract all available types
 */
let cachedRoutineTypes: string[] | null = null;

export async function getRoutineTypes(): Promise<string[]> {
  // Return cached types if already fetched
  if (cachedRoutineTypes) {
    return cachedRoutineTypes;
  }

  if (apiConfig.useRealApi) {
    try {
      // Fetch all routines to get complete type diversity
      const apiResponse = await routinesApiClient.getRoutines({
        nodeCode: apiConfig.defaults.nodeCode,
        includeDeleted: false,
        offset: 0,
        limit: 1000, // Get all routines to ensure we have all types
        sortMethod: 'title_asc'
      });

      const routines = apiResponse.data.map(apiRoutine => mapApiRoutineToRoutine(apiRoutine));
      const types = Array.from(new Set(routines.map(routine => routine.type)));
      
      cachedRoutineTypes = ['All Types', ...types.sort()];
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Routines Service] Extracted types from API sample (${apiResponse.data.length} routines):`, types);
      }
      
      return cachedRoutineTypes;
    } catch (error) {
      console.error('[Routines Service] Failed to fetch types from API, using mock data:', error);
      // Fall back to mock data
    }
  }

  // Mock data fallback (original logic)
  const types = Array.from(new Set(mockRoutines.map(routine => routine.type)));
  cachedRoutineTypes = ['All Types', ...types];
  return cachedRoutineTypes;
}
