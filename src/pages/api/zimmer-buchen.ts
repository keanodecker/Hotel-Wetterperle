// Nimmt eine VERBINDLICHE Zimmerbuchung vom Buchungsdialog entgegen und legt
// sie in Smoobu an.
//
// Historie: gebaut 12.08.2026 (Commit 019f19f), am 14.08. morgens auf KD-Ansage
// geloescht ("Anfragen statt buchen"), am 14.08. 12:04 von KD wieder gewollt —
// diesmal als EIGENES Buchungsformular statt des Smoobu-iframes: "dann haben
// wir nicht noch dieses Smoobu Design auf der Website aber auch die
// Anfrageoption auch ueber uns mit Resend."
//
// 🔴 DER PREIS KOMMT VON UNS, NICHT VON SMOOBU (KD 14.08.2026): Die
// Website-Preise (rooms.ts) sind inkl. Fruehstueck + Kulturfoerderabgabe und
// weichen BEWUSST von den Smoobu-/Booking-Grundpreisen ab. Der Website-Preis
// ist der Vertragspreis — er wird SERVERSEITIG aus rooms.ts gerechnet
// (niemals dem Client vertrauen) und als `price` an Smoobu uebergeben.
// `pruefeVerfuegbarkeit` liefert zwar einen Smoobu-Preis mit, der wird hier
// absichtlich ignoriert (nur frei/belegt zaehlt).
//
// Smoobu kennt keine unverbindliche Anfrage, nur eine echte Buchung: sobald
// sie steht, ist der Zeitraum geblockt — auch auf Booking.com (derselbe
// Channel-Manager). Deshalb sagt die Oberflaeche unmissverstaendlich
// "Verbindlich buchen"; der unverbindliche Weg ist der Anfrage-Modus des
// Dialogs (Mail via /api/kontakt).
//
// Bezahlt wird VOR ORT (KD 12.08.2026) — keine Vorauszahlung, keine Kaution.
export const prerender = false;

import type { APIRoute } from 'astro';
import { rooms } from '../../data/rooms';
import { ZIMMER_ZU_SMOOBU, legeBuchungAn, pruefeVerfuegbarkeit, smoobuKonfiguriert } from '../../lib/smoobu';

const MAX = { name: 120, email: 200, telefon: 60, nachricht: 2000 };

function antwort(ok: boolean, meldung: string, status = ok ? 200 : 400, extra: object = {}) {
  return new Response(JSON.stringify({ ok, meldung, ...extra }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function sauber(wert: FormDataEntryValue | null, grenze: number) {
  return typeof wert === 'string' ? wert.trim().slice(0, grenze) : '';
}

/** yyyy-mm-dd, wie das <input type="date"> es liefert. Alles andere wird abgelehnt. */
const ISO_DATUM = /^\d{4}-\d{2}-\d{2}$/;

/*
 * Das Formular hat EIN Feld "Ihr Name" (KD 14.08.2026 14:15: "Bei beiden nur
 * 'Ihr Name' bitte") — Smoobus API fuehrt firstName und lastName aber getrennt.
 * Aufteilung: erstes Wort = Vorname, REST = Nachname ("Frank van der Berg" →
 * "Frank" / "van der Berg"). Bei nur EINEM Wort steht das Wort in BEIDEN
 * Feldern: nichts wird erfunden (der Gast hat genau das getippt), und ein
 * moeglicherweise pflichtiges firstName bleibt gefuellt — lastName ist das
 * Feld, ueber das Frank die Buchung in Smoobu wiederfindet.
 */
function nameTeilen(voll: string) {
  const teile = voll.split(/\s+/).filter(Boolean);
  if (teile.length < 2) return { vorname: voll, nachname: voll };
  return { vorname: teile[0], nachname: teile.slice(1).join(' ') };
}

/** Notbremse wie im Kontaktformular: pro IP hoechstens 5 Versuche in 10 Minuten. */
const takt = new Map<string, number[]>();
function zuOft(ip: string) {
  const jetzt = Date.now();
  const fenster = (takt.get(ip) ?? []).filter((t) => jetzt - t < 10 * 60 * 1000);
  fenster.push(jetzt);
  takt.set(ip, fenster);
  if (takt.size > 500) takt.clear();
  return fenster.length > 5;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let daten: FormData;
  try {
    daten = await request.formData();
  } catch {
    return antwort(false, 'Die Anfrage konnte nicht gelesen werden.');
  }

  // Sprache zuerst, damit auch Fehlermeldungen in der Sprache des Gastes kommen.
  const sprache = sauber(daten.get('sprache'), 5) === 'en' ? 'en' : 'de';
  const txt = (de: string, en: string) => (sprache === 'en' ? en : de);

  if (!smoobuKonfiguriert()) {
    // Fail closed: lieber ehrlich absagen als eine Buchung vortaeuschen, die
    // niemand bekommt. Passiert genau dann, wenn die Variablen in Vercel fehlen
    // oder nach dem Anlegen kein Redeploy lief.
    console.error('[buchung] SMOOBU_API_KEY_ID/SMOOBU_API_KEY fehlen — NICHT gebucht.');
    return antwort(
      false,
      txt(
        'Die Online-Buchung ist gerade nicht erreichbar. Bitte rufen Sie uns an — wir halten Ihr Zimmer sofort fest.',
        'Online booking is currently unavailable. Please give us a call — we will hold your room right away.',
      ),
      503,
    );
  }

  // Honeypot wie im Kontaktformular: gefuellt = Bot. Erfolg melden, nichts buchen.
  if (sauber(daten.get('website'), 100)) return antwort(true, 'Vielen Dank.');

  const name = sauber(daten.get('name'), MAX.name);
  const email = sauber(daten.get('email'), MAX.email);
  const telefon = sauber(daten.get('telefon'), MAX.telefon);
  const anreise = sauber(daten.get('anreise'), 20);
  const abreise = sauber(daten.get('abreise'), 20);
  const zimmerId = sauber(daten.get('zimmerId'), 60);
  const personen = Number(sauber(daten.get('personen'), 10) || '0');
  const nachricht = sauber(daten.get('nachricht'), MAX.nachricht);

  if (!name || !email) {
    return antwort(false, txt('Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse an.', 'Please fill in your name and email address.'));
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return antwort(false, txt('Diese E-Mail-Adresse sieht nicht gültig aus.', 'This email address does not look valid.'));
  }
  if (!daten.get('datenschutz')) {
    return antwort(false, txt('Bitte bestätigen Sie kurz die Datenschutzhinweise.', 'Please confirm the privacy notice.'));
  }
  if (!ISO_DATUM.test(anreise) || !ISO_DATUM.test(abreise)) {
    return antwort(false, txt('Bitte wählen Sie Anreise- und Abreisedatum aus.', 'Please choose your arrival and departure dates.'));
  }
  if (abreise <= anreise) {
    return antwort(false, txt('Die Abreise muss nach der Anreise liegen.', 'Departure must be after arrival.'));
  }
  if (anreise < new Date().toISOString().slice(0, 10)) {
    return antwort(false, txt('Die Anreise kann nicht in der Vergangenheit liegen.', 'Arrival cannot be in the past.'));
  }

  const apartmentId = ZIMMER_ZU_SMOOBU[zimmerId];
  const zimmer = rooms('de').find((r) => r.id === zimmerId);
  if (!apartmentId || !zimmer) {
    return antwort(false, txt('Bitte wählen Sie ein konkretes Zimmer aus.', 'Please choose a specific room.'));
  }
  if (!personen || personen < 1 || !Number.isInteger(personen)) {
    return antwort(false, txt('Bitte geben Sie an, wie viele Personen anreisen.', 'Please tell us how many guests are coming.'));
  }
  if (personen > zimmer.maxGuests) {
    return antwort(
      false,
      txt(
        `Dieses Zimmer bietet Platz für höchstens ${zimmer.maxGuests} Personen. Für größere Gruppen rufen Sie uns gern an.`,
        `This room sleeps at most ${zimmer.maxGuests} guests. For larger groups, please give us a call.`,
      ),
    );
  }

  /*
   * 🔴 Preis SERVERSEITIG aus rooms.ts — der Website-Preis (inkl. Fruehstueck +
   * Kulturfoerderabgabe) ist der Vertragspreis. Personen-Staffel: Basispreis
   * gilt fuer `basisPersonen`, jede weitere Person kostet `aufpreisProPerson`
   * pro Nacht. Der Client zeigt dieselbe Rechnung nur AN.
   */
  if (zimmer.pricePerNight === null) {
    // Gibt es aktuell nicht (alle Zimmer haben Preise) — aber ohne Preis darf
    // nie still zu 0 € gebucht werden.
    return antwort(false, txt('Für dieses Zimmer nennen wir den Preis auf Anfrage — bitte rufen Sie uns an.', 'This room is priced on request — please give us a call.'));
  }
  const naechte = Math.round((new Date(abreise).getTime() - new Date(anreise).getTime()) / 86400000);
  const zusatz =
    zimmer.basisPersonen != null && zimmer.aufpreisProPerson != null
      ? Math.max(0, personen - zimmer.basisPersonen)
      : 0;
  const proNacht = zimmer.pricePerNight + zusatz * (zimmer.aufpreisProPerson ?? 0);
  const gesamt = naechte * proNacht;
  const aufschluesselung =
    zusatz > 0
      ? `${naechte} × (${zimmer.pricePerNight} € + ${zusatz} × ${zimmer.aufpreisProPerson} €)`
      : `${naechte} × ${proNacht} €`;

  if (zuOft(clientAddress ?? 'unbekannt')) {
    return antwort(
      false,
      txt(
        'Es sind gerade sehr viele Anfragen von Ihrem Anschluss eingegangen. Bitte versuchen Sie es in einigen Minuten noch einmal.',
        'We have received a lot of requests from your connection. Please try again in a few minutes.',
      ),
      429,
    );
  }

  // 1. Ist wirklich frei? Zwischen dem Laden der Seite und dem Absenden koennen
  //    Minuten liegen — in denen ueber Booking.com jemand anderes gebucht hat.
  //    ⚠️ Nur frei/belegt auswerten; den Smoobu-Preis aus der Antwort BEWUSST
  //    ignorieren (s. Kopf-Kommentar).
  let verfuegbar;
  try {
    verfuegbar = await pruefeVerfuegbarkeit(apartmentId, anreise, abreise, personen);
  } catch (fehler) {
    console.error('[buchung] Verfügbarkeitsprüfung fehlgeschlagen:', fehler instanceof Error ? fehler.message : 'unbekannt');
    return antwort(
      false,
      txt(
        'Wir konnten die Verfügbarkeit gerade nicht prüfen. Bitte versuchen Sie es gleich noch einmal oder rufen Sie uns an.',
        'We could not check availability just now. Please try again in a moment or give us a call.',
      ),
      502,
    );
  }

  if (!verfuegbar.frei) {
    return antwort(
      false,
      txt(
        'Dieses Zimmer ist im gewählten Zeitraum leider nicht verfügbar. Wählen Sie gern andere Tage oder ein anderes Zimmer — oder schicken Sie uns eine unverbindliche Anfrage bzw. rufen Sie uns an, wir finden etwas für Sie.',
        'Unfortunately this room is not available for the chosen dates. Feel free to pick other days or another room — or send us a non-binding enquiry or give us a call, and we will find something for you.',
      ),
      409,
    );
  }

  // 2. Buchen. Ab hier ist der Zeitraum blockiert — auch auf Booking.com.
  const { vorname, nachname } = nameTeilen(name);
  let buchungsId: number | undefined;
  try {
    buchungsId = await legeBuchungAn({
      apartmentId,
      anreise,
      abreise,
      vorname,
      nachname,
      email,
      telefon: telefon || undefined,
      erwachsene: personen,
      // UNSER Betrag, nicht verfuegbar.preis (s. Kopf-Kommentar).
      preis: gesamt,
      notiz: [
        `Website-Buchung, Preis inkl. Frühstück & Kulturförderabgabe: ${gesamt} € (${aufschluesselung})`,
        nachricht ? `Nachricht des Gastes: ${nachricht}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      sprache,
    });
  } catch (fehler) {
    console.error('[buchung] Smoobu lehnte die Buchung ab:', fehler instanceof Error ? fehler.message : 'unbekannt');
    return antwort(
      false,
      txt(
        'Die Buchung konnte gerade nicht abgeschlossen werden. Bitte rufen Sie uns an — wir halten Ihr Zimmer sofort fest.',
        'The booking could not be completed just now. Please give us a call — we will hold your room right away.',
      ),
      502,
    );
  }

  console.log(`[buchung] angelegt: Smoobu-ID ${buchungsId ?? 'unbekannt'}, Einheit ${apartmentId}, ${anreise} bis ${abreise}, ${gesamt} € (${aufschluesselung})`);

  return antwort(
    true,
    txt(
      `Vielen Dank — Ihr Zimmer ist verbindlich gebucht. Gesamtpreis: ${gesamt} € inkl. Frühstück & Kulturförderabgabe, zahlbar vor Ort. Sie erhalten eine Bestätigung per E-Mail.`,
      `Thank you — your room is booked. Total: €${gesamt} incl. breakfast & city tax, payable on site. You will receive a confirmation by email.`,
    ),
    200,
    { buchungsId },
  );
};
