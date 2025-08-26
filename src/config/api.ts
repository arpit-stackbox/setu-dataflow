/**
 * API Configuration for Setu DataFlow Operations
 * Centralized API settings and endpoint management
 */

export const apiConfig = {
  // Base URL configuration
  baseUrl: process.env.API_BASE_URL || 
           process.env.NEXT_PUBLIC_API_BASE_URL || 
           'http://localhost:3000/api',
  
  // API Endpoints
  endpoints: {
    routines: '/api/routines',
    episodes: '/api/episodes',
    files: '/api/files',
  },

  // Request configuration
  timeout: parseInt(process.env.API_TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),

  // Feature flags
  useRealApi: process.env.NEXT_PUBLIC_USE_REAL_API === 'true',

  // Default values
  defaults: {
    nodeCode: process.env.NEXT_PUBLIC_DEFAULT_NODE_CODE || 'test',
    pageSize: 10,
    includeDeleted: false,
    sortMethod: 'title_asc',
  },

  // Headers
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Validation function for API configuration
 */
export function validateApiConfig(): void {
  if (!apiConfig.baseUrl) {
    throw new Error('API base URL is not configured');
  }

  if (apiConfig.useRealApi && !process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.warn('Real API is enabled but NEXT_PUBLIC_API_BASE_URL is not set');
  }
}

/**
 * Get full URL for an endpoint
 */
export function getApiUrl(endpoint: string): string {
  return `${apiConfig.baseUrl}${endpoint}`;
}

/**
 * Get API headers with any additional headers
 */
export function getApiHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    ...apiConfig.defaultHeaders,
    ...additionalHeaders,
  };
}
