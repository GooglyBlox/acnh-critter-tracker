/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import CustomDropdown from './CustomDropdown';
import { FilterDropdown } from './FilterDropdown';
import { Filter, X } from 'lucide-react';
import type { FilterOptions } from '@/types';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalResults: number;
  currentFilters: FilterOptions;
}

const categoryOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'fish', label: 'Fish' },
  { value: 'insect', label: 'Insects' },
  { value: 'seaCreature', label: 'Sea Creatures' }
];

const sortOptions = [
  { value: 'availability', label: 'Sort by Availability' },
  { value: 'name', label: 'Sort by Name' },
  { value: 'price', label: 'Sort by Price' }
];

export function FilterBar({ onFilterChange, totalResults, currentFilters }: FilterBarProps) {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const handleChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilters.category !== 'all') count++;
    if (currentFilters.onlyAvailable) count++;
    if (currentFilters.caught !== 'all') count++;
    if (currentFilters.sortBy !== 'availability') count++;
    return count;
  };

  return (
    <>
      <div className="sticky top-0 z-20 p-4 mb-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto">
          {/* Mobile Layout */}
          <div className="flex flex-col space-y-3 lg:hidden">
            <div className="flex items-center gap-2">
              <SearchBar
                value={currentFilters.search}
                onChange={(value) => handleChange('search', value)}
                className="flex-1"
              />
              <button
                onClick={() => setIsFilterPanelOpen(true)}
                className="flex items-center justify-center h-11 px-4 bg-white rounded-lg 
                  border-2 border-primary hover:border-secondary transition-colors"
              >
                <Filter className="w-5 h-5 text-primary" />
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-1.5 flex items-center justify-center w-5 h-5 text-xs 
                    font-bold bg-primary text-white rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>
            
            <p className="text-sm text-text-secondary">
              Found {totalResults} critters
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <SearchBar
              value={currentFilters.search}
              onChange={(value) => handleChange('search', value)}
              className="flex-1"
            />
            
            <div className="flex items-center gap-3">
              <CustomDropdown
                options={categoryOptions}
                value={currentFilters.category}
                onChange={(value) => handleChange('category', value)}
                className="w-40"
              />
              
              <CustomDropdown
                options={sortOptions}
                value={currentFilters.sortBy}
                onChange={(value) => handleChange('sortBy', value)}
                className="w-48"
              />
              
              <FilterDropdown
                filters={currentFilters}
                onChange={handleChange}
              />
              
              <p className="text-sm text-text-secondary border-l pl-3">
                Found {totalResults} critters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {isFilterPanelOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsFilterPanelOpen(false)} />
          
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button 
                onClick={() => setIsFilterPanelOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Category</label>
                <CustomDropdown
                  options={categoryOptions}
                  value={currentFilters.category}
                  onChange={(value) => handleChange('category', value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Sort By</label>
                <CustomDropdown
                  options={sortOptions}
                  value={currentFilters.sortBy}
                  onChange={(value) => handleChange('sortBy', value)}
                  className="w-full"
                />
              </div>

              <div className="pt-2">
                <FilterDropdown
                  filters={currentFilters}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}