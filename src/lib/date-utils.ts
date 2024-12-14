import type { BaseCritterCSV, TimeRange, Hemisphere } from "@/types";

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

    return timeStr.split(';').map(range => {
        const [start, end] = range.trim().split('–').map(time => {
            const [hourPart, ampm] = time.trim().split(' ');
            let [hour] = hourPart.split(':').map(Number);
            
            if (ampm === 'PM' && hour !== 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
            
            return hour;
        });

        return { start, end };
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

export function getMonthValue(critter: BaseCritterCSV, hemisphere: Hemisphere, month: number): string {
    const key = getMonthKeyForCSV(hemisphere, month);
    return (critter[key] || 'NA') as string;
}

export function formatMonthList(months: number[]): string {
    if (months.length === 12) return 'All year';
    if (months.length === 0) return 'Never';

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const ranges: string[] = [];
    let start = months[0];
    let prev = months[0];

    for (let i = 1; i <= months.length; i++) {
        if (i === months.length || months[i] !== prev + 1) {
            if (start === prev) {
                ranges.push(monthNames[start - 1]);
            } else {
                ranges.push(`${monthNames[start - 1]} - ${monthNames[prev - 1]}`);
            }
            if (i < months.length) {
                start = months[i];
                prev = months[i];
            }
        } else {
            prev = months[i];
        }
    }

    return ranges.join(', ');
}

export function isTimeInRange(hour: number, ranges: TimeRange[]): boolean {
    if (!ranges || ranges.length === 0) return false;

    return ranges.some(range => {
        if (range.start === 0 && range.end === 24) return true;
        if (range.start <= range.end) {
            return hour >= range.start && hour < range.end;
        } else {
            return hour >= range.start || hour < range.end;
        }
    });
}