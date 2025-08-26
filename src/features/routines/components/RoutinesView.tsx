"use client";

import { useState, useCallback, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Routine } from "../types/routine";
import { RoutinesResponse, getRoutines } from "../routines-api";
import { RoutinesTable } from "./RoutinesTable";
import { SearchAndFilter } from "@/components/layout/SearchAndFilter";
import { CompactPaginationComponent } from "@/components/layout/CompactPaginationComponent";
import { DEFAULT_ITEMS_PER_PAGE } from "@/lib/constants";

interface RoutinesViewProps {
  initialData: RoutinesResponse;
  routineTypes: string[];
}

/**
 * RoutinesView - Client Component for interactive functionality
 * Handles search, filtering, and server-side pagination
 */
export function RoutinesView({ initialData, routineTypes }: RoutinesViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentData, setCurrentData] = useState<RoutinesResponse>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);

  // Handle routine click navigation
  const handleRoutineClick = useCallback(
    (routine: Routine) => {
      router.push(`/episodes/${routine.id}`);
    },
    [router]
  );

  // Handle page change with API call
  const handlePageChange = useCallback(
    (page: number) => {
      startTransition(async () => {
        try {
          const newData = await getRoutines({
            page,
            limit: DEFAULT_ITEMS_PER_PAGE,
            search: searchQuery,
            type: selectedType,
          });

          // CRITICAL FIX: Ensure totalCount is never 0 if we had data before
          if (newData.totalCount === 0 && currentData.totalCount > 0) {
            console.warn(
              `⚠️ API returned totalCount=0, preserving previous value: ${currentData.totalCount}`
            );
            newData.totalCount = currentData.totalCount;
          }

          setCurrentData(newData);
          setCurrentPage(page);
        } catch (error) {
          console.error("❌ Failed to load page:", error);
          // Handle error - keep current data but still update page
          setCurrentPage(page);
        }
      });
    },
    [searchQuery, selectedType, currentData, currentPage]
  ); // Handle filter changes with API call
  const handleFiltersChange = useCallback((query: string, type: string) => {
    // Temporarily disabled until we implement proper server-side filtering
    console.log(
      "Search/filter temporarily disabled - API does not support server-side filtering yet"
    );
    return;

    startTransition(async () => {
      try {
        const newData = await getRoutines({
          page: 1,
          limit: DEFAULT_ITEMS_PER_PAGE,
          search: query,
          type,
        });
        setCurrentData(newData);
        setSearchQuery(query);
        setSelectedType(type);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to filter:", error);
        // Handle error
      }
    });
  }, []);

  // For now, show all routines from current page (no client-side filtering)
  // TODO: Implement proper server-side filtering in API
  const displayRoutines = currentData.routines;

  return (
    <>
      <SearchAndFilter onFiltersChange={handleFiltersChange} />

      {/* Top pagination - always use total count from API, not filtered count */}
      <div className="flex justify-end mb-4">
        <CompactPaginationComponent
          currentPage={currentPage}
          totalItems={currentData.totalCount} // Always use API total, not filtered count
          itemsPerPage={DEFAULT_ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>

      <RoutinesTable
        routines={displayRoutines}
        onRoutineClick={handleRoutineClick}
      />

      {/* Loading overlay when fetching new data */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
