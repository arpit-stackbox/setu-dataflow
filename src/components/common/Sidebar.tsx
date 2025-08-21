import { useCallback } from "react";
import { Menu, X } from "lucide-react";
import { SidebarItem } from "@/types/sidebar";

interface SidebarProps {
  title: string;
  logoText?: string;
  items: SidebarItem[];
  isCollapsed?: boolean;
  isMobileMenuOpen?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onToggleMobileMenu?: (open: boolean) => void;
  className?: string;
}

/**
 * Sidebar component - Reusable navigation sidebar
 * Responsive design with mobile-first approach
 * Follows copilot instructions: under 200 lines, optimized performance
 */
export function Sidebar({
  title,
  logoText = "D",
  items,
  isCollapsed = false,
  isMobileMenuOpen = false,
  onToggleCollapse,
  onToggleMobileMenu,
  className = "",
}: SidebarProps) {
  // Memoized handlers for better performance
  const handleToggleCollapse = useCallback(() => {
    onToggleCollapse?.(!isCollapsed);
  }, [isCollapsed, onToggleCollapse]);

  const handleCloseMobile = useCallback(() => {
    onToggleMobileMenu?.(false);
  }, [onToggleMobileMenu]);

  const handleItemClick = useCallback(
    (item: SidebarItem) => {
      if (item.onClick) {
        item.onClick();
      }
      // Close mobile menu when item is clicked
      handleCloseMobile();
    },
    [handleCloseMobile]
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleCloseMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 fixed lg:relative z-50 lg:z-auto h-full ${className}`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6">
          {isCollapsed ? (
            // Collapsed header with toggle button
            <div className="flex justify-center">
              <button
                onClick={handleToggleCollapse}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Expand sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            // Expanded header with logo and toggle
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {logoText}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {title}
                </span>
              </div>
              <button
                onClick={handleToggleCollapse}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Collapse sidebar"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={`${isCollapsed ? "mt-4" : "mt-6 sm:mt-8"} px-2 sm:px-4`}
        >
          <div className="space-y-1">
            {items.map((item) => {
              const IconComponent = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    item.isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  aria-label={isCollapsed ? item.label : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComponent
                    className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                      isCollapsed ? "" : "mr-2 sm:mr-3"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer (optional section for future use) */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              {/* Add footer content if needed */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
