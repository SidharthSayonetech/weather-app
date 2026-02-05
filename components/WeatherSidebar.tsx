'use client';

import React from 'react';
import { Wind, Droplets, MapPin } from 'lucide-react';
import { UnitToggle } from './UnitToggle';
import { getWeatherColor } from '@/lib/weather-helpers';

interface WeatherSidebarProps {
    data: {
        city: string;
        temp: number;
        condition: string;
        humidity: number;
        windSpeed: number;
        timezone?: number;
    };
    unit: 'C' | 'F';
    onToggleUnit: () => void;
}

export const WeatherSidebar: React.FC<WeatherSidebarProps> = ({
    data,
    unit,
    onToggleUnit
}) => {
    const theme = getWeatherColor(data.condition);

    // Calculate city local time
    const getCityTime = () => {
        if (!data.timezone) return new Date();
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (data.timezone * 1000));
    };

    const cityDate = getCityTime();

    return (
        <div className="relative w-full md:w-[340px] h-auto md:h-full md:min-h-[560px] p-3 md:p-4 flex flex-col text-slate-700 shrink-0">
            {/* The Unified Hero Card */}
            <div className="relative z-10 flex flex-col h-full bg-white/30 backdrop-blur-[40px] rounded-[32px] md:rounded-[44px] border border-white/60 shadow-2xl p-5 md:p-7 overflow-hidden glass-border">
                {/* Frosted Noise Texture */}
                <div className="absolute inset-0 glass-noise pointer-events-none opacity-[0.08]" />
                {/* Inner Glow/Border */}
                <div className="absolute inset-x-0 top-0 h-[100%] rounded-[32px] md:rounded-[44px] border border-white/20 pointer-events-none" />

                {/* Date & City Info */}
                <div className="mb-3 md:mb-5 text-center md:text-left">
                    <div className="text-[10px] md:text-xs font-medium opacity-60 mb-1 flex items-center justify-center md:justify-start gap-2">
                        <MapPin size={12} />
                        {cityDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 mb-0.5">{data.city}</div>
                    <div className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${theme.text}`}>
                        {data.condition}
                    </div>
                </div>

                {/* Main Temperature & Toggle */}
                <div className="flex flex-col items-center md:items-start mb-3 md:mb-5 relative z-20">
                    <div className="flex items-baseline gap-1">
                        <span className="text-7xl md:text-8xl font-bold leading-none tracking-tighter text-slate-800 drop-shadow-sm">
                            {Math.round(data.temp)}
                        </span>
                        <span className="text-4xl md:text-5xl font-light text-slate-400">°</span>
                    </div>

                    <div className="mt-3 md:ml-1 scale-90 origin-left">
                        <UnitToggle unit={unit} onToggle={onToggleUnit} />
                    </div>
                </div>

                {/* Large Icon Area - Dynamic Illustration */}
                <div className="flex-none md:flex-1 flex items-center justify-center relative py-3 md:py-0 mb-3 md:mb-5 min-h-[120px] md:min-h-0 z-10">
                    <div className="absolute w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-blue-200/50 to-purple-200/50 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>

                    <div className="relative transform scale-[0.7] md:scale-90 opacity-90 transition-all duration-700">
                        {/* The Dynamic Celestial Body (Sun/Moon) */}
                        {(() => {
                            const hour = cityDate.getHours();
                            const isDay = hour >= 6 && hour < 18;
                            const isRainy = data.condition.toLowerCase().includes('rain') || data.condition.toLowerCase().includes('storm');
                            const isCloudy = data.condition.toLowerCase().includes('cloud') || isRainy;

                            // Celestial Styles
                            const celestialColor = isDay
                                ? 'from-yellow-300 to-orange-400'
                                : 'from-slate-400 to-slate-600';

                            const celestialPos = isCloudy
                                ? 'top-[-10px] right-[-10px] scale-90'
                                : 'top-0 right-[-12px] scale-100';

                            return (
                                <div
                                    className={`absolute w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${celestialColor} rounded-full shadow-lg z-0 animate-bounce transition-all duration-1000 ${celestialPos}`}
                                    style={{ animationDuration: '3s' }}
                                />
                            );
                        })()}

                        {/* Layered Glass Clouds */}
                        <div className="relative w-28 h-18 md:w-32 md:h-20 bg-white/90 backdrop-blur-md rounded-full shadow-xl z-10 flex items-center justify-center border border-white/50">
                            <div className="absolute -bottom-2 -left-2 w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-md rounded-full z-10"></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Metrics Cards */}
                <div className="mt-auto pt-3 border-t border-slate-800/5">
                    <div className="flex items-center gap-2 mb-3 opacity-40">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Stats</span>
                        <div className="h-[1px] flex-1 bg-slate-800/5"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative aspect-square bg-white/25 backdrop-blur-xl rounded-[20px] md:rounded-[24px] p-4 flex flex-col justify-start md:justify-between gap-5 md:gap-0 border border-white/50 shadow-sm hover:bg-white/40 transition-all duration-300 group overflow-hidden">
                            {/* Reflective Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

                            <div className="relative z-10 flex flex-col justify-start md:justify-between gap-5 md:gap-0 h-full">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    <Wind size={18} />
                                </div>
                                <div>
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Wind</span>
                                    <div className="text-base font-bold text-slate-700">{data.windSpeed} km/h</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-square bg-white/25 backdrop-blur-xl rounded-[20px] md:rounded-[24px] p-4 flex flex-col justify-start md:justify-between gap-5 md:gap-0 border border-white/50 shadow-sm hover:bg-white/40 transition-all duration-300 group overflow-hidden">
                            {/* Reflective Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

                            <div className="relative z-10 flex flex-col justify-start md:justify-between gap-5 md:gap-0 h-full">
                                <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                                    <Droplets size={18} />
                                </div>
                                <div>
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Humidity</span>
                                    <div className="text-base font-bold text-slate-700">{data.humidity}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
