import { Check } from 'lucide-react';
import { isCritterCaught, toggleCaughtStatus } from '@/lib/caught-utils';
import { useState, useEffect } from 'react';

interface CaughtButtonProps {
  critterId: string;
  className?: string;
}

export function CaughtButton({ critterId, className = '' }: CaughtButtonProps) {
  const [isCaught, setIsCaught] = useState(false);

  useEffect(() => {
    setIsCaught(isCritterCaught(critterId));
  }, [critterId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = toggleCaughtStatus(critterId);
    setIsCaught(newStatus);
  };

  return (
    <button
      onClick={handleToggle}
      className={`absolute top-3 right-3 flex items-center gap-1.5 py-1 px-2
        rounded-full transition-all duration-200 group border-2
        ${isCaught 
          ? 'bg-primary border-primary text-white hover:bg-primary/90' 
          : 'border-primary/30 hover:border-primary text-primary/40 hover:text-primary hover:bg-primary/5'}
        ${className}`}
      aria-label={isCaught ? "Mark as uncaught" : "Mark as caught"}
    >
      <Check className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">
        {isCaught ? 'Caught' : 'Catch'}
      </span>
    </button>
  );
}