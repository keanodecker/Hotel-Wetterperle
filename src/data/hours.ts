export interface OpeningHoursEntry {
	/** 0 = Sonntag ... 6 = Samstag, matches Date#getDay() */
	days: number[];
	label: string;
	ranges: string[] | null;
}

export const openingHours: OpeningHoursEntry[] = [
	{ days: [1], label: 'Montag', ranges: ['17:00 – 23:00 Uhr'] },
	{ days: [2, 3], label: 'Dienstag & Mittwoch', ranges: null },
	{ days: [4, 5, 6], label: 'Donnerstag – Samstag', ranges: ['17:00 – 23:00 Uhr'] },
	{ days: [0], label: 'Sonntag', ranges: ['11:00 – 14:00 Uhr', '17:00 – 23:00 Uhr'] },
];

export const shortOpeningHours = 'Mo, Do–Sa 17–23 Uhr · So 11–14 & 17–23 Uhr · Di/Mi Ruhetag';
