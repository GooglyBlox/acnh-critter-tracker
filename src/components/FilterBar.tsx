/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search } from 'lucide-react';
import type { FilterOptions } from '@/types';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalResults: number;
  currentFilters: FilterOptions;
}

export function FilterBar({ onFilterChange, totalResults, currentFilters }: FilterBarProps) {
  const handleChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="sticky top-0 z-10 p-4 mb-4 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Search critters..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={currentFilters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
          
          <select
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            value={currentFilters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="fish">Fish</option>
            <option value="insect">Insects</option>
            <option value="seaCreature">Sea Creatures</option>
          </select>
          
          <select
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            value={currentFilters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value as FilterOptions['sortBy'])}
          >
            <option value="availability">Sort by Availability</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentFilters.onlyAvailable}
              onChange={(e) => handleChange('onlyAvailable', e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm">Show only available now</span>
          </label>
          
          <p className="text-sm text-text-secondary ml-auto">
            Found {totalResults} critters
          </p>
        </div>
      </div>
    </div>
  );
}