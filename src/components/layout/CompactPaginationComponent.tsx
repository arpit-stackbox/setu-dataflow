import { useMemo, useCallback } from "react";
import { DEFAULT_ITEMS_PER_PAGE } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CompactPaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

/**
 * CompactPaginationComponent - Compact pagination for top-right placement
 * Similar to Gmail's pagination style with minimal space usage
 */
export function CompactPaginationComponent({
  currentPage,
  totalItems,
  onPageChange,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: CompactPaginationProps) {
  // Memoized calculations
  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const displayInfo = useMemo(
    () => ({
      start: totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0,
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

  // Always show pagination, even with 0 items or 1 page

  return (
    <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
      {/* Results info - compact format */}
      <div className="text-xs sm:text-sm whitespace-nowrap">
        {totalItems === 0 ? (
          "0 results"
        ) : (
          <>
            {displayInfo.start}–{displayInfo.end} of {displayInfo.total}
          </>
        )}
      </div>

      {/* Compact pagination controls - show even with 1 page */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <button
          onClick={(e) => handlePageClick(e, currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
            currentPage === 1 || totalPages === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Current page info */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs text-gray-500">Page</span>
          <span className="font-medium text-gray-900">{currentPage}</span>
          <span className="text-xs text-gray-500">
            of {Math.max(1, totalPages)}
          </span>
        </div>

        {/* Next button */}
        <button
          onClick={(e) => handlePageClick(e, currentPage + 1)}
          disabled={currentPage === totalPages || totalPages <= 1}
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
            currentPage === totalPages || totalPages <= 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
