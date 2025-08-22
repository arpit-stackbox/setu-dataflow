import { Episode } from './types/episode';
import { mockEpisodes } from '@/__mocks__/mock-episodes';
import { mockRoutines } from '@/__mocks__/mock-routines';

/**
 * Server-side data fetching for episodes
 * In a real application, this would fetch from an API or database
 */

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

/**
 * Fetch episodes with server-side filtering and pagination
 * This simulates a real API call that would happen on the server
 */
export async function getEpisodes(filters: EpisodesFilters): Promise<EpisodesResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const {
    routineId,
    search = '',
    status = 'All Types',
    page = 1,
    limit = 10,
    dateRange
  } = filters;

  // Server-side filtering
  const filteredEpisodes = mockEpisodes.filter((episode) => {
    // Must match routine ID
    const matchesRoutine = episode.routineId === routineId;
    
    // Search filter
    const matchesSearch = search === '' ||
      episode.id.toLowerCase().includes(search.toLowerCase()) ||
      episode.status.toLowerCase().includes(search.toLowerCase()) ||
      episode.errorDetails?.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = status === 'All Types' || episode.status === status;
    
    // Date range filter
    const matchesDateRange = !dateRange || (() => {
      const episodeDate = new Date(episode.startTime);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      return episodeDate >= startDate && episodeDate <= endDate;
    })();
    
    return matchesRoutine && matchesSearch && matchesStatus && matchesDateRange;
  });

  // Server-side pagination
  const totalCount = filteredEpisodes.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedEpisodes = filteredEpisodes.slice(startIndex, endIndex);

  // Get routine info (in a real app, this might come from a separate API call)
  const routineInfo = paginatedEpisodes.length > 0 ? {
    id: routineId,
    name: paginatedEpisodes[0].routineName
  } : { id: routineId, name: 'Unknown Routine' };

  return {
    episodes: paginatedEpisodes,
    totalCount,
    currentPage: page,
    totalPages,
    routineInfo
  };
}

/**
 * Get episode status types for filter dropdown
 */
export async function getEpisodeStatusTypes(): Promise<string[]> {
  // In a real app, this might come from a separate API endpoint
  const statuses = Array.from(new Set(mockEpisodes.map(episode => episode.status)));
  return ['All Types', ...statuses];
}

/**
 * Get routine info by ID
 */
export async function getRoutineInfo(routineId: string): Promise<{ id: string; name: string } | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Find routine info from routines data (this is the correct source)
  const routine = mockRoutines.find(routine => routine.id === routineId);
  return routine ? { id: routineId, name: routine.name } : null;
}
