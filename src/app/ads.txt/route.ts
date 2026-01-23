import { NextResponse } from 'next/server';

export async function GET() {
    // 301 permanent redirect to Ezoic's ads.txt manager
    return NextResponse.redirect(
        'https://srv.adstxtmanager.com/19390/calendarsolunar.ro',
        301
    );
}
