import { Routine } from './types/routine';
import { mockRoutines } from '@/__mocks__/mock-routines';

/**
 * Server-side data fetching for routines
 * In a real application, this would fetch from an API or database
 */

export interface RoutinesFilters {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface RoutinesResponse {
  routines: Routine[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Fetch routines with server-side filtering and pagination
 * This simulates a real API call that would happen on the server
 */
export async function getRoutines(filters: RoutinesFilters = {}): Promise<RoutinesResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const {
    search = '',
    type = 'All Types',
    page = 1,
    limit = 10
  } = filters;

  // Server-side filtering
  const filteredRoutines = mockRoutines.filter((routine) => {
    const matchesSearch = search === '' ||
      routine.name.toLowerCase().includes(search.toLowerCase()) ||
      routine.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = type === 'All Types' || routine.type === type;
    
    return matchesSearch && matchesType;
  });

  // Server-side pagination
  const totalCount = filteredRoutines.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedRoutines = filteredRoutines.slice(startIndex, endIndex);

  return {
    routines: paginatedRoutines,
    totalCount,
    currentPage: page,
    totalPages
  };
}

/**
 * Get routine types for filter dropdown
 */
export async function getRoutineTypes(): Promise<string[]> {
  // In a real app, this might come from a separate API endpoint
  const types = Array.from(new Set(mockRoutines.map(routine => routine.type)));
  return ['All Types', ...types];
}
