'use client';

import React from 'react';
import { CloudLightning, CloudRain, Sun, CloudSun, Cloud, Snowflake, Wind } from 'lucide-react';
import { getWeatherColor } from '@/lib/weather-helpers';

interface ForecastDay {
    day: string;
    date: string;
    condition: string;
    temp: string;
    label: string;
    wind: string;
    quality: string;
}

interface WeeklyForecastProps {
    data: ForecastDay[];
    onSelect: (index: number) => void;
    selectedIndex: number | null;
}

const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain')) return CloudRain;
    if (c.includes('snow')) return Snowflake;
    if (c.includes('clear') || c.includes('sun')) return Sun;
    if (c.includes('cloud')) return CloudSun;
    if (c.includes('thunder') || c.includes('storm')) return CloudLightning;
    if (c.includes('wind')) return Wind;
    return Cloud;
};

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ data, onSelect, selectedIndex }) => {
    return (
        <div className="w-full h-full flex flex-col justify-center overflow-visible">
            {/* Vertical Cards Grid */}
            <div className="flex-1 flex overflow-x-auto md:overflow-visible md:grid md:grid-cols-5 gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide items-center py-10 px-4 md:p-1">
                {data.map((day, index) => {
                    const Icon = getIcon(day.condition);
                    const theme = getWeatherColor(day.label);
                    const isSelected = selectedIndex === index;

                    return (
                        <div
                            key={index}
                            onClick={() => onSelect(index)}
                            className={`relative snap-center shrink-0 w-[140px] md:w-auto flex flex-col items-center justify-between text-center backdrop-blur-[32px] p-6 rounded-[32px] md:rounded-[40px] shadow-xl transition-all duration-500 min-h-[240px] md:min-h-[300px] border group overflow-hidden glass-border cursor-pointer
                                ${isSelected
                                    ? 'bg-white/50 border-blue-400/50 shadow-[0_20px_40px_rgba(59,130,246,0.2)] scale-[1.05] z-10'
                                    : 'bg-white/30 border-white/60 hover:bg-white/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]'
                                }`}
                        >
                            {/* Frosted Noise Texture */}
                            <div className="absolute inset-0 glass-noise pointer-events-none opacity-[0.06]" />
                            {/* Inner Glow/Border */}
                            <div className="absolute inset-x-0 top-0 h-[100%] rounded-[32px] md:rounded-[40px] border border-white/20 pointer-events-none" />
                            {/* Reflective Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center justify-center gap-6 h-full w-full">

                                {/* Day & Date Headers */}
                                <div className="flex flex-col items-center gap-1">
                                    <h3 className="font-bold text-slate-700 text-lg md:text-xl">{day.day}</h3>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{day.date}</span>
                                </div>

                                {/* Icon Area */}
                                <div className="my-2 transition-transform duration-300 group-hover:scale-110">
                                    <Icon
                                        size={40}
                                        className={`md:w-12 md:h-12 drop-shadow-sm ${theme.text}`}
                                        strokeWidth={1.5}
                                    />
                                </div>

                                {/* Temperature Range & Label */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-xl md:text-2xl font-bold text-slate-700 tracking-tight">
                                        {day.temp}
                                    </div>
                                    <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-60">
                                        {day.label}
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
