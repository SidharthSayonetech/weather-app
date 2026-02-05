export type WeatherCondition = 'Clear' | 'Clouds' | 'Rain' | 'Snow' | 'Thunderstorm' | 'Drizzle' | 'Mist' | 'Smoke' | 'Haze' | 'Dust' | 'Fog' | 'Sand' | 'Ash' | 'Squall' | 'Tornado';

export interface WeatherData {
    city: string;
    temp: number;
    condition: WeatherCondition;
    humidity: number;
    windSpeed: number;
    description: string;
    feelsLike: number;
    pressure: number;
    visibility: number;
    icon: string;
    timezone: number;
}

export interface ForecastDay {
    day: string;
    date: string;
    condition: WeatherCondition;
    temp: string;
    label: string;
    wind: string;
    quality: string;
    highTemp: number;
    lowTemp: number;
    icon: string;
}

export interface ApiWeatherResponse {
    coord: {
        lon: number;
        lat: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        country: string;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export interface ApiForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: Array<{
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            pressure: number;
            humidity: number;
        };
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
        clouds: {
            all: number;
        };
        wind: {
            speed: number;
            deg: number;
        };
        visibility: number;
        pop: number;
        dt_txt: string;
    }>;
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
    };
}

export interface WeatherError {
    message: string;
    code: 'INVALID_CITY' | 'API_ERROR' | 'NETWORK_ERROR' | 'NOT_FOUND';
}
