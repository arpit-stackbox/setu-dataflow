import { Database } from "lucide-react";
import { NavigationItem } from "@/types/sidebar";

/**
 * Navigation configuration for the application sidebar
 * Centralized navigation structure following copilot instructions
 * Currently showing only Operations with data source icon
 */
export const navigationConfig: NavigationItem[] = [
  {
    id: "operations",
    label: "Operations",
    icon: Database,
    href: "/",
    description: "Monitor routine operations and data flows",
  },
];

/**
 * Get navigation item by ID
 */
export function getNavigationItem(id: string): NavigationItem | undefined {
  return navigationConfig.find(item => item.id === id);
}

/**
 * Get active navigation item based on current path
 */
export function getActiveNavigationItem(pathname: string): NavigationItem | undefined {
  return navigationConfig.find(item => {
    if (item.href === "/" && pathname === "/") return true;
    if (item.href !== "/" && pathname.startsWith(item.href)) return true;
    return false;
  });
}
