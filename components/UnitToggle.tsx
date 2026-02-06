'use client';

import React from 'react';

interface UnitToggleProps {
    unit: 'C' | 'F';
    onToggle: () => void;
}

export const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onToggle }) => {
    return (
        <div
            onClick={onToggle}
            className="group flex items-center bg-white/40 backdrop-blur-md rounded-full p-1 cursor-pointer transition-all duration-300 hover:bg-white/60 shadow-inner w-[94px] h-[38px] relative"
            role="button"
            aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
        >
            {/* Sliding Pill Handle */}
            <div
                className="absolute top-1 bottom-1 w-[43px] bg-white rounded-full shadow-md transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
                style={{ transform: unit === 'C' ? 'translateX(0)' : 'translateX(43px)' }}
            />

            {/* Labels */}
            <div className="flex w-full justify-between items-center px-1 relative z-10 select-none">
                <span className={`w-[41px] h-[30px] flex items-center justify-center text-[12px] font-bold transition-colors duration-300 ${unit === 'C' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                    °C
                </span>
                <span className={`w-[41px] h-[30px] flex items-center justify-center text-[12px] font-bold transition-colors duration-300 ${unit === 'F' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                    °F
                </span>
            </div>
        </div>
    );
};
