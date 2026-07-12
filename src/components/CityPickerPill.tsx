'use client';

/**
 * Selectorul de locatie din designul Solunar Mobile: pastila cu punct auriu
 * care deschide un bottom sheet cu lista de orase (+ geolocatie).
 * Navigheaza identic cu LocationPicker (parametrii lat/lng/loc din URL).
 */

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { locations, type Location } from '@/data/locations';

export default function CityPickerPill() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentName = searchParams.get('loc') || 'București';

    const navigateTo = (lat: number, lng: number, name: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('lat', String(lat));
        params.set('lng', String(lng));
        params.set('loc', name);
        params.delete('d');
        router.push(`${pathname}?${params.toString()}`);
        setOpen(false);
    };

    const useMyLocation = () => {
        if (!('geolocation' in navigator)) return;
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLoading(false);
                navigateTo(pos.coords.latitude, pos.coords.longitude, 'Locația Mea');
            },
            () => setLoading(false)
        );
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-[7px] rounded-full px-[13px] py-2 text-[12.5px] font-semibold text-[#EEF1F7]"
                style={{ background: 'rgba(148,170,220,0.09)', border: '1px solid rgba(148,170,220,0.16)' }}
            >
                <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: '#F2CE72', boxShadow: '0 0 8px rgba(242,206,114,0.7)' }}
                />
                {currentName}
                <span className="text-[10px] text-[#8C96AB]">▾</span>
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-[80]"
                        style={{ background: 'rgba(3,6,13,0.64)', backdropFilter: 'blur(3px)' }}
                        onClick={() => setOpen(false)}
                    />
                    <div
                        className="fixed inset-x-0 bottom-0 z-[81] max-h-[72%] overflow-y-auto px-4 pb-6 pt-3"
                        style={{
                            background: '#0D1526',
                            border: '1px solid rgba(148,170,220,0.16)',
                            borderBottom: 'none',
                            borderRadius: '24px 24px 0 0',
                        }}
                    >
                        <div className="mx-auto mb-3.5 h-1 w-[38px] rounded" style={{ background: 'rgba(148,170,220,0.3)' }} />
                        <div className="mb-3 px-1 text-[15px] font-bold text-white">Alege locația</div>
                        <button
                            onClick={useMyLocation}
                            disabled={loading}
                            className="mb-1.5 flex w-full items-center justify-between gap-2.5 rounded-[14px] px-[13px] py-[11px] text-left"
                            style={{ background: 'rgba(242,206,114,0.07)', border: '1px solid rgba(242,206,114,0.25)' }}
                        >
                            <div>
                                <div className="text-sm font-semibold text-[#F2CE72]">
                                    {loading ? 'Se detectează…' : 'Folosește locația mea'}
                                </div>
                                <div className="mt-0.5 text-[10.5px] text-[#8C96AB]">GPS, pentru ore exacte la balta ta</div>
                            </div>
                            <span className="text-sm font-bold text-[#F2CE72]">➤</span>
                        </button>
                        {locations.filter((l) => l.type === 'city').map((ct: Location) => {
                            const sel = ct.name === currentName;
                            return (
                                <button
                                    key={ct.name}
                                    onClick={() => navigateTo(ct.lat, ct.lng, ct.name)}
                                    className="mb-1.5 flex w-full items-center justify-between gap-2.5 rounded-[14px] px-[13px] py-[11px] text-left text-[#EEF1F7]"
                                    style={{
                                        background: sel ? 'rgba(242,206,114,0.09)' : 'rgba(148,170,220,0.05)',
                                        border: sel ? '1px solid rgba(242,206,114,0.35)' : '1px solid rgba(148,170,220,0.1)',
                                    }}
                                >
                                    <div className="text-sm font-semibold">{ct.name}</div>
                                    {sel && <span className="text-sm font-bold text-[#F2CE72]">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
}
