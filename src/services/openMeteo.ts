import { City, WeatherData } from "@/types/weather";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    if (!res.ok) throw new Error("Failed to fetch cities");
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m",
      hourly: "temperature_2m,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
      timezone: "auto"
    });

    const res = await fetch(`${WEATHER_API_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch weather");

    const data = await res.json();
    
    return {
      current: {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        time: data.current.time,
        humidity: data.current.relative_humidity_2m,
        isDay: data.current.is_day,
      },
      hourly: {
        time: data.hourly.time,
        temperature2m: data.hourly.temperature_2m,
        weatherCode: data.hourly.weather_code,
      },
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        temperature2mMax: data.daily.temperature_2m_max,
        temperature2mMin: data.daily.temperature_2m_min,
        sunrise: data.daily.sunrise,
        sunset: data.daily.sunset,
        uvIndexMax: data.daily.uv_index_max,
      },
      timezone: data.timezone,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}
