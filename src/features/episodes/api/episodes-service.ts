/**
 * Episodes Service Layer
 * Provides high-level functions for episodes operations
 */

/**
 * Get episode status types for filter dropdown
 * Now returns the actual states that come from the API
 */
export async function getEpisodeStatusTypes(): Promise<string[]> {
  // Return the actual episode states that come from the API
  return [
    'All Types',
    'Success',
    'Failed', 
    'Running',
    'Warning'
  ];
}
