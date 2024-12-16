/* eslint-disable @typescript-eslint/no-explicit-any */
import { MonthColumns } from "./extended";
export type CritterCategory = 'fish' | 'seaCreature' | 'insect';
export type Hemisphere = 'NH' | 'SH';

export interface BaseCritterFields extends MonthColumns {
    '#': string;
    'Name': string;
    'Icon Image': string;
    'Critterpedia Image': string;
    'Furniture Image': string;
    'Sell': string;
    'Size': string;
    'Surface': string;
    'Description': string;
    'Catch phrase': string;
    'HHA Base Points': string;
    'HHA Category': string;
    'Color 1': string;
    'Color 2': string;
    'Icon Filename': string;
    'Critterpedia Filename': string;
    'Furniture Filename': string;
    'Internal ID': string;
    'Unique Entry ID': string;
    'Total Catches to Unlock': string;
    'Spawn Rates': string;
    'Where/How': string;
    'Lighting Type': string;
}

export interface FishFields extends BaseCritterFields {
  'Shadow': string;
  'Catch Difficulty': string;
  'Vision': string;
}

export interface InsectFields extends BaseCritterFields {
  'Weather': string;
}

export interface SeaCreatureFields extends BaseCritterFields {
  'Movement Speed': string;
  'Shadow': string;
}

export type BaseCritterCSV = FishFields | InsectFields | SeaCreatureFields;

export interface TimeRange {
  start: number;
  end: number;
}

export interface Critter {
  id: string;
  number: number;
  name: string;
  iconFilename: string;
  critterpediaFilename: string;
  furnitureFilename: string;
  price: number;
  location: string;           // Where/How
  shadow?: string;            // Only for fish and sea creatures
  catchDifficulty?: string;   // Only for fish
  vision?: string;            // Only for fish
  movementSpeed?: string;     // Only for sea creatures
  weather?: string;           // Only for insects
  spawnRates: string;
  totalCatchesToUnlock: number;
  monthsAvailable: {
    NH: number[];
    SH: number[];
  };
  timeRanges: TimeRange[];
  size: string;
  surface: string;
  description: string;
  catchPhrase: string;
  hhaBasePoints: number;
  hhaCategory: string;
  color1: string;
  color2: string;
  lightingType: string | null;
  category: CritterCategory;
  internalId: number;
  [key: string]: any;
}

export interface FilterOptions {
  search: string;
  category: 'all' | CritterCategory;
  onlyAvailable: boolean;
  caught: 'all' | 'caught' | 'uncaught';
  sortBy: 'name' | 'price' | 'availability';
}

export function isFishCSV(row: BaseCritterCSV): row is FishFields {
  return 'Shadow' in row && 'Catch Difficulty' in row && 'Vision' in row;
}

export function isInsectCSV(row: BaseCritterCSV): row is InsectFields {
  return 'Weather' in row;
}

export function isSeaCreatureCSV(row: BaseCritterCSV): row is SeaCreatureFields {
  return 'Movement Speed' in row;
}