// Zugang zur Smoobu-API — der Channel-Manager des Hauses (dort haengt auch
// Booking.com dran). Wird NUR serverseitig benutzt: die Zugangsdaten duerfen
// niemals ins Frontend, sie koennen echte Buchungen anlegen und stornieren.
//
// ⚠️ STAND 14.08.2026: Aktuell importiert NIEMAND diese Datei. Die Route
// /api/zimmer-buchen (Direktbuchung uebers Formular) wurde auf KD-Ansage
// geloescht — Zimmer werden wieder per Mail ANGEFRAGT (/api/kontakt), echte
// Buchungen laufen nur ueber den Smoobu-iframe in BookingWidget.astro.
// Die Datei bleibt BEWUSST: der HMAC-Zugang samt der drei gemessenen Fallen
// unten ist muehsam erarbeitet und wird fuer die spaetere Preis-/
// Verfuegbarkeits-Anzeige wieder gebraucht. Nicht loeschen.
//
// AUTHENTIFIZIERUNG: HMAC. Der alte einzelne `Api-Key`-Header wird laut
// docs.smoobu.com am 25.09.2026 abgeschaltet — deshalb hier gar nicht erst
// eingebaut. Gebraucht werden ZWEI Werte:
//   SMOOBU_API_KEY_ID  = die Key-ID  (Form `usr_live_…`), geht in X-API-Key
//   SMOOBU_API_KEY     = das Secret  (44 Zeichen base64), signiert die Anfrage
// Beide stehen in Smoobu unter Einstellungen -> Erweitert -> API Keys; das
// Secret wird dort nur EINMAL angezeigt.
//
// ⚠️ Drei Fallen, alle am 12.08.2026 gemessen — nicht "aufraeumen":
//  1. Die Query muss PROZENT-KODIERT signiert UND gesendet werden. `apartments[]`
//     roh ergibt 401, `apartments%5B%5D` ergibt 200. Signatur und URL muessen
//     exakt dieselbe Zeichenkette benutzen.
//  2. Mehrere gleichnamige Query-Parameter brechen die Signatur (1 Apartment 200,
//     5 Apartments 401). Deshalb wird je Einheit einzeln gefragt.
//  3. Der Zeitstempel darf hoechstens 5 Minuten von Smoobus Uhr abweichen, und
//     jede Nonce gilt nur einmal.

import crypto from 'node:crypto';

const BASIS = 'https://login.smoobu.com';
const ZEITLIMIT_MS = 10_000;

/** Kunden-/Konto-Nummer des Hauses — steht in der iFrame-URL des Buchungssystems. */
export const SMOOBU_KONTO = 86259;

/**
 * Zuordnung Website-Zimmer -> Smoobu-Einheit. In Smoobu ist JEDES Zimmer eine
 * eigene Einheit; die IDs stammen aus `GET /api/apartments` (12.08.2026).
 * ⚠️ Ueber die stabile `id` aus data/rooms.ts verknuepft, NICHT ueber den
 * Anzeigenamen — der ist zweisprachig und wuerde auf der englischen Seite
 * niemals treffen.
 */
export const ZIMMER_ZU_SMOOBU: Record<string, number> = {
  einzelzimmer: 290565, // Einzelzimmer Nr.1     — max. 1 Gast
  'familien-suite': 290568, // Familien-Suite Nr.2   — max. 5 Gaeste
  doppelzimmer: 290571, // Doppelzimmert Nr.3    — max. 2 Gaeste (Schreibweise so in Smoobu)
  'doppelzimmer-klein': 290574, // Kleines Doppelzimmer Nr.4 — max. 2 Gaeste
  familienzimmer: 290577, // Familienzimmer Nr.5   — max. 4 Gaeste
};

function env(name: string) {
  return process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
}

/** Ohne BEIDE Werte wird nichts versucht — fail closed, wie beim Kontaktformular. */
export function smoobuKonfiguriert() {
  return Boolean(env('SMOOBU_API_KEY_ID') && env('SMOOBU_API_KEY'));
}

/**
 * Baut die Signatur nach docs.smoobu.com:
 *   METHOD \n Pfad \n Query \n Timestamp \n Nonce \n SHA256(Body, hex) \n API-Key-ID
 * HMAC-SHA256 mit dem Secret, Ergebnis base64.
 */
function kopfzeilen(methode: string, pfad: string, query: string, koerper: string) {
  const id = env('SMOOBU_API_KEY_ID')!;
  const secret = env('SMOOBU_API_KEY')!;
  const zeitstempel = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const nonce = crypto.randomUUID();
  const koerperHash = crypto.createHash('sha256').update(koerper, 'utf8').digest('hex');
  const kanonisch = [methode, pfad, query, zeitstempel, nonce, koerperHash, id].join('\n');
  return {
    'X-API-Key': id,
    'X-Timestamp': zeitstempel,
    'X-Nonce': nonce,
    'X-Signature': crypto.createHmac('sha256', secret).update(kanonisch, 'utf8').digest('base64'),
    'Content-Type': 'application/json',
  };
}

async function ruf(methode: 'GET' | 'POST', pfad: string, roheQuery = '', koerper?: unknown) {
  const query = [...new URLSearchParams(roheQuery).entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  const text = koerper === undefined ? '' : JSON.stringify(koerper);
  const antwort = await fetch(BASIS + pfad + (query ? '?' + query : ''), {
    method: methode,
    headers: kopfzeilen(methode, pfad, query, text),
    body: koerper === undefined ? undefined : text,
    signal: AbortSignal.timeout(ZEITLIMIT_MS),
  });
  if (!antwort.ok) {
    const grund = await antwort.text().catch(() => '');
    throw new Error(`Smoobu ${methode} ${pfad}: HTTP ${antwort.status} ${grund.slice(0, 300)}`);
  }
  return antwort.json();
}

export type Verfuegbarkeit = {
  frei: boolean;
  preis?: number;
  waehrung?: string;
  /** Klartextgrund von Smoobu, wenn nicht frei (z. B. Mindestaufenthalt). */
  grund?: string;
};

/**
 * Fragt Smoobu, ob EINE Einheit im Zeitraum buchbar ist — und zu welchem Preis.
 * Rein lesend; aendert nichts. Der Preis kommt bewusst von Smoobu und nicht aus
 * den Website-Daten: nur Smoobu kennt Saison, Mindestaufenthalt und Rabatte.
 */
export async function pruefeVerfuegbarkeit(
  apartmentId: number,
  anreise: string,
  abreise: string,
  gaeste: number,
): Promise<Verfuegbarkeit> {
  const ergebnis = (await ruf('POST', '/booking/checkApartmentAvailability', '', {
    arrivalDate: anreise,
    departureDate: abreise,
    apartments: [apartmentId],
    customerId: SMOOBU_KONTO,
    guests: gaeste,
  })) as {
    availableApartments?: number[];
    prices?: Record<string, { price?: number; currency?: string }>;
    errorMessages?: Record<string, { message?: string }>;
  };

  const frei = (ergebnis.availableApartments ?? []).includes(apartmentId);
  const preis = ergebnis.prices?.[String(apartmentId)];
  const fehler = ergebnis.errorMessages?.[String(apartmentId)] ?? ergebnis.errorMessages?.errorCode;

  return {
    frei,
    preis: preis?.price,
    waehrung: preis?.currency,
    grund: frei ? undefined : (fehler as { message?: string } | undefined)?.message,
  };
}

export type Buchung = {
  apartmentId: number;
  anreise: string;
  abreise: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  erwachsene: number;
  preis?: number;
  notiz?: string;
  sprache?: string;
};

/**
 * Legt eine ECHTE Buchung an. Sie blockt den Zeitraum sofort — auch auf
 * Booking.com, weil dort derselbe Channel-Manager haengt. Deshalb wird sie nur
 * nach bestandener Verfuegbarkeitspruefung aufgerufen, und die Oberflaeche muss
 * unmissverstaendlich "verbindlich buchen" sagen.
 *
 * `channelId: 70` = "Direct booking". Damit ist im Kalender und in der Statistik
 * sichtbar, dass die Buchung ueber die eigene Website kam und nicht ueber ein Portal.
 * Bezahlt wird bei Wetteraperle grundsaetzlich VOR ORT (KD 12.08.2026) — deshalb
 * kein prepayment, kein deposit.
 */
export async function legeBuchungAn(b: Buchung) {
  const ergebnis = (await ruf('POST', '/api/reservations', '', {
    arrivalDate: b.anreise,
    departureDate: b.abreise,
    apartmentId: b.apartmentId,
    channelId: 70,
    firstName: b.vorname,
    lastName: b.nachname,
    email: b.email,
    ...(b.telefon ? { phone: b.telefon } : {}),
    adults: b.erwachsene,
    ...(b.preis !== undefined ? { price: b.preis } : {}),
    ...(b.notiz ? { notice: b.notiz } : {}),
    language: b.sprache ?? 'de',
  })) as { id?: number };
  return ergebnis.id;
}
