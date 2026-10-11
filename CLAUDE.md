# Veni Vidi Volo

Reiseangebote swipen wie bei Tinder (rechts = gefällt mir, links = nein). Zielgruppe: Reisende ab Zürich.
Live: https://djsunji.github.io/venividivolo/ (GitHub Pages, Branch `main`, Ordner `/`).
Betreiber: Dejan Ehrbar. Antworte auf Deutsch (Schweizer Schreibweise: «ss» statt «ß»).
Ausführliche Übergabe mit Geschichte, Entscheidungen und allen Details: `UEBERGABE.md`.

## Aufbau

- `index.html` – die ganze App in einer Datei (HTML, CSS, JavaScript, keine Build-Tools, kein Framework).
  - Logos sind als data-URIs eingebettet, die PNG-Dateien dienen nur als Favicon und für die Rechtsseiten.
  - CSS: Tokens auf `:root`, viele nacheinander angehängte Blöcke. Spätere Blöcke überschreiben frühere.
    Neue Styles kommen als eigener Block direkt vor `/* ---------- Desktop ---------- */`.
  - Nachtmodus: `:root[data-theme="dark"]`, Umschalter `#theme`, gespeichert in `localStorage`.
  - `localStorage`-Schlüssel haben das Präfix `reisetinder:` (`filters2`, `liked`, `seen`, `theme2`, `matchSeen`, `session`, `accounts`).
  - Angebote: Array `OFFERS` (14 Beispielangebote, Stand 8. Oktober 2026). Liegt eine `offers.json` neben `index.html`,
    ersetzt die App damit die Beispiele (`normalizeOffer`), und `TODAY` wird das echte Datum.
  - Bilder: ohne Feed gezeichnete SVG-Szenen (`scene`, `sceneHotel` …); mit Feed `images` als Fotos über den SVGs.
  - Filter: Reiseart, Reisezeit bis 24 h, ab mehr als 12 h Regionen und Kontinente statt Länder (`REGION`),
    Länder als Tags, Erwachsene, Kinder (2–17), Babys, Reisedatum mit «Flexibel ± 2 Tage».
  - Karte: Tippen links und rechts im Bild wechselt das Foto, Mitte öffnet die Details, Wischen über 100 px entscheidet.
  - Login: `FIREBASE_CONFIG` (noch `null` = Demo-Modus, Konten nur im Browser). Mit Konfiguration lädt die App das
    Firebase-SDK (compat, Version in `FB_VER`) von jsDelivr. Merkliste wird in Firestore `users/{uid}` gespeichert.
    `LOGIN_PROVIDERS` blendet nicht eingerichtete Anbieter aus. Siehe `ANLEITUNG-LOGIN.md`, Regeln in `firestore.rules`.
- `scripts/import-feed.mjs` + `scripts/feed-config.json` – holt Affiliate-Produktfeeds (Awin-CSV, auch .gz) und schreibt `offers.json`.
  Keine Abhängigkeiten, Node 18+. Test ohne Internet: `node scripts/import-feed.mjs pfad/feed.csv`.
- `.github/workflows/angebote.yml` – täglicher Import, liest das Secret `FEED_URLS`. Siehe `ANLEITUNG-ANGEBOTE.md`.
- `impressum.html`, `datenschutz.html` – Rechtsseiten. Bei neuen Diensten (Tracking, neue Anbieter) die Datenschutzerklärung nachführen.

## Stand und offene Punkte

- Awin-Publisher-Konto ist angenommen, aber noch kein Feed verbunden (kein `FEED_URLS`, keine `offers.json`).
- Firebase noch nicht eingerichtet, Dejan schickt den `firebaseConfig`-Block (nicht geheim).
- Der Feed-Link enthält einen persönlichen Schlüssel: nie im Chat, im Code oder in Commits ablegen, nur als GitHub-Secret.

## Lokal starten und testen

`offers.json` wird per `fetch` geladen, das geht nicht über `file://`. Darum lokal einen Server starten:

```
npx serve .
# oder
python -m http.server 8000
```

Vor jedem Commit prüfen: Mobil (ca. 400 px) und Desktop (1440 px), Tag- und Nachtmodus, Konsole ohne Fehler,
Tippzonen auf der Karte, Filter-Zähler, Login im Demo-Modus.

## Arbeitsweise

- Design: modern, hell, ferienhaft. Schwarzes Strich-Logo, Akzente Sonne (`--sun`, Koralle) und Meer (`--sea`, Petrol). Kein Gold.
- Texte in der App ohne Gedankenstriche, kurz und einladend.
- Änderungen direkt auf `main` sind für Dejan in Ordnung (GitHub Pages veröffentlicht automatisch).
