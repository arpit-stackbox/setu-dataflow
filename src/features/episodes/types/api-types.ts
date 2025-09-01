/**
 * Episode API Types and Utilities
 * 
 * Contains episode-specific API types, mapping functions, and calculation utilities
 */

import { Episode } from '../types/episode';
import { RoutineStatus } from '@/features/routines/types/routine';

// =============================================================================
// Episode API Types
// =============================================================================

/**
 * Raw episode attempt data from API
 */
export interface ApiEpisodeAttempt {
  id: string;
  number: number;
  task_id: string;
  started_at: string;
  settled_at: string;
  timeout_at: string;
  retried_at: string | null;
  backoff_at: string | null;
  created_at: string;
  success: boolean;
  error: string | null;
  cause: string | null;
  retry_state: string;
  trace: string | null;
  storage_id: string;
  file_id: string;
  file_name: string | null;
  file_type: string;
  file_size: number;
  file_count_rows: number;
  file_count_cols: number;
}

/**
 * Raw episode segment data from API
 */
export interface ApiEpisodeSegment {
  id: string;
  number: number;
  type: string;
  storage_id: string;
  created_at: string;
  args: unknown | null;
  crux: Record<string, unknown>;
  attempts: ApiEpisodeAttempt[];
  latest_attempt_count_rows: number | null;
  fallback_title: string;
}

/**
 * Raw episode data from API
 */
export interface ApiEpisodeItem {
  id: string;
  number: number | null;
  routine_id: string;
  created_at: string;
  deleted_at: string | null;
  title: string | null;
  fallback_title?: string;
  state: string; // API episode state (e.g., "failed", "success", "running")
  args: Record<string, unknown>;
  crux: Record<string, unknown>;
  segments: ApiEpisodeSegment[];
}

export type EpisodesApiResponse = ApiEpisodeItem[];

// =============================================================================
// Episode Status and Metrics Types
// =============================================================================

/**
 * Episode status information derived from API data
 */
export interface EpisodeStatusInfo {
  status: RoutineStatus;
  timestamp: string;
  hasErrors: boolean;
}

/**
 * Episode metrics calculated from segments and attempts
 */
export interface EpisodeMetrics {
  duration: number; // Total duration in milliseconds
  progress: number; // Completion percentage (0-100)
  steps: {
    completed: number;
    total: number;
  };
  errorDetails?: string;
  retryInfo: {
    currentAttempt: number;
    maxAttempts: number;
  };
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Mapping from API episode states to internal status types
 */
export const EPISODE_STATE_MAPPING: Record<string, RoutineStatus> = {
  success: 'Success',
  completed: 'Success',
  failed: 'Failed',
  error: 'Failed',
  running: 'Running',
  executing: 'Running',
  in_progress: 'Running',
  warning: 'Warning',
  partial: 'Warning',
} as const;

// =============================================================================
// Type Guards and Validation
// =============================================================================

/**
 * Checks if an episode state indicates failure
 */
export function isEpisodeFailed(episode: ApiEpisodeItem): boolean {
  const state = episode.state?.toLowerCase();
  return state === 'failed' || state === 'error';
}

/**
 * Checks if an episode attempt was successful
 */
export function isAttemptSuccessful(attempt: ApiEpisodeAttempt): boolean {
  return attempt.success === true && !attempt.error;
}

/**
 * Checks if an episode segment has any successful attempts
 */
export function isSegmentCompleted(segment: ApiEpisodeSegment): boolean {
  return segment.attempts.some(isAttemptSuccessful);
}

// =============================================================================
// Episode Status Calculation
// =============================================================================

/**
 * Determines episode status from API state field
 */
export function getEpisodeStatus(episode: ApiEpisodeItem): EpisodeStatusInfo {
  const normalizedState = episode.state?.toLowerCase() || '';
  const status = EPISODE_STATE_MAPPING[normalizedState] || 'Warning';
  const hasErrors = status === 'Failed' || status === 'Warning';

  if (!EPISODE_STATE_MAPPING[normalizedState]) {
    console.warn(`Unknown episode state: ${episode.state}`);
  }

  return {
    status,
    timestamp: episode.created_at,
    hasErrors,
  };
}

// =============================================================================
// Episode Metrics Calculation
// =============================================================================

/**
 * Calculates comprehensive episode metrics from API data
 */
export function calculateEpisodeMetrics(apiEpisode: ApiEpisodeItem): EpisodeMetrics {
  const { segments } = apiEpisode;
  
  if (segments.length === 0) {
    return {
      duration: 0,
      progress: 100,
      steps: { completed: 0, total: 0 },
      errorDetails: undefined,
      retryInfo: { currentAttempt: 1, maxAttempts: 3 }
    };
  }

  const totalSegments = segments.length;
  let completedSegments = 0;
  let totalDuration = 0;
  let lastFailingSegmentError: string | undefined;
  let lastFailingSegmentRetryInfo = { currentAttempt: 1, maxAttempts: 3 };

  // Process each segment
  for (const segment of segments) {
    // Check completion status
    if (isSegmentCompleted(segment)) {
      completedSegments++;
    } else {
      // Handle failing segment
      const failureInfo = extractFailureInfo(segment);
      if (failureInfo) {
        lastFailingSegmentError = failureInfo.error;
        lastFailingSegmentRetryInfo = failureInfo.retryInfo;
      }
    }

    // Accumulate duration
    totalDuration += calculateSegmentDuration(segment);
  }

  const progress = Math.round((completedSegments / totalSegments) * 100);

  return {
    duration: totalDuration,
    progress,
    steps: { completed: completedSegments, total: totalSegments },
    errorDetails: lastFailingSegmentError,
    retryInfo: lastFailingSegmentRetryInfo
  };
}

/**
 * Calculates the total duration of a segment from all its attempts
 */
function calculateSegmentDuration(segment: ApiEpisodeSegment): number {
  return segment.attempts.reduce((total, attempt) => {
    if (attempt.started_at && attempt.settled_at) {
      const startTime = new Date(attempt.started_at).getTime();
      const endTime = new Date(attempt.settled_at).getTime();
      return total + (endTime - startTime);
    }
    return total;
  }, 0);
}

/**
 * Extracts failure information from a failing segment
 */
function extractFailureInfo(segment: ApiEpisodeSegment): {
  error: string;
  retryInfo: { currentAttempt: number; maxAttempts: number };
} | null {
  if (segment.attempts.length === 0) return null;

  // Get the latest attempt
  const latestAttempt = segment.attempts.reduce((latest, current) => 
    current.number > latest.number ? current : latest
  );

  if (!latestAttempt.error) return null;

  // Calculate retry statistics
  const failedAttempts = segment.attempts.filter(attempt => 
    !attempt.success || attempt.error
  ).length;

  return {
    error: latestAttempt.error,
    retryInfo: {
      currentAttempt: failedAttempts,
      maxAttempts: segment.attempts.length
    }
  };
}

/**
 * Calculates the end time of an episode from all segment attempts
 */
export function calculateEndTime(apiEpisode: ApiEpisodeItem): string | undefined {
  if (apiEpisode.segments.length === 0) {
    return apiEpisode.created_at;
  }

  let latestEndTime: string | undefined;

  for (const segment of apiEpisode.segments) {
    for (const attempt of segment.attempts) {
      if (attempt.settled_at && (!latestEndTime || attempt.settled_at > latestEndTime)) {
        latestEndTime = attempt.settled_at;
      }
    }
  }

  return latestEndTime;
}

// =============================================================================
// Episode Mapping Function
// =============================================================================

/**
 * Maps API episode to internal Episode type
 */
export function mapApiEpisodeToEpisode(
  apiEpisode: ApiEpisodeItem, 
  routineName?: string
): Episode {
  const episodeStatus = getEpisodeStatus(apiEpisode);
  const metrics = calculateEpisodeMetrics(apiEpisode);
  const endTime = calculateEndTime(apiEpisode);

  return {
    id: apiEpisode.id,
    title: apiEpisode.title,
    fallbackTitle: apiEpisode.fallback_title,
    state: apiEpisode.state,
    status: episodeStatus.status,
    startTime: apiEpisode.created_at,
    endTime,
    duration: metrics.duration,
    progress: metrics.progress,
    steps: metrics.steps,
    errorDetails: metrics.errorDetails,
    retryInfo: metrics.retryInfo,
    routineId: apiEpisode.routine_id,
    routineName: routineName || 'Unknown Routine',
  };
}
