import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressInputProps {
  label: string;
  value: string;
  onChange: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
}

const AddressInput = ({ label, value, onChange, placeholder }: AddressInputProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`
      );
      const data = await res.json();
      setSuggestions(data);
      setShowDropdown(true);
    } catch { setSuggestions([]); }
  }, []);

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => searchAddress(val), 400);
  };

  const handleSelect = (s: Suggestion) => {
    setQuery(s.display_name);
    onChange(s.display_name, parseFloat(s.lat), parseFloat(s.lon));
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="pl-10 h-11 bg-card border-border"
        />
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-luxury-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors border-b border-border last:border-0 truncate"
            >
              {s.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressInput;
