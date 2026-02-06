'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';

interface CitySuggestion {
    name: string;
    state?: string;
    country: string;
    lat: number;
    lon: number;
}

interface SearchInputProps {
    onSearch: (city: string) => void;
    isLoading: boolean;
    className?: string;
    compact?: boolean;
    externalError?: string | null;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    onSearch,
    isLoading,
    className = '',
    compact = false,
    externalError
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [localError, setLocalError] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const hasError = localError || (!!externalError && !showSuggestions);

    // Debounced search for suggestions
    useEffect(() => {
        if (inputValue.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/cities?q=${encodeURIComponent(inputValue)}`);
                const data = await res.json();
                setSuggestions(data);
                setShowSuggestions(true);
                setSelectedIndex(-1);
            } catch (err) {
                console.error('Failed to fetch suggestions:', err);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const canSubmit = inputValue.length < 2 || suggestions.length > 0 || isSearching;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim() || !canSubmit) {
            setLocalError(true);
            return;
        }

        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex]);
        } else {
            setLocalError(false);
            setShowSuggestions(false);
            onSearch(inputValue.trim());
        }
    };

    const handleSelect = (city: CitySuggestion) => {
        const queryParts = [city.name, city.state, city.country].filter(Boolean);
        const formattedQuery = queryParts.join(', ');

        setInputValue(city.name);
        setShowSuggestions(false);
        setSuggestions([]);
        onSearch(formattedQuery);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) {
            if (e.key === 'Enter' && !canSubmit) {
                e.preventDefault();
                setLocalError(true);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSelect(suggestions[selectedIndex]);
            } else if (!canSubmit) {
                setLocalError(true);
            } else {
                handleSubmit(e as any);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value.trim()) setLocalError(false);
        setSelectedIndex(-1);
    };

    return (
        <div ref={containerRef} className={`w-full relative ${className}`}>
            <form onSubmit={handleSubmit} className={`relative z-20 ${hasError ? 'animate-shake' : ''}`}>
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => inputValue.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={compact ? "Search city..." : "Enter city name"}
                        className={`w-full ${compact ? 'h-10 text-sm' : 'h-14 text-lg'} pl-5 pr-12 rounded-2xl border-2 outline-none transition-all duration-300 
              backdrop-blur-md shadow-inner
              ${hasError
                                ? 'border-red-300/50 bg-red-50/50 text-red-900 placeholder:text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                : 'border-white/40 bg-white/40 focus:bg-white/60 focus:border-white/80 text-slate-800 placeholder:text-slate-500 shadow-lg shadow-blue-900/5 focus:shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] glass-border'
                            }`}
                        disabled={isLoading}
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                        {isSearching && <Loader2 className="w-4 h-4 text-blue-500 animate-spin mr-1" />}
                        <button
                            type="submit"
                            disabled={isLoading || !canSubmit}
                            className={` ${compact ? 'p-1.5' : 'p-2.5'} bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30`}
                        >
                            {isLoading ? (
                                <Loader2 className={`${compact ? 'w-3 h-3' : 'w-5 h-5'} animate-spin`} />
                            ) : (
                                <Search className={`${compact ? 'w-3 h-3' : 'w-5 h-5'}`} />
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Error Message Tooltip */}
            {externalError && !showSuggestions && !isSearching && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-red-50/80 backdrop-blur-md border border-red-200/50 rounded-xl p-3 px-5 shadow-lg shadow-red-500/5 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-xs font-semibold text-red-600 tracking-tight">
                            {externalError}
                        </span>
                    </div>
                </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && (inputValue.length >= 2) && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[10000] bg-white border border-slate-200 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="relative z-10">
                        {suggestions.length > 0 ? (
                            <div className="p-2">
                                {suggestions.map((city, index) => (
                                    <button
                                        key={`${city.lat}-${city.lon}`}
                                        onClick={() => handleSelect(city)}
                                        className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200 rounded-2xl mb-1 last:mb-0
                                        ${index === selectedIndex
                                                ? 'bg-blue-500/80 text-white shadow-lg shadow-blue-500/30 -translate-y-0.5'
                                                : 'hover:bg-white/40 text-slate-700 hover:shadow-sm border border-transparent hover:border-white/20'}
                                    `}
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${index === selectedIndex ? 'bg-white/20' : 'bg-blue-50'}`}>
                                            <MapPin size={18} className={index === selectedIndex ? 'text-white' : 'text-blue-500'} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[15px] tracking-tight">
                                                {city.name}
                                            </span>
                                            <span className={`text-[11px] font-medium uppercase tracking-wider opacity-60 ${index === selectedIndex ? 'text-blue-50' : 'text-slate-500'}`}>
                                                {[city.state, city.country].filter(Boolean).join(' • ')}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            !isSearching && (
                                <div className="p-8 text-center bg-red-50/30">
                                    <p className="text-slate-500 font-medium mb-1">No cities found</p>
                                    <p className="text-[11px] text-slate-400">Try checking the spelling or try a different name</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
};
