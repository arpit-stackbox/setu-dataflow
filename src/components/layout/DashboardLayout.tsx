"use client";

import { Menu } from "lucide-react";
import { RoutinesPage } from "@/components/routines/RoutinesPage";
import { Sidebar } from "@/components/common/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { navigationConfig, getActiveNavigationItem } from "@/config/navigation";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

/**
 * DashboardLayout component - Main layout with reusable sidebar
 * Implements responsive design and modern navigation patterns
 * Follows copilot instructions: clean component composition
 */
export default function DashboardLayout() {
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

  // Memoized navigation items with active state
  const navigationItems = useMemo(() => {
    const activeItem = getActiveNavigationItem(pathname);

    return navigationConfig.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      href: item.href,
      isActive: item.id === activeItem?.id,
      onClick: () => {
        // Handle navigation - for now just log
        console.log(`Navigate to ${item.href}`);
        // In a real app, you'd use Next.js router here
        // router.push(item.href);
      },
    }));
  }, [pathname]);

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

        <RoutinesPage />
      </div>
    </div>
  );
}
