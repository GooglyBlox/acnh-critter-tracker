/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import SearchBar from './SearchBar';
import type { FilterOptions } from '@/types';
import CustomDropdown from './CustomDropdown';

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
        <div className="flex flex-wrap items-center gap-4">
          <SearchBar
            value={currentFilters.search}
            onChange={(value) => handleChange('search', value)}
          />
          
          <CustomDropdown
            options={categoryOptions}
            value={currentFilters.category}
            onChange={(value) => handleChange('category', value)}
            className="w-40"
          />
          
          <CustomDropdown
            options={sortOptions}
            value={currentFilters.sortBy}
            onChange={(value) => handleChange('sortBy', value as FilterOptions['sortBy'])}
            className="w-48"
          />
          
          <label className="flex items-center gap-2 cursor-pointer group select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={currentFilters.onlyAvailable}
                onChange={(e) => handleChange('onlyAvailable', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 bg-white border-2 border-primary rounded 
                peer-checked:bg-primary peer-checked:border-primary transition-all" 
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                text-white opacity-0 peer-checked:opacity-100 transition-opacity text-sm">
                ✓
              </div>
            </div>
            <span className="text-sm text-text">Available now</span>
          </label>
          
          <p className="text-sm text-text-secondary ml-auto">
            Found {totalResults} critters
          </p>
        </div>
      </div>
    </div>
  );
}