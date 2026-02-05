import type { WeatherCondition } from '@/types/weather';

/**
 * Map OpenWeatherMap condition codes to our app's condition types
 */
export function mapApiConditionToType(apiCondition: string): WeatherCondition {
    const condition = apiCondition.toLowerCase();

    if (condition.includes('clear')) return 'Clear';
    if (condition.includes('cloud')) return 'Clouds';
    if (condition.includes('rain')) return 'Rain';
    if (condition.includes('drizzle')) return 'Drizzle';
    if (condition.includes('thunder') || condition.includes('storm')) return 'Thunderstorm';
    if (condition.includes('snow')) return 'Snow';
    if (condition.includes('mist')) return 'Mist';
    if (condition.includes('smoke')) return 'Smoke';
    if (condition.includes('haze')) return 'Haze';
    if (condition.includes('dust')) return 'Dust';
    if (condition.includes('fog')) return 'Fog';
    if (condition.includes('sand')) return 'Sand';
    if (condition.includes('ash')) return 'Ash';
    if (condition.includes('squall')) return 'Squall';
    if (condition.includes('tornado')) return 'Tornado';

    return 'Clouds';
}

/**
 * Get label for weather condition
 */
export function getWeatherLabel(condition: WeatherCondition): string {
    const labelMap: Record<WeatherCondition, string> = {
        'Clear': 'SUNNY',
        'Clouds': 'CLOUDY',
        'Rain': 'RAIN',
        'Snow': 'SNOW',
        'Thunderstorm': 'STORM',
        'Drizzle': 'DRIZZLE',
        'Mist': 'MISTY',
        'Smoke': 'SMOKY',
        'Haze': 'HAZY',
        'Dust': 'DUSTY',
        'Fog': 'FOGGY',
        'Sand': 'SANDY',
        'Ash': 'ASH',
        'Squall': 'SQUALL',
        'Tornado': 'TORNADO'
    };

    return labelMap[condition] || condition.toUpperCase();
}

/**
 * Format date for forecast display
 */
export function formatForecastDate(dateString: string): { day: string; date: string } {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    return { day, date: formattedDate.replace(',', '').toUpperCase() };
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get air quality estimation based on visibility and humidity
 */
export function getAirQuality(visibility: number, humidity: number): string {
    if (visibility > 9000 && humidity < 70) return 'Excellent';
    if (visibility > 6000 && humidity < 80) return 'Good';
    if (visibility > 3000) return 'Moderate';
    return 'Poor';
}
/**
 * Get color classes for a weather condition
 */
export function getWeatherColor(condition: string | WeatherCondition): { text: string; shadow: string } {
    const c = condition.toLowerCase();

    if (c.includes('clear') || c.includes('sun')) {
        return { text: 'text-amber-500', shadow: 'shadow-amber-400/50' };
    }
    if (c.includes('rain') || c.includes('drizzle')) {
        return { text: 'text-cyan-500', shadow: 'shadow-cyan-400/50' };
    }
    if (c.includes('thunder') || c.includes('storm') || c.includes('tornado')) {
        return { text: 'text-indigo-600', shadow: 'shadow-indigo-500/50' };
    }
    if (c.includes('snow')) {
        return { text: 'text-sky-400', shadow: 'shadow-sky-300/50' };
    }
    if (c.includes('cloud') || c.includes('mist') || c.includes('fog') || c.includes('haze')) {
        return { text: 'text-slate-500', shadow: 'shadow-slate-400/50' };
    }

    return { text: 'text-blue-500', shadow: 'shadow-blue-400/50' }; // Default
}
