'use client';

import { useState } from 'react';

interface GeolocationState {
    loading: boolean;
    error: string | null;
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        loading: false,
        error: null
    });

    const getLocation = (): Promise<{ lat: number; lon: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const error = 'Geolocation is not supported by your browser';
                setState({ loading: false, error });
                reject(new Error(error));
                return;
            }

            setState({ loading: true, error: null });

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setState({ loading: false, error: null });
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    let errorMessage = 'Unable to get your location';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied. Please enable location access in your browser settings and try again.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable. Please check your device settings.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out. Please try again.';
                            break;
                        default:
                            errorMessage = 'An error occurred while getting your location. Please try again.';
                    }

                    setState({ loading: false, error: errorMessage });
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    };

    return {
        ...state,
        getLocation
    };
}
