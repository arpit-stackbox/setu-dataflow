/**
 * API Response Types for Routines
 */

import { Routine, RoutineType, RoutineStatus } from './routine';
import { Episode } from '@/features/episodes/types/episode';

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
  state: string; // Episode state from API (e.g., "failed", "success", "running", etc.)
  fallback_title?: string; // Optional fallback title
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
 * Get episode status from API state field
 * Now uses the direct state field from the API response instead of complex logic
 */
function getEpisodeStatus(episode: ApiEpisodeItem): {
  status: RoutineStatus;
  timestamp: string;
  hasErrors: boolean;
} {
  // Map API state to our RoutineStatus type
  let status: RoutineStatus;
  let hasErrors = false;

  switch (episode.state?.toLowerCase()) {
    case 'success':
    case 'completed':
      status = 'Success';
      break;
    case 'failed':
    case 'error':
      status = 'Failed';
      hasErrors = true;
      break;
    case 'running':
    case 'executing':
    case 'in_progress':
      status = 'Running';
      break;
    case 'warning':
    case 'partial':
      status = 'Warning';
      hasErrors = true;
      break;
    default:
      // Fallback to the old logic if state is not recognized
      status = 'Warning';
      console.warn(`Unknown episode state: ${episode.state}`);
  }

  return {
    status,
    timestamp: episode.created_at,
    hasErrors,
  };
}

/**
 * Determines if an episode is failed using the direct state field
 * Much simpler than the previous segment analysis approach
 */
export function isEpisodeFailed(episode: ApiEpisodeItem): boolean {
  const state = episode.state?.toLowerCase();
  return state === 'failed' || state === 'error';
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
 * Maps API episode item to internal Episode type
 * Converts the complex API episode structure to the simplified UI episode format
 */
export function mapApiEpisodeToEpisode(apiEpisode: ApiEpisodeItem, routineName?: string): Episode {
  const episodeStatus = getEpisodeStatus(apiEpisode);
  
  // Calculate duration and progress from segments
  const { duration, progress, steps, errorDetails, retryInfo } = calculateEpisodeMetrics(apiEpisode);
  
  // Determine end time
  const endTime = calculateEndTime(apiEpisode);

  return {
    id: apiEpisode.id,
    title: apiEpisode.title,
    fallbackTitle: apiEpisode.fallback_title,
    status: episodeStatus.status,
    startTime: apiEpisode.created_at,
    endTime,
    duration,
    progress,
    steps,
    errorDetails,
    retryInfo,
    routineId: apiEpisode.routine_id,
    routineName: routineName || 'Unknown Routine',
    // payloadFiles can be added later if needed
  };
}

/**
 * Calculate episode metrics from API episode data
 */
function calculateEpisodeMetrics(apiEpisode: ApiEpisodeItem) {
  if (apiEpisode.segments.length === 0) {
    return {
      duration: 0,
      progress: 100,
      steps: { completed: 0, total: 0 },
      errorDetails: undefined,
      retryInfo: { currentAttempt: 1, maxAttempts: 3 }
    };
  }

  const totalSegments = apiEpisode.segments.length;
  let completedSegments = 0;
  let totalDuration = 0;
  let errorDetails: string | undefined;
  let maxAttempts = 1;
  let totalCurrentAttempts = 0;

  for (const segment of apiEpisode.segments) {
    // Check if segment is completed (has successful attempt or all attempts failed)
    const hasSuccessfulAttempt = segment.attempts.some(attempt => 
      attempt.success && !attempt.error
    );
    const hasOnlyFailedAttempts = segment.attempts.length > 0 && 
      segment.attempts.every(attempt => !attempt.success || attempt.error);
    
    if (hasSuccessfulAttempt || hasOnlyFailedAttempts) {
      completedSegments++;
    }

    // Calculate duration for this segment
    for (const attempt of segment.attempts) {
      if (attempt.started_at && attempt.settled_at) {
        const startTime = new Date(attempt.started_at).getTime();
        const endTime = new Date(attempt.settled_at).getTime();
        totalDuration += endTime - startTime;
      }
      
      // Track retry info
      maxAttempts = Math.max(maxAttempts, attempt.number);
      totalCurrentAttempts += attempt.number;
      
      // Collect error details
      if (attempt.error && !errorDetails) {
        errorDetails = attempt.error;
      }
    }
  }

  // Calculate progress percentage
  const progress = totalSegments > 0 ? Math.round((completedSegments / totalSegments) * 100) : 100;
  
  // Calculate average current attempt
  const avgCurrentAttempt = totalSegments > 0 ? Math.ceil(totalCurrentAttempts / totalSegments) : 1;

  return {
    duration: totalDuration,
    progress,
    steps: { completed: completedSegments, total: totalSegments },
    errorDetails,
    retryInfo: { 
      currentAttempt: avgCurrentAttempt, 
      maxAttempts: Math.max(maxAttempts, 3) // Default to at least 3
    }
  };
}

/**
 * Calculate end time from API episode data
 */
function calculateEndTime(apiEpisode: ApiEpisodeItem): string | undefined {
  if (apiEpisode.segments.length === 0) {
    return apiEpisode.created_at;
  }

  let latestEndTime: string | undefined;

  for (const segment of apiEpisode.segments) {
    for (const attempt of segment.attempts) {
      if (attempt.settled_at) {
        if (!latestEndTime || attempt.settled_at > latestEndTime) {
          latestEndTime = attempt.settled_at;
        }
      }
    }
  }

  return latestEndTime;
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
