/*
 * Gemeinsame Galerie-Lightbox fuer ALLE Bildergalerien der Seite —
 * ZimmerGalerie (Hotelseite) UND PhotoGrid (Rund ums Haus, Restaurant- und
 * Feiern-Impressionen). Herausgezogen aus ZimmerGalerie.astro am 14.08.2026
 * (KD: "Macht es ne schöne Ansicht, dass wenn ich draufklick das Bild angucken
 * kann und dann ganz schön durch swipen kann") — vorher hatte nur die
 * Zimmergalerie eine Lightbox, die PhotoGrid-Bilder reagierten gar nicht auf
 * Klicks, und Touch-Swipe fehlte ueberall.
 *
 * Erwartetes Markup (baut die jeweilige .astro-Komponente):
 *   <div data-galerie data-texte='{"schliessen":…,"vorheriges":…,"naechstes":…,"bildVon":"Bild {i} von {n}"}'>
 *     <button data-galerie-bild data-index="0" data-voll="/pfad/gross.webp">
 *       <img alt="…"> …
 *
 * Technik: natives <dialog> + showModal() — Top-Layer (liegt immer ueber der
 * sticky Kopfzeile), ESC schliesst nativ, die Seite dahinter ist inert.
 * Erst beim ersten Klick wird der Dialog in den DOM gehaengt; die grossen
 * Bildfassungen (getImage, 1600 px WebP) laedt der Browser erst beim Ansehen.
 * KEINE Abhaengigkeit — bewusst von Hand, wie der Rest der Seite.
 */

interface Eintrag {
	voll: string;
	alt: string;
}

interface Bedientexte {
	schliessen: string;
	vorheriges: string;
	naechstes: string;
	bildVon: string;
}

/*
 * Beschriftungen kommen aus dem data-Attribut der ersten Galerie (dort in der
 * Sprache der Seite hinterlegt — pro Seite gibt es nur eine Sprache). Faellt
 * das aus, bleibt die deutsche Fassung: eine Lightbox ohne Beschriftung waere
 * schlechter als eine mit der falschen Sprache.
 */
const ersteGalerie = document.querySelector<HTMLElement>('[data-galerie]');
let texte: Bedientexte = {
	schliessen: 'Galerie schliessen',
	vorheriges: 'Vorheriges Bild',
	naechstes: 'Nächstes Bild',
	bildVon: 'Bild {i} von {n}',
};
try {
	if (ersteGalerie?.dataset.texte) texte = JSON.parse(ersteGalerie.dataset.texte);
} catch {
	/* Standardtexte behalten */
}

let dialog: HTMLDialogElement | null = null;
let bildEl: HTMLImageElement | null = null;
let textEl: HTMLParagraphElement | null = null;
let zaehlerEl: HTMLSpanElement | null = null;
let aktuelleListe: Eintrag[] = [];
let aktuellerIndex = 0;
let vorherFokus: HTMLElement | null = null;

function baueDialog() {
	dialog = document.createElement('dialog');
	// Der Dialog IST die dunkle Flaeche (statt eines Backdrops): volle Groesse,
	// Inhalt zentriert — ein Klick auf die freie Flaeche trifft dann den Dialog
	// selbst und schliesst (die figure und die Knoepfe fangen ihre Klicks ab).
	dialog.className =
		'm-0 flex h-full max-h-none w-full max-w-none items-center justify-center bg-ink-900/95 p-4 sm:p-8';
	dialog.innerHTML = `
		<button type="button" data-schliessen aria-label="${texte.schliessen}"
			class="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream-50/10 text-2xl leading-none text-cream-50 transition hover:bg-cream-50/25">&times;</button>
		<button type="button" data-zurueck aria-label="${texte.vorheriges}"
			class="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/10 text-2xl leading-none text-cream-50 transition hover:bg-cream-50/25 sm:left-6">&#8249;</button>
		<button type="button" data-weiter aria-label="${texte.naechstes}"
			class="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/10 text-2xl leading-none text-cream-50 transition hover:bg-cream-50/25 sm:right-6">&#8250;</button>
		<figure class="flex max-h-full w-full max-w-5xl select-none flex-col items-center gap-3 touch-pan-y" data-swipe-flaeche>
			<img data-lightbox-bild alt="" draggable="false" class="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain" />
			<figcaption class="text-center text-sm text-cream-100/75">
				<p data-lightbox-text></p>
				<span data-lightbox-zaehler class="mt-1 block text-xs text-cream-100/50"></span>
			</figcaption>
		</figure>
	`;
	document.body.appendChild(dialog);

	bildEl = dialog.querySelector('[data-lightbox-bild]');
	textEl = dialog.querySelector('[data-lightbox-text]');
	zaehlerEl = dialog.querySelector('[data-lightbox-zaehler]');

	dialog.querySelector('[data-schliessen]')?.addEventListener('click', () => dialog?.close());
	dialog.querySelector('[data-zurueck]')?.addEventListener('click', () => blaettern(-1));
	dialog.querySelector('[data-weiter]')?.addEventListener('click', () => blaettern(1));
	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) dialog?.close();
	});

	// Pfeiltasten. ESC uebernimmt der Dialog selbst (cancel → close).
	dialog.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft') blaettern(-1);
		if (event.key === 'ArrowRight') blaettern(1);
	});

	// Aufraeumen bei JEDEM Schliessen-Weg (X, ESC, Hintergrund-Klick).
	dialog.addEventListener('close', () => {
		document.body.style.overflow = '';
		if (bildEl) bildEl.src = '';
		vorherFokus?.focus();
	});

	/*
	 * Touch-/Maus-Swipe (KD 14.08.2026: "ganz schön durch swipen"): Pointer
	 * Events decken Finger UND Maus ab. `touch-pan-y` an der figure laesst
	 * vertikales Scrollen dem Browser und gibt uns die horizontale Geste.
	 * Schwelle 40 px, und horizontal muss dominieren — sonst blaettert ein
	 * schraeger Scroll-Wisch versehentlich.
	 */
	const flaeche = dialog.querySelector<HTMLElement>('[data-swipe-flaeche]');
	let startX = 0;
	let startY = 0;
	let wischt = false;
	flaeche?.addEventListener('pointerdown', (event) => {
		wischt = true;
		startX = event.clientX;
		startY = event.clientY;
	});
	flaeche?.addEventListener('pointerup', (event) => {
		if (!wischt) return;
		wischt = false;
		const dx = event.clientX - startX;
		const dy = event.clientY - startY;
		if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) blaettern(dx < 0 ? 1 : -1);
	});
	flaeche?.addEventListener('pointercancel', () => {
		wischt = false;
	});
}

/** Nachbarbild in den Browser-Cache holen — dann fuehlt sich Swipen sofort an. */
function ladeVor(index: number) {
	const n = aktuelleListe.length;
	if (n < 2) return;
	const eintrag = aktuelleListe[((index % n) + n) % n];
	if (eintrag) new Image().src = eintrag.voll;
}

function zeige(index: number) {
	if (!bildEl || !textEl || !zaehlerEl) return;
	aktuellerIndex = ((index % aktuelleListe.length) + aktuelleListe.length) % aktuelleListe.length;
	const eintrag = aktuelleListe[aktuellerIndex];
	bildEl.src = eintrag.voll;
	bildEl.alt = eintrag.alt;
	textEl.textContent = eintrag.alt;
	zaehlerEl.textContent = texte.bildVon
		.replace('{i}', String(aktuellerIndex + 1))
		.replace('{n}', String(aktuelleListe.length));
	ladeVor(aktuellerIndex + 1);
	ladeVor(aktuellerIndex - 1);
}

function blaettern(richtung: number) {
	zeige(aktuellerIndex + richtung);
}

function oeffnen(liste: Eintrag[], index: number, ausloeser: HTMLElement) {
	if (!dialog) baueDialog();
	if (!dialog) return;
	vorherFokus = ausloeser;
	aktuelleListe = liste;
	zeige(index);
	document.body.style.overflow = 'hidden';
	dialog.showModal();
	dialog.querySelector<HTMLButtonElement>('[data-schliessen]')?.focus();
}

document.querySelectorAll<HTMLElement>('[data-galerie]').forEach((galerie) => {
	const knoepfe = Array.from(galerie.querySelectorAll<HTMLElement>('[data-galerie-bild]'));
	const liste: Eintrag[] = knoepfe.map((knopf) => ({
		voll: knopf.dataset.voll ?? '',
		alt: knopf.querySelector('img')?.alt ?? '',
	}));

	knoepfe.forEach((knopf, i) => {
		knopf.addEventListener('click', () => {
			oeffnen(liste, Number(knopf.dataset.index ?? i), knopf);
		});
	});
});
