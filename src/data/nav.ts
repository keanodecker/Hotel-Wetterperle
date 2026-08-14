import { pfad, texte, type Lang } from '../i18n/ui';

export interface NavItem {
	href: string;
	label: string;
}

/**
 * Navigation je Sprache. Die Adressen kommen aus der Routen-Tabelle in
 * `src/i18n/ui.ts` — hier steht kein englischer Slug, damit es nur EINE
 * Stelle gibt, an der sich eine Adresse aendern laesst.
 */
export function navItems(sprache: Lang): NavItem[] {
	const t = texte(sprache);
	return [
		{ href: pfad(sprache, '/restaurant'), label: t.nav.restaurant },
		{ href: pfad(sprache, '/hotel'), label: t.nav.hotel },
		{ href: pfad(sprache, '/feiern'), label: t.nav.feiern },
		{ href: pfad(sprache, '/ueber-uns'), label: t.nav.ueberUns },
		{ href: pfad(sprache, '/kontakt'), label: t.nav.kontakt },
	];
}

export function footerNavItems(sprache: Lang): NavItem[] {
	const t = texte(sprache);
	return [
		...navItems(sprache),
		{ href: pfad(sprache, '/presse'), label: t.nav.presse },
		{ href: pfad(sprache, '/datenschutz'), label: t.nav.datenschutz },
		{ href: pfad(sprache, '/impressum'), label: t.nav.impressum },
	];
}

export const chefplatzUrl = 'https://www.chefplatz.de/wetteraperle';

export const contact = {
	name: 'Landgasthof Wetteraperle',
	street: 'Raila 11',
	zipCity: '07929 Saalburg-Ebersdorf',
	region: 'Thüringen',
	phoneDisplay: '036647 / 299909',
	phoneHref: 'tel:+4936647299909',
	email: 'info@wetteraperle.de',
	mapEmbedSrc:
		'https://www.google.com/maps/embed/v1/place?q=Raila+11%2C+07929+Saalburg-Ebersdorf%2C+Germany&key=AIzaSyD09zQ9PNDNNy9TadMuzRV_UsPUoWKntt8',
};
