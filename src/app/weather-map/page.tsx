"use client";

import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";
import { Loader } from "@/components/ui/Loader";

export default function WeatherMapPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <MapIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather Map</h1>
          <p className="text-muted-foreground">
            Interactive map to explore weather patterns across different regions. Use the search bar to navigate.
          </p>
        </div>
      </div>
      
      <div className="w-full relative z-0">
      </div>
    </div>
  );
}
