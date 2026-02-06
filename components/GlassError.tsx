'use client';

import React from 'react';
import { CloudOff, RefreshCw } from 'lucide-react';

interface GlassErrorProps {
    message: string;
    onRetry?: () => void;
}

export const GlassError: React.FC<GlassErrorProps> = ({ message, onRetry }) => {
    return (
        <div className="w-full flex items-center justify-center p-8">
            <div className="relative w-full max-w-md p-10 rounded-[40px] bg-white/60 backdrop-blur-2xl border border-red-200/50 shadow-xl shadow-red-100/20 flex flex-col items-center text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-400">
                    <CloudOff size={40} />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h3>
                <p className="text-slate-600 mb-8">{message}</p>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#6B8EFF] to-[#4F46E5] hover:from-[#5A7DE0] hover:to-[#4338CA] text-white rounded-2xl transition-all font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};
