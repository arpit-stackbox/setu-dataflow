import { useState, useCallback, useEffect } from "react";

interface UseSidebarOptions {
  defaultCollapsed?: boolean;
  persistCollapsedState?: boolean;
  storageKey?: string;
}

interface UseSidebarReturn {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleCollapse: () => void;
  toggleMobileMenu: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

/**
 * Custom hook for managing sidebar state
 * Handles responsive behavior and optional persistence
 * Follows copilot instructions: optimized performance with memoization
 */
export function useSidebar({
  defaultCollapsed = false,
  persistCollapsedState = true,
  storageKey = "sidebar-collapsed",
}: UseSidebarOptions = {}): UseSidebarReturn {
  // Initialize collapsed state with persistence support
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined" || !persistCollapsedState) {
      return defaultCollapsed;
    }
    
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaultCollapsed;
    } catch {
      return defaultCollapsed;
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persist collapsed state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && persistCollapsedState) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(isCollapsed));
      } catch {
        // Silently handle localStorage errors
      }
    }
  }, [isCollapsed, persistCollapsedState, storageKey]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoized toggle functions for better performance
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
  }, []);

  const setMobileMenuOpen = useCallback((open: boolean) => {
    setIsMobileMenuOpen(open);
  }, []);

  return {
    isCollapsed,
    isMobileMenuOpen,
    toggleCollapse,
    toggleMobileMenu,
    setCollapsed,
    setMobileMenuOpen,
  };
}
