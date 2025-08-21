/**
 * Example: How to use the Sidebar component in other layouts
 * This demonstrates the reusability and flexibility of the sidebar system
 */

// Example 1: Analytics Page Layout
/*
"use client";

import { BarChart3, TrendingUp, PieChart } from "lucide-react";
import { Sidebar } from "@/components/common/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";

export function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobileMenuOpen, setCollapsed, setMobileMenuOpen } = useSidebar();

  const analyticsItems = [
    {
      id: "overview",
      label: "Overview",
      icon: TrendingUp,
      isActive: true,
      onClick: () => console.log("Navigate to overview"),
    },
    {
      id: "charts",
      label: "Charts",
      icon: BarChart3,
      onClick: () => console.log("Navigate to charts"),
    },
    {
      id: "reports",
      label: "Reports",
      icon: PieChart,
      onClick: () => console.log("Navigate to reports"),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        title="Analytics Hub"
        logoText="A"
        items={analyticsItems}
        isCollapsed={isCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleCollapse={setCollapsed}
        onToggleMobileMenu={setMobileMenuOpen}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
*/

// Example 2: Custom Sidebar with Different Styling
/*
import { Sidebar } from "@/components/common/Sidebar";

export function CustomSidebar() {
  const items = [
    // ... your navigation items
  ];

  return (
    <Sidebar
      title="Custom App"
      logoText="CA"
      items={items}
      className="bg-slate-900 border-slate-700" // Custom styling
      // ... other props
    />
  );
}
*/

// Example 3: Sidebar with Navigation Router Integration
/*
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/common/Sidebar";
import { navigationConfig } from "@/config/navigation";

export function RouterIntegratedSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const items = navigationConfig.map(item => ({
    ...item,
    isActive: pathname === item.href,
    onClick: () => router.push(item.href),
  }));

  return (
    <Sidebar
      title="DataFlow Ops"
      items={items}
      // ... other props
    />
  );
}
*/

export {}; // Make this a module
