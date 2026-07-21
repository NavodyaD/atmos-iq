"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

// Fix for default marker icons in Leaflet with webpack/nextjs
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Component to dynamically update map center when coordinates change
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function WeatherMap() {
  const searchParams = useSearchParams();
  const [position, setPosition] = useState<[number, number]>([51.5085, -0.1257]); // Default London
  const [cityName, setCityName] = useState("London");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updatePosition = () => {
      const lat = searchParams.get("lat");
      const lon = searchParams.get("lon");
      const city = searchParams.get("city");
      
      if (lat && lon) {
        setPosition([parseFloat(lat), parseFloat(lon)]);
      }
      if (city) {
        setCityName(city);
      }
    };

    updatePosition();
    
    // Listen for custom event from CitySearch
    window.addEventListener("citychange", updatePosition);
    return () => window.removeEventListener("citychange", updatePosition);
  }, [searchParams]);

  if (!mounted) {
    return (
      <Card className="h-[600px] w-full flex items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg h-[600px] w-full z-0 relative rounded-xl">
      <MapContainer 
        center={position} 
        zoom={10} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Precipitation map overlay from OpenWeatherMap (free tier allows some basic layers, but needs API key)
            Since we don't have an OpenWeatherMap API key, we will just show the map and a marker.
            In a real app, you'd add: url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`} 
        */}
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="font-semibold">{cityName}</div>
            <div className="text-sm text-muted-foreground">Lat: {position[0]}, Lon: {position[1]}</div>
          </Popup>
        </Marker>
        <MapUpdater center={position} />
      </MapContainer>
    </Card>
  );
}
