"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Routine } from "../types/routine";
import { RoutinesResponse } from "../routines-api";
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
 * Handles search, filtering, and pagination with client-side state
 */
export function RoutinesView({ initialData }: RoutinesViewProps) {
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
    return initialData.routines.filter((routine) => {
      const matchesSearch =
        searchQuery === "" ||
        routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "All Types" || routine.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [initialData.routines, searchQuery, selectedType]);

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
    <>
      <SearchAndFilter onFiltersChange={handleFiltersChange} />

      {/* Top pagination - Gmail style */}
      <div className="flex justify-end mb-4">
        <CompactPaginationComponent
          currentPage={currentPage}
          totalItems={filteredRoutines.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <RoutinesTable
        routines={paginatedRoutines}
        onRoutineClick={handleRoutineClick}
      />
    </>
  );
}
