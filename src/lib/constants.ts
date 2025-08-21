/**
 * Shared constants for routine management components
 * Follows copilot instructions: centralized configuration, typed constants
 */

// Routine type constants shared across components
export const ROUTINE_TYPES = [
  "All Types",
  "Integration", 
  "App Extension",
  "Orchestration",
  "Communication"
] as const;

export const ROUTINE_TYPES_WITHOUT_ALL = ROUTINE_TYPES.filter(type => type !== "All Types") as readonly string[];

/**
 * Badge configuration Maps for better performance than objects
 * Follows copilot instructions: prefer Maps over objects for lookups
 */

// Status badge configurations using Map for better performance
export const STATUS_BADGE_CONFIG = new Map<string, string>([
  ["Success", "bg-green-100 text-green-800"],
  ["Failed", "bg-red-100 text-red-800"], 
  ["Running", "bg-blue-100 text-blue-800"],
  ["Warning", "bg-yellow-100 text-yellow-800"],
]);

// Type badge configurations using Map for better performance
export const TYPE_BADGE_CONFIG = new Map<string, string>([
  ["Integration", "bg-blue-50 text-blue-700"],
  ["App Extension", "bg-green-50 text-green-700"],
  ["Orchestration", "bg-purple-50 text-purple-700"],
  ["Communication", "bg-orange-50 text-orange-700"],
]);

// Application configuration constants
export const DEFAULT_ITEMS_PER_PAGE = 5;

// Default badge styles for fallback
export const DEFAULT_STATUS_BADGE = "bg-gray-100 text-gray-800";
export const DEFAULT_TYPE_BADGE = "bg-gray-50 text-gray-700";
