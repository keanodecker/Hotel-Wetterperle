// Nimmt das Kontaktformular entgegen und schickt die Anfrage per E-Mail weiter.
//
// Diese Route ist die EINZIGE, die nicht vorgerendert wird — der Rest der Seite
// bleibt statisch. Deshalb steht hier `prerender = false`.
//
// Versandweg ist die HTTP-API von Resend (https://resend.com), NICHT SMTP:
//   · Eine Serverless-Funktion darf zuverlässig nur HTTPS nach außen; ausgehende
//     SMTP-Verbindungen laufen dort gern in einen Timeout.
//   · Ohne nodemailer braucht die Route KEINE Abhängigkeit — `fetch` ist eingebaut.
//     Das hält den Kaltstart kurz, und genau der trifft die erste Anfrage.
//   · Die Antwort liefert eine Message-ID, die im Resend-Log wiederzufinden ist.
//     Damit ist nachweisbar, ob eine Anfrage rausging — beim alten Weg war das
//     Glaubenssache.
// Franks eigenes Postfach scheidet ohnehin aus: HostPapa verschickt über
// MailChannels und sperrt den Absender ("550 5.7.1 [ESA] Sender blocked").
//
// Absender ist bewusst NICHT der Gast: Fremde Absenderadressen bestehen weder
// SPF noch DKIM und landen im Spam. Verschickt wird von der bei Resend
// verifizierten Domain, der Gast steht in `reply_to` — ein Klick auf
// „Antworten" geht direkt an ihn.
export const prerender = false;

import type { APIRoute } from 'astro';

const MAX = { name: 120, email: 200, betreff: 120, nachricht: 5000 };
const RESEND_URL = 'https://api.resend.com/emails';
const ZEITLIMIT_MS = 10_000;

/**
 * Werte kommen zur LAUFZEIT aus `process.env` — so empfiehlt es die Astro-Doku
 * für SSR-Adapter. `import.meta.env` wird beim Bauen statisch ersetzt und würde
 * das Geheimnis ins Build-Artefakt backen; es bleibt nur als Rückfall fürs
 * lokale `astro dev`.
 */
function env(name: string) {
  return process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
}

/** Ohne vollständige Konfiguration wird NICHT gesendet und NICHT so getan als ob. */
function konfiguration() {
  const key = env('RESEND_API_KEY');
  const empfaenger = env('KONTAKT_EMPFAENGER');
  if (!key || !empfaenger) return null;
  return {
    key,
    empfaenger,
    absender: env('KONTAKT_ABSENDER') || 'formular@wetteraperle.de',
  };
}

function antwort(ok: boolean, meldung: string, status = ok ? 200 : 400) {
  return new Response(JSON.stringify({ ok, meldung }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function sauber(wert: FormDataEntryValue | null, grenze: number) {
  return typeof wert === 'string' ? wert.trim().slice(0, grenze) : '';
}

/**
 * Notbremse gegen Dauerfeuer: pro Absender-IP höchstens 5 Anfragen in 10 Minuten.
 * ⚠️ Der Speicher lebt nur so lange wie die Function-Instanz — auf Vercel also
 * bewusst unzuverlässig. Er soll einen hängengebliebenen Doppelklick und ein
 * simples Skript bremsen, mehr nicht. Der eigentliche Bot-Schutz ist der
 * Honeypot weiter unten.
 */
const takt = new Map<string, number[]>();

function zuOft(ip: string) {
  const jetzt = Date.now();
  const fenster = (takt.get(ip) ?? []).filter((t) => jetzt - t < 10 * 60 * 1000);
  fenster.push(jetzt);
  takt.set(ip, fenster);
  if (takt.size > 500) takt.clear(); // kein unbegrenztes Wachstum
  return fenster.length > 5;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const konfig = konfiguration();
  if (!konfig) {
    // Fail closed: lieber eine ehrliche Fehlermeldung als ein stiller Verlust.
    console.error('[kontakt] RESEND_API_KEY oder KONTAKT_EMPFAENGER fehlt — Anfrage NICHT verschickt.');
    return antwort(false, 'Das Formular ist gerade nicht erreichbar. Bitte rufen Sie uns an oder schreiben Sie uns direkt eine E-Mail.', 503);
  }

  let daten: FormData;
  try {
    daten = await request.formData();
  } catch {
    return antwort(false, 'Die Anfrage konnte nicht gelesen werden.');
  }

  // Honeypot: ein für Menschen unsichtbares Feld. Ist es gefüllt, war es ein Bot.
  // Wir melden trotzdem Erfolg — sonst lernt der Bot, dass er erkannt wurde.
  if (sauber(daten.get('website'), 100)) return antwort(true, 'Vielen Dank für Ihre Nachricht.');

  const name = sauber(daten.get('name'), MAX.name);
  const email = sauber(daten.get('email'), MAX.email);
  const betreff = sauber(daten.get('betreff'), MAX.betreff) || 'Anfrage über die Website';
  const nachricht = sauber(daten.get('nachricht'), MAX.nachricht);
  const einwilligung = daten.get('datenschutz');

  if (!name || !email) return antwort(false, 'Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse an.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return antwort(false, 'Diese E-Mail-Adresse sieht nicht gültig aus.');
  if (!nachricht) return antwort(false, 'Bitte schreiben Sie uns kurz Ihr Anliegen.');
  // Ein `required` im Browser ist bequem, aber kein Schutz — deshalb hier noch einmal.
  if (!einwilligung) {
    return antwort(false, 'Bitte bestätigen Sie kurz die Datenschutzhinweise, dann können wir Ihre Anfrage bearbeiten.');
  }

  if (zuOft(clientAddress ?? 'unbekannt')) {
    return antwort(false, 'Es sind gerade sehr viele Anfragen von Ihrem Anschluss eingegangen. Bitte versuchen Sie es in einigen Minuten noch einmal.', 429);
  }

  /*
   * ⚠️ Hier landen KEINE Zimmerbuchungen mehr. Wählt der Gast im Formular
   * „Zimmer verbindlich buchen", schaltet die Seite auf /api/zimmer-buchen um —
   * die legt die Buchung direkt in Smoobu an. Diese Route ist der Mail-Weg für
   * alles andere (Sonstiges, Feier/Event) und bleibt bewusst schlicht.
   */
  const text = [
    `Anliegen: ${betreff}`,
    `Name: ${name}`,
    `E-Mail: ${email}`,
    '',
    nachricht,
    '',
    'Einwilligung Datenschutz: erteilt',
    '— Gesendet über das Kontaktformular auf wetteraperle.de',
  ].join('\n');

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${konfig.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Landgasthof Wetteraperle — Website <${konfig.absender}>`,
        to: [konfig.empfaenger],
        // ⚠️ snake_case! `replyTo` ist die Schreibweise des SDK; die REST-API
        // ignoriert sie STILLSCHWEIGEND — dann geht „Antworten" ins Leere.
        reply_to: `${name} <${email}>`,
        subject: `Website-Anfrage: ${betreff}`,
        text,
      }),
      signal: AbortSignal.timeout(ZEITLIMIT_MS),
    });

    if (!res.ok) {
      // Status und Fehlertext von Resend ins Log — der API-Key steckt nur im
      // Header und kommt hier nicht vor.
      const grund = await res.text().catch(() => '');
      console.error(`[kontakt] Resend antwortete ${res.status}: ${grund.slice(0, 300)}`);
      return antwort(false, 'Die Nachricht konnte gerade nicht verschickt werden. Bitte versuchen Sie es später noch einmal oder rufen Sie uns an.', 502);
    }

    // Die Message-ID ist der Faden zum Resend-Log. Ohne sie lässt sich im
    // Zweifel nicht belegen, ob eine Anfrage wirklich rausging.
    const ergebnis = (await res.json().catch(() => ({}))) as { id?: string };
    console.log(`[kontakt] verschickt an ${konfig.empfaenger}, Resend-ID ${ergebnis.id ?? 'unbekannt'}`);
  } catch (fehler) {
    // Der Fehlertext kann Verbindungsdetails enthalten — deshalb nur die Ursache.
    console.error('[kontakt] Versand fehlgeschlagen:', fehler instanceof Error ? fehler.message : 'unbekannt');
    return antwort(false, 'Die Nachricht konnte gerade nicht verschickt werden. Bitte versuchen Sie es später noch einmal oder rufen Sie uns an.', 502);
  }

  return antwort(true, 'Vielen Dank für Ihre Nachricht — wir melden uns schnellstmöglich bei Ihnen.');
};
