import type { Critter, TimeRange } from '@/types';

export function isCurrentlyAvailable(critter: Critter, hemisphere: 'NH' | 'SH' = 'NH'): boolean {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentHour = now.getHours();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthKey = `${hemisphere} ${monthNames[currentMonth]}` as keyof Critter;

  const monthData = critter[monthKey];
  if (!monthData || monthData === 'NA' || monthData === '') return false;

  if (monthData === 'All day') return true;

  const timeRanges = parseTimeRanges(monthData);
  return timeRanges.some(range => {
    if (range.start === 0 && range.end === 24) return true;
    
    if (range.start <= range.end) {
      return currentHour >= range.start && currentHour < range.end;
    } else {
      return currentHour >= range.start || currentHour < range.end;
    }
  });
}

export function parseTimeRanges(timeStr: string): TimeRange[] {
  if (!timeStr || timeStr === 'NA' || timeStr === '') return [];
  if (timeStr === 'All day') return [{ start: 0, end: 24 }];

  const ranges = timeStr.includes(';') ? timeStr.split(';') : timeStr.split(',');
  
  return ranges.map(range => {
    const [startTime, endTime] = range.trim().split('–').map(time => {
      const [hourPart, ampm] = time.trim().split(' ');
      let [hour] = hourPart.split(':').map(Number);
      hour = hour || 0;
      
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      
      return hour;
    });

    return { start: startTime, end: endTime };
  });
}

export function formatTimeRange(range: TimeRange): string {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h} ${period}`;
  };

  if (range.start === 0 && range.end === 24) {
    return 'All day';
  }

  return `${formatHour(range.start)} - ${formatHour(range.end)}`;
}