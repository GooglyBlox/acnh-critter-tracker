/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import type { Critter, Hemisphere } from '@/types';
import { formatTimeRange, parseTimeRanges, formatMonthList, isCurrentlyAvailable } from '@/lib/date-utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Bell, Clock, Calendar, MapPin, Ruler, Info } from 'lucide-react';
import { CritterTooltip } from './ui/tooltip';
import { CaughtButton } from './CaughtButton';

interface CritterCardProps {
  critter: Critter;
  currentHemisphere: Hemisphere;
  onCaughtChange?: (critterId: string, newStatus: boolean) => void;
}

export function CritterCard({ critter, currentHemisphere, onCaughtChange }: CritterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const monthKey = `${currentHemisphere} ${monthNames[currentMonth]}` as keyof Critter;
  const currentTimeStr = critter[monthKey];
  const isMonthAvailable = currentTimeStr && currentTimeStr !== 'NA';
  const isTimeAvailable = isCurrentlyAvailable(critter, currentHemisphere);
  const isAvailable = currentTimeStr && currentTimeStr !== 'NA';
  const timeRanges = isAvailable ? parseTimeRanges(currentTimeStr) : [];
  const availableMonths = critter.monthsAvailable[currentHemisphere];

  const getIconPath = () => {
    const categoryFolder = {
      fish: 'fish',
      insect: 'bugs',
      seaCreature: 'sea_creatures'
    }[critter.category];

    const formattedName = critter.name
      .split(' ')
      .map(word => {
        if (word.includes('-')) {
          return word.split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-');
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ')
      .replace(/'/g, '_');
  
    return `/icons/${categoryFolder}/${formattedName} NH Icon.png`;
  };

  const getAvailabilityColor = () => {
    if (!isMonthAvailable) return 'border-red-200';
    if (!isTimeAvailable) return 'border-amber-200';
    return 'border-green-200';
  };

  const getLocation = () => {
    if (critter.category === 'seaCreature') return 'Ocean';
    return critter.location;
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-200 hover:scale-102 
        ${getAvailabilityColor()} border-2 rounded-2xl`}
    >
      <CardHeader className="pt-6 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full">
            <img 
              src={getIconPath()} 
              alt={`${critter.name} icon`}
              width={32}
              height={32}
              className="w-9 h-9 object-contain"
            />
          </div>
          <div className="min-w-0 flex-1 pr-20">
            <CritterTooltip
              title={critter.name.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ).join(' ')}
              content={critter.description}
              side="top"
              align="start"
            >
              <h3 className="text-lg font-bold capitalize text-gray-800 truncate hover:cursor-help">
                {critter.name}
              </h3>
            </CritterTooltip>
            <CritterTooltip
              title="Catch Phrase"
              content={critter.catchPhrase}
              side="bottom"
              align="start"
            >
              <p className="text-sm text-gray-500 italic line-clamp-2 hover:cursor-help mt-1">
                {critter.catchPhrase}
              </p>
            </CritterTooltip>
          </div>
        </div>
        <CaughtButton 
          critterId={critter.id}
          onCaughtChange={(newStatus) => onCaughtChange?.(critter.id, newStatus)}
        />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-2 bg-white/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 shrink-0 mt-0.5 text-yellow-400" />
              <span className="text-sm">
                {critter.price} bells
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <span className="text-sm">
                {formatMonthList(availableMonths)}
              </span>
            </div>
            {isAvailable && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span className="text-sm">
                  {formatTimeRange(timeRanges)}
                </span>
              </div>
            )}
          </div>

          {!isExpanded && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="w-full py-2.5 mt-2 text-sm font-medium text-primary hover:bg-primary/10 
                rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Info className="w-4 h-4" />
              More Details
            </button>
          )}
          
          {isExpanded && (
            <div className="space-y-3 animate-fadeIn">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                  <span className="text-sm text-gray-600">{getLocation()}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Ruler className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                  <span className="text-sm text-gray-600">{critter.size}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {critter.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {critter.catchDifficulty && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full 
                    bg-yellow-50 text-yellow-700 border border-yellow-200">
                    {critter.catchDifficulty} to catch
                  </span>
                )}
                {critter.vision && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full 
                    bg-blue-50 text-blue-700 border border-blue-200">
                    {critter.vision} vision
                  </span>
                )}
                {critter.spawnRates && Number(critter.spawnRates) !== 0 && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full 
                    bg-purple-50 text-purple-700 border border-purple-200">
                    Spawn Rate: {critter.spawnRates}%
                  </span>
                )}
                {critter.shadow && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full 
                    bg-green-50 text-green-700 border border-green-200">
                    Shadow Size: {critter.shadow}
                  </span>
                )}
                {critter.weather && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full 
                    bg-red-50 text-red-700 border border-red-200">
                    Weather: {critter.weather}
                  </span>
                )}
                {critter.movementSpeed && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full 
                    bg-orange-50 text-orange-700 border border-orange-200">
                    Movement Speed: {critter.movementSpeed}
                  </span>
                )}
              </div>

              <button 
                onClick={() => setIsExpanded(false)}
                className="w-full py-2 text-sm font-medium text-primary/80 
                  hover:bg-primary/10 rounded-lg transition-colors"
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}