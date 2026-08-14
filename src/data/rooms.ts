// Zimmerdaten inkl. Bildergalerien.
//
// Die Fotos stammen aus dem Schwung von Frank Roethas (Juli 2026) und liegen
// unter src/assets/zimmer/<zimmer>/. Sie liegen bewusst in src/ und nicht in
// public/, damit Astro sie beim Build zu WebP konvertiert und in mehreren
// Breiten ausliefert - die Originale sind 1600-1920 px breit und waeren
// ungebremst zu schwer fuer die Seite.
//
// ZWEISPRACHIG (seit 12.08.2026): Name, Beschreibung, Ausstattung und alle
// Bildbeschreibungen liegen je Sprache vor; Bilder, Preise, Personenzahl und
// Groesse sind sprachneutral und stehen nur einmal da. `rooms(sprache)` gibt
// die flache Fassung fuer eine Sprache zurueck - die Komponenten sehen davon
// nichts und bleiben fuer beide Sprachen identisch.
import type { Lang } from '../i18n/ui';

import einzel01 from '../assets/zimmer/einzelzimmer/einzelzimmer-01.jpg';
import einzel02 from '../assets/zimmer/einzelzimmer/einzelzimmer-02.jpg';
import einzel03 from '../assets/zimmer/einzelzimmer/einzelzimmer-03.jpg';
import einzel04 from '../assets/zimmer/einzelzimmer/einzelzimmer-04.jpg';
import einzel05 from '../assets/zimmer/einzelzimmer/einzelzimmer-05.jpg';
import einzel06 from '../assets/zimmer/einzelzimmer/einzelzimmer-06.jpg';

import doppel01 from '../assets/zimmer/doppelzimmer/doppelzimmer-01.jpg';
import doppel02 from '../assets/zimmer/doppelzimmer/doppelzimmer-02.jpg';
import doppel03 from '../assets/zimmer/doppelzimmer/doppelzimmer-03.jpg';
import doppel04 from '../assets/zimmer/doppelzimmer/doppelzimmer-04.jpg';
import doppel05 from '../assets/zimmer/doppelzimmer/doppelzimmer-05.jpg';
import doppel06 from '../assets/zimmer/doppelzimmer/doppelzimmer-06.jpg';

import klein01 from '../assets/zimmer/doppelzimmer-klein/doppelzimmer-klein-01.jpg';
import klein02 from '../assets/zimmer/doppelzimmer-klein/doppelzimmer-klein-02.jpg';
import klein03 from '../assets/zimmer/doppelzimmer-klein/doppelzimmer-klein-03.jpg';
import klein04 from '../assets/zimmer/doppelzimmer-klein/doppelzimmer-klein-04.jpg';
import klein05 from '../assets/zimmer/doppelzimmer-klein/doppelzimmer-klein-05.jpg';

import familie01 from '../assets/zimmer/familienzimmer/familienzimmer-01.jpg';
import familie02 from '../assets/zimmer/familienzimmer/familienzimmer-02.jpg';
import familie03 from '../assets/zimmer/familienzimmer/familienzimmer-03.jpg';
import familie04 from '../assets/zimmer/familienzimmer/familienzimmer-04.jpg';
import familie05 from '../assets/zimmer/familienzimmer/familienzimmer-05.jpg';

import suite01 from '../assets/zimmer/familiensuite/familiensuite-01.jpg';
import suite02 from '../assets/zimmer/familiensuite/familiensuite-02.jpg';
import suite03 from '../assets/zimmer/familiensuite/familiensuite-03.jpg';
import suite04 from '../assets/zimmer/familiensuite/familiensuite-04.jpg';
import suite05 from '../assets/zimmer/familiensuite/familiensuite-05.jpg';
import suite06 from '../assets/zimmer/familiensuite/familiensuite-06.jpg';
import suite07 from '../assets/zimmer/familiensuite/familiensuite-07.jpg';

/** Ein Bild in der fertigen, einsprachigen Fassung. */
export interface RoomImage {
	src: ImageMetadata;
	alt: string;
}

/** Ein Zimmer in der fertigen, einsprachigen Fassung. */
export interface Room {
	id: string;
	name: string;
	/** null = Preis auf Anfrage (noch nicht festgelegt). Bei einer Personen-Staffel
	 *  ist das der BASISPREIS fuer `basisPersonen` Gaeste. */
	pricePerNight: number | null;
	maxGuests: number;
	/** Personen-Staffel (Familienzimmer/-Suite): Preis gilt fuer diese Personenzahl … */
	basisPersonen?: number;
	/** … und jede weitere Person kostet diesen Aufpreis pro Nacht. */
	aufpreisProPerson?: number;
	size: string | null;
	features: string[];
	/** Kurztext ueber der Galerie auf der Hotelseite. */
	description: string;
	/** Erstes Bild ist das Titelbild (Buchungswidget, Karten, Galerie gross). */
	gallery: RoomImage[];
}

type Sprachig<T> = Record<Lang, T>;

interface RoomQuelle {
	id: string;
	name: Sprachig<string>;
	pricePerNight: number | null;
	maxGuests: number;
	basisPersonen?: number;
	aufpreisProPerson?: number;
	size: string | null;
	features: Sprachig<string[]>;
	description: Sprachig<string>;
	gallery: { src: ImageMetadata; alt: Sprachig<string> }[];
}

/*
 * Website-Preise: KD-Ansage 14.08.2026 10:46, inkl. Fruehstueck +
 * Kulturfoerderabgabe — damit NICHT mehr identisch mit Smoobu/Booking
 * (die dortigen Werte sind netto ohne diese Bestandteile; die aeltere
 * Ansage "gleiche Preise wie Booking" vom 12.08. ist ueberholt).
 * Familienzimmer und Familien-Suite gelten fuer 2 Personen, jede weitere
 * Person kostet +15 €/Nacht (basisPersonen/aufpreisProPerson unten).
 * Anzeige bleibt "ab X €".
 */
const quelle: RoomQuelle[] = [
	{
		id: 'einzelzimmer',
		name: { de: 'Einzelzimmer', en: 'Single room' },
		pricePerNight: 78,
		maxGuests: 1,
		size: null,
		features: {
			de: ['Einzelbett', 'Privates Badezimmer', 'Kostenloses WLAN', 'Frühstück & Kulturförderabgabe inbegriffen'],
			en: ['Single bed', 'Private bathroom', 'Free Wi-Fi', 'Breakfast & city tax included'],
		},
		description: {
			de: 'Unser gemütlichstes Zimmer: ein Einzelbett in einer Nische unter alten Holzbalken, Sprossenfenster mit Blick ins Grüne und viel warmes Holz. Ideal, wenn Sie allein unterwegs sind und trotzdem nicht auf Landgasthof-Atmosphäre verzichten möchten.',
			en: 'Our cosiest room: a single bed tucked into an alcove beneath old wooden beams, a lattice window looking out into the green, and plenty of warm wood. Ideal if you are travelling alone but still want the atmosphere of a country inn.',
		},
		gallery: [
			{
				src: einzel01,
				alt: {
					de: 'Einzelzimmer: Bett mit karierter Bettwäsche in der Holznische, darüber ein Hochbett',
					en: 'Single room: bed with checked linen in the wooden alcove, a loft bed above it',
				},
			},
			{
				src: einzel06,
				alt: {
					de: 'Einzelzimmer: Blick auf Bett, Stuhl und Sprossenfenster mit Morgenlicht',
					en: 'Single room: view of the bed, chair and lattice window in the morning light',
				},
			},
			{
				src: einzel04,
				alt: {
					de: 'Einzelzimmer: obere Liegefläche des Hochbetts am Fenster',
					en: 'Single room: the upper sleeping level of the loft bed by the window',
				},
			},
			{
				src: einzel02,
				alt: {
					de: 'Einzelzimmer: Bett durch die historischen Deckenbalken gesehen',
					en: 'Single room: the bed seen through the historic ceiling beams',
				},
			},
			{
				src: einzel03,
				alt: {
					de: 'Einzelzimmer: Holzleiter zum Hochbett im Sonnenlicht',
					en: 'Single room: wooden ladder up to the loft bed in the sunlight',
				},
			},
			{
				src: einzel05,
				alt: {
					de: 'Einzelzimmer: warm leuchtende Tischlampe auf dem alten Holzbalken',
					en: 'Single room: a warmly glowing table lamp on the old wooden beam',
				},
			},
		],
	},
	{
		id: 'doppelzimmer',
		name: { de: 'Doppelzimmer', en: 'Double room' },
		pricePerNight: 111,
		maxGuests: 2,
		size: null,
		features: {
			de: [
				'Doppelbett aus Massivholz',
				'Balkon mit Blick ins Grüne',
				'Eigenes Bad mit Dusche',
				'Kostenloses WLAN',
				'Frühstück & Kulturförderabgabe inbegriffen',
			],
			en: [
				'Solid wood double bed',
				'Balcony looking out into the green',
				'Private bathroom with shower',
				'Free Wi-Fi',
				'Breakfast & city tax included',
			],
		},
		description: {
			de: 'Unser klassisches Doppelzimmer mit breitem Massivholzbett, eigenem Bad mit Dusche und – das Beste daran – einem Balkon direkt über der Wiese. Morgens der erste Kaffee im Sessel, vor sich nichts als Wald und Feld.',
			en: 'Our classic double room with a wide solid wood bed, a private bathroom with shower and – best of all – a balcony right above the meadow. The first coffee of the day in the armchair, with nothing in front of you but woods and fields.',
		},
		gallery: [
			{
				src: doppel01,
				alt: {
					de: 'Doppelzimmer: Massivholzbett mit karierter Bettwäsche und warmem Abendlicht',
					en: 'Double room: solid wood bed with checked linen in warm evening light',
				},
			},
			{
				src: doppel06,
				alt: {
					de: 'Doppelzimmer: Gast sitzt mit einer Tasse Kaffee auf dem Balkon',
					en: 'Double room: a guest sitting on the balcony with a cup of coffee',
				},
			},
			{
				src: doppel02,
				alt: {
					de: 'Doppelzimmer: Blick von der Tür auf das Doppelbett mit Leselampen',
					en: 'Double room: view from the door onto the double bed with reading lamps',
				},
			},
			{
				src: doppel05,
				alt: {
					de: 'Doppelzimmer: Blick aus dem Sprossenfenster auf Wiese und Wald',
					en: 'Double room: view from the lattice window over meadow and forest',
				},
			},
			{
				src: doppel03,
				alt: {
					de: 'Doppelzimmer: eigenes Bad mit Dusche, Waschbecken und Spiegel',
					en: 'Double room: private bathroom with shower, washbasin and mirror',
				},
			},
			{
				src: doppel04,
				alt: {
					de: 'Doppelzimmer: Nachttischlampe und karierte Kissen am Bettrand',
					en: 'Double room: bedside lamp and checked cushions at the edge of the bed',
				},
			},
		],
	},
	{
		id: 'doppelzimmer-klein',
		name: { de: 'Kleines Doppelzimmer', en: 'Small double room' },
		pricePerNight: 101,
		maxGuests: 2,
		size: null,
		features: {
			de: [
				'Doppelbett aus Massivholz',
				'Flachbild-TV',
				'Leselampen mit USB am Kopfteil',
				'Balkonzugang',
				'Kostenloses WLAN',
				'Frühstück & Kulturförderabgabe inbegriffen',
			],
			en: [
				'Solid wood double bed',
				'Flat-screen TV',
				'Reading lamps with USB in the headboard',
				'Access to the balcony',
				'Free Wi-Fi',
				'Breakfast & city tax included',
			],
		},
		description: {
			de: 'Kompakter geschnitten als unser großes Doppelzimmer, aber mit allem, was zwei Gäste brauchen: Massivholzbett mit gemütlichem Holzkopfteil, Leselampen samt USB-Anschluss, Fernseher, Kleiderschrank und Zugang zum Balkon. Die sparsame Variante, ohne dass es sich sparsam anfühlt.',
			en: 'More compact than our large double room, but with everything two guests need: a solid wood bed with a cosy wooden headboard, reading lamps with a USB socket, a TV, a wardrobe and access to the balcony. The thrifty choice, without feeling like one.',
		},
		gallery: [
			{
				src: klein02,
				alt: {
					de: 'Kleines Doppelzimmer: Massivholzbett mit Kleiderschrank und warmer Leselampe',
					en: 'Small double room: solid wood bed with wardrobe and a warm reading lamp',
				},
			},
			{
				src: klein04,
				alt: {
					de: 'Kleines Doppelzimmer: Fernseher, Sitzecke und Fenstertür zum Balkon',
					en: 'Small double room: TV, seating corner and the french door to the balcony',
				},
			},
			{
				src: klein01,
				alt: {
					de: 'Kleines Doppelzimmer: Bett von der Seite mit bereitgelegten Handtüchern',
					en: 'Small double room: the bed from the side with towels laid out ready',
				},
			},
			{
				src: klein05,
				alt: {
					de: 'Kleines Doppelzimmer: Holzkopfteil mit Leselampe und USB-Anschluss',
					en: 'Small double room: wooden headboard with reading lamp and USB socket',
				},
			},
			{
				src: klein03,
				alt: {
					de: 'Kleines Doppelzimmer: frische Handtücher mit Willkommensgruß auf dem Bett',
					en: 'Small double room: fresh towels with a welcome greeting on the bed',
				},
			},
		],
	},
	{
		id: 'familienzimmer',
		name: { de: 'Familienzimmer', en: 'Family room' },
		pricePerNight: 136,
		maxGuests: 4,
		basisPersonen: 2,
		aufpreisProPerson: 15,
		size: '40 m²',
		features: {
			de: [
				'Großes Doppelbett',
				'Kleines Doppelbett',
				'Eigener Essbereich',
				'Eigenes Bad mit Dusche',
				'Kostenloses WLAN',
				'Frühstück & Kulturförderabgabe inbegriffen',
			],
			en: [
				'Large double bed',
				'Small double bed',
				'Its own dining area',
				'Private bathroom with shower',
				'Free Wi-Fi',
				'Breakfast & city tax included',
			],
		},
		description: {
			de: '40 m² für die ganze Familie: ein großes und ein kleines Doppelbett im hellen Schlafbereich, dazu ein eigener Essbereich mit Tisch für vier unter freigelegtem Fachwerk. Platz zum Ausbreiten, ohne dass jemand über Koffer steigen muss.',
			en: '40 m² for the whole family: one large and one small double bed in the bright sleeping area, plus a dining area of its own with a table for four beneath exposed half-timbering. Room to spread out, without anyone having to climb over suitcases.',
		},
		gallery: [
			{
				src: familie03,
				alt: {
					de: 'Familienzimmer: heller Schlafbereich mit zwei Betten unter dem Strandbild',
					en: 'Family room: bright sleeping area with two beds beneath the beach painting',
				},
			},
			{
				src: familie01,
				alt: {
					de: 'Familienzimmer: eigener Essbereich mit Tisch für vier vor dem freigelegten Fachwerk',
					en: 'Family room: its own dining area with a table for four in front of the exposed half-timbering',
				},
			},
			{
				src: familie04,
				alt: {
					de: 'Familienzimmer: offener Holzschrank und Sitzbank neben den Betten',
					en: 'Family room: open wooden wardrobe and bench beside the beds',
				},
			},
			{
				src: familie05,
				alt: {
					de: 'Familienzimmer: Betten mit karierten Kissen unter der Pendelleuchte',
					en: 'Family room: beds with checked cushions beneath the pendant light',
				},
			},
			{
				src: familie02,
				alt: {
					de: 'Familienzimmer: eigenes Bad mit Dusche und Waschbecken',
					en: 'Family room: private bathroom with shower and washbasin',
				},
			},
		],
	},
	{
		id: 'familien-suite',
		name: { de: 'Familien-Suite', en: 'Family suite' },
		pricePerNight: 146,
		maxGuests: 5,
		basisPersonen: 2,
		aufpreisProPerson: 15,
		size: '40 m²',
		features: {
			de: [
				'Zwei Ebenen über eine historische Holztreppe',
				'Großes Doppelbett',
				'Zusätzliches Klappbett und Schlafsessel',
				'Sitzecke mit Balkon, Minibar und Kaffeemaschine',
				'Flachbild-TV',
				'Extra Toilette',
				'Kostenloses WLAN',
				'Frühstück & Kulturförderabgabe inbegriffen',
			],
			en: [
				'Two levels connected by a historic wooden staircase',
				'Large double bed',
				'Additional folding bed and sleeping chair',
				'Seating corner with balcony, minibar and coffee machine',
				'Flat-screen TV',
				'Extra toilet',
				'Free Wi-Fi',
				'Breakfast & city tax included',
			],
		},
		description: {
			de: 'Unser besonderstes Quartier, verteilt auf zwei Ebenen: Über eine historische Holztreppe geht es hinauf unter die alten Dachbalken zum Schlafbereich mit Galerie. Unten warten Sitzecke, Kaffeemaschine, Minibar und die Balkontür ins Grüne. Ein zusätzliches Klappbett und ein Schlafsessel schaffen Platz für bis zu fünf Gäste.',
			en: 'Our most special quarters, spread over two levels: a historic wooden staircase leads up beneath the old roof beams to the sleeping area with its gallery. Downstairs a seating corner, coffee machine, minibar and the balcony door into the green are waiting. An additional folding bed and a sleeping chair make room for up to five guests.',
		},
		gallery: [
			{
				src: suite06,
				alt: {
					de: 'Familien-Suite: Schlafbereich unter historischen Dachbalken mit Galerie und Sessel',
					en: 'Family suite: sleeping area beneath historic roof beams, with gallery and armchair',
				},
			},
			{
				src: suite07,
				alt: {
					de: 'Familien-Suite: Sitzecke mit offener Balkontür, Kaffeemaschine und Kleiderschrank',
					en: 'Family suite: seating corner with open balcony door, coffee machine and wardrobe',
				},
			},
			{
				src: suite03,
				alt: {
					de: 'Familien-Suite: obere Ebene mit Bett, Kommode, Fernseher und Sessel',
					en: 'Family suite: upper level with bed, chest of drawers, TV and armchair',
				},
			},
			{
				src: suite04,
				alt: {
					de: 'Familien-Suite: historische Holztreppe zwischen den beiden Ebenen',
					en: 'Family suite: the historic wooden staircase between the two levels',
				},
			},
			{
				src: suite01,
				alt: {
					de: 'Familien-Suite: ausgeklapptes Zusatzbett unter der Dachschräge',
					en: 'Family suite: the additional bed folded out beneath the sloping ceiling',
				},
			},
			{
				src: suite02,
				alt: {
					de: 'Familien-Suite: Schlafsessel an der Galeriebrüstung unter der Dachschräge',
					en: 'Family suite: sleeping chair by the gallery railing beneath the sloping ceiling',
				},
			},
			{
				src: suite05,
				alt: {
					de: 'Familien-Suite: Leseecke mit Sessel und Bogenlampe unter der Dachschräge',
					en: 'Family suite: reading corner with armchair and arc lamp beneath the sloping ceiling',
				},
			},
		],
	},
];

/** Alle Zimmer in einer Sprache — Reihenfolge und IDs bleiben identisch. */
export function rooms(sprache: Lang): Room[] {
	return quelle.map((z) => ({
		id: z.id,
		name: z.name[sprache],
		pricePerNight: z.pricePerNight,
		maxGuests: z.maxGuests,
		basisPersonen: z.basisPersonen,
		aufpreisProPerson: z.aufpreisProPerson,
		size: z.size,
		features: z.features[sprache],
		description: z.description[sprache],
		gallery: z.gallery.map((b) => ({ src: b.src, alt: b.alt[sprache] })),
	}));
}
