import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMemo, useCallback } from "react";
import { DEFAULT_ITEMS_PER_PAGE } from "@/lib/constants";

interface PaginationComponentProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

/**
 * PaginationComponent - Handles pagination controls and logic
 * Includes internal page calculations and optimized click handlers
 * Uses memoization for performance optimization
 */
export function PaginationComponent({
  currentPage,
  totalItems,
  onPageChange,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: PaginationComponentProps) {
  // Memoized calculations for better performance
  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const displayInfo = useMemo(
    () => ({
      start: (currentPage - 1) * itemsPerPage + 1,
      end: Math.min(currentPage * itemsPerPage, totalItems),
      total: totalItems,
    }),
    [currentPage, itemsPerPage, totalItems]
  );

  // Memoized page click handler
  const handlePageClick = useCallback(
    (e: React.MouseEvent, page: number) => {
      e.preventDefault();
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 sm:mt-6">
      {/* Results info - responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          Showing <span className="font-medium">{displayInfo.start}</span> to{" "}
          <span className="font-medium">{displayInfo.end}</span> of{" "}
          <span className="font-medium">{displayInfo.total}</span> results
        </div>
      </div>

      {/* Pagination controls */}
      <Pagination>
        <PaginationContent className="flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => handlePageClick(e, currentPage - 1)}
              className={`${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              } text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            const isVisible =
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1;

            if (!isVisible && page === currentPage - 2) {
              return (
                <PaginationItem key={`ellipsis-before-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            if (!isVisible && page === currentPage + 2) {
              return (
                <PaginationItem key={`ellipsis-after-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            if (!isVisible) return null;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => handlePageClick(e, page)}
                  className="cursor-pointer text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 min-w-[32px] sm:min-w-[40px]"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => handlePageClick(e, currentPage + 1)}
              className={`${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              } text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
