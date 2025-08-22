/**
 * Loading skeleton for the routines page
 * Provides visual feedback while data is loading
 */
export function RoutinesLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Search and Filter Skeleton */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto lg:w-48">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="p-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="grid grid-cols-6 gap-4 items-center">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-2">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}
