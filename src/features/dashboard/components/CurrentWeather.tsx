"use client";

import { CurrentWeather as CurrentWeatherType } from "@/types/weather";
import { getWeatherInfo } from "@/lib/constants/weatherCodes";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedCities } from "@/hooks/useSavedCities";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  city: string;
}

export function CurrentWeather({ data, city }: CurrentWeatherProps) {
  const weatherInfo = getWeatherInfo(data.weatherCode);
  const WeatherIcon = weatherInfo.icon;

  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toggleSave, checkIsSaved } = useSavedCities();

  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : 51.5085;
  const lon = searchParams.get("lon") ? parseFloat(searchParams.get("lon")!) : -0.1257;

  // Check if this city is already saved when user/city changes
  useEffect(() => {
    if (!user) {
      setIsSaved(false);
      setSavedDocId(null);
      return;
    }
    checkIsSaved(lat, lon).then((docId) => {
      setIsSaved(!!docId);
      setSavedDocId(docId);
    });
  }, [user, lat, lon, checkIsSaved]);

  const handleSave = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSaving(true);
    try {
      const nowSaved = await toggleSave({ name: city, lat, lon });
      setIsSaved(nowSaved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="flex items-center text-2xl font-bold">
                  <MapPin className="mr-2 h-6 w-6" />
                  {city}
                </h2>
                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  title={isSaved ? "Remove from saved cities" : "Save this city"}
                  className="ml-1 rounded-full p-1.5 bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isSaved ? (
                    <BookmarkCheck className="h-4 w-4 fill-white" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>

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

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="login"
      />
    </>
  );
}
