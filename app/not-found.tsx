import Link from 'next/link';
import { GlassError } from '@/components/GlassError';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#A4BDD0] flex items-center justify-center p-4">
            <div className="text-center">
                <GlassError
                    message="Oops! The page you're looking for doesn't exist."
                />
                <div className="mt-8">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-slate-700 font-bold transition-all border border-white/40 shadow-lg"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
