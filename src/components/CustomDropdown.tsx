import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CustomDropdown = ({ options, value, onChange, className = '' }: CustomDropdownProps) => {
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

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white rounded-lg border-2 border-primary 
          hover:border-secondary transition-colors duration-200 focus:outline-none focus:ring-2 
          focus:ring-primary focus:ring-opacity-50 flex items-center justify-between gap-2
          group"
      >
        <span className="text-text truncate">{selectedOption?.label}</span>
        <ChevronDown 
          className={`w-4 h-4 text-primary group-hover:text-secondary transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-primary rounded-lg 
          shadow-sm overflow-hidden animate-fadeIn">
          <div className="max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors
                  ${value === option.value ? 'bg-primary/20 font-medium' : ''}
                  ${value === option.value ? 'text-primary' : 'text-text'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;