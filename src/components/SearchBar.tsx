import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search critters...",
  className = '' 
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div 
      className={`relative flex-1 group ${className}`}
    >
      <div
        className={`absolute inset-0 -m-0.5 rounded-lg bg-primary/10 opacity-0 
          transition-opacity duration-200 
          ${isFocused ? 'opacity-100' : 'group-hover:opacity-50'}`}
      />
      
      <div className="relative flex items-center">
        <Search 
          className={`absolute left-3 w-4 h-4 transition-colors duration-200
            ${isFocused ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`}
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-8 py-2 bg-white border-2 border-primary 
            rounded-lg outline-none transition-all duration-200
            placeholder:text-text-secondary/70
            focus:border-secondary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
        />
        
        {value && (
          <button
            onClick={handleClear}
            className={`absolute right-3 p-0.5 rounded-full transition-colors
              hover:bg-primary/10 ${isFocused ? 'text-primary' : 'text-text-secondary'}`}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;