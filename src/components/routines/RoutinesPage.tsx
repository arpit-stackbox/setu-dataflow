"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockRoutines } from "@/lib/mock-routines";
import { Routine } from "@/types/routine";
import { RoutinesTable } from "./RoutinesTable";
import { SearchAndFilter } from "../layout/SearchAndFilter";
import { PaginationComponent } from "../layout/PaginationComponent";
import { DEFAULT_ITEMS_PER_PAGE } from "@/lib/constants";

/**
 * RoutinesPage component - Main page for routine management
 * Follows copilot instructions: under 200 lines, simple and focused
 */
export function RoutinesPage() {
  const router = useRouter();
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

  // Filter routines - memoized for performance
  const filteredRoutines = useMemo(() => {
    return mockRoutines.filter((routine) => {
      const matchesSearch =
        routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "All Types" || routine.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  // Handle filter changes
  const handleFiltersChange = useCallback((query: string, type: string) => {
    setSearchQuery(query);
    setSelectedType(type);
    setCurrentPage(1);
  }, []);

  // Pagination logic
  const paginatedRoutines = useMemo(() => {
    const startIndex = (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE;
    const endIndex = startIndex + DEFAULT_ITEMS_PER_PAGE;
    return filteredRoutines.slice(startIndex, endIndex);
  }, [filteredRoutines, currentPage]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Operations
        </h1>
      </div>

      <SearchAndFilter onFiltersChange={handleFiltersChange} />

      <RoutinesTable
        routines={paginatedRoutines}
        onRoutineClick={handleRoutineClick}
      />

      <PaginationComponent
        currentPage={currentPage}
        totalItems={filteredRoutines.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
