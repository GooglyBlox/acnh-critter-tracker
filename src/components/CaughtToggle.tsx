interface CaughtToggleProps {
    value: 'all' | 'caught' | 'uncaught';
    onChange: (value: 'all' | 'caught' | 'uncaught') => void;
    className?: string;
  }
  
  export function CaughtToggle({ value, onChange, className = '' }: CaughtToggleProps) {
    return (
      <div className={`inline-flex rounded-lg border-2 border-primary ${className}`}>
        <button
          onClick={() => onChange('all')}
          className={`px-3 py-1.5 text-sm transition-colors
            ${value === 'all' 
              ? 'bg-primary text-white font-medium' 
              : 'text-primary hover:bg-primary/10'}`}
        >
          All
        </button>
        <button
          onClick={() => onChange('caught')}
          className={`px-3 py-1.5 text-sm transition-colors border-l border-primary
            ${value === 'caught' 
              ? 'bg-primary text-white font-medium' 
              : 'text-primary hover:bg-primary/10'}`}
        >
          Caught
        </button>
        <button
          onClick={() => onChange('uncaught')}
          className={`px-3 py-1.5 text-sm transition-colors border-l border-primary
            ${value === 'uncaught' 
              ? 'bg-primary text-white font-medium' 
              : 'text-primary hover:bg-primary/10'}`}
        >
          Not Caught
        </button>
      </div>
    );
  }