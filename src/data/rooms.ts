export interface Room {
	id: string;
	name: string;
	pricePerNight: number;
	maxGuests: number;
	size: string | null;
	features: string[];
}

export const rooms: Room[] = [
	{
		id: 'einzelzimmer',
		name: 'Einzelzimmer',
		pricePerNight: 78,
		maxGuests: 1,
		size: null,
		features: ['Einzelbett', 'Privates Badezimmer', 'Kostenloses WLAN', 'Frühstück inbegriffen'],
	},
	{
		id: 'doppelzimmer',
		name: 'Doppelzimmer',
		pricePerNight: 101,
		maxGuests: 2,
		size: null,
		features: ['Doppelbett', 'Privates Badezimmer', 'Kostenloses WLAN', 'Frühstück inbegriffen'],
	},
	{
		id: 'familienzimmer',
		name: 'Familienzimmer',
		pricePerNight: 150,
		maxGuests: 3,
		size: '40 m²',
		features: ['Großes Doppelbett', 'Kleines Doppelbett', 'Kostenloses WLAN', 'Frühstück inbegriffen'],
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
	},
];
