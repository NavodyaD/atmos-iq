"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getWeather } from "@/services/openMeteo";
import { WeatherData } from "@/types/weather";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { format } from "date-fns";
import { getWeatherInfo } from "@/lib/constants/weatherCodes";

function HourlyForecastContent() {
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
      
      const lat = latParam ? parseFloat(latParam) : 51.5085;
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
    
    const handleCityChange = () => fetchWeather();
    window.addEventListener("citychange", handleCityChange);
    
    return () => window.removeEventListener("citychange", handleCityChange);
  }, [searchParams]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size={48} /></div>;
  if (error || !weather) return <div className="h-[60vh] flex items-center justify-center"><ErrorState /></div>;

  // Get next 48 hours
  const now = new Date();
  const currentIndex = weather.hourly.time.findIndex((t) => new Date(t) > now) || 0;
  const next48Hours = weather.hourly.time.slice(currentIndex, currentIndex + 48).map((time, idx) => ({
    time,
    temp: weather.hourly.temperature2m[currentIndex + idx],
    code: weather.hourly.weatherCode[currentIndex + idx],
  }));

  // Group by day
  const groupedByDay = next48Hours.reduce((acc, curr) => {
    const day = format(new Date(curr.time), "EEEE, MMMM do");
    if (!acc[day]) acc[day] = [];
    acc[day].push(curr);
    return acc;
  }, {} as Record<string, typeof next48Hours>);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hourly Forecast</h1>
          <p className="text-muted-foreground">
            Detailed 48-hour forecast for {city}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-8">
        {Object.entries(groupedByDay).map(([day, hours]) => (
          <Card key={day} className="bg-card/50 backdrop-blur-sm border-muted overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg font-semibold text-primary">{day}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {hours.map((hour, idx) => {
                  const weatherInfo = getWeatherInfo(hour.code);
                  const WeatherIcon = weatherInfo.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-6 w-1/3">
                        <span className="text-sm font-semibold w-20">{format(new Date(hour.time), "h:mm a")}</span>
                        <WeatherIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="w-1/3 flex justify-center">
                        <span className="text-sm font-medium text-muted-foreground">{weatherInfo.description}</span>
                      </div>
                      <div className="w-1/3 flex justify-end">
                        <span className="text-lg font-bold">{Math.round(hour.temp)}&deg;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function HourlyForecastPage() {
  return (
    <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><Loader size={48} /></div>}>
      <HourlyForecastContent />
    </Suspense>
  );
}
