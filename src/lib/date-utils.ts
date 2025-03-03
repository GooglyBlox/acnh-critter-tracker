import type { BaseCritterCSV, TimeRange, Hemisphere, Critter } from "@/types";

function getMonthKeyForCSV(hemisphere: Hemisphere, month: number): keyof BaseCritterCSV {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${hemisphere} ${monthNames[month - 1]}` as keyof BaseCritterCSV;
}

export function parseMonthsFromCSV(row: BaseCritterCSV): { NH: number[]; SH: number[] } {
    const months = {
        NH: [] as number[],
        SH: [] as number[]
    };

    ['NH', 'SH'].forEach((hemisphere) => {
        for (let i = 1; i <= 12; i++) {
            const key = getMonthKeyForCSV(hemisphere as Hemisphere, i);
            const value = row[key];
            
            if (value && value !== 'NA' && value !== '') {
                months[hemisphere as Hemisphere].push(i);
            }
        }
    });

    return months;
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

export function formatTimeRange(timeRanges: TimeRange[]): string {
    if (!timeRanges || timeRanges.length === 0) return 'Not available';
    if (timeRanges.length === 1) {
        const range = timeRanges[0];
        if (range.start === 0 && range.end === 24) {
            return 'All day';
        }

        const formatHour = (hour: number) => {
            const period = hour >= 12 ? 'PM' : 'AM';
            const h = hour % 12 || 12;
            return `${h} ${period}`;
        };

        return `${formatHour(range.start)} - ${formatHour(range.end)}`;
    }

    return timeRanges
        .map(range => formatTimeRange([range]))
        .join(' & ');
}

export function formatMonthList(months: number[]): string {
    if (months.length === 12) return 'All year';
    if (months.length === 0) return 'Never';

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (months.length === 0) return 'Never';

    const sortedMonths = [...months].sort((a, b) => a - b);

    const wrapsAround = sortedMonths.includes(12) && sortedMonths.includes(1);
    
    if (wrapsAround) {
        const januaryIndex = sortedMonths.indexOf(1);
        const rotatedMonths = [
            ...sortedMonths.slice(januaryIndex),
            ...sortedMonths.slice(0, januaryIndex)
        ];
        sortedMonths.length = 0;
        sortedMonths.push(...rotatedMonths);
    }

    const ranges: string[] = [];
    let start = sortedMonths[0];
    let prev = sortedMonths[0];

    for (let i = 1; i <= sortedMonths.length; i++) {
        if (i === sortedMonths.length || sortedMonths[i] !== prev + 1) {
            if (start === prev) {
                ranges.push(monthNames[start - 1]);
            } else {
                ranges.push(`${monthNames[start - 1]} - ${monthNames[prev - 1]}`);
            }
            if (i < sortedMonths.length) {
                start = sortedMonths[i];
                prev = sortedMonths[i];
            }
        } else {
            prev = sortedMonths[i];
        }
    }

    if (ranges.length > 1 && wrapsAround) {
        const firstRange = ranges[0];
        const lastRange = ranges[ranges.length - 1];
        
        if (firstRange.includes('January') && lastRange.includes('December')) {
            const startMonth = lastRange.split(' - ')[0];
            const endMonth = firstRange.split(' - ').pop();
            ranges.splice(0, 1);
            ranges.splice(-1, 1);
            ranges.unshift(`${startMonth} - ${endMonth}`);
        }
    }

    return ranges.join(', ');
}

export function isCurrentlyAvailable(critter: Critter, hemisphere: Hemisphere = 'NH'): boolean {
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
        
        if (range.start > range.end) {
            return currentHour >= range.start || currentHour < range.end;
        }
        return currentHour >= range.start && currentHour < range.end;
    });
}