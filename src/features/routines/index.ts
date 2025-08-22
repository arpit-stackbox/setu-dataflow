// Routines Feature Exports
// Clean exports for all routines-related functionality

// Components
export { RoutinesView } from './components/RoutinesView';
export { RoutinesTable } from './components/RoutinesTable';
export { RoutinesLoadingSkeleton } from './components/RoutinesLoadingSkeleton';

// API
export { getRoutines, getRoutineTypes } from './routines-api';
export type { RoutinesFilters, RoutinesResponse } from './routines-api';

// Types
export type { Routine } from './types/routine';
