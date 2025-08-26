/**
 * API types and interfaces for episodes service
 */

// Import Episode type from types directory
import type { Episode } from '../types/episode';

export interface EpisodesFilters {
  routineId: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface EpisodesResponse {
  episodes: Episode[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  routineInfo?: {
    id: string;
    name: string;
  };
}

export interface RoutineInfo {
  id: string;
  name: string;
}

// Re-export Episode type 
export type { Episode };
