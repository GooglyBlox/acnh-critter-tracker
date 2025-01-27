/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { FilterBar } from '@/components/FilterBar';
import { CritterGrid } from '@/components/CritterGrid';
import HemisphereToggle from '@/components/HemisphereToggle';
import LoadingView from '@/components/LoadingView';
import type { Critter, FilterOptions, Hemisphere } from '@/types';
import { isCurrentlyAvailable } from '@/lib/date-utils';
import { isCritterCaught } from '@/lib/caught-utils';

const defaultFilters: FilterOptions = {
  search: '',
  category: 'all',
  onlyAvailable: false,
  caught: 'all',
  sortBy: 'availability'
};

export default function Home() {
  const [critters, setCritters] = useState<Critter[]>([]);
  const [filteredCritters, setFilteredCritters] = useState<Critter[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isHemisphereLoaded, setIsHemisphereLoaded] = useState(false);
  const [hemisphere, setHemisphere] = useState<Hemisphere>('NH');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchCritters = async () => {
      try {
        const response = await fetch('/api/critters');
        if (!response.ok) throw new Error('Failed to fetch critters');
        const data = await response.json();
        setCritters(data);
      } catch (err) {
        console.error('Error fetching critters:', err);
        setError(err instanceof Error ? err.message : 'Failed to load critters');
      } finally {
        setLoading(false);
      }
    };

    fetchCritters();
  }, []);

  useEffect(() => {
    let result = [...critters];

    if (filters.category !== 'all') {
      result = result.filter(critter => critter.category === filters.category);
    }

    if (filters.onlyAvailable) {
      result = result.filter(critter => {
        if (critter.monthsAvailable[hemisphere].length === 0) {
          return true;
        }
        return isCurrentlyAvailable(critter, hemisphere);
      });
    }

    if (filters.caught !== 'all') {
      result = result.filter(critter => {
        const isCaught = isCritterCaught(critter.id);
        return filters.caught === 'caught' ? isCaught : !isCaught;
      });
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(critter => 
        critter.name.toLowerCase().includes(searchLower) ||
        critter.description.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'availability': {
          const aAvailable = a.monthsAvailable[hemisphere].length === 0 ? true : isCurrentlyAvailable(a, hemisphere);
          const bAvailable = b.monthsAvailable[hemisphere].length === 0 ? true : isCurrentlyAvailable(b, hemisphere);
          if (aAvailable === bAvailable) {
            return a.name.localeCompare(b.name);
          }
          return aAvailable ? -1 : 1;
        }
        default:
          return 0;
      }
    });

    setFilteredCritters(result);
  }, [critters, filters, hemisphere]);

  useEffect(() => {
    const stored = localStorage.getItem('acnh-hemisphere');
    if (stored === 'SH' || stored === 'NH') {
      setHemisphere(stored);
    }
    setIsHemisphereLoaded(true);
  }, []);

  useEffect(() => {
    const fetchCritters = async () => {
      try {
        const response = await fetch('/api/critters');
        if (!response.ok) throw new Error('Failed to fetch critters');
        const data = await response.json();
        setCritters(data);
      } catch (err) {
        console.error('Error fetching critters:', err);
        setError(err instanceof Error ? err.message : 'Failed to load critters');
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
  
    fetchCritters();
  }, []);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const toggleHemisphere = () => {
    const newHemisphere = hemisphere === 'NH' ? 'SH' : 'NH';
    setHemisphere(newHemisphere);
    localStorage.setItem('acnh-hemisphere', newHemisphere);
  };

  const handleCaughtChange = (critterId: string, newStatus: boolean) => {
    if ((filters.caught === 'uncaught' && newStatus) || 
        (filters.caught === 'caught' && !newStatus)) {
      setFilteredCritters(prev => prev.filter(critter => critter.id !== critterId));
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-error">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4 flex justify-end">
        <div className={`transition-opacity duration-200 ${isHemisphereLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <HemisphereToggle
            hemisphere={hemisphere}
            onToggle={toggleHemisphere}
          />
        </div>
      </div>
      
      <FilterBar
        onFilterChange={handleFilterChange}
        totalResults={filteredCritters.length}
        currentFilters={filters}
      />

      {loading || isInitialLoad ? (
        <LoadingView />
      ) : filteredCritters.length > 0 ? (
        <CritterGrid
          critters={filteredCritters}
          currentHemisphere={hemisphere}
          onCaughtChange={handleCaughtChange}
        />
      ) : (
        <div className="text-center py-12 space-y-4">
          <p className="text-text-secondary">No critters found matching your filters.</p>
          <div className="w-96 mx-auto">
            <img 
              src="/isabelle-stop.webp" 
              alt="Isabelle saying no results found"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}