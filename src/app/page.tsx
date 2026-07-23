"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getWeather } from "@/services/openMeteo";
import { WeatherData } from "@/types/weather";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { CurrentWeather } from "@/features/dashboard/components/CurrentWeather";
import { WeatherHighlights } from "@/features/dashboard/components/WeatherHighlights";
import { HourlyForecast } from "@/features/dashboard/components/HourlyForecast";
import { TemperatureChart } from "@/features/dashboard/components/TemperatureChart";

function DashboardContent() {
  const searchParams = useSearchParams();
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [city, setCity] = useState("London");

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      const latParam = searchParams.get("lat");
      const lonParam = searchParams.get("lon");
      const cityParam = searchParams.get("city");
      
      const lat = latParam ? parseFloat(latParam) : 51.5085; // Default London
      const lon = lonParam ? parseFloat(lonParam) : -0.1257;
      if (cityParam) setCity(cityParam);

      const data = await getWeather(lat, lon);
      if (data) {
        setWeather(data);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Listen for custom event from CitySearch
    const handleCityChange = () => fetchWeather();
    window.addEventListener("citychange", handleCityChange);
    
    return () => window.removeEventListener("citychange", handleCityChange);
  }, [searchParams]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size={48} /></div>;
  if (error || !weather) return <div className="h-[60vh] flex items-center justify-center"><ErrorState /></div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CurrentWeather data={weather.current} city={city} />
        </div>
        <div className="lg:col-span-2">
          <WeatherHighlights current={weather.current} daily={weather.daily} />
        </div>
      </div>
      
      <HourlyForecast data={weather.hourly} />
      
      <div className="grid gap-6">
        <TemperatureChart data={weather.daily} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><Loader size={48} /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
