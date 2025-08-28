import { Suspense } from "react";
import {
  getRoutines,
  getRoutineTypes,
  RoutinesView,
  RoutinesLoadingSkeleton,
} from "@/features/routines";

interface DashboardProps {
  searchParams: Promise<{ page?: string }>;
}

/**
 * Dashboard Page - Server Component
 * Fetches initial data on the server for better performance and SEO
 */
export default async function Dashboard({ searchParams }: DashboardProps) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  // Server-side data fetching - get the requested page
  const [initialRoutines, routineTypes] = await Promise.all([
    getRoutines({ page: currentPage, limit: 10 }),
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
          initialPage={currentPage}
        />
      </Suspense>
    </div>
  );
}
