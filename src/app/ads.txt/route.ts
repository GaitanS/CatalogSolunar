import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.redirect(
        'https://srv.adstxtmanager.com/19390/calendarsolunar.ro',
        { status: 301 }
    );
}
