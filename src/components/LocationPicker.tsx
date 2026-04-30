'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { locations, type Location } from '@/data/locations';
import { useToast } from '@/contexts/ToastContext';

export default function LocationPicker() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    // Get current selected location from URL or default
    const currentLat = searchParams.get('lat');
    const currentLocationName = searchParams.get('loc') || 'București';

    const handleLocationSelect = (loc: Location) => {
        const params = new URLSearchParams(searchParams);
        params.set('lat', loc.lat.toString());
        params.set('lng', loc.lng.toString());
        params.set('loc', loc.name);

        router.push(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    const handleUseMyLocation = () => {
        setLoading(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const params = new URLSearchParams(searchParams);
                    params.set('lat', latitude.toString());
                    params.set('lng', longitude.toString());
                    params.set('loc', 'Locația Mea');

                    router.push(`${pathname}?${params.toString()}`);
                    setLoading(false);
                    setIsOpen(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    showToast('Nu am putut detecta locația. Te rugăm să alegi din listă.', 'error');
                    setLoading(false);
                }
            );
        } else {
            showToast('Geolocația nu este suportată de browser-ul tău.', 'warning');
            setLoading(false);
        }
    };

    return (
        <div className="relative z-40 w-full sm:w-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="interactive-lift flex w-full sm:w-auto items-center gap-2 px-4 py-2.5 bg-[#151b25]/86 backdrop-blur border border-white/10 rounded-2xl hover:bg-[#1f2937]/88 transition-colors text-white min-w-[180px] justify-between taste-surface"
            >
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-moon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate max-w-[120px]">{currentLocationName}</span>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[60]"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 w-64 max-h-96 overflow-y-auto bg-night-950 border border-night-700/50 rounded-xl shadow-2xl shadow-black/80 z-[70] scrollbar-thin backdrop-blur-xl">
                    <div className="p-2 border-b border-white/10 sticky top-0 bg-[#151b25] z-30">
                        <button
                            onClick={handleUseMyLocation}
                            disabled={loading}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-300/10 text-amber-100 hover:bg-amber-300/15 transition-colors text-sm font-semibold"
                            >
                                {loading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                Folosește Locația Mea
                            </button>
                        </div>

                        <div className="p-2">
                            <div className="text-xs font-bold text-night-400 px-2 py-1 uppercase tracking-wider">Orașe</div>
                            {locations.filter(l => l.type === 'city').map((loc) => (
                                <button
                                    key={loc.name}
                                    onClick={() => handleLocationSelect(loc)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-night-200 hover:bg-night-800 hover:text-white transition-colors"
                                >
                                    {loc.name}
                                </button>
                            ))}

                            <div className="text-xs font-bold text-night-400 px-2 py-1 mt-2 uppercase tracking-wider">Locuri de Pescuit</div>
                            {locations.filter(l => l.type === 'fishing_spot').map((loc) => (
                                <button
                                    key={loc.name}
                                    onClick={() => handleLocationSelect(loc)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-night-200 hover:bg-night-800 hover:text-white transition-colors"
                                >
                                    {loc.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
