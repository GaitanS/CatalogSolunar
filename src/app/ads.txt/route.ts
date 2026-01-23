import { redirect } from 'next/navigation';

export async function GET() {
    // Redirect to Ezoic's ads.txt manager
    redirect('https://srv.adstxtmanager.com/19390/calendarsolunar.ro');
}
