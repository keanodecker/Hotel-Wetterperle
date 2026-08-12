// Nimmt eine VERBINDLICHE Zimmerbuchung vom Kontaktformular entgegen und legt
// sie in Smoobu an.
//
// Warum das kein Anfrage-Formular mehr ist (KD 12.08.2026): Smoobu kennt keine
// unverbindliche Anfrage, nur eine echte Buchung. Sobald sie steht, ist der
// Zeitraum geblockt — auch auf Booking.com, weil dort derselbe Channel-Manager
// haengt. Genau das ist der Zweck: keine Doppelbelegung. Die Folge ist aber, dass
// die Oberflaeche unmissverstaendlich "verbindlich buchen" sagen MUSS und nicht
// "Anfrage". Wer nur fragen will, nimmt im Formular ein anderes Anliegen — das
// geht wie bisher per E-Mail ueber /api/kontakt.
//
// Bezahlt wird VOR ORT (KD 12.08.2026) — deshalb keine Vorauszahlung, keine
// Kaution, kein Zahlungsanbieter.
export const prerender = false;

import type { APIRoute } from 'astro';
import {
  ZIMMER_ZU_SMOOBU,
  legeBuchungAn,
  pruefeVerfuegbarkeit,
  smoobuKonfiguriert,
} from '../../lib/smoobu';

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

/** „Anna Maria Müller" -> Vorname „Anna Maria", Nachname „Müller". */
function nameTeilen(voll: string) {
  const teile = voll.split(/\s+/).filter(Boolean);
  if (teile.length < 2) return { vorname: voll, nachname: voll };
  return { vorname: teile.slice(0, -1).join(' '), nachname: teile.at(-1)! };
}

/** yyyy-mm-dd, wie das <input type="date"> es liefert. Alles andere wird abgelehnt. */
const ISO_DATUM = /^\d{4}-\d{2}-\d{2}$/;

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
  if (!smoobuKonfiguriert()) {
    // Fail closed: lieber ehrlich absagen als eine Buchung vortäuschen, die
    // niemand bekommt. Passiert genau dann, wenn die Variablen in Vercel fehlen
    // oder nach dem Anlegen kein Redeploy lief.
    console.error('[buchung] SMOOBU_API_KEY_ID/SMOOBU_API_KEY fehlen — NICHT gebucht.');
    return antwort(
      false,
      'Die Online-Buchung ist gerade nicht erreichbar. Bitte rufen Sie uns an — wir halten Ihr Zimmer sofort fest.',
      503,
    );
  }

  let daten: FormData;
  try {
    daten = await request.formData();
  } catch {
    return antwort(false, 'Die Anfrage konnte nicht gelesen werden.');
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
  const sprache = sauber(daten.get('sprache'), 5) === 'en' ? 'en' : 'de';

  if (!name || !email) return antwort(false, 'Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse an.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return antwort(false, 'Diese E-Mail-Adresse sieht nicht gültig aus.');
  if (!daten.get('datenschutz')) return antwort(false, 'Bitte bestätigen Sie kurz die Datenschutzhinweise.');
  if (!ISO_DATUM.test(anreise) || !ISO_DATUM.test(abreise)) {
    return antwort(false, 'Bitte wählen Sie Anreise- und Abreisedatum aus.');
  }
  if (abreise <= anreise) return antwort(false, 'Die Abreise muss nach der Anreise liegen.');
  if (anreise < new Date().toISOString().slice(0, 10)) {
    return antwort(false, 'Die Anreise kann nicht in der Vergangenheit liegen.');
  }

  const apartmentId = ZIMMER_ZU_SMOOBU[zimmerId];
  if (!apartmentId) {
    // Passiert, wenn der Gast „Noch offen / bitte beraten" gewaehlt hat. Ohne
    // konkretes Zimmer kann Smoobu nicht buchen — das ist ein Fall fuer Frank.
    return antwort(false, 'Bitte wählen Sie ein konkretes Zimmer aus — oder schicken Sie uns eine Anfrage, dann beraten wir Sie.');
  }
  if (!personen || personen < 1) return antwort(false, 'Bitte geben Sie an, wie viele Personen anreisen.');

  if (zuOft(clientAddress ?? 'unbekannt')) {
    return antwort(false, 'Es sind gerade sehr viele Anfragen von Ihrem Anschluss eingegangen. Bitte versuchen Sie es in einigen Minuten noch einmal.', 429);
  }

  // 1. Ist wirklich frei? Zwischen dem Laden der Seite und dem Absenden koennen
  //    Minuten liegen — in denen ueber Booking.com jemand anderes gebucht hat.
  let verfuegbar;
  try {
    verfuegbar = await pruefeVerfuegbarkeit(apartmentId, anreise, abreise, personen);
  } catch (fehler) {
    console.error('[buchung] Verfügbarkeitsprüfung fehlgeschlagen:', fehler instanceof Error ? fehler.message : 'unbekannt');
    return antwort(false, 'Wir konnten die Verfügbarkeit gerade nicht prüfen. Bitte versuchen Sie es gleich noch einmal oder rufen Sie uns an.', 502);
  }

  if (!verfuegbar.frei) {
    return antwort(
      false,
      verfuegbar.grund
        ? `Dieses Zimmer ist im gewählten Zeitraum leider nicht buchbar: ${verfuegbar.grund}`
        : 'Dieses Zimmer ist im gewählten Zeitraum leider schon belegt. Bitte wählen Sie andere Tage oder ein anderes Zimmer.',
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
      preis: verfuegbar.preis,
      notiz: [
        'Über das Buchungsformular auf wetteraperle.de',
        nachricht ? `Nachricht des Gastes: ${nachricht}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      sprache,
    });
  } catch (fehler) {
    console.error('[buchung] Smoobu lehnte die Buchung ab:', fehler instanceof Error ? fehler.message : 'unbekannt');
    return antwort(false, 'Die Buchung konnte gerade nicht abgeschlossen werden. Bitte rufen Sie uns an — wir halten Ihr Zimmer sofort fest.', 502);
  }

  console.log(`[buchung] angelegt: Smoobu-ID ${buchungsId ?? 'unbekannt'}, Einheit ${apartmentId}, ${anreise} bis ${abreise}`);

  const preisText = verfuegbar.preis !== undefined ? ` Gesamtpreis: ${verfuegbar.preis} ${verfuegbar.waehrung ?? 'EUR'}, zahlbar vor Ort.` : '';
  return antwort(
    true,
    sprache === 'en'
      ? `Thank you — your booking is confirmed.${verfuegbar.preis !== undefined ? ` Total: ${verfuegbar.preis} ${verfuegbar.waehrung ?? 'EUR'}, payable on site.` : ''} You will receive a confirmation by e-mail.`
      : `Vielen Dank — Ihre Buchung ist bestätigt.${preisText} Sie erhalten die Bestätigung per E-Mail.`,
    200,
    { buchungsId },
  );
};
