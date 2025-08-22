import { Search, Filter, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Episode status types for filtering
const EPISODE_STATUS_TYPES = [
  "All Types",
  "Success",
  "Failed",
  "Running",
  "Warning",
] as const;

interface EpisodeSearchAndFilterProps {
  onFiltersChange: (
    searchQuery: string,
    selectedType: string,
    dateRange?: { start: string; end: string }
  ) => void;
}

/**
 * EpisodeSearchAndFilter component - Search and filtering controls for episodes
 * Includes search, status filter, and date range filter
 * Manages internal state and communicates changes to parent via callback
 */
export function EpisodeSearchAndFilter({
  onFiltersChange,
}: EpisodeSearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Memoized callbacks for better performance
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      const dateRange =
        startDate && endDate ? { start: startDate, end: endDate } : undefined;
      onFiltersChange(value, selectedType, dateRange);
    },
    [selectedType, startDate, endDate, onFiltersChange]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setSelectedType(value);
      const dateRange =
        startDate && endDate ? { start: startDate, end: endDate } : undefined;
      onFiltersChange(searchQuery, value, dateRange);
    },
    [searchQuery, startDate, endDate, onFiltersChange]
  );

  const handleDateChange = useCallback(
    (field: "start" | "end", value: string) => {
      if (field === "start") {
        setStartDate(value);
        const dateRange =
          value && endDate ? { start: value, end: endDate } : undefined;
        onFiltersChange(searchQuery, selectedType, dateRange);
      } else {
        setEndDate(value);
        const dateRange =
          startDate && value ? { start: startDate, end: value } : undefined;
        onFiltersChange(searchQuery, selectedType, dateRange);
      }
    },
    [searchQuery, selectedType, startDate, endDate, onFiltersChange]
  );

  return (
    <Card className="mb-6 sm:mb-8 p-4 sm:p-6 border-gray-200 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
        {/* Search Section */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Episodes
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by episode ID or status..."
              className="pl-10 h-10 sm:h-11 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filter by Status Section */}
        <div className="flex-shrink-0 w-full sm:w-auto lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full h-10 sm:h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EPISODE_STATUS_TYPES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range Section */}
        <div className="flex flex-col gap-4 w-full sm:w-auto lg:w-96">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10 h-10 sm:h-11 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10 h-10 sm:h-11 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
