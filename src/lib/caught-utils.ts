const STORAGE_KEY = 'acnh-caught-critters';

export function getCaughtCritters(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch (error) {
    console.error('Error reading caught critters from localStorage:', error);
    return new Set();
  }
}

export function toggleCaughtStatus(critterId: string): boolean {
  const caught = getCaughtCritters();
  const wasCaught = caught.has(critterId);
  
  if (wasCaught) {
    caught.delete(critterId);
  } else {
    caught.add(critterId);
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...caught]));
    return !wasCaught;
  } catch (error) {
    console.error('Error saving caught status to localStorage:', error);
    return wasCaught;
  }
}

export function isCritterCaught(critterId: string): boolean {
  return getCaughtCritters().has(critterId);
}

export function getCaughtCount(): number {
  return getCaughtCritters().size;
}

export function clearCaughtCritters(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing caught critters from localStorage:', error);
  }
}