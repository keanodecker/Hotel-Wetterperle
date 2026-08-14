/*
 * Horizontale Wisch-Geste — EINE Implementierung fuer alle Stellen der Seite
 * (Galerie-Lightbox, Google-Bewertungen; extrahiert am 14.08.2026, als die
 * Bewertungen wischbar wurden — vorher steckte die Logik inline in der
 * Lightbox).
 *
 * Pointer Events decken Finger UND Maus ab. Regeln:
 *  · Schwelle 40 px, und horizontal muss dominieren — sonst blaettert ein
 *    schraeger Scroll-Wisch versehentlich.
 *  · Die Flaeche braucht `touch-action: pan-y` (Tailwind: `touch-pan-y`),
 *    damit der Browser vertikal weiter scrollt und uns die horizontale
 *    Geste ueberlaesst. Ueberwiegend vertikale Gesten enden als
 *    pointercancel — dann passiert hier bewusst nichts.
 *  · `nurTouch` fuer Flaechen mit markierbarem TEXT (Bewertungen): dort
 *    wuerde ein Maus-Drag mit der Textauswahl kollidieren, also wischt nur
 *    der Finger. Die Lightbox (nur Bild) laesst auch die Maus wischen.
 */

export interface SwipeOptionen {
	/** Mindestweg in px, ab dem die Geste als Wisch zaehlt (Standard 40). */
	schwelle?: number;
	/** true = nur echte Touch-Pointer, Maus-Drags ignorieren. */
	nurTouch?: boolean;
}

/** Ruft `wische(1)` bei Wisch nach links (= weiter), `wische(-1)` nach rechts (= zurueck). */
export function beiHorizontalemSwipe(
	flaeche: HTMLElement,
	wische: (richtung: 1 | -1) => void,
	optionen: SwipeOptionen = {},
) {
	const schwelle = optionen.schwelle ?? 40;
	let startX = 0;
	let startY = 0;
	let aktiv = false;

	flaeche.addEventListener('pointerdown', (event) => {
		if (optionen.nurTouch && event.pointerType !== 'touch') return;
		aktiv = true;
		startX = event.clientX;
		startY = event.clientY;
	});
	flaeche.addEventListener('pointerup', (event) => {
		if (!aktiv) return;
		aktiv = false;
		const dx = event.clientX - startX;
		const dy = event.clientY - startY;
		if (Math.abs(dx) > schwelle && Math.abs(dx) > Math.abs(dy)) wische(dx < 0 ? 1 : -1);
	});
	flaeche.addEventListener('pointercancel', () => {
		aktiv = false;
	});
}
