"use client";

import { HourlyForecast as HourlyForecastType } from "@/types/weather";
import { getWeatherInfo } from "@/lib/constants/weatherCodes";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Clock } from "lucide-react";

interface HourlyForecastProps {
  data: HourlyForecastType;
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  // Get next 24 hours
  const now = new Date();
  const currentIndex = data.time.findIndex((t) => new Date(t) > now) || 0;
  const next24Hours = data.time.slice(currentIndex, currentIndex + 24).map((time, idx) => ({
    time,
    temp: data.temperature2m[currentIndex + idx],
    code: data.weatherCode[currentIndex + idx],
  }));

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-muted">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Today's Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {next24Hours.map((hour, idx) => {
            const WeatherIcon = getWeatherInfo(hour.code).icon;
            return (
              <div
                key={idx}
                className="flex min-w-[80px] flex-col items-center justify-between rounded-xl border bg-background/50 p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="text-xs font-medium text-muted-foreground mb-3">
                  {format(new Date(hour.time), "ha")}
                </span>
                <WeatherIcon className="h-8 w-8 text-primary mb-3" />
                <span className="text-lg font-bold">{Math.round(hour.temp)}&deg;</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
