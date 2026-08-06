# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).


## Kontaktformular — Versand

Das Formular auf `/kontakt` schickt die Anfrage per E-Mail an den Gasthof.

**Wie es funktioniert.** Die Seite ist weiterhin **statisch** — alle Seiten werden
vorgerendert. Einzige Ausnahme ist `src/pages/api/kontakt.ts`: Diese Route trägt
`export const prerender = false` und läuft als Serverless-Funktion auf Vercel.
Dafür ist der Adapter `@astrojs/vercel` in `astro.config.mjs` eingetragen.

Vorher gab es keinen Adapter und damit überhaupt keinen Server — deshalb konnte das
Formular nichts verschicken. Das war die Ursache, nicht das Formular selbst.

**Absenderlogik.** Verschickt wird über das eigene Postfach, nicht über die Adresse
des Gastes: Fremde Absender werden von SPF/DKIM abgelehnt und landen im Spam. Der
Gast steht in `Antworten an` — ein Klick auf „Antworten" geht direkt an ihn.

**Was gesetzt sein muss** (siehe `.env.example`): `SMTP_HOST`, `SMTP_PORT`,
`SMTP_USER`, `SMTP_PASS`, `KONTAKT_EMPFAENGER`, optional `KONTAKT_ABSENDER`.
Lokal in einer `.env`, auf Vercel unter *Settings → Environment Variables*.

⚠️ **Fehlt eine der Pflichtangaben, wird nichts verschickt** — der Endpoint antwortet
mit einer sichtbaren Fehlermeldung und schreibt eine Zeile ins Server-Log. Er tut nie
so, als sei die Nachricht angekommen. Ein stiller Ausfall wäre hier der schlimmste
Fall: Der Gast glaubt, er habe angefragt, und der Wirt erfährt nie davon.

**Spam-Schutz.** Ein für Menschen unsichtbares Feld (`website`) dient als Falle.
Ist es ausgefüllt, war es ein Bot; die Anfrage wird verworfen, dem Absender aber
Erfolg gemeldet — sonst lernt der Bot, dass er erkannt wurde.

**Ohne JavaScript** greift das normale POST-Verhalten des Formulars, der Endpoint
antwortet dann als JSON. Mit JavaScript bleibt der Gast auf der Seite und sieht die
Rückmeldung direkt unter dem Absenden-Knopf.
