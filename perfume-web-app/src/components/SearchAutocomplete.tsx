import { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { perfumeApi } from '../lib/api';
import type { Perfume } from '../types/perfume';
import PerfumeImage from './PerfumeImage';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (perfume: Perfume) => void;
  placeholder?: string;
  className?: string;
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Search perfumes...",
  className = ""
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  const debouncedQuery = useDebounce(value, 300);

  // Fetch suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => perfumeApi.searchPerfumes(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when there are suggestions
  useEffect(() => {
    if (suggestions && suggestions.perfumes.length > 0 && isFocused && debouncedQuery.length >= 2) {
      setIsOpen(true);
    } else if (debouncedQuery.length < 2) {
      setIsOpen(false);
    }
  }, [suggestions, isFocused, debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelectPerfume = (perfume: Perfume) => {
    onSelect(perfume);
    setIsOpen(false);
    onChange(''); // Clear search after selection
  };

  const displayedSuggestions = suggestions?.perfumes.slice(0, 8) || [];

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full pl-16 pr-6 py-5 md:py-6 text-lg md:text-xl border-2 border-slate-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
          aria-label="Search for a perfume"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />

        {isLoading && (
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-96 overflow-y-auto">
          {displayedSuggestions.length > 0 ? (
            <ul role="listbox" className="py-2">
              {displayedSuggestions.map((perfume) => (
                <li
                  key={perfume.id}
                  role="option"
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors duration-150 border-b border-slate-100 last:border-0"
                  onClick={() => handleSelectPerfume(perfume)}
                >
                  <div className="flex items-center space-x-3">
                    <PerfumeImage
                      perfume={perfume}
                      className="flex-shrink-0 rounded-lg"
                      width={48}
                      height={48}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate text-sm">
                        {perfume.title || perfume.name}
                      </p>
                      <p className="text-slate-600 text-xs truncate">
                        {perfume.brand}
                        {perfume.year && ` • ${perfume.year}`}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-slate-600">
              No perfumes found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
