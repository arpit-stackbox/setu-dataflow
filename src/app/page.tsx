import { Suspense } from "react";
import {
  getRoutines,
  getRoutineTypes,
  RoutinesView,
  RoutinesLoadingSkeleton,
} from "@/features/routines";

/**
 * Dashboard Page - Server Component
 * Fetches initial data on the server for better performance and SEO
 */
export default async function Dashboard() {
  // Server-side data fetching - get first page only (let client handle pagination)
  const [initialRoutines, routineTypes] = await Promise.all([
    getRoutines({ page: 1, limit: 10 }), // Get first page only
    getRoutineTypes(),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Operations
        </h1>
      </div>

      <Suspense fallback={<RoutinesLoadingSkeleton />}>
        <RoutinesView
          initialData={initialRoutines}
          routineTypes={routineTypes}
        />
      </Suspense>
    </div>
  );
}
