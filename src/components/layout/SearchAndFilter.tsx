import { Search, Filter } from "lucide-react";
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
import { ROUTINE_TYPES } from "@/lib/constants";

interface SearchAndFilterProps {
  onFiltersChange: (searchQuery: string, selectedType: string) => void;
}

/**
 * SearchAndFilter component - Self-contained search and filtering controls
 * Manages internal state and communicates changes to parent via callback
 * Optimized with memoized callbacks for performance
 */
export function SearchAndFilter({ onFiltersChange }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");

  // Memoized callbacks for better performance
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onFiltersChange(value, selectedType);
    },
    [selectedType, onFiltersChange]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setSelectedType(value);
      onFiltersChange(searchQuery, value);
    },
    [searchQuery, onFiltersChange]
  );
  return (
    <Card className="mb-6 sm:mb-8 p-4 sm:p-6 border-gray-200 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
        {/* Search Section */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Routines
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or description..."
              className="pl-10 h-10 sm:h-11 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex-shrink-0 w-full sm:w-auto lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full h-10 sm:h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROUTINE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
