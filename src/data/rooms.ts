// Zimmerdaten inkl. Bildergalerien.
//
// Die Fotos stammen aus dem Schwung von Frank Roethas (Juli 2026) und liegen
// unter src/assets/zimmer/<zimmer>/. Sie liegen bewusst in src/ und nicht in
// public/, damit Astro sie beim Build zu WebP konvertiert und in mehreren
// Breiten ausliefert - die Originale sind 1600-1920 px breit und waeren
// ungebremst zu schwer fuer die Seite.
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

export interface RoomImage {
	src: ImageMetadata;
	alt: string;
}

export interface Room {
	id: string;
	name: string;
	/** null = Preis auf Anfrage (noch nicht festgelegt). */
	pricePerNight: number | null;
	maxGuests: number;
	size: string | null;
	features: string[];
	/** Kurztext ueber der Galerie auf der Hotelseite. */
	description: string;
	/** Erstes Bild ist das Titelbild (Buchungswidget, Karten, Galerie gross). */
	gallery: RoomImage[];
}

export const rooms: Room[] = [
	{
		id: 'einzelzimmer',
		name: 'Einzelzimmer',
		pricePerNight: 78,
		maxGuests: 1,
		size: null,
		features: ['Einzelbett', 'Privates Badezimmer', 'Kostenloses WLAN', 'Frühstück inbegriffen'],
		description:
			'Unser gemütlichstes Zimmer: ein Einzelbett in einer Nische unter alten Holzbalken, Sprossenfenster mit Blick ins Grüne und viel warmes Holz. Ideal, wenn Sie allein unterwegs sind und trotzdem nicht auf Landgasthof-Atmosphäre verzichten möchten.',
		gallery: [
			{ src: einzel01, alt: 'Einzelzimmer: Bett mit karierter Bettwäsche in der Holznische, darüber ein Hochbett' },
			{ src: einzel06, alt: 'Einzelzimmer: Blick auf Bett, Stuhl und Sprossenfenster mit Morgenlicht' },
			{ src: einzel04, alt: 'Einzelzimmer: obere Liegefläche des Hochbetts am Fenster' },
			{ src: einzel02, alt: 'Einzelzimmer: Bett durch die historischen Deckenbalken gesehen' },
			{ src: einzel03, alt: 'Einzelzimmer: Holzleiter zum Hochbett im Sonnenlicht' },
			{ src: einzel05, alt: 'Einzelzimmer: warm leuchtende Tischlampe auf dem alten Holzbalken' },
		],
	},
	{
		id: 'doppelzimmer',
		name: 'Doppelzimmer',
		pricePerNight: 101,
		maxGuests: 2,
		size: null,
		features: [
			'Doppelbett aus Massivholz',
			'Balkon mit Blick ins Grüne',
			'Eigenes Bad mit Dusche',
			'Kostenloses WLAN',
			'Frühstück inbegriffen',
		],
		description:
			'Unser klassisches Doppelzimmer mit breitem Massivholzbett, eigenem Bad mit Dusche und – das Beste daran – einem Balkon direkt über der Wiese. Morgens der erste Kaffee im Sessel, vor sich nichts als Wald und Feld.',
		gallery: [
			{ src: doppel01, alt: 'Doppelzimmer: Massivholzbett mit karierter Bettwäsche und warmem Abendlicht' },
			{ src: doppel06, alt: 'Doppelzimmer: Gast sitzt mit einer Tasse Kaffee auf dem Balkon' },
			{ src: doppel02, alt: 'Doppelzimmer: Blick von der Tür auf das Doppelbett mit Leselampen' },
			{ src: doppel05, alt: 'Doppelzimmer: Blick aus dem Sprossenfenster auf Wiese und Wald' },
			{ src: doppel03, alt: 'Doppelzimmer: eigenes Bad mit Dusche, Waschbecken und Spiegel' },
			{ src: doppel04, alt: 'Doppelzimmer: Nachttischlampe und karierte Kissen am Bettrand' },
		],
	},
	{
		id: 'doppelzimmer-klein',
		name: 'Kleines Doppelzimmer',
		pricePerNight: null,
		maxGuests: 2,
		size: null,
		features: [
			'Doppelbett aus Massivholz',
			'Flachbild-TV',
			'Leselampen mit USB am Kopfteil',
			'Balkonzugang',
			'Kostenloses WLAN',
			'Frühstück inbegriffen',
		],
		description:
			'Kompakter geschnitten als unser großes Doppelzimmer, aber mit allem, was zwei Gäste brauchen: Massivholzbett mit gemütlichem Holzkopfteil, Leselampen samt USB-Anschluss, Fernseher, Kleiderschrank und Zugang zum Balkon. Die sparsame Variante, ohne dass es sich sparsam anfühlt.',
		gallery: [
			{ src: klein02, alt: 'Kleines Doppelzimmer: Massivholzbett mit Kleiderschrank und warmer Leselampe' },
			{ src: klein04, alt: 'Kleines Doppelzimmer: Fernseher, Sitzecke und Fenstertür zum Balkon' },
			{ src: klein01, alt: 'Kleines Doppelzimmer: Bett von der Seite mit bereitgelegten Handtüchern' },
			{ src: klein05, alt: 'Kleines Doppelzimmer: Holzkopfteil mit Leselampe und USB-Anschluss' },
			{ src: klein03, alt: 'Kleines Doppelzimmer: frische Handtücher mit Willkommensgruß auf dem Bett' },
		],
	},
	{
		id: 'familienzimmer',
		name: 'Familienzimmer',
		pricePerNight: 150,
		maxGuests: 3,
		size: '40 m²',
		features: [
			'Großes Doppelbett',
			'Kleines Doppelbett',
			'Eigener Essbereich',
			'Eigenes Bad mit Dusche',
			'Kostenloses WLAN',
			'Frühstück inbegriffen',
		],
		description:
			'40 m² für die ganze Familie: ein großes und ein kleines Doppelbett im hellen Schlafbereich, dazu ein eigener Essbereich mit Tisch für vier unter freigelegtem Fachwerk. Platz zum Ausbreiten, ohne dass jemand über Koffer steigen muss.',
		gallery: [
			{ src: familie03, alt: 'Familienzimmer: heller Schlafbereich mit zwei Betten unter dem Strandbild' },
			{ src: familie01, alt: 'Familienzimmer: eigener Essbereich mit Tisch für vier vor dem freigelegten Fachwerk' },
			{ src: familie04, alt: 'Familienzimmer: offener Holzschrank und Sitzbank neben den Betten' },
			{ src: familie05, alt: 'Familienzimmer: Betten mit karierten Kissen unter der Pendelleuchte' },
			{ src: familie02, alt: 'Familienzimmer: eigenes Bad mit Dusche und Waschbecken' },
		],
	},
	{
		id: 'familien-suite',
		name: 'Familien-Suite',
		pricePerNight: 160,
		maxGuests: 3,
		size: '40 m²',
		features: [
			'Zwei Ebenen über eine historische Holztreppe',
			'Großes Doppelbett',
			'Zusätzliches Klappbett',
			'Sitzecke mit Balkon, Minibar und Kaffeemaschine',
			'Flachbild-TV',
			'Extra Toilette',
			'Kostenloses WLAN',
			'Frühstück inbegriffen',
		],
		description:
			'Unser besonderstes Quartier, verteilt auf zwei Ebenen: Über eine historische Holztreppe geht es hinauf unter die alten Dachbalken zum Schlafbereich mit Galerie. Unten warten Sitzecke, Kaffeemaschine, Minibar und die Balkontür ins Grüne. Ein zusätzliches Klappbett schafft Platz für das dritte Familienmitglied.',
		gallery: [
			{ src: suite06, alt: 'Familien-Suite: Schlafbereich unter historischen Dachbalken mit Galerie und Sessel' },
			{ src: suite07, alt: 'Familien-Suite: Sitzecke mit offener Balkontür, Kaffeemaschine und Kleiderschrank' },
			{ src: suite03, alt: 'Familien-Suite: obere Ebene mit Bett, Kommode, Fernseher und Sessel' },
			{ src: suite04, alt: 'Familien-Suite: historische Holztreppe zwischen den beiden Ebenen' },
			{ src: suite01, alt: 'Familien-Suite: ausgeklapptes Zusatzbett unter der Dachschräge' },
			{ src: suite02, alt: 'Familien-Suite: Schlafsessel an der Galeriebrüstung unter der Dachschräge' },
			{ src: suite05, alt: 'Familien-Suite: Leseecke mit Sessel und Bogenlampe unter der Dachschräge' },
		],
	},
];
