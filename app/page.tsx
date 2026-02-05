import { Metadata } from 'next';
import WeatherClient from '@/components/WeatherClient';
import { getCurrentWeather, getForecast } from '@/lib/weather-api';
import type { WeatherData, ForecastDay, WeatherError } from '@/types/weather';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const weather = await getCurrentWeather('New York');
    return {
      title: `Weather in ${weather.city} - ${weather.temp}°C | Premium Weather App`,
      description: `Current weather in ${weather.city}: ${weather.description}. High humidity, wind speed ${weather.windSpeed} km/h. Plan your day with our premium glassmorphic weather app.`,
      openGraph: {
        title: `Weather in ${weather.city} - ${weather.temp}°C`,
        description: `Check the latest weather update for ${weather.city}.`,
        images: ['/og-image.jpg'], 
      }
    };
  } catch {
    return {
      title: 'Weather App - Premium Glassmorphic Design',
      description: 'Check real-time weather and 5-day forecasts for any city with a beautiful glassmorphic interface.'
    };
  }
}

export default async function Home() {
  // SSR: Fetch initial data for New York on the server
  let initialWeather: WeatherData | null = null;
  let initialForecast: ForecastDay[] = [];
  let initialError: WeatherError | null = null;

  try {
    const [weather, forecast] = await Promise.all([
      getCurrentWeather('New York'),
      getForecast('New York')
    ]);
    initialWeather = weather;
    initialForecast = forecast;
  } catch (error: any) {
    console.error('Initial SSR fetch failed:', error);
    initialError = error as WeatherError;
  }

  return (
    <WeatherClient
      initialWeather={initialWeather}
      initialForecast={initialForecast}
      initialError={initialError}
    />
  );
}
