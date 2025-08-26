/**
 * API Toggle Component
 * Development utility to switch between mock and real API data
 * Only renders in development mode
 */

"use client";

import { useState, useEffect } from "react";

export function ApiToggle() {
  const [useRealApi, setUseRealApi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  useEffect(() => {
    // Check current setting
    const current = process.env.NEXT_PUBLIC_USE_REAL_API === "true";
    setUseRealApi(current);
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);

    // Note: In a real implementation, you'd need to update the environment variable
    // and restart the server. This is just a visual indicator.
    const newValue = !useRealApi;
    setUseRealApi(newValue);

    // Show instruction to user
    alert(
      `To ${newValue ? "enable" : "disable"} real API:\n\n` +
        `1. Set NEXT_PUBLIC_USE_REAL_API=${newValue} in .env.local\n` +
        `2. Restart your development server\n` +
        `3. Refresh the page`
    );

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">API Mode:</span>
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs ${useRealApi ? "text-gray-400" : "text-green-600 font-medium"}`}
            >
              Mock
            </span>
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${useRealApi ? "bg-blue-600" : "bg-gray-200"}
                ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${useRealApi ? "translate-x-6" : "translate-x-1"}
                `}
              />
            </button>
            <span
              className={`text-xs ${useRealApi ? "text-blue-600 font-medium" : "text-gray-400"}`}
            >
              Real API
            </span>
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Current: {useRealApi ? "Real API" : "Mock Data"}
        </div>
      </div>
    </div>
  );
}
