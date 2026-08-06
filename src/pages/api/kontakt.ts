// Nimmt das Kontaktformular entgegen und schickt die Anfrage per E-Mail weiter.
//
// Diese Route ist die EINZIGE, die nicht vorgerendert wird — der Rest der Seite
// bleibt statisch. Deshalb steht hier `prerender = false`.
//
// Absender ist bewusst NICHT der Gast: Fremde Absenderadressen werden von
// SPF/DKIM abgelehnt und landen im Spam. Verschickt wird vom eigenen Postfach,
// der Gast steht in `replyTo` — ein Klick auf „Antworten" geht direkt an ihn.
export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

const MAX = { name: 120, email: 200, betreff: 120, nachricht: 5000 };

/** Ohne vollständige Konfiguration wird NICHT gesendet und NICHT so getan als ob. */
function konfiguration() {
  const env = import.meta.env;
  const host = env.SMTP_HOST;
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const empfaenger = env.KONTAKT_EMPFAENGER;
  if (!host || !user || !pass || !empfaenger) return null;
  return {
    host,
    port: Number(env.SMTP_PORT ?? 465),
    user,
    pass,
    empfaenger,
    absender: env.KONTAKT_ABSENDER || user,
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

export const POST: APIRoute = async ({ request }) => {
  const konfig = konfiguration();
  if (!konfig) {
    // Fail closed: lieber eine ehrliche Fehlermeldung als ein stiller Verlust.
    console.error('[kontakt] SMTP-Konfiguration unvollständig — Anfrage NICHT verschickt.');
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

  if (!name || !email) return antwort(false, 'Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse an.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return antwort(false, 'Diese E-Mail-Adresse sieht nicht gültig aus.');
  if (!nachricht) return antwort(false, 'Bitte schreiben Sie uns kurz Ihr Anliegen.');

  const text = [
    `Anliegen: ${betreff}`,
    `Name: ${name}`,
    `E-Mail: ${email}`,
    '',
    nachricht,
    '',
    '— Gesendet über das Kontaktformular auf wetteraperle.de',
  ].join('\n');

  try {
    const transport = nodemailer.createTransport({
      host: konfig.host,
      port: konfig.port,
      secure: konfig.port === 465,
      auth: { user: konfig.user, pass: konfig.pass },
    });

    await transport.sendMail({
      from: `"Landgasthof Wetteraperle — Website" <${konfig.absender}>`,
      to: konfig.empfaenger,
      replyTo: `"${name}" <${email}>`,
      subject: `Website-Anfrage: ${betreff}`,
      text,
    });
  } catch (fehler) {
    // Der Fehlertext kann Zugangsdaten enthalten — deshalb nur der Name der Ursache.
    console.error('[kontakt] Versand fehlgeschlagen:', fehler instanceof Error ? fehler.message : 'unbekannt');
    return antwort(false, 'Die Nachricht konnte gerade nicht verschickt werden. Bitte versuchen Sie es später noch einmal oder rufen Sie uns an.', 502);
  }

  return antwort(true, 'Vielen Dank für Ihre Nachricht — wir melden uns schnellstmöglich bei Ihnen.');
};
