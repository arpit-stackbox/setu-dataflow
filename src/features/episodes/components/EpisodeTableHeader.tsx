import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * EpisodeTableHeader component - Desktop table header
 * Displays column headers for the episodes table
 */
export function EpisodeTableHeader() {
  return (
    <TableHeader className="bg-gray-50/50">
      <TableRow className="border-gray-200">
        <TableHead className="font-semibold text-gray-700 py-3 lg:py-4">
          Episode
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-3 lg:py-4">
          Status
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-3 lg:py-4">
          Progress
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-3 lg:py-4">
          Error Details
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-3 lg:py-4">
          Duration
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-3 lg:py-4">
          Retry Info
        </TableHead>
        <TableHead className="font-semibold text-gray-700 py-3 lg:py-4">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
