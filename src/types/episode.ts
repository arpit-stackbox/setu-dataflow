/**
 * Episode-related type definitions
 * Following copilot instructions: use interfaces over types
 */

export interface Episode {
  id: string;
  status: 'Success' | 'Failed' | 'Running' | 'Warning';
  startTime: string;
  endTime?: string;
  duration?: number; // in milliseconds
  errorMessage?: string;
  dataProcessed?: number;
  recordsProcessed?: number;
  routineId: string;
  routineName: string;
}

export interface EpisodeFilters {
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

export interface EpisodeMetrics {
  totalEpisodes: number;
  successfulEpisodes: number;
  failedEpisodes: number;
  runningEpisodes: number;
  averageDuration: number;
}
