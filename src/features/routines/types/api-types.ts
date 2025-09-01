/**
 * Routine API Types and Utilities
 * 
 * Contains routine-specific API types, mapping functions, and type derivation utilities
 */

import { Routine, RoutineType, RoutineStatus } from './routine';
import { ApiEpisodeItem } from '@/features/episodes/types/api-types';

// =============================================================================
// Routine API Types
// =============================================================================

/**
 * Raw routine data from API
 */
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

export type RoutinesApiResponse = ApiRoutineItem[];

/**
 * Enhanced API service response with metadata
 */
export interface RoutinesApiServiceResponse {
  data: ApiRoutineItem[];
  totalCount: number;
  offset: number;
  limit: number;
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Default values for fields missing from API responses
 */
export const DEFAULT_VALUES = {
  sender: 'System',
  receiver: 'Processing Node',
  lastEpisodeStatus: 'Success' as RoutineStatus,
  failedEpisodes: 0,
  modifiedBy: 'System',
  createdBy: 'System',
} as const;

// =============================================================================
// Routine Type Derivation
// =============================================================================

/**
 * Derives routine type from API routine data
 */
export function deriveRoutineType(apiRoutine: ApiRoutineItem): RoutineType {
  // Check permission-based type first
  if (apiRoutine.permission) {
    const permission = apiRoutine.permission.toLowerCase();
    
    const typeMap: Array<[string[], RoutineType]> = [
      [['orchestration', 'orchestra'], 'Orchestration'],
      [['integration', 'integrate'], 'Integration'],
      [['app', 'extension'], 'App Extension'],
      [['communication', 'comm', 'message'], 'Communication'],
    ];

    for (const [keywords, type] of typeMap) {
      if (keywords.some(keyword => permission.includes(keyword))) {
        return type;
      }
    }
    
    return 'App Extension'; // Default for permission-based
  }
  
  // Check schedule-based type
  if (apiRoutine.schedule?.trim()) {
    return 'Orchestration';
  }
  
  // Check awaited flag
  if (apiRoutine.awaited) {
    return 'Integration';
  }
  
  return 'App Extension'; // Final fallback
}

/**
 * Generates a description from API routine data
 */
export function generateDescription(apiRoutine: ApiRoutineItem): string {
  if (apiRoutine.schedule?.trim()) {
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

// =============================================================================
// Routine Mapping Function
// =============================================================================

/**
 * Maps API routine to internal Routine type
 */
export function mapApiRoutineToRoutine(
  apiRoutine: ApiRoutineItem, 
  latestEpisode?: ApiEpisodeItem, 
  failedEpisodesLast7Days?: number
): Routine {
  let episodeInfo = null;
  
  if (latestEpisode) {
    // Dynamic import to avoid circular dependency
    // This is a runtime import, so we can't use the function directly here
    // Instead, we'll handle this at the call site where needed
    episodeInfo = {
      status: 'Warning' as RoutineStatus,
      timestamp: latestEpisode.created_at,
      hasErrors: false
    };
  }

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

// =============================================================================
// API Parameter Mapping
// =============================================================================

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
