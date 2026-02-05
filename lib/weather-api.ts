import type {
    WeatherData,
    ForecastDay,
    ApiWeatherResponse,
    ApiForecastResponse,
    WeatherError
} from '@/types/weather';
import {
    mapApiConditionToType,
    getWeatherLabel,
    formatForecastDate,
    getAirQuality
} from './weather-helpers';

const API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;

// Helper to determine if we are on the server
const isServer = typeof window === 'undefined';

/**
 * Fetch current weather by city name
 */
export async function getCurrentWeather(city: string): Promise<WeatherData> {
    const url = isServer
        ? `${API_URL}/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        : `/api/weather?q=${encodeURIComponent(city)}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                throw {
                    message: `City "${city}" not found`,
                    code: 'NOT_FOUND'
                } as WeatherError;
            }
            throw {
                message: 'Network error. Please try again.',
                code: 'NETWORK_ERROR'
            } as WeatherError;
        }

        return {
            city: data.name,
            temp: Math.round(data.main.temp),
            condition: mapApiConditionToType(data.weather[0].main),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6),
            description: data.weather[0].description,
            feelsLike: Math.round(data.main.feels_like),
            pressure: data.main.pressure,
            visibility: data.visibility,
            icon: data.weather[0].icon,
            timezone: data.timezone
        };
    } catch (error: any) {
        if (error.code) throw error;
        throw {
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR'
        } as WeatherError;
    }
}

/**
 * Helper to process forecast list into daily summaries
 */
function processForecastData(list: any[], timezone: number): ForecastDay[] {
    const dailyForecasts: ForecastDay[] = [];
    const processedDays = new Set<string>();

    for (const item of list) {
        // Create a date object shifted by the city's timezone
        const localDate = new Date((item.dt + timezone) * 1000);
        const dateKey = `${localDate.getUTCFullYear()}-${localDate.getUTCMonth() + 1}-${localDate.getUTCDate()}`;

        if (processedDays.has(dateKey)) continue;

        const dayForecasts = list.filter(f => {
            const fLocalDate = new Date((f.dt + timezone) * 1000);
            const fDateKey = `${fLocalDate.getUTCFullYear()}-${fLocalDate.getUTCMonth() + 1}-${fLocalDate.getUTCDate()}`;
            return fDateKey === dateKey;
        });

        const middayForecast = dayForecasts.reduce((closest, current) => {
            const currentHour = new Date((current.dt + timezone) * 1000).getUTCHours();
            const closestHour = new Date((closest.dt + timezone) * 1000).getUTCHours();
            return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
        });

        const { day, date } = formatForecastDate(new Date((middayForecast.dt + timezone) * 1000).toISOString());
        const condition = mapApiConditionToType(middayForecast.weather[0].main);

        const temps = dayForecasts.map(f => f.main.temp);
        const highTemp = Math.round(Math.max(...temps));
        const lowTemp = Math.round(Math.min(...temps));

        dailyForecasts.push({
            day,
            date,
            condition,
            temp: `${lowTemp}~${highTemp}°`,
            label: getWeatherLabel(condition),
            wind: `<${Math.round(middayForecast.wind.speed * 3.6)}km/h`,
            quality: getAirQuality(middayForecast.visibility, middayForecast.main.humidity),
            highTemp,
            lowTemp,
            icon: middayForecast.weather[0].icon
        });

        processedDays.add(dateKey);
        if (dailyForecasts.length >= 5) break;
    }

    return dailyForecasts;
}

/**
 * Fetch 5-day forecast by city name
 */
export async function getForecast(city: string): Promise<ForecastDay[]> {
    const url = isServer
        ? `${API_URL}/forecast?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        : `/api/forecast?q=${encodeURIComponent(city)}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json() as ApiForecastResponse;

        if (!response.ok) {
            if (response.status === 404) {
                throw {
                    message: `City "${city}" not found`,
                    code: 'NOT_FOUND'
                } as WeatherError;
            }
            throw {
                message: 'Network error. Please try again.',
                code: 'NETWORK_ERROR'
            } as WeatherError;
        }

        return processForecastData(data.list, data.city.timezone);
    } catch (error: any) {
        if (error.code) throw error;
        throw {
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR'
        } as WeatherError;
    }
}

/**
 * Fetch weather by coordinates
 */
export async function getWeatherByCoords(lat: number, lon: number): Promise<{ current: WeatherData; forecast: ForecastDay[] }> {
    const currentUrl = isServer
        ? `${API_URL}/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        : `/api/weather?lat=${lat}&lon=${lon}&units=metric`;

    const forecastUrl = isServer
        ? `${API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        : `/api/forecast?lat=${lat}&lon=${lon}&units=metric`;

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            throw {
                message: 'Network error. Please try again.',
                code: 'NETWORK_ERROR'
            } as WeatherError;
        }

        const currentData: ApiWeatherResponse = await currentRes.json();
        const forecastData: ApiForecastResponse = await forecastRes.json();

        const current: WeatherData = {
            city: currentData.name,
            temp: Math.round(currentData.main.temp),
            condition: mapApiConditionToType(currentData.weather[0].main),
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed * 3.6),
            description: currentData.weather[0].description,
            feelsLike: Math.round(currentData.main.feels_like),
            pressure: currentData.main.pressure,
            visibility: currentData.visibility,
            icon: currentData.weather[0].icon,
            timezone: currentData.timezone
        };

        const forecast = processForecastData(forecastData.list, forecastData.city.timezone);

        return { current, forecast };
    } catch (error: any) {
        if (error.code) throw error;
        throw {
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR'
        } as WeatherError;
    }
}
