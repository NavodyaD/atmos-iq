"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedCities } from "@/hooks/useSavedCities";
import { getWeather } from "@/services/openMeteo";
import { WeatherData } from "@/types/weather";
import { SavedCity } from "@/types/user";
import { getWeatherInfo } from "@/lib/constants/weatherCodes";
import { AuthModal } from "@/components/auth/AuthModal";
import { Loader } from "@/components/ui/Loader";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Bookmark,
  Trash2,
  MapPin,
  Clock,
  LogIn,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface CityCardData {
  city: SavedCity;
  weather: WeatherData | null;
  loading: boolean;
}

function CityCard({
  data,
  onRemove,
}: {
  data: CityCardData;
  onRemove: () => void;
}) {
  const { city, weather, loading } = data;

  const currentWeather = weather?.current;
  const weatherInfo = currentWeather
    ? getWeatherInfo(currentWeather.weatherCode)
    : null;
  const WeatherIcon = weatherInfo?.icon;

  return (
    <Card className="group relative overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        {/* Top gradient banner */}
        <div className="bg-gradient-to-br from-primary/70 to-primary px-5 pt-5 pb-4 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="h-4 w-4 opacity-80" />
                <h3 className="text-lg font-bold">{city.name}</h3>
              </div>
              {loading ? (
                <div className="h-8 w-20 rounded bg-white/20 animate-pulse" />
              ) : currentWeather ? (
                <p className="text-3xl font-black tracking-tighter">
                  {Math.round(currentWeather.temperature)}&deg;C
                </p>
              ) : (
                <p className="text-sm opacity-70">Unavailable</p>
              )}
            </div>

            {WeatherIcon && !loading && (
              <div className="p-3 bg-white/15 rounded-xl">
                <WeatherIcon className="h-8 w-8 drop-shadow" strokeWidth={1.5} />
              </div>
            )}
            {loading && (
              <div className="h-14 w-14 rounded-xl bg-white/20 animate-pulse" />
            )}
          </div>

          {weatherInfo && !loading && (
            <p className="text-sm text-primary-foreground/80 mt-1">
              {weatherInfo.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-3 flex items-center justify-between">
          <Link
            href={`/hourly-forecast?lat=${city.lat}&lon=${city.lon}&city=${encodeURIComponent(city.name)}`}
            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            <Clock className="h-3.5 w-3.5" />
            Hourly Forecast
          </Link>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Remove from saved"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SavedCitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const { savedCities, loading: citiesLoading, removeCity, refetch } = useSavedCities();
  const [cityData, setCityData] = useState<CityCardData[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch weather for all saved cities
  useEffect(() => {
    if (!savedCities.length) {
      setCityData([]);
      return;
    }

    // Initialize with loading state
    setCityData(
      savedCities.map((city) => ({ city, weather: null, loading: true }))
    );

    // Fetch each city's weather
    savedCities.forEach((city, idx) => {
      getWeather(city.lat, city.lon)
        .then((weather) => {
          setCityData((prev) =>
            prev.map((item, i) =>
              i === idx ? { ...item, weather, loading: false } : item
            )
          );
        })
        .catch(() => {
          setCityData((prev) =>
            prev.map((item, i) =>
              i === idx ? { ...item, loading: false } : item
            )
          );
        });
    });
  }, [savedCities]);

  const handleRemove = async (id: string) => {
    await removeCity(id);
  };

  if (authLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Bookmark className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Your Saved Cities</h1>
          <p className="text-muted-foreground max-w-sm">
            Sign in to save your favourite cities and access their weather at a glance.
          </p>
        </div>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <LogIn className="h-5 w-5" />
          Sign In to Continue
        </button>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab="login"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Bookmark className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Cities</h1>
            <p className="text-muted-foreground">
              {savedCities.length === 0
                ? "No cities saved yet"
                : `${savedCities.length} ${savedCities.length === 1 ? "city" : "cities"} saved`}
            </p>
          </div>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {citiesLoading ? (
        <div className="h-[40vh] flex items-center justify-center">
          <Loader size={40} />
        </div>
      ) : savedCities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-lg">No saved cities yet</p>
            <p className="text-muted-foreground text-sm mt-1">
              Go to the Dashboard and click the bookmark icon on a city to save it.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cityData.map((data) => (
            <CityCard
              key={data.city.id}
              data={data}
              onRemove={() => handleRemove(data.city.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
