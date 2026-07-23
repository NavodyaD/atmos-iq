export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Province
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  time: string;
  humidity?: number;
  isDay?: number;
}

export interface HourlyForecast {
  time: string[];
  temperature2m: number[];
  weatherCode: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  timezone: string;
}
