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
  progress: number; // percentage 0-100
  steps: {
    completed: number;
    total: number;
  };
  errorDetails?: string;
  retryInfo: {
    currentAttempt: number;
    maxAttempts: number;
    nextRetryAt?: string;
  };
  routineId: string;
  routineName: string;
  payloadFiles?: PayloadFile[];
}

export interface PayloadFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: 'input' | 'output' | 'error';
  downloadUrl: string;
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
