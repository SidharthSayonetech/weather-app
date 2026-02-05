'use client';

import React from 'react';

export const GlassSkeleton = () => {
    return (
        <div className="w-full flex flex-col md:flex-row animate-pulse">

            {/* Left Sidebar Skeleton */}
            <div className="w-full md:w-[380px] p-5 md:p-8 flex flex-col text-slate-700 shrink-0">
                <div className="h-full">
                    {/* Date & City Info */}
                    <div className="mb-6 md:mb-8">
                        <div className="w-full h-4 bg-slate-300/50 rounded mb-2"></div>
                        <div className="w-3/4 h-10 bg-slate-300/50 rounded mb-1"></div>
                        <div className="w-1/2 h-4 bg-slate-300/50 rounded"></div>
                    </div>

                    {/* Temperature */}
                    <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <div className="w-32 h-24 bg-slate-300/50 rounded"></div>
                        <div className="w-16 h-10 bg-slate-300/50 rounded-full"></div>
                    </div>

                    {/* Large Icon */}
                    <div className="flex items-center justify-center py-6 mb-8">
                        <div className="w-40 h-20 bg-slate-300/50 rounded-full"></div>
                    </div>

                    {/* Bottom Cards */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="aspect-square bg-white/40 backdrop-blur-md rounded-[24px] md:rounded-[30px] p-5"></div>
                        <div className="aspect-square bg-white/40 backdrop-blur-md rounded-[24px] md:rounded-[30px] p-5"></div>
                    </div>
                </div>
            </div>

            {/* Right Content Skeleton */}
            <div className="flex-1 p-4 md:p-8 md:pl-0">
                {/* Search Bar */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 h-10 bg-white/40 rounded-2xl"></div>
                    <div className="w-40 h-10 bg-slate-300/50 rounded-2xl"></div>
                </div>

                {/* Heading */}
                <div className="mb-6">
                    <div className="w-48 h-8 bg-slate-300/50 rounded"></div>
                </div>

                {/* Forecast Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-[24px] md:rounded-[32px] min-h-[220px] md:min-h-[280px]">
                            <div className="w-16 h-6 bg-slate-300/50 rounded mb-1 mx-auto"></div>
                            <div className="w-20 h-4 bg-slate-300/50 rounded mb-4 mx-auto"></div>
                            <div className="w-10 h-10 bg-slate-300/50 rounded-full mb-4 mx-auto"></div>
                            <div className="w-24 h-6 bg-slate-300/50 rounded mb-2 mx-auto"></div>
                            <div className="w-16 h-4 bg-slate-300/50 rounded mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
