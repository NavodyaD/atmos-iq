"use client";

import { CurrentWeather as CurrentWeatherType } from "@/types/weather";
import { getWeatherInfo } from "@/lib/constants/weatherCodes";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin } from "lucide-react";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  city: string;
}

export function CurrentWeather({ data, city }: CurrentWeatherProps) {
  const weatherInfo = getWeatherInfo(data.weatherCode);
  const WeatherIcon = weatherInfo.icon;
  const isDay = data.isDay === 1;

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="flex items-center text-2xl font-bold mb-1">
              <MapPin className="mr-2 h-6 w-6" />
              {city}
            </h2>
            <p className="text-primary-foreground/80 font-medium mb-6">
              {format(new Date(data.time), "EEEE, do MMMM yyyy | h:mm a")}
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-6xl font-black tracking-tighter">
                {Math.round(data.temperature)}&deg;
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">{weatherInfo.description}</span>
                <span className="text-primary-foreground/80 text-sm">
                  Feels like {Math.round(data.temperature)}&deg;
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 bg-white/10 rounded-full backdrop-blur-sm">
            <WeatherIcon size={120} className="drop-shadow-lg" strokeWidth={1.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
