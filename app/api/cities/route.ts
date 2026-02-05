import { NextRequest, NextResponse } from 'next/server';
import { proxyFetch, handleProxyResponse } from '@/lib/proxy-fetch';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
        return NextResponse.json([]);
    }

    const result = await proxyFetch('/direct', { q, limit: '5' }, {
        baseUrl: 'https://api.openweathermap.org/geo/1.0'
    });

    if (result.error) {
        return handleProxyResponse(result);
    }

    // Return a cleaner list of results
    const results = result.data.map((item: any) => ({
        name: item.name,
        state: item.state,
        country: item.country,
        lat: item.lat,
        lon: item.lon
    }));

    // Basic deduplication
    const uniqueResults = results.filter((item: any, index: number, self: any[]) =>
        index === self.findIndex((t) => (
            t.name === item.name && t.state === item.state && t.country === item.country
        ))
    );

    return NextResponse.json(uniqueResults);
}
