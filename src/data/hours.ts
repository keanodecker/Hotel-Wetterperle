import { texte, type Lang } from '../i18n/ui';

export interface OpeningHoursEntry {
	/** 0 = Sonntag ... 6 = Samstag, matches Date#getDay() */
	days: number[];
	label: string;
	ranges: string[] | null;
}

/**
 * Oeffnungszeiten je Sprache. Die Tage und Zeiten sind dieselben — uebersetzt
 * werden nur die Beschriftungen und das Uhrzeit-Format (24 h vs. am/pm).
 */
export function openingHours(sprache: Lang): OpeningHoursEntry[] {
	const s = texte(sprache).stunden;
	return [
		{ days: [1], label: s.montag, ranges: [s.abend] },
		{ days: [2, 3], label: s.diMi, ranges: null },
		{ days: [4, 5, 6], label: s.doSa, ranges: [s.abend] },
		{ days: [0], label: s.sonntag, ranges: [s.mittag, s.abend] },
	];
}

export function shortOpeningHours(sprache: Lang): string {
	return texte(sprache).stunden.kurz;
}
