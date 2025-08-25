import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Routine } from "../types/routine";
import {
  STATUS_BADGE_CONFIG,
  TYPE_BADGE_CONFIG,
  DEFAULT_STATUS_BADGE,
  DEFAULT_TYPE_BADGE,
} from "@/lib/constants";
import { useCallback } from "react";

interface RoutinesTableProps {
  routines: Routine[];
  onRoutineClick?: (routine: Routine) => void;
}

/**
 * RoutinesTable component - Displays routine data in responsive table/card format
 * Follows copilot instructions: under 200 lines, optimized performance
 */
export function RoutinesTable({
  routines,
  onRoutineClick,
}: RoutinesTableProps) {
  // Memoized utility functions for performance
  const getStatusBadge = useCallback((status: string): string => {
    return STATUS_BADGE_CONFIG.get(status) || DEFAULT_STATUS_BADGE;
  }, []);

  const getTypeBadge = useCallback((type: string): string => {
    return TYPE_BADGE_CONFIG.get(type) || DEFAULT_TYPE_BADGE;
  }, []);

  const formatDateTime = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }, []);

  const handleRoutineClick = useCallback(
    (routine: Routine) => {
      if (onRoutineClick) {
        onRoutineClick(routine);
      }
    },
    [onRoutineClick]
  );

  return (
    <Card className="overflow-hidden">
      {/* Mobile card view */}
      <div className="block sm:hidden">
        <div className="divide-y divide-gray-200">
          {routines.map((routine) => (
            <div key={routine.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3
                    className="text-sm font-medium text-blue-600 cursor-pointer hover:underline truncate"
                    onClick={() => handleRoutineClick(routine)}
                  >
                    {routine.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Created by {routine.createdBy}
                  </p>
                </div>
                <Badge
                  className={`ml-2 ${getStatusBadge(routine.lastEpisode.status)}`}
                >
                  {routine.lastEpisode.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <Badge className={`ml-1 ${getTypeBadge(routine.type)}`}>
                    {routine.type}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">Failed:</span>
                  {routine.failedEpisodes === 0 ? (
                    <span className="ml-1 text-gray-500">None</span>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="ml-1 rounded-full w-6 h-6 p-0 flex items-center justify-center"
                    >
                      {routine.failedEpisodes}
                    </Badge>
                  )}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Last Run:</span>
                  <span className="ml-1 text-gray-500">
                    {formatDateTime(routine.lastRun)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Modified by:</span>
                  <span className="ml-1 font-medium">{routine.modifiedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[200px]">
                Routine
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[140px]">
                Routine Type
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[120px]">
                Last Episode
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[160px]">
                Last Run
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[100px]">
                Failed Episodes
              </TableHead>
              <TableHead className="text-gray-900 text-sm lg:text-base py-3 lg:py-4 min-w-[140px]">
                Modified By
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routines.map((routine) => (
              <TableRow
                key={routine.id}
                className="border-b border-gray-100 hover:bg-gray-50/50"
              >
                <TableCell className="py-3 lg:py-4">
                  <div className="min-w-0">
                    <div
                      className="font-medium text-blue-600 cursor-pointer hover:underline truncate"
                      onClick={() => handleRoutineClick(routine)}
                    >
                      {routine.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created by {routine.createdBy}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 lg:py-4">
                  <Badge className={getTypeBadge(routine.type)}>
                    {routine.type}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 lg:py-4">
                  <Badge className={getStatusBadge(routine.lastEpisode.status)}>
                    {routine.lastEpisode.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500 py-3 lg:py-4">
                  {formatDateTime(routine.lastRun)}
                </TableCell>
                <TableCell className="py-3 lg:py-4">
                  {routine.failedEpisodes === 0 ? (
                    <span className="text-sm text-gray-500">None</span>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="rounded-full w-6 h-6 p-0 flex items-center justify-center"
                    >
                      {routine.failedEpisodes}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500 py-3 lg:py-4">
                  {routine.modifiedBy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
