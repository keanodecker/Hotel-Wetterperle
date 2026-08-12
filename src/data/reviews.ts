export interface Review {
	author: string;
	rating: number;
	text: string;
}

/**
 * Echte Google-Bewertungen, 1:1 von KD am 12.08.2026 aus Google Maps/Search
 * per Screenshot übernommen (Reihenfolge wie von KD vorgegeben).
 * ⚠️ Rezension 3 (Cryo) ist im Original-Screenshot hinter "... Mehr" gekürzt —
 * Text endet dort, wo Google ihn abgeschnitten hat. Volltext müsste KD aus
 * Google nachliefern, falls gewünscht.
 */
export const reviews: Review[] = [
	{
		author: 'Silke Schmidt',
		rating: 5,
		text: 'Wir haben für eine Nacht ein Familienzimmer gebucht. Ein sehr freundlicher Empfang von den netten Gastgebern. Zimmer perfekt und chic, mit Begrüßungsgetränken. Am Abend haben wir im Restaurant sehr gut gespeist. Das Frühstück bestens mit Bäckerbrötchen und ausreichend Zutaten. Rundum hat alles super gepasst. Eine Perle in der deutschen Gastronomielandschaft. Dankeschön Fam Schmidt',
	},
	{
		author: 'Lutz Hellmund',
		rating: 5,
		text: 'Mit viel Liebe eingerichteter und geführter Gasthof. Für eine Landgasthof außergewöhnlich einfallsreiches Speisenangebot. Super Frühstück mit meinen geliebten Ost-Brötchen. Wir waren auf einer Radtour auf Durchreise. Der Gastgeber hat uns noch vergessene Utensilien hinterher gefahren. Alles Sachen, die man nicht voraussetzend kann, aber doch passieren. Großes Kompliment.',
	},
	{
		// ⚠️ im Screenshot hinter "... Mehr" gekürzt, Text endet hier wie bei Google gezeigt
		author: 'Cryo',
		rating: 5,
		text: 'Wir waren zu fünft im Landgasthof Wetteraperle und haben uns rundum wohlgefühlt. Unser Zimmer war gemütlich und sehr schön eingerichtet, und das Essen im Restaurant war ausgesprochen lecker. Die direkte Umgebung eignet sich außerdem gut zum …',
	},
	{
		author: 'Dieter Oetjengerdes',
		rating: 5,
		text: 'Sehr schönes Hotel in ruhiger Lage. Die Abendkarte und das Frühstück sind absolute Spitzenklasse und lassen keine Wünsche offen. Das gesamte Team ist sehr freundlich und hilfsbereit. Ein perfekter Aufenthalt den man nur empfehlen kann',
	},
	{
		author: 'Jonas Peters',
		rating: 5,
		text: 'Wir hatten einen sehr angenehmen Aufenthalt im Landgasthof - ein herzlicher Empfang, schöne und sehr neu gemachte Zimmer, fantastisches Essen in reichlichen Portionen, ein schöner Garten mit Spielgelegenheiten und Blick auf den Teich. Absolut zu empfehlen!',
	},
	{
		author: 'Sven Otersen',
		rating: 5,
		text: 'Wir waren auf der Durchreise und wurden sehr nett empfangen. Die Gastfreundschaft ist hier einfach von der ersten Sekunde an gesetzt. Wir haben sehr gut gegessen, die Zimmer waren toll, ruhig geschlafen und sehr gut gefrühstückt. Wir kommen gerne wieder und schöne Grüße aus dem LK Cuxhaven 😊',
	},
	{
		author: 'Mandy Moors',
		rating: 5,
		text: 'Was für ein Glücksgriff! Auf unserer Durchreise in Richtung Schweiz sind wir durch Zufall im Landgasthof Wetteraperle gelandet – und wurden rundum begeistert. Schon beim herzlichen Empfang spürt man, dass hier mit Leidenschaft und Liebe zum Detail gearbeitet wird. Die Küche ist ein Genuss: saisonal, frisch und geschmacklich perfekt abgestimmt. Besonders der gebratene Kürbis mit Ziegenkäse war ein echtes Highlight – eine Kombination, die man nicht so schnell vergisst! Auch die Anrichtung der Gerichte ist ein Augenschmaus und das Preis-Leistungs-Verhältnis stimmt einfach. Unser Fazit: Ein Abstecher von der Autobahn, der sich mehr als lohnt. Hier fühlt man sich willkommen und wird kulinarisch verwöhnt – ein Geheimtipp, den wir von Herzen weiterempfehlen!',
	},
	{
		author: 'Lora Ibrom',
		rating: 5,
		text: 'Dieser Landgasthof ist wie sein Name lautet wirklich eine richtige PERLE am Flüsschen WETTERA. Begrüßung von Herzen, Zimmer neu und süß, sogar mit USB-Anschluss zum Handyaufladen. Die Speisekarte ist großartig, das Essen sensationell. Wirklich. Großes Kompliment an den Inhaber. Hatte mich auf Grund der guten Google-Bewertungen entschieden, hier wegen meiner langen Fahrstrecke zwischenzustoppen, zu Anend zu essen und zu übernachten. Eine gute Entscheidung. Viele liebe Grüße an den Inhaber und sein Team.',
	},
	{
		author: 'David von Behr',
		rating: 5,
		text: 'Wir waren schon zum zweiten Mal Gast in der Wetteraperle - leider wieder nur zur Durchreise. Die Zimmer sind geräumig, gemütlich und sehr gut ausgestattet. Das Frühstück ist lecker und vielfältig und der Gastwirt ist einfach super nett und familienfreundlich. Könnte nicht besser sein 👍',
	},
	{
		author: 'Ines Inesb',
		rating: 5,
		text: 'Wir haben in Familie ein super entspanntes Osterwochenende in diesem Gasthaus erlebt. Die Zimmer sind sehr geräumig und geschmackvoll eingerichtet. Es ist alles da, was man braucht. In ruhiger landschaftlich idyllischer Umgebung kann man wunderbar die Seele baumeln lassen. Wir haben uns sofort wohlgefühlt. Der Gastwirt selber ist hier der Koch und es vereinen sich Können, Kreativität und Raffinesse zu einem kulinarischen Erlebnis. Das Frühstück nimmt man in wohliger Atmosphäre zu sich. Es wird am Tisch eingedeckt und dadurch entsteht keine Unruhe durch ständige Buffetgänge. Wir fanden das sehr angenehm. Auch für nette Gespräche sind die Gastleute sehr offen. Einfach sympathisch. Die Umgebung bietet vielfältige Angebote zur Freizeitgestaltung. Wandern, Sehenswürdigkeiten, Wassersport, etc... Wir waren sicher nicht das letzte Mal hier und können diese Unterkunft mit gutem Gewissen weiterempfehlen. Vielen Dank nochmal.',
	},
];
