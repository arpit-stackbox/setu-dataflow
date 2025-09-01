import { apiConfig } from '@/config/api';
import { isEpisodeFailed } from '../types/api-types';
import type { ApiEpisodeItem } from '../types/api-types';

/**
 * Episodes API Client
 * Handles all episodes-related API interactions using the direct episodes endpoint
 */
export class EpisodesApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiConfig.baseUrl;
  }

  /**
   * Fetch episodes for a specific routine using the direct episodes API
   * This is the primary method for getting episode data
   */
  async getEpisodesForRoutine(params: {
    routineId: string;
    limit?: number;
    offset?: number;
    reverse?: boolean;
    recencyLimit?: number;
  }): Promise<{
    episodes: ApiEpisodeItem[];
    totalCount: number;
    offset: number;
    limit: number;
  }> {
    const { 
      routineId, 
      limit, 
      offset = 0, 
      reverse = true,
      recencyLimit,
    } = params;
    
    const searchParams = new URLSearchParams({
      offset: String(offset),
      reverse: String(reverse),
      routine_id: routineId,
    });

    // Only add limit if explicitly provided
    if (limit !== undefined) {
      searchParams.set('limit', String(limit));
    }

    // Add recency limit only if provided (for failed episode counts)
    if (recencyLimit !== undefined) {
      searchParams.set('recency_limit', String(recencyLimit));
    }

    const url = `${this.baseUrl}/api/episodes?${searchParams}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(apiConfig.timeout),
      });

      if (!response.ok) {
        throw new Error(`Episodes API call failed: ${response.status} ${response.statusText}`);
      }

      const episodes: ApiEpisodeItem[] = await response.json();
      
      // Extract pagination info from headers
      const totalCountHeader = response.headers.get('total-count') || 
                               response.headers.get('x-total-count') || 
                               response.headers.get('Total-Count') || '0';
      const totalCount = parseInt(totalCountHeader) || episodes.length;

      return {
        episodes,
        totalCount,
        offset,
        limit: limit ?? episodes.length, // Use actual episodes length if no limit was set
      };
    } catch (error) {
      console.error(`[Episodes API] Failed to fetch episodes for routine ${routineId}:`, error);
      throw error;
    }
  }

  /**
   * Get the latest episode for a routine (for dashboard/routine list)
   */
  async getLatestEpisode(routineId: string): Promise<ApiEpisodeItem | null> {
    try {
      const result = await this.getEpisodesForRoutine({
        routineId,
        limit: 1,
        offset: 0,
        reverse: true,
      });

      return result.episodes.length > 0 ? result.episodes[0] : null;
    } catch (error) {
      console.error(`[Episodes API] Failed to fetch latest episode for routine ${routineId}:`, error);
      return null;
    }
  }

    /**
   * Get failed episodes count for a routine in the last N days
   */
  async getFailedEpisodesCount(routineId: string, daysBack: number = 7): Promise<number> {
    try {
      // Calculate recency limit in seconds (days * 24 * 60 * 60)
      const recencyLimit = daysBack * 24 * 60 * 60;
      
      const result = await this.getEpisodesForRoutine({
        routineId,
        offset: 0,
        reverse: true,
        recencyLimit, // Only get episodes from last 7 days
      });

      // Analyze episode states for debugging
      const states = result.episodes.map(ep => ep.state).filter(Boolean);
      const uniqueStates = [...new Set(states)];

      // Count failed episodes
      const failedEpisodes = result.episodes.filter(episode => {
        return isEpisodeFailed(episode);
      });

      const failedCount = failedEpisodes.length;

      return failedCount;
    } catch (error) {
      console.error(`[Episodes API] Failed to get failed episodes count for routine ${routineId}:`, error);
      return 0;
    }
  }

}

// Export singleton instance
export const episodesApiClient = new EpisodesApiClient();
