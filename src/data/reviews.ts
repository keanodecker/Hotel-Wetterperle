export interface Review {
	author: string;
	rating: number;
	text: string;
}

/**
 * Platzhalter, an echten Themen aus TripAdvisor/RestaurantGuru orientiert (4,9★ Schnitt).
 * Sobald der Google-Rezensionen-Link ausgewertet ist, hier 1:1 gegen die echten Top-10 tauschen.
 */
export const reviews: Review[] = [
	{
		author: 'Sabine K.',
		rating: 5,
		text: 'Wunderschön gelegener Landgasthof mitten im Grünen. Das Zimmer war geräumig, sauber und liebevoll eingerichtet. Genau die Ruhe, die wir gesucht haben.',
	},
	{
		// Echte Bewertung, 1:1 von der Original-Startseite wetteraperle.de
		author: 'Bernd',
		rating: 5,
		text: 'Ein hervorragendes, kleines Hotel mit bester Küche. Wunderbare, äußerst sympathische Gastgeber. Zimmer modern, gemütlich und sauber. Eine familiäre Atmosphäre dank der freundlichen Wirte. Der Chef kocht selber und zwar exzellent. Ich habe mich bestens aufgehoben gefühlt.',
	},
	{
		// Echte Bewertung, 1:1 von der Original-Startseite wetteraperle.de
		author: 'Georg',
		rating: 5,
		text: 'Die Besitzer des Landgasthofs waren unheimlich gastfreundlich. Das Abendessen war sehr lecker, qualitativ sehr gut und die Portionen riesig. Auch das Frühstück hat uns super gefallen. Dazu eine sehr ruhige Lage mitten in der Natur. Kinder sind herzlich willkommen. Wir werden gerne wieder kommen!',
	},
	{
		author: 'Jürgen W.',
		rating: 5,
		text: 'Der Biergarten am Teich ist ein echtes Highlight – abends dort zu sitzen und die Ruhe zu genießen, war der perfekte Abschluss unseres Ausflugs ins Schiefergebirge.',
	},
	{
		author: 'Claudia B.',
		rating: 5,
		text: 'Der hausgemachte Honig und die Marmelade zum Frühstück sind ein Traum – haben uns direkt ein Glas zum Mitnehmen gekauft.',
	},
	{
		author: 'Thomas H.',
		rating: 5,
		text: 'Unsere Feier im Festsaal war rundum gelungen. Individuelle Planung, aufmerksamer Service und ein Ambiente, das im Gedächtnis bleibt.',
	},
	{
		author: 'Petra S.',
		rating: 5,
		text: 'Kleiner, inhabergeführter Gasthof mit großem Herz. Man merkt, dass hier noch mit Leidenschaft statt Routine gearbeitet wird.',
	},
	{
		author: 'Markus F.',
		rating: 5,
		text: 'Ideale Lage für einen Zwischenstopp mit dem Wohnmobil – die Stellplätze sind gepflegt und die Küche danach eine willkommene Belohnung.',
	},
	{
		author: 'Nicole D.',
		rating: 5,
		text: 'Modernes, sauberes Zimmer mit Blick ins Grüne. Für den Preis eines der besten Häuser, in denen wir in der Region übernachtet haben.',
	},
	{
		author: 'Stefan L.',
		rating: 5,
		text: 'Von der Begrüßung bis zur Verabschiedung alles top. Wir kommen definitiv wieder – am liebsten gleich mit der ganzen Familie.',
	},
];
