/**
 * Routines API Client
 * Handles direct communication with the routines API endpoint
 */

import { apiConfig } from '@/config/api';
import { RoutinesApiServiceResponse, RoutinesApiResponse, EpisodesApiResponse, ApiEpisodeItem } from '../types/api-types';

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
   * Fetch latest episode for a specific routine
   */
  async getLatestEpisode(routineId: string): Promise<ApiEpisodeItem | null> {
    const searchParams = new URLSearchParams({
      limit: '1',
      offset: '0',
      reverse: 'true',
    });

    const url = `${this.baseUrl}/api/routines/${routineId}/episodes?${searchParams}`;

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
        if (response.status === 404) {
          // No episodes found for this routine
          return null;
        }
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      // Parse response body (array of episodes)
      const episodes: EpisodesApiResponse = await response.json();
      
      // Return the latest episode (first in reversed list) or null
      const latestEpisode = episodes.length > 0 ? episodes[0] : null;

      // Log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Routines API] GET ${url} → ${response.status} (latest episode: ${latestEpisode?.id || 'none'})`);
      }

      return latestEpisode;
    } catch (error) {
      // Log error
      console.error(`[Routines API] GET ${url} → Error:`, error);
      
      // Return null instead of throwing for episodes (non-critical)
      return null;
    }
  }

  /**
   * Fetch latest episodes for current page routines (typically 10 routines)
   * All requests run in parallel for maximum performance
   */
  async getLatestEpisodesForRoutines(routineIds: string[]): Promise<Map<string, ApiEpisodeItem>> {
    const episodeMap = new Map<string, ApiEpisodeItem>();

    if (routineIds.length === 0) {
      return episodeMap;
    }

    const startTime = Date.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Routines API] Fetching episodes for ${routineIds.length} routines in parallel`);
    }

    // Execute all episode requests in parallel
    const promises = routineIds.map(async (routineId) => {
      try {
        const episode = await this.getLatestEpisode(routineId);
        return { routineId, episode, success: true };
      } catch (error) {
        console.error(`[Routines API] Failed to fetch episode for routine ${routineId}:`, error);
        return { routineId, episode: null, success: false };
      }
    });

    // Wait for all requests to complete
    const results = await Promise.all(promises);
    
    // Process results
    let successCount = 0;
    results.forEach(({ routineId, episode, success }) => {
      if (episode) {
        episodeMap.set(routineId, episode);
        successCount++;
      }
    });

    const duration = Date.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Routines API] Completed ${successCount}/${routineIds.length} episode requests in ${duration}ms`);
    }

    return episodeMap;
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
