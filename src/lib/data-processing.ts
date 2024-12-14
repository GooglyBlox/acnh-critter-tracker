import Papa from 'papaparse';
import type { 
  Critter, 
  BaseCritterCSV, 
  FishFields, 
  InsectFields, 
  SeaCreatureFields
} from '@/types';
import { parseMonthsFromCSV, parseTimeRanges } from '@/lib/date-utils';

function getCurrentMonthData(row: BaseCritterCSV): string {
  const currentMonth = new Date().getMonth(); // 0-11
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthKey = `NH ${monthNames[currentMonth]}` as keyof BaseCritterCSV;
  return (row[monthKey] || 'NA') as string;
}

export async function processCSVData(fishData: string, insectData: string, seaCreatureData: string): Promise<Critter[]> {
  const parseCSV = (csvContent: string) => {
    return new Promise<BaseCritterCSV[]>((resolve, reject) => {
      try {
        const results = Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          transform: (value) => value.trim(),
        });
        resolve(results.data as BaseCritterCSV[]);
      } catch (error) {
        reject(error);
      }
    });
  };

  try {
    const [fishRows, insectRows, seaCreatureRows] = await Promise.all([
      parseCSV(fishData),
      parseCSV(insectData),
      parseCSV(seaCreatureData)
    ]);

    const fish = fishRows.map(row => processFishRow(row as FishFields));
    const insects = insectRows.map(row => processInsectRow(row as InsectFields));
    const seaCreatures = seaCreatureRows.map(row => processSeaCreatureRow(row as SeaCreatureFields));

    return [...fish, ...insects, ...seaCreatures];
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    throw error;
  }
}

function processFishRow(row: FishFields): Critter {
  const months = parseMonthsFromCSV(row);
  const currentMonthData = getCurrentMonthData(row);
  const timeRanges = parseTimeRanges(currentMonthData);

  return {
    id: row['Unique Entry ID'],
    number: parseInt(row['#']) || 0,
    name: row['Name'],
    iconFilename: row['Icon Filename'],
    critterpediaFilename: row['Critterpedia Filename'],
    furnitureFilename: row['Furniture Filename'],
    price: parseInt(row['Sell']) || 0,
    location: row['Where/How'],
    shadow: row['Shadow'],
    catchDifficulty: row['Catch Difficulty'],
    vision: row['Vision'],
    spawnRates: row['Spawn Rates'],
    totalCatchesToUnlock: parseInt(row['Total Catches to Unlock']) || 0,
    monthsAvailable: months,
    timeRanges,
    size: row['Size'],
    surface: row['Surface'],
    description: row['Description'],
    catchPhrase: row['Catch phrase'],
    hhaBasePoints: parseInt(row['HHA Base Points']) || 0,
    hhaCategory: row['HHA Category'],
    color1: row['Color 1'],
    color2: row['Color 2'],
    lightingType: row['Lighting Type'],
    category: 'fish',
    internalId: parseInt(row['Internal ID']) || 0,
    ...Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return [
          [`NH ${monthNames[i]}`, row[`NH ${monthNames[i]}` as keyof BaseCritterCSV]],
          [`SH ${monthNames[i]}`, row[`SH ${monthNames[i]}` as keyof BaseCritterCSV]]
        ];
      }).flat()
    )
  };
}

function processInsectRow(row: InsectFields): Critter {
  const base = processFishRow(row as unknown as FishFields);
  return {
    ...base,
    category: 'insect',
    shadow: undefined,
    catchDifficulty: undefined,
    vision: undefined,
    weather: row['Weather'],
  };
}

function processSeaCreatureRow(row: SeaCreatureFields): Critter {
  const base = processFishRow(row as unknown as FishFields);
  return {
    ...base,
    category: 'seaCreature',
    catchDifficulty: undefined,
    vision: undefined,
    movementSpeed: row['Movement Speed'],
    shadow: row['Shadow'],
  };
}