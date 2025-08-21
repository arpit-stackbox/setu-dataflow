import { LucideIcon } from "lucide-react";

/**
 * Type definitions for sidebar components
 * Follows copilot instructions: use interfaces over types
 */

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarSection {
  id: string;
  title?: string;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface SidebarConfiguration {
  title: string;
  logoText?: string;
  logoUrl?: string;
  sections?: SidebarSection[];
  items?: SidebarItem[];
  footer?: {
    content?: React.ReactNode;
    hidden?: boolean;
  };
}

export interface SidebarState {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  expandedSections: string[];
}

export interface SidebarActions {
  toggleCollapse: () => void;
  toggleMobileMenu: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSection: (sectionId: string) => void;
}

export interface UseSidebarOptions {
  defaultCollapsed?: boolean;
  persistCollapsedState?: boolean;
  storageKey?: string;
  autoCollapseMobile?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  description?: string;
  badge?: string | number;
  children?: NavigationItem[];
  permission?: string;
  external?: boolean;
}

export interface NavigationConfig {
  items: NavigationItem[];
  sections?: {
    id: string;
    title: string;
    items: NavigationItem[];
  }[];
}
