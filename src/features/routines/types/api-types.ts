/**
 * API Response Types for Routines
 */

import { Routine, RoutineType, RoutineStatus } from './routine';

// API Response types (based on actual API structure)
export interface ApiRoutineItem {
  id: string;
  title: string;
  schedule: string;
  node_id: string;
  awaited: boolean;
  permission: string | null;
  meta: {
    priority: string;
  };
  params: unknown[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Episode API types
export interface ApiEpisodeAttempt {
  number: number;
  error: string | null;
  file_size: number;
  timeout_at: string;
  trace: string | null;
  file_type: string;
  backoff_at: string | null;
  cause: string | null;
  file_name: string | null;
  started_at: string;
  retry_state: string;
  created_at: string;
  id: string;
  settled_at: string;
  storage_id: string;
  retried_at: string | null;
  file_id: string;
  task_id: string;
  success: boolean;
  file_count_rows: number;
  file_count_cols: number;
}

export interface ApiEpisodeSegment {
  id: string;
  number: number;
  type: string;
  attempts: ApiEpisodeAttempt[];
  created_at: string;
  storage_id: string;
  args: unknown | null;
  crux: Record<string, unknown>;
  latest_attempt_count_rows: number | null;
  fallback_title: string;
}

export interface ApiEpisodeItem {
  id: string;
  number: number | null;
  created_at: string;
  routine_id: string;
  title: string | null;
  deleted_at: string | null;
  args: Record<string, unknown>;
  crux: Record<string, unknown>;
  segments: ApiEpisodeSegment[];
}

export type EpisodesApiResponse = ApiEpisodeItem[];

// API returns array directly
export type RoutinesApiResponse = ApiRoutineItem[];

// Enhanced API service response with headers
export interface RoutinesApiServiceResponse {
  data: ApiRoutineItem[];
  totalCount: number;
  offset: number;
  limit: number;
}

// Default values for missing fields
const DEFAULT_VALUES = {
  sender: 'System',
  receiver: 'Processing Node',
  lastEpisodeStatus: 'Success' as RoutineStatus,
  failedEpisodes: 0,
  modifiedBy: 'System',
  createdBy: 'System',
} as const;

/**
 * Extracts episode status information from API episode data
 * Episode is successful only if ALL segments have at least one successful attempt
 */
function getEpisodeStatus(episode: ApiEpisodeItem): {
  status: RoutineStatus;
  timestamp: string;
  hasErrors: boolean;
} {
  if (episode.segments.length === 0) {
    return {
      status: 'Success',
      timestamp: episode.created_at,
      hasErrors: false,
    };
  }

  let allSegmentsSuccessful = true;
  let hasAnyErrors = false;
  let hasAnyRunning = false;

  for (const segment of episode.segments) {
    if (segment.attempts.length === 0) {
      allSegmentsSuccessful = false;
      hasAnyRunning = true;
      continue;
    }

    const hasSuccessfulAttempt = segment.attempts.some(attempt => 
      attempt.success && !attempt.error
    );
    const hasRunningAttempt = segment.attempts.some(attempt => 
      !attempt.settled_at && !!attempt.started_at
    );
    const hasErrorAttempts = segment.attempts.some(attempt => !!attempt.error);

    if (hasRunningAttempt) {
      hasAnyRunning = true;
    } else if (!hasSuccessfulAttempt) {
      allSegmentsSuccessful = false;
      if (hasErrorAttempts) {
        hasAnyErrors = true;
      }
    }
  }

  let status: RoutineStatus;
  if (hasAnyRunning) {
    status = 'Running';
  } else if (allSegmentsSuccessful) {
    status = 'Success';
  } else if (hasAnyErrors) {
    status = 'Failed';
  } else {
    status = 'Warning';
  }

  return {
    status,
    timestamp: episode.created_at,
    hasErrors: hasAnyErrors,
  };
}

/**
 * Determines if an episode is failed based on segment analysis
 * Used for counting failed episodes consistently across the application
 */
export function isEpisodeFailed(episode: ApiEpisodeItem): boolean {
  if (episode.segments.length === 0) return false;
  
  let allSegmentsSuccessful = true;
  let hasAnyErrors = false;
  let hasAnyRunning = false;

  for (const segment of episode.segments) {
    if (segment.attempts.length === 0) {
      hasAnyRunning = true;
      allSegmentsSuccessful = false;
      continue;
    }

    const hasSuccessfulAttempt = segment.attempts.some(attempt => 
      attempt.success && !attempt.error
    );
    const hasRunningAttempt = segment.attempts.some(attempt => 
      !attempt.settled_at && !!attempt.started_at
    );
    const hasErrorAttempts = segment.attempts.some(attempt => !!attempt.error);

    if (hasRunningAttempt) {
      hasAnyRunning = true;
    } else if (!hasSuccessfulAttempt) {
      allSegmentsSuccessful = false;
      if (hasErrorAttempts) {
        hasAnyErrors = true;
      }
    }
  }

  // Episode is failed if it has errors and is not running and not all segments successful
  return !hasAnyRunning && !allSegmentsSuccessful && hasAnyErrors;
}

/**
 * Maps API routine item to internal Routine type
 */
export function mapApiRoutineToRoutine(
  apiRoutine: ApiRoutineItem, 
  latestEpisode?: ApiEpisodeItem, 
  failedEpisodesLast7Days?: number
): Routine {
  const episodeInfo = latestEpisode ? getEpisodeStatus(latestEpisode) : null;

  return {
    id: apiRoutine.id,
    name: apiRoutine.title,
    description: generateDescription(apiRoutine),
    type: deriveRoutineType(apiRoutine),
    sender: DEFAULT_VALUES.sender,
    receiver: DEFAULT_VALUES.receiver,
    lastEpisode: {
      timestamp: episodeInfo?.timestamp || apiRoutine.updated_at,
      status: episodeInfo?.status || DEFAULT_VALUES.lastEpisodeStatus,
    },
    lastRun: episodeInfo?.timestamp || apiRoutine.updated_at,
    failedEpisodes: failedEpisodesLast7Days ?? DEFAULT_VALUES.failedEpisodes,
    modifiedBy: DEFAULT_VALUES.modifiedBy,
    createdBy: DEFAULT_VALUES.createdBy,
  };
}

/**
 * Generates description from API data
 */
function generateDescription(apiRoutine: ApiRoutineItem): string {
  if (apiRoutine.schedule && apiRoutine.schedule.trim()) {
    return `Scheduled: ${apiRoutine.schedule}`;
  }
  
  if (apiRoutine.awaited) {
    return 'Awaited execution routine';
  }
  
  if (apiRoutine.permission) {
    return `Permission-controlled routine (${apiRoutine.permission})`;
  }
  
  return 'Manual execution routine';
}

/**
 * Derives routine type from API data
 */
function deriveRoutineType(apiRoutine: ApiRoutineItem): RoutineType {
  if (apiRoutine.permission) {
    const permission = apiRoutine.permission.toLowerCase();
    
    if (permission.includes('orchestration') || permission.includes('orchestra')) {
      return 'Orchestration';
    }
    
    if (permission.includes('integration') || permission.includes('integrate')) {
      return 'Integration';
    }
    
    if (permission.includes('app') || permission.includes('extension')) {
      return 'App Extension';
    }
    
    if (permission.includes('communication') || permission.includes('comm') || permission.includes('message')) {
      return 'Communication';
    }
    
    return 'App Extension';
  }
  
  if (apiRoutine.schedule && apiRoutine.schedule.trim()) {
    return 'Orchestration';
  }
  
  if (apiRoutine.awaited) {
    return 'Integration';
  }
  
  return 'App Extension';
}

/**
 * Maps internal filters to API query parameters
 */
export function mapFiltersToApiParams(filters: {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}): {
  nodeCode: string;
  includeDeleted: boolean;
  offset: number;
  limit: number;
  sortMethod: string;
} {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const offset = (page - 1) * limit;

  return {
    nodeCode: process.env.NEXT_PUBLIC_DEFAULT_NODE_CODE || 'test',
    includeDeleted: false,
    offset,
    limit,
    sortMethod: 'title_asc',
  };
}
