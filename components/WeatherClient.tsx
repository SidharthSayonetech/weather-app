'use client';

import React, { useState, useEffect } from 'react';
import { WeatherSidebar } from '@/components/WeatherSidebar';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { SearchInput } from '@/components/SearchInput';
import { GlassSkeleton } from '@/components/GlassSkeleton';
import { LocateFixed } from 'lucide-react';
import { GlassError } from '@/components/GlassError';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { WeatherData, ForecastDay, WeatherError } from '@/types/weather';

interface WeatherClientProps {
    initialWeather: WeatherData | null;
    initialForecast: ForecastDay[];
    initialError?: WeatherError | null;
}

export default function WeatherClient({ initialWeather, initialForecast, initialError }: WeatherClientProps) {
    const {
        status,
        weatherData,
        forecastData,
        error,
        unit,
        searchWeather,
        searchWeatherByCoords,
        toggleUnit,
        retry,
        reset
    } = useWeather(initialWeather || undefined, initialForecast, initialError || undefined);

    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0);
    const { loading: geoLoading, getLocation } = useGeolocation();

    const currentWeatherData = weatherData || initialWeather;
    const currentForecastData = forecastData.length > 0 ? forecastData : initialForecast;

    useEffect(() => {
        setSelectedDayIndex(0);
    }, [currentWeatherData?.city]);

    const isLoading = status === 'loading';

    const handleDetectLocation = async () => {
        try {
            const { lat, lon } = await getLocation();
            await searchWeatherByCoords(lat, lon);
        } catch (err: any) {
            // Silently fail - user can use search instead
            console.error('Geolocation error:', err.message);
        }
    };

    return (
        <div
            className="min-h-screen font-sans relative overflow-hidden text-slate-700"
            style={{ background: 'linear-gradient(135deg, #DCEAF4 0%, #BFD5E5 100%)' }}
        >
            {/* Full Page Glass Overlay with Noise */}
            <div className="relative z-10 w-full min-h-screen bg-white/10 backdrop-blur-[32px] flex justify-center overflow-y-auto">
                <div className="absolute inset-0 glass-noise pointer-events-none opacity-[0.03]" />
                <div className="w-full max-w-[1300px] flex flex-col items-center justify-center min-h-screen py-4 md:py-10 px-4 md:px-0">

                    {(status === 'loading' || geoLoading) ? (
                        <GlassSkeleton />
                    ) : status === 'error' ? (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                            <GlassError
                                message={error?.message || 'Failed to fetch weather data'}
                                onRetry={retry}
                            />
                            <button
                                onClick={reset}
                                className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors flex items-center gap-2 px-6 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-sm hover:shadow-md active:scale-95"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">

                            {currentWeatherData && (
                                <>
                                    {/* Left Sidebar Panel */}
                                    {(() => {
                                        // Dynamic data mapping for the Hero Card
                                        const displayData = selectedDayIndex === 0 || selectedDayIndex === null
                                            ? currentWeatherData
                                            : currentForecastData[selectedDayIndex]
                                                ? {
                                                    city: currentWeatherData?.city || '',
                                                    temp: parseInt(currentForecastData[selectedDayIndex].temp.split('~')[1]), // Use High temp for display
                                                    condition: currentForecastData[selectedDayIndex].label,
                                                    humidity: currentWeatherData?.humidity || 0,
                                                    windSpeed: parseInt(currentForecastData[selectedDayIndex].wind) || 0,
                                                    timezone: currentWeatherData?.timezone
                                                }
                                                : currentWeatherData;

                                        return displayData ? (
                                            <WeatherSidebar
                                                data={displayData}
                                                unit={unit}
                                                onToggleUnit={toggleUnit}
                                            />
                                        ) : null;
                                    })()}

                                    {/* Right Content Panel */}
                                    <div className="flex-1 flex flex-col p-4 md:p-6 md:pl-0 justify-center gap-6 md:gap-14">

                                        {/* Header: Search & Detect Location */}
                                        <div className="flex flex-col md:flex-row gap-4 shrink-0 relative z-50">
                                            <div className="flex-1">
                                                <SearchInput
                                                    onSearch={searchWeather}
                                                    isLoading={isLoading}
                                                    externalError={error?.message}
                                                    compact
                                                    className="relative z-[100]"
                                                />
                                            </div>
                                            <button
                                                onClick={handleDetectLocation}
                                                disabled={geoLoading || isLoading}
                                                className="h-10 px-6 bg-white/40 backdrop-blur-md border border-white/60 hover:border-blue-300/50 hover:bg-white/60 text-slate-600 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                                            >
                                                <LocateFixed size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                                <span className="text-sm">{geoLoading ? 'Detecting...' : 'Detect Location'}</span>
                                            </button>
                                        </div>

                                        {/* Content Area: Forecast section */}
                                        <div className="flex flex-col gap-4 overflow-visible">
                                            {/* Forecast Section Heading */}
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                                    Weather Forecast
                                                </h2>
                                                <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-300 to-transparent rounded-full"></div>
                                            </div>

                                            {/* Forecast Card */}
                                            <WeeklyForecast
                                                data={currentForecastData}
                                                onSelect={(index) => setSelectedDayIndex(index)}
                                                selectedIndex={selectedDayIndex}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
