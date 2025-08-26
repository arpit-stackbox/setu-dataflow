/**
 * Routines API Types
 * Type definitions for routines API operations
 */

import { Routine } from '../types/routine';

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
