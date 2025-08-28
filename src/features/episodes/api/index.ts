/**
 * Episodes API Module
 * Centralized exports for all episodes API functionality
 */

// Client
export { episodesApiClient, EpisodesApiClient } from './episodes-client';

// Service functions
export { getEpisodeStatusTypes } from './episodes-service';

// Types
export type { 
  EpisodesFilters, 
  EpisodesResponse, 
  RoutineInfo,
  Episode 
} from './types';
