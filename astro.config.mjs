// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// Die Seite bleibt statisch — jede Seite wird wie bisher vorgerendert.
// Der Adapter ist nur da, damit EINE Route serverseitig laufen kann:
// src/pages/api/kontakt.ts (dort steht `export const prerender = false`).
// Ohne Adapter gibt es keinen Server, und ein Kontaktformular kann
// grundsaetzlich nichts verschicken — das war die Ursache, nicht das Formular.
// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});