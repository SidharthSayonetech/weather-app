import { NextRequest } from 'next/server';
import { proxyFetch, handleProxyResponse } from '@/lib/proxy-fetch';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('q');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const units = searchParams.get('units') || 'metric';

    const params: Record<string, string> = { units };
    if (city) {
        params.q = city;
    } else if (lat && lon) {
        params.lat = lat;
        params.lon = lon;
    } else {
        return handleProxyResponse({ error: 'City or coordinates required', status: 400 });
    }

    const result = await proxyFetch('/weather', params);
    return handleProxyResponse(result);
}
