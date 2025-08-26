/**
 * API Response Types for Routines
 * Maps real API structure to internal types
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

// API returns array directly, not wrapped in data object
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
 * Logic: For each segment, check the latest attempt (highest number)
 * Episode is successful only if ALL segments have successful latest attempts
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
  const segmentStatuses: Array<{ segmentId: string; success: boolean; running: boolean; error?: string }> = [];

  // Check each segment's latest attempt
  for (const segment of episode.segments) {
    if (segment.attempts.length === 0) {
      // No attempts yet - consider as running
      allSegmentsSuccessful = false;
      hasAnyRunning = true;
      segmentStatuses.push({
        segmentId: segment.id,
        success: false,
        running: true,
      });
      continue;
    }

    // Find the latest attempt (highest number)
    const latestAttempt = segment.attempts.reduce((latest, current) => 
      current.number > latest.number ? current : latest
    );

    const isRunning = !latestAttempt.settled_at && !!latestAttempt.started_at;
    const hasError = !!latestAttempt.error;
    const isSuccessful = latestAttempt.success && !hasError;

    segmentStatuses.push({
      segmentId: segment.id,
      success: isSuccessful,
      running: isRunning,
      error: latestAttempt.error || undefined,
    });

    if (isRunning) {
      hasAnyRunning = true;
      allSegmentsSuccessful = false;
    } else if (!isSuccessful) {
      allSegmentsSuccessful = false;
      if (hasError) {
        hasAnyErrors = true;
      }
    }
  }

  // Determine overall episode status
  let status: RoutineStatus;
  if (hasAnyRunning) {
    status = 'Running';
  } else if (allSegmentsSuccessful) {
    status = 'Success';
  } else if (hasAnyErrors) {
    status = 'Failed';
  } else {
    // Some segments not successful but no explicit errors
    status = 'Warning';
  }

  // Development logging to verify status calculation
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Episode Status] Episode ${episode.id}:`, {
      status,
      segments: episode.segments.length,
      segmentStatuses: segmentStatuses.map(s => ({
        segment: s.segmentId.slice(-8),
        success: s.success,
        running: s.running,
        error: s.error?.slice(0, 30) + (s.error && s.error.length > 30 ? '...' : ''),
      })),
      allSuccessful: allSegmentsSuccessful,
      hasErrors: hasAnyErrors,
      hasRunning: hasAnyRunning,
    });
  }

  return {
    status,
    timestamp: episode.created_at,
    hasErrors: hasAnyErrors,
  };
}

/**
 * Maps API routine item to internal Routine type
 * Key mappings:
 * - title → name
 * - permission → type (with intelligent mapping)
 */
export function mapApiRoutineToRoutine(apiRoutine: ApiRoutineItem, latestEpisode?: ApiEpisodeItem): Routine {
  const episodeInfo = latestEpisode ? getEpisodeStatus(latestEpisode) : null;

  return {
    id: apiRoutine.id,
    name: apiRoutine.title, // API field: title → internal field: name
    description: generateDescription(apiRoutine),
    type: deriveRoutineType(apiRoutine), // API field: permission → internal field: type
    sender: DEFAULT_VALUES.sender,
    receiver: DEFAULT_VALUES.receiver,
    lastEpisode: {
      timestamp: episodeInfo?.timestamp || apiRoutine.updated_at,
      status: episodeInfo?.status || DEFAULT_VALUES.lastEpisodeStatus,
    },
    lastRun: episodeInfo?.timestamp || apiRoutine.updated_at,
    failedEpisodes: episodeInfo?.hasErrors ? 1 : DEFAULT_VALUES.failedEpisodes,
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
 * Maps permission field to internal RoutineType
 */
function deriveRoutineType(apiRoutine: ApiRoutineItem): RoutineType {
  // Use permission field to determine type
  if (apiRoutine.permission) {
    const permission = apiRoutine.permission.toLowerCase();
    
    // Map common permission values to routine types
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
    
    // If permission doesn't match known patterns, default to App Extension
    return 'App Extension';
  }
  
  // Fallback logic when permission is null
  // If it has a schedule, it's likely orchestration
  if (apiRoutine.schedule && apiRoutine.schedule.trim()) {
    return 'Orchestration';
  }
  
  // If it's awaited, it's likely integration
  if (apiRoutine.awaited) {
    return 'Integration';
  }
  
  // Default to app extension
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
    sortMethod: 'title_asc', // TODO: Add sorting support
  };
}
