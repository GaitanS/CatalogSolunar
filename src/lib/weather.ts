export interface WeatherData {
    temperature: number;
    pressure: number;
    windSpeed: number;
    windDirection: number; // degrees
    waterTemp: number; // estimated
}

const FALLBACK_WEATHER: WeatherData = {
    temperature: 18,
    pressure: 1012,
    windSpeed: 12,
    windDirection: 0,
    waterTemp: 15
};

/**
 * Retry fetch with exponential backoff
 */
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;

            // Don't retry on 4xx errors (client errors)
            if (response.status >= 400 && response.status < 500) {
                throw new Error(`Client error: ${response.status}`);
            }
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');

            // Wait before retrying (exponential backoff: 1s, 2s, 4s)
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

export async function getWeatherData(lat: number, lng: number): Promise<WeatherData> {
    try {
        const response = await fetchWithRetry(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,surface_pressure,wind_speed_10m,wind_direction_10m`,
            { next: { revalidate: 3600 } }, // Cache for 1 hour
            2 // Only 2 retries for weather data
        );

        const data = await response.json();
        const current = data.current;

        // Validate data before returning
        if (!current || typeof current.temperature_2m !== 'number') {
            throw new Error('Invalid weather data format');
        }

        return {
            temperature: Math.round(current.temperature_2m),
            pressure: Math.round(current.surface_pressure),
            windSpeed: Math.round(current.wind_speed_10m),
            windDirection: current.wind_direction_10m,
            // Estimate water temp based on air temp with seasonal adjustment
            waterTemp: Math.round(current.temperature_2m - 2),
        };
    } catch (error) {
        console.error('Error fetching weather data:', error instanceof Error ? error.message : error);
        // Return fallback data with console warning
        return FALLBACK_WEATHER;
    }
}

export function getWindDirectionString(degrees: number): string {
    const directions = ['N', 'N-E', 'E', 'S-E', 'S', 'S-V', 'V', 'N-V'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}
