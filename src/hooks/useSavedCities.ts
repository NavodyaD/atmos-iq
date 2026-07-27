"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSavedCities,
  saveCity,
  deleteCity,
  isCitySaved,
} from "@/lib/firestore/cities";
import { SavedCity } from "@/types/user";

export function useSavedCities() {
  const { user } = useAuth();
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = useCallback(async () => {
    if (!user) {
      setSavedCities([]);
      return;
    }
    setLoading(true);
    try {
      const cities = await getSavedCities(user.uid);
      setSavedCities(cities);
    } catch (e) {
      console.error("Failed to fetch saved cities", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const checkIsSaved = useCallback(
    async (lat: number, lon: number): Promise<string | null> => {
      if (!user) return null;
      return isCitySaved(user.uid, lat, lon);
    },
    [user]
  );

  const toggleSave = useCallback(
    async (city: { name: string; lat: number; lon: number }): Promise<boolean> => {
      if (!user) return false;
      const existingId = await isCitySaved(user.uid, city.lat, city.lon);
      if (existingId) {
        await deleteCity(existingId);
        setSavedCities((prev) => prev.filter((c) => c.id !== existingId));
        return false; // now unsaved
      } else {
        const id = await saveCity(user.uid, city);
        const newCity: SavedCity = {
          id,
          name: city.name,
          lat: city.lat,
          lon: city.lon,
          savedAt: new Date().toISOString(),
        };
        setSavedCities((prev) => [newCity, ...prev]);
        return true; // now saved
      }
    },
    [user]
  );

  const removeCity = useCallback(async (id: string) => {
    await deleteCity(id);
    setSavedCities((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { savedCities, loading, toggleSave, checkIsSaved, removeCity, refetch: fetchCities };
}
