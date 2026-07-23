"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { City } from "@/types/weather";
import { searchCities } from "@/services/openMeteo";

export function CitySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Default coordinates (e.g., London) if we want to store them
  // For now, let's just log the selected city.
  // In a real app, you'd use context or URL params to share the selected city.

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const cities = await searchCities(query);
        setResults(cities);
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectCity = (city: City) => {
    setQuery("");
    setIsOpen(false);
    
    // Using URL Search Params to update global state
    const url = new URL(window.location.href);
    url.searchParams.set("lat", city.latitude.toString());
    url.searchParams.set("lon", city.longitude.toString());
    url.searchParams.set("city", city.name);
    window.history.pushState({}, "", url.toString());
    
    // Trigger a custom event to notify components that the city changed
    window.dispatchEvent(new Event("citychange"));
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search for cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <ul className="max-h-60 overflow-auto p-1">
            {results.map((city) => (
              <li
                key={city.id}
                onClick={() => handleSelectCity(city)}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">{city.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
