import { type WeatherData } from './weather';
import { type DaySolunarData } from './solunar';

export function getFishingAdvice(weather: WeatherData, solunar: DaySolunarData): string {
    const tips: string[] = [];

    // Wind check
    if (weather.windSpeed > 25) {
        return "Vânt puternic! Caută un mal adăpostit sau un golf liniștit.";
    }
    if (weather.windSpeed > 15) {
        tips.push("Vântul este activ.");
    }

    // Pressure check (Approximation: <1005 Low, >1020 High)
    if (weather.pressure < 1005) {
        return "Presiune atmosferică scăzută. Peștii pot fi apatici, încearcă la adâncime.";
    }
    if (weather.pressure > 1022) {
        return "Presiune ridicată. Încearcă în ape mai mici sau la suprafață.";
    }

    // Temperature check
    if (weather.temperature < 5) {
        tips.push("Apa este rece, recuperările lente sunt cheia.");
    } else if (weather.temperature > 30) {
        tips.push("Caniculă! Pescuiește dimineața devreme sau seara târziu.");
    }

    // Moon/Solunar Rating check
    if (solunar.overallRating >= 4) {
        return "Condiții solunare excelente! Nu rata răsăritul și apusul.";
    }

    // General fallback based on moon phase
    if (solunar.moonPhase === 'full' || solunar.moonPhase === 'new') {
        return "Fazele de Lună Plină/Nouă aduc adesea capturi capitale.";
    }

    if (tips.length > 0) {
        return tips.join(" ") + " Verifică barometrul.";
    }

    return "Condiții stabile. O zi bună pentru a te relaxa pe malul apei.";
}

export function getMajorPeriodsDescription(periods: any[]): string {
    if (periods.length === 0) return "Fără perioade majore azi.";
    const count = periods.length;
    const totalDuration = count * 2; // Approx 2 hours per period
    return `Azi ai ${count} perioade majore. Aproximativ ${totalDuration} ore de activitate intensă.`;
}

export function getMinorPeriodsDescription(periods: any[]): string {
    if (periods.length === 0) return "Fără perioade minore azi.";
    const count = periods.length;
    return `Azi ai ${count} perioade minore. Activitate moderată în reprize scurte.`;
}
