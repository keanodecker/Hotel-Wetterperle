/*
 * Zweisprachigkeit (Deutsch / Englisch) — EINE Quelle fuer alle sichtbaren Texte.
 *
 * Aufbau:
 *   - `de` ist die Quelle. `en` bekommt den Typ `typeof de`, damit TypeScript
 *     JEDEN fehlenden oder falsch benannten Schluessel sofort meldet. So kann
 *     eine englische Seite nicht stillschweigend auf Deutsch zurueckfallen.
 *   - Die Sprache wird NICHT als Prop durchgereicht, sondern in jeder Komponente
 *     aus `Astro.url` gelesen (`spracheAusPfad`). Markup und Aufbau bleiben damit
 *     fuer beide Sprachen identisch — es gibt nur EINE Fassung jeder Komponente.
 *
 * Neue Texte: immer hier eintragen, nie direkt ins Markup schreiben.
 */

export type Lang = 'de' | 'en';

/*
 * Routen-Tabelle: deutscher Pfad ↔ englischer Pfad.
 * Sie ist die einzige Stelle, an der die englischen Slugs stehen — Navigation,
 * Footer und der Sprachumschalter lesen alle hier.
 */
export const routen: { de: string; en: string }[] = [
	{ de: '/', en: '/en/' },
	{ de: '/restaurant', en: '/en/restaurant' },
	{ de: '/hotel', en: '/en/hotel' },
	{ de: '/feiern', en: '/en/celebrations' },
	{ de: '/ueber-uns', en: '/en/about-us' },
	{ de: '/kontakt', en: '/en/contact' },
	{ de: '/presse', en: '/en/press' },
	{ de: '/datenschutz', en: '/en/privacy' },
];

/** Vergleichsform eines Pfades: ohne abschliessenden Schraegstrich (ausser "/"). */
function normiere(pfad: string): string {
	if (pfad.length > 1 && pfad.endsWith('/')) return pfad.slice(0, -1);
	return pfad;
}

/** Sprache aus der aktuellen URL — alles unter /en/ ist englisch. */
export function spracheAusPfad(url: URL | string): Lang {
	const pfad = typeof url === 'string' ? url : url.pathname;
	return pfad === '/en' || pfad.startsWith('/en/') ? 'en' : 'de';
}

/** Deutschen Routen-Schluessel in die Fassung der gewuenschten Sprache uebersetzen. */
export function pfad(sprache: Lang, deRoute: string): string {
	const eintrag = routen.find((r) => normiere(r.de) === normiere(deRoute));
	if (!eintrag) return deRoute;
	return sprache === 'de' ? eintrag.de : eintrag.en;
}

/** Die Entsprechung der aktuellen Seite in der jeweils anderen Sprache. */
export function gegenstueck(aktuellerPfad: string): string {
	const jetzt = normiere(aktuellerPfad);
	const eintrag = routen.find((r) => normiere(r.de) === jetzt || normiere(r.en) === jetzt);
	if (!eintrag) return spracheAusPfad(aktuellerPfad) === 'de' ? '/en/' : '/';
	return spracheAusPfad(aktuellerPfad) === 'de' ? eintrag.en : eintrag.de;
}

/** Preisangabe je Sprache: "78 €" bzw. "€78". */
export function preis(sprache: Lang, betrag: number): string {
	return sprache === 'de' ? `${betrag} €` : `€${betrag}`;
}

/** Dezimalzahl je Sprache: "4,9" bzw. "4.9". */
export function zahl(sprache: Lang, wert: string): string {
	return sprache === 'de' ? wert : wert.replace(',', '.');
}

const de = {
	sprache: {
		// Beschriftung des Umschalters: zeigt, wohin es geht (nicht, wo man ist).
		wechselZu: 'English',
		wechselAria: 'Switch to English',
	},

	allgemein: {
		logoAlt: 'Landgasthof Wetteraperle',
		tischReservieren: 'Tisch reservieren',
		hotelBuchen: 'Hotel buchen',
		menue: 'Menü',
		mehrErfahren: 'Mehr erfahren →',
		ruhetag: 'Ruhetag',
		oeffnungszeiten: 'Öffnungszeiten',
		kontakt: 'Kontakt',
		navigation: 'Navigation',
		googleBewertung: 'Google-Bewertung',
		googleBewertungen: 'Google-Bewertungen',
	},

	nav: {
		restaurant: 'Restaurant',
		hotel: 'Hotel',
		feiern: 'Feiern',
		ueberUns: 'Über uns',
		kontakt: 'Kontakt',
		presse: 'Presse',
		datenschutz: 'Datenschutz',
	},

	stunden: {
		montag: 'Montag',
		diMi: 'Dienstag & Mittwoch',
		doSa: 'Donnerstag – Samstag',
		sonntag: 'Sonntag',
		abend: '17:00 – 23:00 Uhr',
		mittag: '11:00 – 14:00 Uhr',
		kurz: 'Mo, Do–Sa 17–23 Uhr · So 11–14 & 17–23 Uhr · Di/Mi Ruhetag',
	},

	hero: {
		bildAlt: 'Luftaufnahme des Landgasthofs Wetteraperle im Grünen',
		kicker: 'Landgasthof',
		claim:
			'Gemütlichkeit, Ruhe und Genuss – dafür stehen wir in der Wetteraperle und das geben wir auch an unsere Gäste weiter.',
	},

	werte: {
		von5: '4,9 von 5',
		von10: '9,2 von 10',
		booking: 'Booking.com',
		punkte: [
			{
				titel: 'Nachhaltigkeit',
				text: 'Wir legen besonders Wert auf einen achtsamen Umgang mit Lebensmitteln – mit kurzen Wegen und Respekt vor unserer Natur.',
			},
			{
				titel: 'Regionalität',
				text: 'Fleisch, Kartoffeln und viele weitere Produkte kommen von Händlern aus der Umgebung – wenn möglich direkt vom Erzeuger vor Ort.',
			},
			{
				titel: 'Qualität',
				text: '„Wer gute Produkte verwendet, wird auch ein köstliches Essen zaubern" – genau nach diesem Motto kocht Frank jedes Gericht selbst.',
			},
			{
				titel: 'Gastfreundschaft',
				text: 'Zum perfekten Erlebnis gehören nicht nur gute Speisen, sondern auch freundliche Gastwirte – wir lernen unsere Gäste gern kennen.',
			},
		],
	},

	leistungen: {
		kicker: 'Willkommen',
		titel: 'Dienstleistungen',
		absatz1:
			'Gemütlichkeit, Ruhe und Genuss – dafür stehen wir in der Wetteraperle und das geben wir auch an unsere Gäste weiter. Wir, Frank und Nadine Gröters, wollen die Wetteraperle in einem neuen Glanz erstrahlen lassen und die historischen Zeiten wieder zurück nach Raila bringen.',
		absatz2:
			'In unserer Küche sorgen wir mit Frische, Qualität und Kreativität für neue Erfahrungen im Saale-Orla-Kreis. Lassen Sie sich von unseren Kochkünsten verzaubern. Als Gast in einem unserer Fremdenzimmer verwöhnen wir Sie mit Gelassenheit, einer ruhigen grünen Landidylle und einer einzigartigen Gastfreundschaft.',
		karten: [
			{
				titel: 'Restaurant',
				text: 'Unser Geheimnis sind frische und regionale Produkte. Wir paaren internationale Küche mit heimischen Spezialitäten. Wir wollen Sie mit lokalen und nicht-lokalen Gerichten überraschen.',
			},
			{
				titel: 'Hotel',
				text: 'Unsere Wetteraperle befindet sich inmitten einer idyllischen Landschaft und wir bieten Ihnen Platz für Familien und Paare.',
			},
			{
				titel: 'Feiern',
				text: 'Unser neuer Festsaal bietet Platz für große Feierlichkeiten. Wir übernehmen für Sie die Veranstaltung von Hochzeiten, Jugendweihen, Konfirmationen und Geburtstagen.',
			},
		],
	},

	zeiten: {
		kicker: 'Öffnungszeiten',
		titel: 'Wann Sie uns besuchen können',
		text: 'Wir freuen uns auf Ihren Besuch im Restaurant – Reservierungen sind jederzeit telefonisch oder online möglich.',
		anrufen: 'anrufen',
	},

	geschichte: {
		kicker: 'Über uns',
		titel: 'Das sind wir',
		absatz1:
			'Frank und Nadine Gröters sind seit 2018 die neuen Besitzer des Landgasthofs Wetteraperle.',
		absatz2:
			'Frank ist schon sein ganzes Leben lang leidenschaftlicher Koch und hat mehr als 30 Jahre Erfahrung. Seine Karriere hat ihn von seiner Heimat Berlin über zahlreiche Stationen am Tegernsee bis zu uns ins schöne Thüringen in den beschaulichen Saale-Orla-Kreis gebracht.',
		absatz3:
			'Zusammen mit seiner Frau Nadine hat Frank den alten Charme zurück in die Wetteraperle gebracht.',
		knopf: 'Unsere Geschichte',
		bildAlt: 'Frank und Nadine Gröters',
	},

	partner: {
		kicker: 'Regional verwurzelt',
		titel: 'Unsere Partner & Lieferanten',
		text: 'Frische, Regionalität und faire Zusammenarbeit – diese Betriebe machen unsere Küche erst möglich.',
	},

	bewertungen: {
		kicker: 'Das sagen unsere Gäste',
		titel: 'Bewertungen aus erster Hand',
		vorherige: 'Vorherige Bewertung',
		naechste: 'Nächste Bewertung',
		punkt: (i: number, n: number) => `Bewertung ${i} von ${n} anzeigen`,
	},

	fusszeile: {
		text: 'Gemütlichkeit, Ruhe und Genuss zwischen Feldern und Wäldern des Thüringer Schiefergebirges.',
		rechte: 'Alle Rechte vorbehalten.',
	},

	galerie: {
		fotosAnsehen: (n: number) => `${n} Fotos ansehen`,
		groesser: 'grösser ansehen',
		schliessen: 'Galerie schliessen',
		vorheriges: 'Vorheriges Bild',
		naechstes: 'Nächstes Bild',
		bildVon: (i: number | string, n: number | string) => `Bild ${i} von ${n}`,
	},

	buchung: {
		bisPerson: 'bis 1 Person',
		bisPersonen: (n: number) => `bis ${n} Personen`,
		preisAufAnfrage: 'Preis auf Anfrage',
		proNacht: ' / Nacht',
		ab: 'ab',
		ohneJs:
			'Für die Online-Buchung braucht Ihr Browser JavaScript. Sie erreichen uns auch direkt – wir bestätigen Ihnen Ihr Zimmer persönlich.',

		// Nur auf der WEBSITE (nicht auf Booking.com) ist das Fruehstueck bei
		// jeder Anfrage/Buchung inklusive — deshalb der auffaellige Badge direkt
		// beim Preis (KD 14.08.2026). Kurzform fuer die engen Grid-Karten,
		// Langform (inkl. Kulturfoerderabgabe, KD 14.08.2026 10:46) fuer
		// Zimmer-Detailzeile und Anfrage-Dialog.
		fruehstueckInklusive: 'inkl. Frühstück',
		fruehstueckKultur: 'inkl. Frühstück & Kulturförderabgabe',
		// Personen-Staffel von Familienzimmer und Familien-Suite (rooms.ts:
		// basisPersonen/aufpreisProPerson) — steht ueberall neben dem Preis.
		staffelHinweis: (basis: number, aufpreis: number) =>
			`für ${basis} Personen, jede weitere +${aufpreis} €/Nacht`,

		/*
		 * Buchungs-/Anfrage-Dialog, seit 14.08.2026 12:04 mit ZWEI Modi
		 * (KD: "eigenes Buchungsformular … aber auch die Anfrageoption"):
		 *  · BUCHEN  → /api/zimmer-buchen → echte, VERBINDLICHE Smoobu-Buchung.
		 *    Wording muss unmissverstaendlich verbindlich sein.
		 *  · ANFRAGEN → /api/kontakt (Resend-Mail ans Haus), unverbindlich.
		 * Jeder Zimmerknopf oeffnet den Dialog im jeweiligen Modus, Zimmer
		 * vorausgewaehlt. Der Smoobu-iframe ist raus.
		 */
		knopfBuchen: 'Buchen',
		knopfAnfragen: 'Anfragen',
		buchenTitel: 'Zimmer verbindlich buchen',
		buchenHinweis:
			'Diese Buchung ist verbindlich: Das Zimmer wird sofort für Sie reserviert. Bezahlt wird vor Ort bei der Abreise.',
		buchenAbsenden: 'Verbindlich buchen',
		buchenErfolgTitel: 'Ihr Zimmer ist verbindlich gebucht',
		buchenErfolgText:
			'Vielen Dank! Ihre Buchung ist bestätigt — bezahlt wird vor Ort. Sie erhalten eine Bestätigung per E-Mail.',
		buchenErfolgAuswahl: 'Ihre Buchung:',
		vornameLabel: 'Vorname *',
		nachnameLabel: 'Nachname *',
		modalTitel: 'Unverbindliche Anfrage',
		modalHinweis:
			'Unverbindlich anfragen – wir prüfen die Verfügbarkeit und bestätigen Ihnen Ihr Zimmer persönlich.',
		zimmerLabel: 'Zimmer',
		anreise: 'Anreise',
		abreise: 'Abreise',
		personen: 'Personen',
		nameLabel: 'Ihr Name *',
		emailLabel: 'E-Mail-Adresse *',
		telefonLabel: 'Telefon (optional)',
		nachrichtLabel: 'Nachricht (optional)',
		nachrichtPlatzhalter: 'Zustellbett, Ankunftszeit, Fragen …',
		einwilligung1: 'Ich bin mit der Verarbeitung meiner Angaben laut',
		datenschutzLink: 'Datenschutzerklärung',
		einwilligung2: 'einverstanden. *',
		pflichtfelder: '* Pflichtfelder',
		absenden: 'Unverbindliche Anfrage senden',
		wirdGesendet: 'Wird gesendet …',
		schliessen: 'Schließen',
		nacht: 'Nacht',
		naechte: 'Nächte',
		gast: 'Gast',
		gaeste: 'Gäste',
		gesamt: 'gesamt',
		pflichtHinweis:
			'Bitte füllen Sie Name, E-Mail und Reisedaten aus und bestätigen Sie die Datenschutzhinweise.',
		emailHinweis: 'Bitte prüfen Sie Ihre E-Mail-Adresse – an diese Adresse antworten wir Ihnen.',
		fehler:
			'Die Anfrage konnte gerade nicht verschickt werden. Bitte rufen Sie uns an oder schreiben Sie uns direkt eine E-Mail.',
		keineVerbindung:
			'Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung oder rufen Sie uns an.',
		erfolgTitel: 'Ihre Anfrage ist angekommen',
		erfolgText:
			'Vielen Dank! Wir haben Ihre Buchungsanfrage erhalten und melden uns schnellstmöglich bei Ihnen – unsere Antwort geht an Ihre E-Mail-Adresse.',
		erfolgAuswahl: 'Ihre Anfrage:',
		erfolgSchliessen: 'Fenster schließen',
	},

	start: {
		titel: 'Startseite',
		beschreibung:
			'Landgasthof Wetteraperle in Saalburg-Ebersdorf – Restaurant, Hotelzimmer und Feiern mitten im Thüringer Schiefergebirge.',
	},

	hotelSeite: {
		titel: 'Hotel',
		beschreibung: 'Zimmer und Suiten im Landgasthof Wetteraperle – Fotos, Preise und Buchung.',
		kicker: 'Übernachten',
		ueberschrift: 'Zimmer & Suiten',
		einleitung:
			'Unsere Wetteraperle befindet sich inmitten einer idyllischen Landschaft und wir bieten Ihnen Platz für Familien und Paare.',
		zitat: '„Gastfreundschaft besteht aus ein wenig Wärme, einem guten Essen und viel Ruhe."',
		zitatQuelle: 'Ralph Waldo Emerson',
		buchungKicker: 'Buchung',
		buchungTitel: 'Zimmer buchen',
		buchungText:
			'Alle Zimmer auf einen Blick – Ihre Buchung nehmen wir direkt entgegen, ohne Umweg über ein Buchungsportal. Wenn Sie sich direkt bei uns melden, können wir für Sie das beste Angebot finden.',
		zimmerKicker: 'Unsere Zimmer',
		zimmerTitel: 'Schauen Sie sich in Ruhe um',
		zimmerText:
			'Jedes unserer Zimmer ist anders geschnitten – alte Balken, Dachschrägen und Fachwerk lassen sich nun einmal nicht in eine Norm pressen. Damit Sie vorher genau wissen, worauf Sie sich freuen, finden Sie hier zu jedem Zimmer die Fotos. Auf ein Bild klicken, dann wird es gross.',
		springenAria: 'Zu einem Zimmer springen',
		zimmerBuchen: 'Zimmer buchen',
		zimmerAnfragen: 'Zimmer anfragen',
		fruehstueckKicker: 'Guten Morgen',
		fruehstueckTitel: 'Frühstück',
		fruehstueckText:
			'Für alle unsere Übernachtungsgäste gehört auch ein hausgemachtes Frühstück dazu. Dieses wird für jeden Gast von unserem Chefkoch Frank zubereitet. Darunter finden Sie nicht nur frische Brötchen, sondern auch hausgemachte Marmeladen und Produkte aus der Umgebung. Auch unseren Honig aus eigener Bienenhaltung halten wir für Sie bereit. Wir werden die wichtigste Mahlzeit für einen guten Start in den Tag so angenehm wie möglich gestalten.',
		fruehstueckAlt1: 'Gedeckter Frühstückstisch mit Etagere, frischen Brötchen und Kaffee',
		fruehstueckAlt2: 'Frisch eingeschenkter Orangensaft zum Frühstück',
		gutZuWissen: 'Gut zu wissen',
		rundumsHaus: 'Rund ums Haus',
		infos: [
			{
				titel: 'Ankunft und Abreise',
				text: 'Die Anreise kann zwischen 14:00 und 22:00 Uhr flexibel erfolgen. Nach vorheriger Absprache mit uns sind auch andere Zeiten möglich. Ihre Abreise muss bis 11:00 Uhr erfolgt sein. Ihr Gepäck können Sie nach Absprache mit uns im Landgasthof hinterlassen und später abholen.',
			},
			{
				titel: 'Stornierungsbedingungen',
				text: 'Bis 7 Tage vor Anreise erheben wir keine Gebühren. Danach wird Ihnen die erste Nacht berechnet.',
			},
			{
				titel: 'Zahlungsmethoden',
				text: 'Kreditkarten (Visa, MasterCard, American Express), EC- und Debitkarten sowie Bargeld.',
			},
		],
		galerie: [
			'Modernes Badezimmer mit Dusche und Waschbecken',
			'Frische Handtücher mit süßem Willkommensgruß',
			'Historische Holztreppe im Landgasthof',
			'Gastraum des Landgasthofs am Abend',
		],
	},

	restaurantSeite: {
		titel: 'Restaurant',
		beschreibung:
			'Gehobene gutbürgerliche Küche mit regionalen Produkten im Landgasthof Wetteraperle.',
		kicker: 'Genuss',
		ueberschrift: 'Restaurant',
		einleitung:
			'Unser Geheimnis sind frische und regionale Produkte. Wir paaren internationale Küche mit heimischen Spezialitäten.',
		bildAlt: 'Bar und Gastraum unter dem historischen Ziegelgewölbe',
		konzeptKicker: 'Küchenkonzept',
		konzeptTitel: 'Regionalität und Natürlichkeit',
		konzept1:
			'In der Wetteraperle legen wir besonders Wert auf einen achtsamen Umgang mit Lebensmitteln. Wir beziehen unsere Produkte von Händlern aus der Umgebung und wenn möglich sogar direkt vom Erzeuger vor Ort. So kommen unsere Produkte wie Fleisch, Kartoffeln und andere Lebensmittel direkt aus der Region.',
		konzept2:
			'Wer gute Produkte verwendet, wird auch ein köstliches Essen zaubern und genau nach diesem Motto kochen wir. Gepaart mit einer Prise Erfahrung, Kreativität und Salz bekommen Sie bei uns nur das Beste.',
		schwerpunkte: ['Dessert', 'Grillen', 'Salate', 'Innovationen'],
		haltungKicker: 'Unsere Haltung',
		haltungTitel: 'Philosophie',
		haltungZitat: '„Wir werden das beste Schnitzel und das beste Steak in der Umgebung machen."',
		haltung1:
			'So lautete das Motto vor unserer Neueröffnung der Wetteraperle. Unsere Küche hat aber noch viel mehr zu bieten als diese beiden Argumente. Wir stehen für Nachhaltigkeit, Regionalität, Qualität und Gastfreundschaft.',
		haltung2:
			'Nach über 20 Jahren Gastronomieerfahrung am Tegernsee möchten wir unsere Zeit in der Heimat von Familie und Freunden verbringen. Wir wollen uns hier kulinarisch verwirklichen und nehmen Sie mit auf diese Reise.',
		haltung3:
			'Wir möchten die Geschichte des Hauses fortsetzen und die Einzigartigkeit des Ortes und der Region mit Ihnen teilen.',
		karte1Titel: 'Tradition, Heimatliebe und internationale Küche',
		karte1Text:
			'Sie fragen sich, ob diese drei Aspekte zusammenpassen? Wir zeigen Ihnen, dass sie es tun. Überzeugen Sie sich, dass traditionelle und moderne Gerichte mit saisonalen Produkten in einem neuen Gewand präsentiert werden können. Öffnen Sie sich ein wenig für neue Geschmäcker und lassen Sie sich von unserer Küchenphilosophie überraschen.',
		karte2Titel: 'Gastfreundschaft',
		karte2Text:
			'Zum perfekten Erlebnis in unserem Restaurant gehören nicht nur gute Speisen, sondern auch freundliche Gastwirte. Wir legen besonderen Wert darauf, unsere Gäste kennenzulernen.',
		karte2Zitat: '„Wer den Gast nicht ehrt, ist die Bezahlung nicht wert."',
		impressionen: 'Impressionen',
		biergartenKicker: 'Draußen sitzen',
		biergartenTitel: 'Biergarten am Teich',
		biergartenText:
			'Wir haben in der Wetteraperle für Sie die Gaststube neu eingerichtet und ihren alten Charme wiedergebracht. Außerdem können Sie bei uns im Biergarten Ihr Feierabendbier oder Ihr Frühstück gerne draußen im Freien direkt am Teich genießen.',
		reservierung: 'Reservierung',
		reservierungText1: 'Am einfachsten reservieren Sie online oder telefonisch unter',
		galerie: [
			'Steak mit Rosmarin, Bratkartoffeln und Kräuterbutter',
			'Rote-Bete-Pasta mit Burrata und Rucola',
			'Pfifferlinge auf geröstetem Brot mit Johannisbeeren',
			'Dessert mit zweierlei Sorbet, Schokoladenerde und Minze',
			'Gastraum mit Massivholztischen und Blick zur Bar',
			'Frank am Grill',
		],
	},

	feiernSeite: {
		titel: 'Feiern',
		beschreibung:
			'Hochzeiten, Geburtstage und Familienfeste im Festsaal oder am See – individuell geplant im Landgasthof Wetteraperle.',
		kicker: 'Ihr Anlass, unsere Sorgfalt',
		ueberschrift: 'Feiern im Landgasthof',
		einleitung:
			'Ob Hochzeit, Geburtstag oder Familienfest – wir planen Ihre Feier individuell, mit Herz und Liebe zum Detail.',
		mottoKicker: 'Unser Motto',
		mottoTitel: '"Es gibt nur einen Chef und das ist der Gast"',
		mottoText:
			'Festsaal, Außenbereich am See, Biergarten oder Restaurant – wir finden für jeden Anlass den passenden Rahmen und planen Menü und Dekoration ganz nach Ihren Wünschen.',
		anfragen: 'Event anfragen',
		bildAlt: 'Feier im Landgasthof Wetteraperle',
		anlaesseTitel: 'Für jeden Anlass',
		anlaesse: [
			{
				titel: 'Hochzeiten',
				text: 'Festsaal und Außenbereich direkt am See – für den schönsten Tag zu zweit.',
			},
			{
				titel: 'Geburtstage',
				text: 'Wichtige und runde Geburtstage sollten immer gebührend gefeiert werden.',
			},
			{
				titel: 'Familienfeste',
				text: 'Restaurant, Biergarten oder Festsaal mit individueller Menü- und Dekorationsplanung.',
			},
			{
				titel: 'Jugendweihe & Konfirmation',
				text: 'Spezialisierte Planung für diesen besonderen Lebensabschnitt.',
			},
		],
		momente: 'Echte Momente',
		galerie: [
			'Heller Festsaal mit eingedeckten Tischen an den Fenstern',
			'Gastraum mit Bar – Platz für Gesellschaften',
			'Feier im Garten unter alten Bäumen',
			'Hüpfburg für die kleinen Gäste',
		],
	},

	ueberUnsSeite: {
		titel: 'Über uns',
		beschreibung:
			'Die Geschichte des Landgasthofs Wetteraperle und seiner Inhaber Frank und Nadine Gröters.',
		kicker: 'Unsere Geschichte',
		ueberschrift: 'Über uns',
		einleitung:
			'Vom historischen Mühlengebäude zum familiengeführten Landgasthof – eine Geschichte mit vielen Kapiteln.',
		inhaberKicker: 'Die Inhaber',
		inhaberTitel: 'Frank & Nadine Gröters',
		inhaberText:
			'Nach einer längeren Pause übernahmen Frank und Nadine Gröters die Wetteraperle und wollten dem Gasthof „wieder ihren alten Charme einhauchen und neue Impulse" setzen. Sie bringen Erfahrung aus Berlin und vom Tegernsee mit – Frank ist gelernter Koch mit über 30 Jahren Erfahrung.',
		hausTitel: 'Ein Gebäude mit Geschichte',
		treppeAlt: 'Historische Holztreppe im Landgasthof Wetteraperle',
		zeitstrahl: [
			{ zeit: '19. Jh. – 1945', text: 'Das Gebäude dient als Getreidemühle mit günstiger Flussanbindung.' },
			{ zeit: 'Nach 1945', text: 'Nutzung als landwirtschaftlicher Betrieb (LPG).' },
			{ zeit: 'Ab 1994', text: 'Das Haus wird zum privat geführten Gasthaus.' },
			{ zeit: '2010 – 2019', text: 'Das Gebäude steht nahezu leer.' },
			{
				zeit: 'Seit 2018/19',
				text: 'Frank und Nadine Gröters übernehmen und hauchen der Wetteraperle neuen Charme ein.',
			},
		],
		werteTitel: 'Wofür wir stehen',
		werte: [
			{
				titel: 'Qualität & Handwerk',
				text: 'Frank bereitet alle Speisen selbst zu – mit Fokus auf Steaks, leichte Salate und innovative Kreationen.',
			},
			{
				titel: 'Nachhaltigkeit',
				text: 'Zutaten von lokalen Bauern, Fleisch aus der Umgebung, eigener Honig – immer saisonal gedacht.',
			},
			{
				titel: 'Gastfreundlichkeit',
				text: 'Wanderer, Radfahrer und Einheimische sind gleichermaßen willkommen – inklusive fünf Wohnmobilstellplätzen.',
			},
		],
		umgebungKicker: 'Mitten in der Natur',
		umgebungTitel: 'Ausflugsziele in der Umgebung',
		umgebungText:
			'Das Thüringer Schiefergebirge und seine Umgebung bieten Ausflugsziele für jeden Geschmack – ideal als Ausgangspunkt für Wanderer, Familien und Entdecker.',
		ziele: [
			{
				titel: 'Feengrotten Saalfeld',
				text: 'Das farbenreichste Schauhöhlensystem der Welt – ein unterirdisches Naturwunder ganz in der Nähe.',
			},
			{
				titel: 'Saaleschleife bei Burgk',
				text: 'Einer der schönsten Aussichtspunkte Thüringens, mit Blick auf die geschwungene Saale.',
			},
			{
				titel: 'Freizeitpark Plohn',
				text: 'Wildwasserbahn und Fahrattraktionen für einen actionreichen Familientag.',
			},
		],
	},

	kontaktSeite: {
		titel: 'Kontakt',
		beschreibung:
			'Adresse, Öffnungszeiten und Anfrage – so erreichen Sie den Landgasthof Wetteraperle.',
		kicker: 'Wir freuen uns auf Sie',
		ueberschrift: 'Kontakt',
		einleitung:
			'Haben Sie Fragen oder möchten Sie ein Zimmer oder einen Tisch anfragen? Wir melden uns schnellstmöglich zurück.',
		bildAlt: 'Gemütlich eingedeckter Tisch im Gastraum der Wetteraperle',
		formTitel: 'Anfrage senden',
		name: 'Name',
		email: 'E-Mail',
		anliegen: 'Anliegen',
		/*
		 * Reihenfolge ist Absicht: „Sonstiges" steht vorn und ist damit die
		 * Vorauswahl (KD 12.08.2026). „Tischreservierung" ist bewusst RAUS — dafür
		 * gibt es den eigenen Weg „Tisch reservieren" im Kopf der Seite.
		 * ⚠️ Die Option an INDEX 1 („Zimmer anfragen") blendet die Zimmerfelder
		 * darunter ein (`ZIMMER_ANFRAGE` in KontaktSeite.astro liest genau diesen
		 * Index) — die Reihenfolge muss in beiden Sprachen identisch bleiben.
		 */
		anliegenOptionen: ['Sonstiges', 'Zimmer anfragen', 'Feier / Event'],
		zimmerBlockTitel: 'Ihre Zimmeranfrage',
		/* ⚠️ ANFRAGE, keine Buchung (KD-Rückbau 14.08.2026): Die Angaben gehen als
		   E-Mail ans Haus (/api/kontakt), es wird NICHTS in Smoobu angelegt.
		   Verbindlich gebucht wird nur noch über das Smoobu-Buchungssystem auf /hotel. */
		zimmerBlockHinweis:
			'Ihre Anfrage ist unverbindlich – wir prüfen die Verfügbarkeit und melden uns persönlich bei Ihnen.',
		zimmerartEgal: 'Bitte wählen',
		zimmerart: 'Welches Zimmer?',
		personen: 'Wie viele Personen?',
		telefonFeld: 'Telefon (für Rückfragen)',
		anreise: 'Anreise',
		abreise: 'Abreise',
		nurAnfragen: 'Sie möchten nur etwas fragen? Wählen Sie oben „Sonstiges".',
		nachricht: 'Nachricht',
		einwilligung1: 'Ich habe die',
		datenschutzLink: 'Datenschutzerklärung',
		einwilligung2:
			'zur Kenntnis genommen. Meine Angaben werden ausschließlich zur Bearbeitung meiner Anfrage verwendet.',
		absenden: 'Anfrage senden',
		wirdGesendet: 'Wird gesendet …',
		honeypot: 'Bitte dieses Feld frei lassen',
		erfolg: 'Vielen Dank für Ihre Nachricht.',
		fehler: 'Die Nachricht konnte nicht verschickt werden. Bitte rufen Sie uns an.',
		keineVerbindung:
			'Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung oder rufen Sie uns an.',
		erreichen: 'So erreichen Sie uns',
		adresse: 'Adresse',
		telefon: 'Telefon',
		karteTitel: 'Standort Landgasthof Wetteraperle',
	},

	presseSeite: {
		titel: 'Presse',
		beschreibung: 'Pressematerial, Fakten und Auszeichnungen des Landgasthofs Wetteraperle.',
		kicker: 'Für Medien',
		ueberschrift: 'Presse',
		einleitung:
			'Fakten, Zahlen und Ansprechpartner für Presseanfragen rund um den Landgasthof Wetteraperle.',
		faktenTitel: 'Fakten auf einen Blick',
		fakten: [
			{ label: 'Standort', wert: 'Raila 11, 07929 Saalburg-Ebersdorf, Thüringen' },
			{ label: 'Inhaber', wert: 'Frank & Nadine Gröters, seit 2018/19' },
			{ label: 'Küchenchef', wert: 'Frank Gröters, über 30 Jahre Erfahrung (Berlin, Tegernsee)' },
			{
				label: 'Gebäude',
				wert: 'Ehemalige Getreidemühle, seit dem 19. Jahrhundert am selben Standort',
			},
			{ label: 'Zimmerkategorien', wert: 'Einzel-, Doppel-, Familienzimmer und Familien-Suite' },
			{ label: 'Besonderheiten', wert: 'Biergarten am Teich, Festsaal, 5 Wohnmobilstellplätze' },
		],
		auszeichnungenTitel: 'Auszeichnungen',
		auszeichnungen: [
			{ titel: '4,9 / 5', text: 'Durchschnittliche Google- und RestaurantGuru-Bewertung' },
			{ titel: '#1 Restaurant', text: 'In Saalburg-Ebersdorf laut Tripadvisor' },
			{ titel: '9,2 „Großartig"', text: 'Hotelbewertung auf Kayak, aus über 700 Bewertungen' },
		],
		pressekontakt: 'Pressekontakt',
		pressekontaktText:
			'Für Presseanfragen, Interviewwünsche oder Bildmaterial wenden Sie sich gerne direkt an uns.',
		bildmaterial: 'Bildmaterial',
		bildmaterialText:
			'Ein Presse-Kit mit Logo und Fotomaterial in Druckqualität folgt in Kürze.',
		presseKit: 'Presse-Kit (bald verfügbar)',
	},

	datenschutzSeite: {
		titel: 'Datenschutz',
		beschreibung: 'Datenschutzerklärung des Landgasthofs Wetteraperle.',
		kicker: 'Rechtliches',
		ueberschrift: 'Datenschutzerklärung',
		verantwortlichTitel: '1. Verantwortlicher',
		verantwortlichText: 'Verantwortlich für die Datenverarbeitung auf dieser Website ist:',
		abschnitte: [
			{
				titel: '2. Allgemeines zur Datenverarbeitung',
				text: 'Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung der Nutzer oder auf Grundlage einer gesetzlichen Erlaubnis.',
			},
			{
				titel: '3. Server-Logfiles',
				text: 'Beim Aufruf dieser Website erhebt unser Hosting-Anbieter automatisch Informationen in sogenannten Server-Logfiles, die Ihr Browser übermittelt (z. B. Browsertyp, verwendetes Betriebssystem, Referrer-URL, Datum und Uhrzeit der Anfrage, IP-Adresse). Diese Daten sind nicht bestimmten Personen zuordenbar und werden nicht mit anderen Datenquellen zusammengeführt.',
			},
			{
				titel: '4. Kontakt- und Anfrageformular',
				text: 'Wenn Sie uns per Formular oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.',
			},
		],
		mapsTitel: '5. Google Maps',
		mapsText1:
			'Auf unserer Kontaktseite binden wir Kartenmaterial des Dienstes „Google Maps" der Google Ireland Limited ein. Bei Aufruf der Kontaktseite kann Google Informationen, einschließlich Ihrer IP-Adresse, an Server in den USA übertragen. Weitere Informationen entnehmen Sie der Datenschutzerklärung von Google unter',
		abschnitte2: [
			{
				titel: '6. Google Fonts',
				text: 'Diese Website nutzt zur einheitlichen Darstellung von Schriftarten „Google Fonts", einen Dienst der Google Ireland Limited. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Schriftarten direkt von den Servern Googles, wobei eine Verbindung zu Google-Servern hergestellt und dabei Ihre IP-Adresse übermittelt wird.',
			},
			{
				titel: '7. Cookies',
				text: 'Diese Website verwendet aktuell keine Analyse- oder Marketing-Cookies. Sollte sich dies ändern, informieren wir Sie an dieser Stelle und holen, soweit erforderlich, Ihre Einwilligung ein.',
			},
			{
				titel: '8. Ihre Rechte',
				text: 'Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten sowie ein Recht auf Berichtigung, Sperrung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Zudem steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten wenden Sie sich bitte an die oben genannten Kontaktdaten.',
			},
			{
				titel: '9. SSL-/TLS-Verschlüsselung',
				text: 'Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung.',
			},
			{
				titel: '10. Änderung dieser Datenschutzerklärung',
				text: 'Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht. Es gilt die jeweils aktuelle, auf dieser Seite veröffentlichte Fassung.',
			},
		],
	},
};

const en: typeof de = {
	sprache: {
		wechselZu: 'Deutsch',
		wechselAria: 'Zur deutschen Fassung wechseln',
	},

	allgemein: {
		logoAlt: 'Landgasthof Wetteraperle country inn',
		tischReservieren: 'Reserve a table',
		hotelBuchen: 'Book a room',
		menue: 'Menu',
		mehrErfahren: 'Find out more →',
		ruhetag: 'Closed',
		oeffnungszeiten: 'Opening hours',
		kontakt: 'Contact',
		navigation: 'Navigation',
		googleBewertung: 'Google review',
		googleBewertungen: 'Google reviews',
	},

	nav: {
		restaurant: 'Restaurant',
		hotel: 'Hotel',
		feiern: 'Celebrations',
		ueberUns: 'About us',
		kontakt: 'Contact',
		presse: 'Press',
		datenschutz: 'Privacy',
	},

	stunden: {
		montag: 'Monday',
		diMi: 'Tuesday & Wednesday',
		doSa: 'Thursday – Saturday',
		sonntag: 'Sunday',
		abend: '5 pm – 11 pm',
		mittag: '11 am – 2 pm',
		kurz: 'Mon, Thu–Sat 5–11 pm · Sun 11 am–2 pm & 5–11 pm · Closed Tue/Wed',
	},

	hero: {
		bildAlt: 'Aerial view of the Landgasthof Wetteraperle surrounded by green countryside',
		kicker: 'Country Inn',
		claim:
			'Comfort, quiet and good food – that is what we stand for at the Wetteraperle, and it is what we pass on to our guests.',
	},

	werte: {
		von5: '4.9 out of 5',
		von10: '9.2 out of 10',
		booking: 'Booking.com',
		punkte: [
			{
				titel: 'Sustainability',
				text: 'We take great care in how we handle our ingredients – short distances and respect for the nature around us.',
			},
			{
				titel: 'Regional sourcing',
				text: 'Meat, potatoes and many other products come from suppliers nearby – wherever possible straight from the local producer.',
			},
			{
				titel: 'Quality',
				text: '“Use good ingredients and you will conjure up a delicious meal” – Frank cooks every dish himself, exactly by that motto.',
			},
			{
				titel: 'Hospitality',
				text: 'A perfect evening takes more than good food; it takes welcoming hosts – and we genuinely enjoy getting to know our guests.',
			},
		],
	},

	leistungen: {
		kicker: 'Welcome',
		titel: 'What we offer',
		absatz1:
			'Comfort, quiet and good food – that is what we stand for at the Wetteraperle, and it is what we pass on to our guests. We, Frank and Nadine Gröters, want to bring the Wetteraperle back to its old glory and return a little of that history to Raila.',
		absatz2:
			'In our kitchen, freshness, quality and creativity make for new experiences in the Saale-Orla district. Let our cooking work its magic on you. As a guest in one of our rooms, we spoil you with a slower pace, a quiet green landscape and hospitality you will remember.',
		karten: [
			{
				titel: 'Restaurant',
				text: 'Our secret is fresh, regional produce. We pair international cuisine with local specialities and love to surprise you with dishes from near and far.',
			},
			{
				titel: 'Hotel',
				text: 'Our Wetteraperle sits in the middle of an idyllic landscape, with room for families and couples alike.',
			},
			{
				titel: 'Celebrations',
				text: 'Our new function hall has space for large celebrations. We host weddings, coming-of-age ceremonies, confirmations and birthdays for you.',
			},
		],
	},

	zeiten: {
		kicker: 'Opening hours',
		titel: 'When you can visit us',
		text: 'We look forward to welcoming you to the restaurant – you can reserve by phone or online at any time.',
		anrufen: 'call us',
	},

	geschichte: {
		kicker: 'About us',
		titel: 'This is us',
		absatz1:
			'Frank and Nadine Gröters have been the new owners of the Landgasthof Wetteraperle since 2018.',
		absatz2:
			'Frank has been a passionate cook all his life and brings more than 30 years of experience. His career took him from his native Berlin through many kitchens around Lake Tegernsee and finally here, to beautiful Thuringia and the peaceful Saale-Orla district.',
		absatz3:
			'Together with his wife Nadine, Frank has brought the old charm back to the Wetteraperle.',
		knopf: 'Our story',
		bildAlt: 'Frank and Nadine Gröters',
	},

	partner: {
		kicker: 'Rooted in the region',
		titel: 'Our partners & suppliers',
		text: 'Freshness, regional sourcing and fair cooperation – these are the businesses that make our kitchen possible.',
	},

	bewertungen: {
		kicker: 'What our guests say',
		titel: 'Reviews first-hand',
		vorherige: 'Previous review',
		naechste: 'Next review',
		punkt: (i: number, n: number) => `Show review ${i} of ${n}`,
	},

	fusszeile: {
		text: 'Comfort, quiet and good food between the fields and forests of the Thuringian Slate Mountains.',
		rechte: 'All rights reserved.',
	},

	galerie: {
		fotosAnsehen: (n: number) => `View ${n} photos`,
		groesser: 'view larger',
		schliessen: 'Close gallery',
		vorheriges: 'Previous image',
		naechstes: 'Next image',
		bildVon: (i: number | string, n: number | string) => `Image ${i} of ${n}`,
	},

	buchung: {
		bisPerson: 'up to 1 guest',
		bisPersonen: (n: number) => `up to ${n} guests`,
		preisAufAnfrage: 'Price on request',
		proNacht: ' / night',
		ab: 'from',
		ohneJs:
			'Online booking needs JavaScript in your browser. You can also reach us directly – we will confirm your room personally.',

		fruehstueckInklusive: 'incl. breakfast',
		fruehstueckKultur: 'incl. breakfast & city tax',
		staffelHinweis: (basis: number, aufpreis: number) =>
			`for ${basis} guests, each additional +€${aufpreis}/night`,

		knopfBuchen: 'Book',
		knopfAnfragen: 'Enquire',
		buchenTitel: 'Book this room (binding)',
		buchenHinweis:
			'This booking is binding: the room is reserved for you immediately. Payment is made on site at departure.',
		buchenAbsenden: 'Book bindingly',
		buchenErfolgTitel: 'Your room is booked',
		buchenErfolgText:
			'Thank you! Your booking is confirmed — payment is made on site. You will receive a confirmation by email.',
		buchenErfolgAuswahl: 'Your booking:',
		vornameLabel: 'First name *',
		nachnameLabel: 'Last name *',
		modalTitel: 'Non-binding enquiry',
		modalHinweis:
			'A non-binding request – we check availability and confirm your room personally.',
		zimmerLabel: 'Room',
		anreise: 'Arrival',
		abreise: 'Departure',
		personen: 'Guests',
		nameLabel: 'Your name *',
		emailLabel: 'Email address *',
		telefonLabel: 'Phone (optional)',
		nachrichtLabel: 'Message (optional)',
		nachrichtPlatzhalter: 'Extra bed, arrival time, questions …',
		einwilligung1: 'I agree to the processing of my details as described in the',
		datenschutzLink: 'privacy policy',
		einwilligung2: '. *',
		pflichtfelder: '* Required fields',
		absenden: 'Send non-binding enquiry',
		wirdGesendet: 'Sending …',
		schliessen: 'Close',
		nacht: 'night',
		naechte: 'nights',
		gast: 'guest',
		gaeste: 'guests',
		gesamt: 'in total',
		pflichtHinweis:
			'Please fill in your name, email address and travel dates and confirm the privacy notice.',
		emailHinweis: 'Please check your email address – this is where our reply will go.',
		fehler:
			'Your request could not be sent just now. Please call us or write to us directly by email.',
		keineVerbindung:
			'No connection to the server. Please check your internet connection or give us a call.',
		erfolgTitel: 'Your request has arrived',
		erfolgText:
			'Thank you! We have received your booking request and will get back to you as soon as possible – our reply will go to your email address.',
		erfolgAuswahl: 'Your request:',
		erfolgSchliessen: 'Close window',
	},

	start: {
		titel: 'Home',
		beschreibung:
			'Landgasthof Wetteraperle in Saalburg-Ebersdorf – restaurant, hotel rooms and celebrations in the heart of the Thuringian Slate Mountains.',
	},

	hotelSeite: {
		titel: 'Hotel',
		beschreibung:
			'Rooms and suites at the Landgasthof Wetteraperle – photos, rates and booking.',
		kicker: 'Stay with us',
		ueberschrift: 'Rooms & suites',
		einleitung:
			'Our Wetteraperle sits in the middle of an idyllic landscape, with room for families and couples alike.',
		zitat: '“Hospitality is a little warmth, a good meal and a great deal of peace and quiet.”',
		zitatQuelle: 'Ralph Waldo Emerson',
		buchungKicker: 'Booking',
		buchungTitel: 'Book a room',
		buchungText:
			'All our rooms at a glance – we take your booking directly, with no detour via a booking portal. Come to us first and we can find you the best offer.',
		zimmerKicker: 'Our rooms',
		zimmerTitel: 'Take your time and look around',
		zimmerText:
			'Every one of our rooms has its own shape – old beams, sloping ceilings and half-timbering simply cannot be pressed into a standard mould. So that you know exactly what to look forward to, you will find photos of every room here. Click an image to see it large.',
		springenAria: 'Jump to a room',
		zimmerBuchen: 'Book this room',
		zimmerAnfragen: 'Enquire about this room',
		fruehstueckKicker: 'Good morning',
		fruehstueckTitel: 'Breakfast',
		fruehstueckText:
			'A home-made breakfast is part of every overnight stay with us, prepared for each guest by our head chef Frank. You will find not only fresh bread rolls, but also home-made jams and produce from the surrounding area. Our own honey, straight from our beehives, is waiting for you too. We do everything we can to make the most important meal of the day as pleasant as possible.',
		fruehstueckAlt1: 'Laid breakfast table with a tiered stand, fresh bread rolls and coffee',
		fruehstueckAlt2: 'Freshly poured orange juice at breakfast',
		gutZuWissen: 'Good to know',
		rundumsHaus: 'Around the house',
		infos: [
			{
				titel: 'Arrival and departure',
				text: 'You can arrive any time between 2 pm and 10 pm. Other times are possible if arranged with us in advance. Departure is by 11 am. If you like, you can leave your luggage at the inn by arrangement and collect it later.',
			},
			{
				titel: 'Cancellation terms',
				text: 'Up to 7 days before arrival we charge no fee. After that, the first night will be invoiced.',
			},
			{
				titel: 'Payment methods',
				text: 'Credit cards (Visa, MasterCard, American Express), debit and EC cards, and cash.',
			},
		],
		galerie: [
			'Modern bathroom with shower and washbasin',
			'Fresh towels with a sweet welcome greeting',
			'Historic wooden staircase inside the inn',
			'The dining room of the inn in the evening',
		],
	},

	restaurantSeite: {
		titel: 'Restaurant',
		beschreibung:
			'Refined country cooking with regional produce at the Landgasthof Wetteraperle.',
		kicker: 'Good food',
		ueberschrift: 'Restaurant',
		einleitung:
			'Our secret is fresh, regional produce. We pair international cuisine with local specialities.',
		bildAlt: 'Bar and dining room beneath the historic brick vaulting',
		konzeptKicker: 'Our approach to cooking',
		konzeptTitel: 'Regional and natural',
		konzept1:
			'At the Wetteraperle we take great care in how we handle our ingredients. We buy from suppliers in the area and, wherever possible, straight from the local producer. That is how our meat, potatoes and other ingredients come directly from the region.',
		konzept2:
			'Use good ingredients and you will conjure up a delicious meal – that is exactly how we cook. Add a pinch of experience, creativity and salt, and you get nothing but the best from us.',
		schwerpunkte: ['Desserts', 'Grill', 'Salads', 'New creations'],
		haltungKicker: 'What we believe in',
		haltungTitel: 'Philosophy',
		haltungZitat: '“We will make the best schnitzel and the best steak in the area.”',
		haltung1:
			'That was our motto before we reopened the Wetteraperle. But our kitchen has far more to offer than those two arguments. We stand for sustainability, regional sourcing, quality and hospitality.',
		haltung2:
			'After more than 20 years in hospitality around Lake Tegernsee, we wanted to spend our time back home, among family and friends. Here we want to realise our culinary ideas – and we are taking you along on that journey.',
		haltung3:
			'We want to continue the story of this house and share the character of this place and this region with you.',
		karte1Titel: 'Tradition, love of home and international cuisine',
		karte1Text:
			'Wondering whether those three go together? We will show you that they do. See for yourself how traditional and modern dishes made with seasonal produce can be presented in a whole new light. Open up to a few new flavours and let our kitchen surprise you.',
		karte2Titel: 'Hospitality',
		karte2Text:
			'A perfect evening in our restaurant takes more than good food; it takes welcoming hosts. Getting to know our guests matters a great deal to us.',
		karte2Zitat: '“Whoever does not honour the guest is not worth the payment.”',
		impressionen: 'Impressions',
		biergartenKicker: 'Sitting outside',
		biergartenTitel: 'Beer garden by the pond',
		biergartenText:
			'We have refurbished the parlour at the Wetteraperle and brought back its old charm. And in our beer garden you are welcome to enjoy your after-work beer or your breakfast outside, right by the pond.',
		reservierung: 'Reservations',
		reservierungText1: 'The easiest way to reserve is online or by phone on',
		galerie: [
			'Steak with rosemary, fried potatoes and herb butter',
			'Beetroot pasta with burrata and rocket',
			'Chanterelles on toasted bread with redcurrants',
			'Dessert with two kinds of sorbet, chocolate soil and mint',
			'Dining room with solid wood tables and a view of the bar',
			'Frank at the grill',
		],
	},

	feiernSeite: {
		titel: 'Celebrations',
		beschreibung:
			'Weddings, birthdays and family celebrations in the function hall or by the lake – individually planned at the Landgasthof Wetteraperle.',
		kicker: 'Your occasion, our care',
		ueberschrift: 'Celebrations at the inn',
		einleitung:
			'Whether it is a wedding, a birthday or a family celebration – we plan your event individually, with heart and an eye for detail.',
		mottoKicker: 'Our motto',
		mottoTitel: '"There is only one boss, and that is the guest"',
		mottoText:
			'Function hall, the outdoor area by the lake, beer garden or restaurant – we find the right setting for every occasion and plan the menu and decoration entirely as you wish.',
		anfragen: 'Enquire about your event',
		bildAlt: 'A celebration at the Landgasthof Wetteraperle',
		anlaesseTitel: 'For every occasion',
		anlaesse: [
			{
				titel: 'Weddings',
				text: 'Function hall and outdoor area right by the lake – for the most beautiful day of your life together.',
			},
			{
				titel: 'Birthdays',
				text: 'Big birthdays and milestone years should always be celebrated properly.',
			},
			{
				titel: 'Family celebrations',
				text: 'Restaurant, beer garden or function hall, with menu and decoration planned individually.',
			},
			{
				titel: 'Coming-of-age & confirmation',
				text: 'Dedicated planning for this special stage of life.',
			},
		],
		momente: 'Real moments',
		galerie: [
			'Bright function hall with laid tables along the windows',
			'Dining room with bar – space for larger parties',
			'A celebration in the garden beneath old trees',
			'Bouncy castle for our youngest guests',
		],
	},

	ueberUnsSeite: {
		titel: 'About us',
		beschreibung:
			'The story of the Landgasthof Wetteraperle and its owners Frank and Nadine Gröters.',
		kicker: 'Our story',
		ueberschrift: 'About us',
		einleitung:
			'From a historic mill building to a family-run country inn – a story with many chapters.',
		inhaberKicker: 'The owners',
		inhaberTitel: 'Frank & Nadine Gröters',
		inhaberText:
			'After a long pause, Frank and Nadine Gröters took over the Wetteraperle, wanting to “breathe its old charm back into the inn and set new impulses”. They bring experience from Berlin and Lake Tegernsee – Frank is a trained chef with more than 30 years behind the stove.',
		hausTitel: 'A building with a history',
		treppeAlt: 'Historic wooden staircase at the Landgasthof Wetteraperle',
		zeitstrahl: [
			{
				zeit: '19th c. – 1945',
				text: 'The building serves as a grain mill, well placed on the river.',
			},
			{ zeit: 'After 1945', text: 'Used as an agricultural cooperative farm (LPG).' },
			{ zeit: 'From 1994', text: 'The house becomes a privately run guest house.' },
			{ zeit: '2010 – 2019', text: 'The building stands almost empty.' },
			{
				zeit: 'Since 2018/19',
				text: 'Frank and Nadine Gröters take over and breathe new charm into the Wetteraperle.',
			},
		],
		werteTitel: 'What we stand for',
		werte: [
			{
				titel: 'Quality & craft',
				text: 'Frank prepares every dish himself – with a focus on steaks, light salads and inventive creations.',
			},
			{
				titel: 'Sustainability',
				text: 'Ingredients from local farmers, meat from the surrounding area, our own honey – always thought through seasonally.',
			},
			{
				titel: 'Hospitality',
				text: 'Hikers, cyclists and locals are equally welcome – including five pitches for camper vans.',
			},
		],
		umgebungKicker: 'Surrounded by nature',
		umgebungTitel: 'Places to visit nearby',
		umgebungText:
			'The Thuringian Slate Mountains and the surrounding countryside offer something for every taste – an ideal base for hikers, families and explorers.',
		ziele: [
			{
				titel: 'Saalfeld Fairy Grottoes',
				text: 'The most colourful show cave system in the world – an underground natural wonder just around the corner.',
			},
			{
				titel: 'Saale loop near Burgk',
				text: 'One of the finest viewpoints in Thuringia, looking out over the winding river Saale.',
			},
			{
				titel: 'Plohn amusement park',
				text: 'A log flume and plenty of rides for an action-packed family day out.',
			},
		],
	},

	kontaktSeite: {
		titel: 'Contact',
		beschreibung:
			'Address, opening hours and enquiries – how to reach the Landgasthof Wetteraperle.',
		kicker: 'We look forward to hearing from you',
		ueberschrift: 'Contact',
		einleitung:
			'Do you have a question, or would you like to enquire about a room or a table? We will get back to you as quickly as we can.',
		bildAlt: 'A cosily laid table in the dining room of the Wetteraperle',
		formTitel: 'Send an enquiry',
		name: 'Name',
		email: 'Email',
		anliegen: 'Your enquiry',
		/* Siehe den deutschen Block: „Something else" ist die Vorauswahl, „Table
		   reservation" ist entfernt. Reihenfolge muss zur deutschen passen, weil die
		   Zimmerfelder am INDEX 1 hängen. */
		anliegenOptionen: ['Something else', 'Room enquiry', 'Celebration / event'],
		zimmerBlockTitel: 'Your room enquiry',
		zimmerBlockHinweis:
			'Your enquiry is non-binding – we check availability and get back to you personally.',
		zimmerartEgal: 'Please choose',
		zimmerart: 'Which room?',
		personen: 'How many guests?',
		telefonFeld: 'Phone (for queries)',
		anreise: 'Arrival',
		abreise: 'Departure',
		nurAnfragen: 'Just want to ask something? Choose “Something else” above.',
		nachricht: 'Message',
		einwilligung1: 'I have read the',
		datenschutzLink: 'privacy policy',
		einwilligung2: '. My details will be used solely to process my enquiry.',
		absenden: 'Send enquiry',
		wirdGesendet: 'Sending …',
		honeypot: 'Please leave this field empty',
		erfolg: 'Thank you very much for your message.',
		fehler: 'Your message could not be sent. Please give us a call.',
		keineVerbindung:
			'No connection to the server. Please check your internet connection or give us a call.',
		erreichen: 'How to reach us',
		adresse: 'Address',
		telefon: 'Phone',
		karteTitel: 'Location of the Landgasthof Wetteraperle',
	},

	presseSeite: {
		titel: 'Press',
		beschreibung: 'Press material, facts and awards for the Landgasthof Wetteraperle.',
		kicker: 'For media',
		ueberschrift: 'Press',
		einleitung:
			'Facts, figures and contacts for press enquiries about the Landgasthof Wetteraperle.',
		faktenTitel: 'Facts at a glance',
		fakten: [
			{ label: 'Location', wert: 'Raila 11, 07929 Saalburg-Ebersdorf, Thuringia' },
			{ label: 'Owners', wert: 'Frank & Nadine Gröters, since 2018/19' },
			{
				label: 'Head chef',
				wert: 'Frank Gröters, more than 30 years of experience (Berlin, Lake Tegernsee)',
			},
			{
				label: 'Building',
				wert: 'A former grain mill, on the same site since the 19th century',
			},
			{ label: 'Room categories', wert: 'Single, double and family rooms, plus a family suite' },
			{
				label: 'Special features',
				wert: 'Beer garden by the pond, function hall, 5 camper van pitches',
			},
		],
		auszeichnungenTitel: 'Awards',
		auszeichnungen: [
			{ titel: '4.9 / 5', text: 'Average rating on Google and RestaurantGuru' },
			{ titel: '#1 restaurant', text: 'In Saalburg-Ebersdorf according to Tripadvisor' },
			{ titel: '9.2 “Wonderful”', text: 'Hotel rating on Kayak, from over 700 reviews' },
		],
		pressekontakt: 'Press contact',
		pressekontaktText:
			'For press enquiries, interview requests or image material, please get in touch with us directly.',
		bildmaterial: 'Image material',
		bildmaterialText:
			'A press kit with our logo and print-quality photos will follow shortly.',
		presseKit: 'Press kit (coming soon)',
	},

	datenschutzSeite: {
		titel: 'Privacy',
		beschreibung: 'Privacy policy of the Landgasthof Wetteraperle.',
		kicker: 'Legal',
		ueberschrift: 'Privacy policy',
		verantwortlichTitel: '1. Controller',
		verantwortlichText: 'The controller responsible for data processing on this website is:',
		abschnitte: [
			{
				titel: '2. General information on data processing',
				text: 'As a rule, we process our users’ personal data only to the extent necessary to provide a functioning website along with our content and services. Personal data is generally processed only with the user’s consent or on the basis of a statutory permission.',
			},
			{
				titel: '3. Server log files',
				text: 'When you visit this website, our hosting provider automatically collects information in what are known as server log files, which your browser transmits (e.g. browser type, operating system used, referrer URL, date and time of the request, IP address). This data cannot be assigned to specific individuals and is not merged with other data sources.',
			},
			{
				titel: '4. Contact and enquiry form',
				text: 'If you send us enquiries via the form or by email, the details you provide in the enquiry form, including the contact data you enter there, will be stored by us in order to process the enquiry and in case of follow-up questions. We do not pass this data on without your consent.',
			},
		],
		mapsTitel: '5. Google Maps',
		mapsText1:
			'On our contact page we embed map material from the “Google Maps” service provided by Google Ireland Limited. When you open the contact page, Google may transmit information, including your IP address, to servers in the USA. For further information please see Google’s privacy policy at',
		abschnitte2: [
			{
				titel: '6. Google Fonts',
				text: 'To display fonts consistently, this website uses “Google Fonts”, a service provided by Google Ireland Limited. When you open a page, your browser loads the required fonts directly from Google’s servers, establishing a connection to Google servers and transmitting your IP address in the process.',
			},
			{
				titel: '7. Cookies',
				text: 'This website currently uses no analytics or marketing cookies. Should this change, we will inform you here and, where required, obtain your consent.',
			},
			{
				titel: '8. Your rights',
				text: 'You have the right at any time to obtain information free of charge about the personal data we hold about you, as well as the right to rectification, blocking, erasure, restriction of processing, data portability and objection. You also have the right to lodge a complaint with the competent supervisory authority. If you have questions about the collection, processing or use of your personal data, please contact us using the details given above.',
			},
			{
				titel: '9. SSL/TLS encryption',
				text: 'For security reasons and to protect the transmission of confidential content, this site uses SSL or TLS encryption.',
			},
			{
				titel: '10. Changes to this privacy policy',
				text: 'We reserve the right to adapt this privacy policy so that it always complies with current legal requirements. The version published on this page at the time applies.',
			},
		],
	},
};

const woerterbuch: Record<Lang, typeof de> = { de, en };

/** Alle Texte der gewuenschten Sprache. */
export function texte(sprache: Lang): typeof de {
	return woerterbuch[sprache];
}

/** Kurzform fuer Komponenten: `const t = ausUrl(Astro.url);` */
export function ausUrl(url: URL | string) {
	const sprache = spracheAusPfad(url);
	return { sprache, t: woerterbuch[sprache] };
}
