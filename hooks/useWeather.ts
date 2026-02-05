'use client';

import { useState, useCallback } from 'react';
import type { WeatherData, ForecastDay, WeatherError } from '@/types/weather';
import { getCurrentWeather, getForecast, getWeatherByCoords } from '@/lib/weather-api';
import { convertTemperature, convertTemperatureString } from '@/lib/temperature-converter';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export function useWeather(initialWeather?: WeatherData, initialForecast?: ForecastDay[], initialError?: WeatherError) {
    const [status, setStatus] = useState<LoadingState>(
        initialError ? 'error' : (initialWeather ? 'success' : 'loading')
    );
    const [weatherData, setWeatherData] = useState<WeatherData | null>(initialWeather || null);
    const [forecastData, setForecastData] = useState<ForecastDay[]>(initialForecast || []);
    const [error, setError] = useState<WeatherError | null>(initialError || null);
    const [unit, setUnit] = useState<'C' | 'F'>('C');
    const [lastSearch, setLastSearch] = useState<{ type: 'city'; city: string } | { type: 'coords'; lat: number; lon: number } | null>(
        initialWeather ? { type: 'city', city: initialWeather.city } : (initialError ? { type: 'city', city: 'New York' } : null)
    );

    const searchWeather = useCallback(async (city: string) => {
        if (!city.trim()) {
            setError({
                message: 'Please enter a city name',
                code: 'INVALID_CITY'
            });
            return;
        }

        setStatus('loading');
        setError(null);
        setLastSearch({ type: 'city', city });

        try {
            const [current, forecast] = await Promise.all([
                getCurrentWeather(city),
                getForecast(city)
            ]);

            setWeatherData(current);
            setForecastData(forecast);
            setStatus('success');
        } catch (err: any) {
            setError(err as WeatherError);
            setStatus('error');
        }
    }, []);

    const searchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
        setStatus('loading');
        setError(null);
        setLastSearch({ type: 'coords', lat, lon });

        try {
            const { current, forecast } = await getWeatherByCoords(lat, lon);
            setWeatherData(current);
            setForecastData(forecast);
            setStatus('success');
        } catch (err: any) {
            setError(err as WeatherError);
            setStatus('error');
        }
    }, []);

    const toggleUnit = useCallback(() => {
        setUnit(prev => prev === 'C' ? 'F' : 'C');
    }, []);

    const retry = useCallback(() => {
        if (lastSearch) {
            if (lastSearch.type === 'city') {
                searchWeather(lastSearch.city);
            } else {
                searchWeatherByCoords(lastSearch.lat, lastSearch.lon);
            }
        } else {
            setStatus('idle');
            setError(null);
        }
    }, [lastSearch, searchWeather, searchWeatherByCoords]);

    const getDisplayTemp = useCallback((celsius: number) => {
        return unit === 'C' ? celsius : Math.round(convertTemperature(celsius, 'F', 'C'));
    }, [unit]);

    const displayForecast = forecastData.map(day => ({
        ...day,
        temp: unit === 'F' ? convertTemperatureString(day.temp, 'F') : day.temp
    }));

    const displayWeather = weatherData ? {
        ...weatherData,
        temp: getDisplayTemp(weatherData.temp),
        feelsLike: getDisplayTemp(weatherData.feelsLike)
    } : null;

    return {
        status,
        weatherData: displayWeather,
        forecastData: displayForecast,
        error,
        unit,
        searchWeather,
        searchWeatherByCoords,
        toggleUnit,
        retry
    };
}
