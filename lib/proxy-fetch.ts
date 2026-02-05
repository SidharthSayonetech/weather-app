import { NextResponse } from 'next/server';

//in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface ProxyOptions {
    tags?: string[];
    revalidate?: number;
    baseUrl?: string;
}

export async function proxyFetch(endpoint: string, params: Record<string, string>, options: ProxyOptions = {}) {
    const apiKey = process.env.WEATHER_API_KEY;
    const baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_WEATHER_API_URL;

    if (!apiKey) {
        return { error: 'API key not configured', status: 500 };
    }

    const queryParams = new URLSearchParams({ ...params, appid: apiKey });
    const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;

    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[Proxy] Cache hit: ${url}`);
        return { data: cached.data, status: 200, fromCache: true };
    }

    try {
        console.log(`[Proxy] Fetching: ${url}`);
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.message || 'API request failed',
                status: response.status
            };
        }

        cache.set(url, { data, timestamp: Date.now() });

        return { data, status: 200 };
    } catch (error) {
        console.error('[Proxy] Error:', error);
        return {
            error: 'Failed to connect to weather service',
            status: 500
        };
    }
}

/**
 * Helper to generate standardized NextResponse from proxy results
 */
export function handleProxyResponse(result: { data?: any; error?: string; status: number }) {
    if (result.error) {
        return NextResponse.json({ message: result.error }, { status: result.status });
    }
    return NextResponse.json(result.data);
}
