export interface NavItem {
	href: string;
	label: string;
}

export const navItems: NavItem[] = [
	{ href: '/restaurant', label: 'Restaurant' },
	{ href: '/hotel', label: 'Hotel' },
	{ href: '/feiern', label: 'Feiern' },
	{ href: '/ueber-uns', label: 'Über uns' },
	{ href: '/kontakt', label: 'Kontakt' },
];

export const footerNavItems: NavItem[] = [
	...navItems,
	{ href: '/presse', label: 'Presse' },
	{ href: '/datenschutz', label: 'Datenschutz' },
];

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
