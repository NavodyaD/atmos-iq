"use client";

import { CurrentWeather, DailyForecast } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Wind, Droplets, Sun, Sunset, Eye, SunDim } from "lucide-react";
import { format } from "date-fns";

interface WeatherHighlightsProps {
  current: CurrentWeather;
  daily: DailyForecast;
}

export function WeatherHighlights({ current, daily }: WeatherHighlightsProps) {
  const highlights = [
    {
      title: "Wind Status",
      value: `${current.windSpeed} km/h`,
      description: `Direction: ${current.windDirection}°`,
      icon: Wind,
    },
    {
      title: "Humidity",
      value: `${current.humidity}%`,
      description: "Normal level",
      icon: Droplets,
    },
    {
      title: "Visibility",
      value: "10 km", // Open-Meteo doesn't provide direct visibility in the basic payload, using mock
      description: "Average visibility",
      icon: Eye,
    },
    {
      title: "UV Index",
      value: daily.uvIndexMax[0]?.toString() || "0",
      description: "Max UV today",
      icon: SunDim,
    },
    {
      title: "Sunrise",
      value: daily.sunrise[0] ? format(new Date(daily.sunrise[0]), "h:mm a") : "--:--",
      description: "Morning",
      icon: Sun,
    },
    {
      title: "Sunset",
      value: daily.sunset[0] ? format(new Date(daily.sunset[0]), "h:mm a") : "--:--",
      description: "Evening",
      icon: Sunset,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {highlights.map((item, index) => (
        <Card key={index} className="bg-card/50 backdrop-blur-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
