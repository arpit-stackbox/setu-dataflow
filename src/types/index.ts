export interface DashboardMetrics {
  totalRoutines: number;
  activeRoutines: number;
  failedEpisodes: number;
  episodesToday: number;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Re-export routine types for convenience
export type { RoutineStatus, RoutineType, Routine, RoutineExecution } from '@/features/routines/types/routine';
