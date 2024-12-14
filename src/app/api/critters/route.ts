import { NextResponse } from 'next/server';
import { processCSVData } from '@/lib/data-processing';
import { isCurrentlyAvailable } from '@/lib/utils';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Critter } from '@/types';

let processedData: Critter[] | null = null;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available') === 'true';
    const hemisphere = (searchParams.get('hemisphere') || 'NH') as 'NH' | 'SH';

    try {
        if (!processedData) {
            const dataDir = join(process.cwd(), 'src', 'data');

            const fishData = readFileSync(join(dataDir, 'fish.csv'), 'utf-8');
            const insectData = readFileSync(join(dataDir, 'insects.csv'), 'utf-8');
            const seaCreatureData = readFileSync(join(dataDir, 'sea-creatures.csv'), 'utf-8');

            processedData = await processCSVData(fishData, insectData, seaCreatureData);
        }

        let filteredData = [...processedData];

        if (category && category !== 'all') {
            filteredData = filteredData.filter(critter => critter.category === category);
        }

        if (available) {
            filteredData = filteredData.filter(critter => isCurrentlyAvailable(critter, hemisphere));
        }

        return NextResponse.json(filteredData);
    } catch (error) {
        console.error('Error processing critter data:', error);
        return NextResponse.json(
            { error: 'Failed to load critter data. Please ensure CSV files are present in the data directory.' },
            { status: 500 }
        );
    }
}