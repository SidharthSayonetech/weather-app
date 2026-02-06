'use client';

import { useEffect } from 'react';
import { GlassError } from '@/components/GlassError';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('SSR Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#A4BDD0] flex items-center justify-center p-4">
            <GlassError
                message="Something went wrong while loading the weather. Please try again."
                onRetry={reset}
            />
        </div>
    );
}
