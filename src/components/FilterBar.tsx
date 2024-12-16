/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import SearchBar from './SearchBar';
import CustomDropdown from './CustomDropdown';
import { FilterDropdown } from './FilterDropdown';
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
  const handleChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="sticky top-0 z-20 p-4 mb-4 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto">
        <div className="flex items-center gap-3">
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
  );
}