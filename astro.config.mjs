// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Die Seite bleibt statisch — jede Seite wird wie bisher vorgerendert.
// Der Adapter ist nur da, damit EINE Route serverseitig laufen kann:
// src/pages/api/kontakt.ts (dort steht `export const prerender = false`).
// Ohne Adapter gibt es keinen Server, und ein Kontaktformular kann
// grundsaetzlich nichts verschicken — das war die Ursache, nicht das Formular.
// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  // Die kuenftige echte Adresse — Basis fuer Sitemap und canonical-Links.
  site: 'https://wetteraperle.de',
  // Eine Adresse, eine Schreibweise: /hotel/ wird auf /hotel umgeleitet.
  // Noetig, damit die Redirects unten auch die alten Links MIT Schraegstrich
  // erwischen (die alte WordPress-Seite verlinkt ausschliesslich so).
  trailingSlash: 'never',
  // Alte WordPress-Adressen auf die neuen Seiten umleiten. Quelle ist NICHT
  // geraten, sondern die sitemap_index.xml der alten Seite (gelesen 14.08.2026):
  // sie kennt zu jeder Seite eine englische Fassung mit /en/ am ENDE.
  // ⚠️ Der Schraegstrich am Ende ist der Knackpunkt: Die alte Seite verlinkt
  //    ueberall MIT ("…/about/"), Astro schreibt seine Redirects aber als
  //    exakte Regel `^/about$` — /home gab 301, /home/ gab 404 (live gemessen).
  //    Geloest ueber `trailingSlash: 'never'` unten: Vercel normalisiert dann
  //    JEDE Adresse mit Schraegstrich weg, erst danach greifen diese Regeln.
  //    Deshalb steht hier bewusst nur EINE Schreibweise je Adresse — zwei
  //    Eintraege waeren fuer Astro dieselbe Route (Kollisions-Warnung).
  // ⚠️ /privacy-policy war auf der alten Seite das IMPRESSUM (Inhalt geprueft),
  //    nicht der Datenschutz — deshalb zeigt es auf /impressum. Die alte
  //    /datenschutz/-Adresse gibt es neu unveraendert, sie braucht nichts.
  // /hotel und /restaurant heissen neu genauso; echte Seiten vertragen den
  // Schraegstrich ohnehin (geprueft: /hotel/ = 200).
  redirects: {
    '/home': '/',
    '/about': '/ueber-uns',
    '/contact-us': '/kontakt',
    '/events': '/feiern',
    '/privacy-policy': '/impressum',
    // Die englische Alt-Struktur der WordPress-Seite (/seite/en/)
    '/home/en': '/en/',
    '/hotel/en': '/en/hotel',
    '/restaurant/en': '/en/restaurant',
    '/about/en': '/en/about-us',
    '/contact-us/en': '/en/contact',
    '/events/en': '/en/celebrations',
  },
  // Sitemap fuer Google: listet alle Seiten inkl. der englischen Fassungen und
  // verknuepft sie als Sprachalternativen. Erzeugt /sitemap-index.xml — genau
  // die Adresse, auf die public/robots.txt zeigt.
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'de', locales: { de: 'de-DE', en: 'en-US' } },
      filter: (seite) => !seite.includes('/logo-test'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});