"use client";

import { Menu } from "lucide-react";
import { Sidebar } from "@/components/common/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { navigationConfig, getActiveNavigationItem } from "@/config/navigation";
import { usePathname } from "next/navigation";
import { useMemo, ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout component - Root layout with sidebar for all pages
 * Follows copilot instructions: clean and simple
 */
export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const {
    isCollapsed,
    isMobileMenuOpen,
    toggleMobileMenu,
    setCollapsed,
    setMobileMenuOpen,
  } = useSidebar({
    defaultCollapsed: false,
    persistCollapsedState: true,
  });

  // Navigation items with active state
  const navigationItems = useMemo(() => {
    const activeItem = getActiveNavigationItem(pathname);
    return navigationConfig.map((item) => ({
      ...item,
      isActive: item.id === activeItem?.id,
      onClick: () => {
        if (isMobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      },
    }));
  }, [pathname, isMobileMenuOpen, setMobileMenuOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        title="DataFlow Ops"
        logoText="D"
        items={navigationItems}
        isCollapsed={isCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleCollapse={setCollapsed}
        onToggleMobileMenu={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            DataFlow Operations
          </h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {children}
      </div>
    </div>
  );
}
