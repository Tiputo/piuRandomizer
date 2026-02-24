import type { Chart } from '../types';

export async function fetchAllCharts(apiToken: string): Promise<Chart[]> {
    const credentials = btoa(`api:${apiToken}`);
    
    // Pokus nacteni dat
    const response = await fetch('/api/charts?Count=5000', {
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Nepodařilo se načíst data');
    }

    const data = await response.json();
    return data.results || data;
}