import React from 'react';
import { Globe } from 'lucide-react';

interface HemisphereToggleProps {
  hemisphere: 'NH' | 'SH';
  onToggle: () => void;
}

const HemisphereToggle = ({ hemisphere, onToggle }: HemisphereToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg 
        border-2 border-primary hover:border-secondary transition-colors"
    >
      <Globe className="w-5 h-5 text-primary" />
      <span className="text-sm font-medium text-primary">
        {hemisphere === 'NH' ? 'Northern' : 'Southern'} Hemisphere
      </span>
    </button>
  );
};

export default HemisphereToggle;