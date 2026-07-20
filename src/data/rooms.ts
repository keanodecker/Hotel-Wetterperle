import einzelzimmer from '../assets/gallery/zimmer/zimmer-einzel-fenster.jpg';
import doppelzimmer from '../assets/gallery/zimmer/zimmer-holzbett.jpg';
import familienzimmer from '../assets/gallery/zimmer/familienzimmer-etagenbett.jpg';
import familienSuite from '../assets/gallery/zimmer/zimmer-dach-balken.jpg';

export interface Room {
	id: string;
	name: string;
	pricePerNight: number;
	maxGuests: number;
	size: string | null;
	features: string[];
	image: ImageMetadata;
	imageAlt: string;
}

export const rooms: Room[] = [
	{
		id: 'einzelzimmer',
		name: 'Einzelzimmer',
		pricePerNight: 78,
		maxGuests: 1,
		size: null,
		features: ['Einzelbett', 'Privates Badezimmer', 'Kostenloses WLAN', 'Frühstück inbegriffen'],
		image: einzelzimmer,
		imageAlt: 'Einzelzimmer mit Bett unter dem Sprossenfenster',
	},
	{
		id: 'doppelzimmer',
		name: 'Doppelzimmer',
		pricePerNight: 101,
		maxGuests: 2,
		size: null,
		features: ['Doppelbett', 'Privates Badezimmer', 'Kostenloses WLAN', 'Frühstück inbegriffen'],
		image: doppelzimmer,
		imageAlt: 'Modernes Doppelzimmer mit Doppelbett aus Massivholz',
	},
	{
		id: 'familienzimmer',
		name: 'Familienzimmer',
		pricePerNight: 150,
		maxGuests: 3,
		size: '40 m²',
		features: ['Großes Doppelbett', 'Kleines Doppelbett', 'Kostenloses WLAN', 'Frühstück inbegriffen'],
		image: familienzimmer,
		imageAlt: 'Familienzimmer mit Etagenbett aus Massivholz',
	},
	{
		id: 'familien-suite',
		name: 'Familien-Suite',
		pricePerNight: 160,
		maxGuests: 3,
		size: '40 m²',
		features: [
			'Großes Doppelbett',
			'Kleines Doppelbett',
			'Extra Toilette',
			'Kostenloses WLAN',
			'Frühstück inbegriffen',
		],
		image: familienSuite,
		imageAlt: 'Familien-Suite unter historischen Deckenbalken mit zwei Betten',
	},
];
