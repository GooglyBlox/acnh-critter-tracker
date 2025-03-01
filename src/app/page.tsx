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
      const currentMonth = new Date().getMonth() + 1;
    
      // Determine if a critter is always available (i.e. available year‐round)
      const aAlwaysAvailable = a.monthsAvailable[hemisphere].length === 0;
      const bAlwaysAvailable = b.monthsAvailable[hemisphere].length === 0;
    
      // Determine "currently available" using time-of-day criteria, or if always available
      const aCurrentlyAvailable = aAlwaysAvailable || isCurrentlyAvailable(a, hemisphere);
      const bCurrentlyAvailable = bAlwaysAvailable || isCurrentlyAvailable(b, hemisphere);
    
      // Determine if the critter is seasonally available (i.e. available during the current month)
      const aSeasonal = a.monthsAvailable[hemisphere].includes(currentMonth);
      const bSeasonal = b.monthsAvailable[hemisphere].includes(currentMonth);
    
      // Assign a rank based on availability:
      // 0 = currently available (time criteria met or always available)
      // 1 = seasonally available (current month included) but not currently available
      // 2 = not available this month at all
      const getRank = (currently: boolean, seasonal: boolean) => {
        if (currently) return 0;
        if (seasonal) return 1;
        return 2;
      };
    
      const aRank = getRank(aCurrentlyAvailable, aSeasonal);
      const bRank = getRank(bCurrentlyAvailable, bSeasonal);
    
      // Lower rank items come first
      if (aRank !== bRank) {
        return aRank - bRank;
      }
    
      // If both critters have the same rank, sort alphabetically by name
      return a.name.localeCompare(b.name);
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