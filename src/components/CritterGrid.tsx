import { CritterCard } from './CritterCard';
import type { Critter, Hemisphere } from '@/types';

interface CritterGridProps {
  critters: Critter[];
  currentHemisphere: Hemisphere;
  onCaughtChange?: (critterId: string, newStatus: boolean) => void;
}

export function CritterGrid({ critters, currentHemisphere, onCaughtChange }: CritterGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
     {critters.map(critter => (
        <CritterCard 
          key={critter.id} 
          critter={critter} 
          currentHemisphere={currentHemisphere}
          onCaughtChange={onCaughtChange}
        />
      ))}
    </div>
  );
}