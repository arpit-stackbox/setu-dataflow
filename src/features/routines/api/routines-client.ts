/**
 * Routines API Client
 * Handles direct communication with the routines API endpoint
 */

import { apiConfig } from '@/config/api';
import { RoutinesApiServiceResponse, RoutinesApiResponse, EpisodesApiResponse, ApiEpisodeItem } from '../types/api-types';
import { episodesApiClient } from '@/features/episodes/api/episodes-client';

export class RoutinesApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiConfig.baseUrl;
  }

  /**
   * Fetch routines from the API
   */
  async getRoutines(params: {
    nodeCode: string;
    includeDeleted?: boolean;
    offset?: number;
    limit?: number;
    sortMethod?: string;
  }): Promise<RoutinesApiServiceResponse> {
    const searchParams = new URLSearchParams({
      node_code: params.nodeCode,
      include_deleted: String(params.includeDeleted ?? false),
      offset: String(params.offset ?? 0),
      limit: String(params.limit ?? 10),
      sort_method: params.sortMethod ?? 'title_asc',
    });

    const url = `${this.baseUrl}/api/routines?${searchParams}`;

    try {
      // Make the API call
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(apiConfig.timeout),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      // Parse response body (array of routines)
      const data: RoutinesApiResponse = await response.json();
      
      // Extract pagination info from headers with fallback logic
      const totalCountHeader = response.headers.get('total-count') || response.headers.get('Total-Count') || '0';
      const totalCount = parseInt(totalCountHeader);
      const offset = params.offset ?? 0;
      const limit = params.limit ?? 10;

      // Validate totalCount - if it's 0 but we have data, something's wrong
      if (totalCount === 0 && data.length > 0) {
        console.warn(`[Routines API] Warning: totalCount=0 but received ${data.length} routines. Header might be missing.`);
      }

      // Log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Routines API] GET ${url} → ${response.status} (${data.length} routines, total: ${totalCount})`);
      }

      return {
        data,
        totalCount,
        offset,
        limit,
      };
    } catch (error) {
      // Log error
      console.error(`[Routines API] GET ${url} → Error:`, error);
      
      // Re-throw with context
      throw new Error(
        `Failed to fetch routines: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Optimized method: Fetch both latest episode and failed count using direct episodes API
   * Uses the new episodes client with direct /api/episodes endpoint
   */
  async getEpisodeDataForRoutine(
    routineId: string, 
    recencyLimitSeconds: number = 604800
  ): Promise<{ latestEpisode: ApiEpisodeItem | null; failedCount: number }> {
    try {
      // Use parallel calls to get both latest episode and failed count
      const [latestEpisode, failedCount] = await Promise.all([
        episodesApiClient.getLatestEpisode(routineId),
        episodesApiClient.getFailedEpisodesCount(routineId, recencyLimitSeconds / 86400) // Convert seconds to days
      ]);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Routines API] Fetched episode data for routine ${routineId}: latest=${latestEpisode?.id?.slice(-8) || 'none'}, ${failedCount} failed in last ${recencyLimitSeconds / 86400} days`);
      }

      return { latestEpisode, failedCount };
    } catch (error) {
      console.error(`[Routines API] Failed to fetch episode data for routine ${routineId}:`, error);
      return { latestEpisode: null, failedCount: 0 };
    }
  }

  /**
   * Optimized batch method: Fetch episode data for multiple routines with parallel API calls
   * Returns both latest episodes and failed counts efficiently
   */
  async getEpisodeDataForRoutines(
    routineIds: string[], 
    recencyLimitSeconds: number = 604800
  ): Promise<{
    episodeMap: Map<string, ApiEpisodeItem>;
    failedCountsMap: Map<string, number>;
  }> {
    const episodeMap = new Map<string, ApiEpisodeItem>();
    const failedCountsMap = new Map<string, number>();

    if (routineIds.length === 0) {
      return { episodeMap, failedCountsMap };
    }

    const startTime = Date.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Routines API] Fetching episode data for ${routineIds.length} routines (parallel calls)`);
    }

    // Make parallel calls for all routines at once (as originally planned)
    const promises = routineIds.map(async (routineId) => {
      try {
        const data = await this.getEpisodeDataForRoutine(routineId, recencyLimitSeconds);
        return { routineId, data, success: true };
      } catch (error) {
        console.error(`[Routines API] Failed to fetch episode data for routine ${routineId}:`, error);
        return { 
          routineId, 
          data: { latestEpisode: null, failedCount: 0 }, 
          success: false 
        };
      }
    });

    const results = await Promise.all(promises);
    
    results.forEach(({ routineId, data }) => {
      if (data.latestEpisode) {
        episodeMap.set(routineId, data.latestEpisode);
      }
      failedCountsMap.set(routineId, data.failedCount);
    });

    const duration = Date.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Routines API] Completed episode data fetching for ${routineIds.length} routines in ${duration}ms (${episodeMap.size} episodes, ${failedCountsMap.size} failed counts)`);
    }

    return { episodeMap, failedCountsMap };
  }

  /**
   * Fetch episodes for a specific routine with pagination
   * Now uses the direct episodes API instead of the routines endpoint
   */
  async getEpisodesForRoutine(params: {
    routineId: string;
    limit?: number;
    offset?: number;
    reverse?: boolean;
  }): Promise<{
    episodes: EpisodesApiResponse;
    totalCount: number;
    offset: number;
    limit: number;
  }> {
    const { routineId, limit = 50, offset = 0, reverse = true } = params;
    
    try {
      // Use the episodes API client for direct episodes endpoint access
      const result = await episodesApiClient.getEpisodesForRoutine({
        routineId,
        limit,
        offset,
        reverse,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Routines API] Fetched ${result.episodes.length} episodes for routine ${routineId} (total: ${result.totalCount})`);
      }

      return {
        episodes: result.episodes as EpisodesApiResponse, // Type assertion for compatibility
        totalCount: result.totalCount,
        offset: result.offset,
        limit: result.limit,
      };
    } catch (error) {
      console.error(`[Routines API] Failed to fetch episodes for routine ${routineId}:`, error);
      throw new Error(
        `Failed to fetch episodes: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Health check for the API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout for health check
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const routinesApiClient = new RoutinesApiClient();
