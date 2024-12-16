/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { Filter, Check } from 'lucide-react';
import type { FilterOptions } from '@/types';
import { getCaughtCount } from '@/lib/caught-utils';

interface FilterDropdownProps {
  filters: FilterOptions;
  onChange: (key: keyof FilterOptions, value: any) => void;
}

export function FilterDropdown({ filters, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.onlyAvailable) count++;
    if (filters.caught !== 'all') count++;
    return count;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium 
          bg-white rounded-lg border-2 border-primary hover:border-secondary 
          transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-xs 
            font-bold bg-primary text-white rounded-full">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border-2 
          border-primary shadow-sm z-50 animate-fadeIn">
          <div className="p-3 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-gray-600">Availability</h3>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.onlyAvailable}
                  onChange={(e) => onChange('onlyAvailable', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 border-2 border-primary rounded 
                  peer-checked:bg-primary transition-colors flex items-center justify-center">
                  {filters.onlyAvailable && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">Show only currently available</span>
              </label>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-gray-600">
                Caught Status ({getCaughtCount()} caught)
              </h3>
              <div className="space-y-1">
                {(['all', 'caught', 'uncaught'] as const).map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={filters.caught === status}
                      onChange={() => onChange('caught', status)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 border-2 border-primary rounded-full 
                      peer-checked:bg-primary transition-colors flex items-center justify-center">
                      {filters.caught === status && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm capitalize">
                      {status === 'all' ? 'Show all' : `Show ${status} only`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}