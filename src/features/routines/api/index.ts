/**
 * Routines API Module
 * Centralized exports for all routines API functionality
 */

// Client
export { RoutinesApiClient, routinesApiClient } from './routines-client';

// Service functions
export { getRoutines, getRoutineTypes } from './routines-service';

// Types
export type { RoutinesFilters, RoutinesResponse } from './types';
