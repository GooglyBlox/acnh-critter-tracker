import { useState } from 'react';
import type { Critter, Hemisphere } from '@/types';
import { formatTimeRange, parseTimeRanges, formatMonthList } from '@/lib/date-utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Bell, Fish, Bug, Anchor, Clock, Calendar, MapPin, Ruler, Info } from 'lucide-react';

interface CritterCardProps {
  critter: Critter;
  currentHemisphere: Hemisphere;
}

export function CritterCard({ critter, currentHemisphere }: CritterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const monthKey = `${currentHemisphere} ${monthNames[currentMonth]}`;
  const currentTimeStr = critter[monthKey];
  const isAvailable = currentTimeStr && currentTimeStr !== 'NA';
  const timeRanges = isAvailable ? parseTimeRanges(currentTimeStr) : [];
  const availableMonths = critter.monthsAvailable[currentHemisphere];

  const getCritterIcon = () => {
    switch (critter.category) {
      case 'fish':
        return <Fish className="w-6 h-6 text-blue-400" />;
      case 'insect':
        return <Bug className="w-6 h-6 text-green-400" />;
      case 'seaCreature':
        return <Anchor className="w-6 h-6 text-cyan-400" />;
    }
  };

  const getAvailabilityColor = () => {
    if (!isAvailable) return 'bg-red-50 border-red-200';
    return 'bg-green-50 border-green-200';
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
      <CardHeader className="pt-6 pr-24">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-full shadow-sm">
            {getCritterIcon()}
          </div>
          <div className="min-w-0">
            <h3 
              className="text-lg font-bold capitalize text-gray-800 truncate cursor-help"
              title={critter.name}
            >
              {critter.name}
            </h3>
            <p 
              className="text-sm text-gray-500 italic line-clamp-2 cursor-help"
              title={critter.catchPhrase}
            >
              {critter.catchPhrase}
            </p>
          </div>
        </div>
      </CardHeader>

      <div className="absolute top-0 right-0 p-3 bg-white rounded-bl-2xl border-l border-b z-10">
        <div className="flex items-center gap-1">
          <Bell className="w-4 h-4 text-yellow-400" />
          <span className="font-medium text-gray-700">{critter.price}</span>
        </div>
      </div>
      
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-2 bg-white/50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">
                {formatMonthList(availableMonths)}
              </span>
            </div>
            {isAvailable && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {formatTimeRange(timeRanges)}
                </span>
              </div>
            )}
          </div>

          {!isExpanded && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="w-full py-2 mt-2 text-sm font-medium text-primary hover:bg-primary/10 
                rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Info className="w-4 h-4" />
              More Info
            </button>
          )}
          
          {isExpanded && (
            <div className="space-y-3 animate-fadeIn">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-1 text-gray-500" />
                  <span className="text-sm text-gray-600">{getLocation()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-500" />
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
                {critter.spawnRates && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full 
                    bg-purple-50 text-purple-700 border border-purple-200">
                    Spawn Rate: {critter.spawnRates}
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