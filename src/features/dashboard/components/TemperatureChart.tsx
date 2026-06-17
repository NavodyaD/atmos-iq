"use client";

import { DailyForecast } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TemperatureChartProps {
  data: DailyForecast;
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = data.time.map((t, idx) => ({
    name: format(new Date(t), "EEE"),
    max: data.temperature2mMax[idx],
    min: data.temperature2mMin[idx],
  }));

  const textColor = mounted && theme === "dark" ? "#94a3b8" : "#64748b";
  const gridColor = mounted && theme === "dark" ? "#1e293b" : "#e2e8f0";

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-muted">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <CalendarDays className="mr-2 h-5 w-5 text-primary" />
          7-Day Temperature Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                stroke={textColor} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke={textColor} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: mounted && theme === "dark" ? "#0f172a" : "#ffffff",
                  borderColor: mounted && theme === "dark" ? "#1e293b" : "#e2e8f0",
                  borderRadius: "8px",
                  color: mounted && theme === "dark" ? "#f8fafc" : "#020617"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="max" 
                name="Max Temp" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="min" 
                name="Min Temp" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
