# Veni Vidi Volo

Reiseangebote swipen wie bei Tinder: rechts wischen = gefällt mir, links = kein Interesse.
Filter nach Reiseart, maximaler Reisezeit ab Zürich, Land, Personen und Datum.
Detailseite mit allen Eckdaten, Chat-Prototyp und Link zur Buchung beim Anbieter.

## Starten

Keine Installation nötig. `index.html` im Browser öffnen.

## Auf GitHub Pages veröffentlichen

1. Neues Repository auf GitHub anlegen und den Inhalt dieses Ordners hochladen
   (auf github.com: «Add file» › «Upload files», alle Dateien hineinziehen, «Commit changes»).
2. Im Repository: «Settings» › «Pages».
3. Bei «Source» «Deploy from a branch» wählen, Branch `main`, Ordner `/ (root)`, «Save».
4. Nach ein bis zwei Minuten ist die Seite unter `https://<dein-name>.github.io/<repo-name>/` erreichbar.

## Echte Angebote

Die App kann echte Angebote aus einem Affiliate-Feed laden, der täglich automatisch
aktualisiert wird. Schritt für Schritt erklärt in [ANLEITUNG-ANGEBOTE.md](ANLEITUNG-ANGEBOTE.md).

## Login

Anmeldung mit E-Mail, Google, Microsoft, Facebook und Apple über Firebase.
Ohne Einrichtung läuft ein Demo-Modus. Anleitung: [ANLEITUNG-LOGIN.md](ANLEITUNG-LOGIN.md).

## Dateien

- `index.html` – die ganze App (HTML, CSS und JavaScript in einer Datei)
- `logo-full.png` – ganzes Logo
- `logo-mark.png` – Logo-Zeichen (Dreieck), auch als Favicon
- `logo-word.png` – Schriftzug
- `scripts/import-feed.mjs` – holt den Feed und schreibt `offers.json`
- `scripts/feed-config.json` – Spaltennamen des Feeds
- `.github/workflows/angebote.yml` – startet den Import jeden Tag
- `impressum.html`, `datenschutz.html` – Impressum und Datenschutzerklärung
- `firestore.rules` – Datenbank-Regeln für die Merkliste (Firebase)

## Hinweise

- Die Angebote sind echte Angebote von lastminute.ch, TUI Suisse und Kuoni, Stand 8. Oktober 2026.
  Sie werden ersetzt, sobald eine `offers.json` vorhanden ist (siehe oben).
- Ohne Feed sind die Bilder gezeichnete Illustrationen (SVG). Mit Feed kommen die Fotos der Anbieter.
- Der Chat ist ein Prototyp mit automatischen Antworten.
- Schriften werden von Google Fonts geladen.
