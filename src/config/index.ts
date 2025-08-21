/**
 * Application configuration and environment variables
 * Centralized configuration management for frontend-only application with mock data
 */

const config = {
  // Authentication (Frontend Only)
  auth: {
    secret: process.env.NEXTAUTH_SECRET || '',
    jwtSecret: process.env.JWT_SECRET || '',
    sessionTimeout: 24 * 60 * 60, // 24 hours in seconds
  },

  // Feature Flags
  features: {
    analytics: process.env.ENABLE_ANALYTICS === 'true',
    realTimeUpdates: process.env.ENABLE_REAL_TIME_UPDATES === 'true',
    advancedFilters: process.env.ENABLE_ADVANCED_FILTERS === 'true',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },

  // Performance
  performance: {
    cacheTtl: parseInt(process.env.CACHE_TTL || '300'),
  },

  // Application Info
  app: {
    name: 'Setu DataFlow Operations',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
} as const;

// Validation function to ensure required config is present
export function validateConfig(): void {
  const requiredConfigs = [
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
  ];

  const missingConfigs = requiredConfigs.filter(
    (key) => !process.env[key]
  );

  if (missingConfigs.length > 0) {
    console.warn(
      `Missing optional environment variables: ${missingConfigs.join(', ')}`
    );
  }
}

export default config;
