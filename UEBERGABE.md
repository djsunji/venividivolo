# Übergabe: Veni Vidi Volo

Vollständige Zusammenfassung des Projekts für Claude Code. Stand: 11. Oktober 2026.
Kurzfassung und Arbeitsregeln stehen in `CLAUDE.md`. Diese Datei ergänzt sie mit Geschichte, Entscheidungen und allen Details.

---

## 1. Worum es geht

**Veni Vidi Volo** ist eine Web-App, in der man Reiseangebote wie bei Tinder durchwischt:
rechts = gefällt mir (wird gemerkt), links = kein Interesse. Zielgruppe: Reisende ab Zürich bzw. der Schweiz.
Die App verkauft selbst nichts. Der Buchungsknopf führt zum Reiseanbieter, idealerweise über einen Affiliate-Link (Provision).

- Betreiber: **Dejan Ehrbar**, Schöngrünstrasse 64f, 4500 Solothurn, Schweiz, dejan.ehrbar@bluewin.ch
- Live: **https://djsunji.github.io/venividivolo/** (GitHub Pages)
- Repository: **https://github.com/djsunji/venividivolo**, Branch `main`, Pages aus `/ (root)`
- Lokal bei Dejan: `D:\claude\venividivolo`
- Prototyp-Version in claude.ai: https://claude.ai/artifact/2YxP9BjHrRJ3UcERU9Rmns (ab jetzt ist das **Repository die Quelle**, nicht dieser Prototyp)
- Sprache der App und mit Dejan: **Deutsch, Schweizer Schreibweise** (ss statt ß, CHF, «Guillemets»)

---

## 2. Funktionen (alles in `index.html`)

### Entdecken (Kartenstapel)
- Karte mit Foto bzw. Illustration, Preis «ab p.P.», Route `ZRH → IATA · Reisezeit`, Badge «Last Minute».
- Unten: Ort, Hotel · Land · Sterne, Fakten (Nächte, Verpflegung, Weiterempfehlung %), Reisearten.
- **Wischen** über 100 px = Entscheidung (Stempel «VOLO» / «NON»). Knöpfe: ✕ (nein), i (Details), ♥ (gefällt mir).
- **Tippen ins Bild**: linkes Drittel = vorheriges Foto, rechtes Drittel = nächstes Foto, Mitte = Details öffnen.
  Runde Pfeile links/rechts im Bild zeigen das an (`.phnav`, nur Hinweis, `pointer-events: none`), Fortschrittsbalken oben.
- Desktop-Tasten: ← nein, → ja, ↑ Details, Leertaste nächstes Foto.
- Erstes «Gefällt mir» zeigt einen **Match-Screen** mit Logo und Konfetti (nur einmal, `matchSeen`).

### Gemerkt
- Liste der gemerkten Angebote, Umschalter «Gemerkt / Alle Treffer», «Liste leeren».
- Desktop: dreispaltig (Filter links, Karten Mitte, Gemerkt rechts).

### Filter
- **Reiseart**: Pauschalreise, All Inclusive, Nur Hotel, Städtereise, Kreuzfahrt, Rundreise, Wellness, Last Minute.
- **Max. Reisezeit ab Zürich**: Regler 1 bis 24 h (Schritt 0,5). Hinweis klein darunter: ab mehr als 12 h kommen Kontinente.
- **Land** (bis 12 h): Chips der vorhandenen Länder + **eigene Länder als Tags** (Eingabefeld mit Vorschlagsliste `COUNTRY_LIST`, Enter/Komma/+).
  Für eingegebene Länder ohne Angebote erscheint ein Hinweis.
- **Region / Kontinent** (über 12 h): ersetzt die Länder. Kontinente (Europa, Afrika, Asien, …) und Regionen
  (Südeuropa, Nordeuropa, Nordafrika, Südostasien, …) aus der Tabelle `REGION`.
- **Reisende**: Erwachsene (1–6), Kinder 2–17 J. (0–4, je mit Altersauswahl), Babys unter 2 J. (höchstens 1 pro Erwachsenen).
- **Reisedatum**: Abreise frühestens / spätestens + Knopf **«Flexibel ± 2 Tage»**.
- Kein «Zurücksetzen»-Knopf (bewusst entfernt). Der Anwenden-Knopf zeigt die Trefferzahl.

### Detailseite
- Fotogalerie mit Pfeilen und Punkten, Hotel, Sterne, Region, Weiterempfehlung.
- Flugroute ZRH → Ziel mit Dauer, Hin-/Rückreise (nächster passender Termin), Dauer, Verpflegung, Reiseart, Reisende, Veranstalter.
- Text «Über das Angebot», «Inbegriffen», Preisaufstellung für die Gruppe (Kinder- und Babypreise «beim Anbieter»).
- Hinweis: Ab-Preis laut Anbieter, Stand-Datum, Buchungslink kann Partnerlink sein.
- **Chat-Prototyp** mit der «Reiseberatung» des Anbieters: automatische Antworten im Browser (Verfügbarkeit, Preis, Kinder, Transfer …), keine echte Verbindung.
- Knopf «Bei <Anbieter> buchen».

### Konto / Login
- Personen-Symbol oben rechts öffnet die Anmeldemaske: Anmelden / Registrieren, E-Mail + Passwort, Passwort anzeigen,
  «Passwort vergessen?», Knöpfe **Google, Microsoft, Facebook, Apple**.
- Angemeldet: Avatar mit Initiale/Profilbild, Name, E-Mail, Abmelden. Merkliste wird mit dem Konto gespeichert.
- **Demo-Modus** (solange `FIREBASE_CONFIG = null`): E-Mail-Konten nur im Browser (`accounts`, Passwort als SHA-256), Social-Login zeigt Hinweis.

### Sonstiges
- **Tag-/Nachtmodus** (Knopf oben rechts), Standard: Tag.
- Links zu **Impressum** und **Datenschutz** im Filter, bei Gemerkt, in der Login-Maske und auf dem Desktop unter der Karte.

---

## 3. Technik

### Dateien
| Datei | Zweck |
|---|---|
| `index.html` | ganze App, keine Abhängigkeiten, kein Build |
| `logo-full.png`, `logo-mark.png`, `logo-word.png` | Logo (schwarze Strichzeichnung, transparent). In der App als data-URI eingebettet, PNGs für Favicon und Rechtsseiten |
| `impressum.html`, `datenschutz.html` | Rechtsseiten mit Dejans Angaben, gleiche Optik, Nachtmodus über `localStorage` |
| `scripts/import-feed.mjs` | Affiliate-Feed (CSV, auch .gz) → `offers.json`, Node 18+, keine Pakete |
| `scripts/feed-config.json` | Spaltennamen (voreingestellt für Awin), Währung CHF, `maxOffers` 200, `minPrice` 99 |
| `.github/workflows/angebote.yml` | täglich 04:00 UTC + manuell: Import ausführen, `offers.json` committen |
| `firestore.rules` | Jede Person liest/schreibt nur `users/{uid}` |
| `ANLEITUNG-ANGEBOTE.md`, `ANLEITUNG-LOGIN.md` | Schritt-für-Schritt für Dejan |
| `README.md` | Überblick, GitHub-Pages-Anleitung |

### Aufbau von `index.html`
- **CSS**: Tokens auf `:root`. Das Design wurde oft umgebaut, darum gibt es viele nacheinander angehängte CSS-Blöcke;
  **spätere Blöcke gewinnen**. Neue Styles als eigenen Block direkt vor `/* ---------- Desktop ---------- */` einfügen.
  Aktuelle Farben (Block «Farbakzente»): `--bg #F8F3EA`, `--sun #E0623F` (Koralle), `--sea #1D6F80` (Petrol), `--sand #C98F45`;
  Nacht: `--sun #F08A66`, `--sea #5FB3C2`. Schriften: Manrope (Text), Cormorant Garamond (Titel), über Google Fonts.
- **Nachtmodus**: `:root[data-theme="dark"]`, `body.is-dark`, gespeichert als `reisetinder:theme2`.
- **Desktop** ab 1000 px Breite (`isDesk()`).
- **localStorage** (Präfix `reisetinder:`): `filters2`, `liked`, `seen`, `theme2`, `matchSeen`, `session`, `accounts`.
  Zugriff nur über `store.get/set`. `store.set("liked")` löst `cloudSave()` aus.

### Datenmodell eines Angebots (`OFFERS` bzw. `offers.json`)
```
{ id, place, region, country, iata, mode ("Flug"|"Bahn"|"Bus"), hours (Reisezeit ab ZRH),
  hotel, stars (0 = ausblenden), rec (HolidayCheck-%, optional), board, types [..],
  nights, dur (optional, z. B. "9 Tage"), price (p.P. bei 2 Erw.), was (Streichpreis), child (null = beim Anbieter),
  kids (true/false), from, until (Reisezeitraum ISO), dep (Wochentag oder null),
  agency (Schlüssel in AGENCIES) oder agencyName, url, images [..] (Feed-Fotos),
  look (Illustrationsstil), scene, pal (Farben der Illustration), text, incl [..] }
```
- `normalizeOffer()` füllt fehlende Felder bei Feed-Angeboten auf.
- `nextDeparture()` sucht den ersten passenden Abreisetag im Filterzeitraum (mit ± 2 Tagen bei «flexibel»).
- `matches()` filtert: Reiseart, Reisezeit, Länder bzw. Regionen, Kinder/Babys nur bei `kids: true`, Datum.

### Angebote
- **Jetzt**: 14 echte Angebote von **lastminute.ch, TUI Suisse und Kuoni**, Stand 8. Oktober 2026, fest in `OFFERS`
  (Mallorca, Kreta, Sardinien, Côte d'Azur, Aldiana-Clubs Fuerteventura/Andalusien/Djerba/Kalabrien, TUI Mallorca ×3,
  Kuoni-Rundreisen Thailand/Süditalien/Island). Einige Last-Minute-Termine sind inzwischen abgelaufen.
  Ohne Feed bleibt `TODAY` auf dem 8.10.2026 fixiert, damit die Beispiele sichtbar bleiben.
- **Mit Feed**: Liegt `offers.json` neben `index.html`, ersetzt sie die Beispiele, `TODAY` = echtes Datum, Fotos aus dem Feed.
- Bilder ohne Feed sind **gezeichnete SVG-Szenen** (`scene`, `sceneHotel`, `sceneRoom`, `sceneActivity`, Stile in `LOOKS`),
  weil echte Fotos im Prototyp nicht geladen werden konnten.

### Feed-Import (`scripts/import-feed.mjs`)
- Quellen: Umgebungsvariable `FEED_URLS` (mehrere durch Leerzeichen/Zeilenumbruch) oder Datei als Argument.
- Erkennt Land (Spalte, sonst aus Text über Länder-, Orts- und englische Namenslisten), Ort, Nächte, Verpflegung, Sterne, Reiseart.
- Reisezeit und Flughafen pro Land aus der Tabelle `DEST` (ca.-Flugzeiten ab ZRH).
- Übernimmt nur CHF-Angebote mit Preis, Link und erkennbarem Ziel, sortiert nach Rabatt, max. 200.
- Getestet mit einer Beispiel-CSV im Awin-Format. Mit einem echten Awin-Feed noch **nicht** getestet: Spaltennamen ggf. in `feed-config.json` anpassen.

### Login (Firebase)
- `FIREBASE_CONFIG` (Zeile mit `const FIREBASE_CONFIG = null;`) – wenn gesetzt, lädt die App
  `firebase-app/auth/firestore-compat.js` Version `FB_VER` (10.14.1) von `cdn.jsdelivr.net`.
- Anbieter: `GoogleAuthProvider`, `FacebookAuthProvider`, `OAuthProvider("microsoft.com")`, `OAuthProvider("apple.com")`,
  Popup mit Fallback auf Redirect. `LOGIN_PROVIDERS` steuert, welche Knöpfe sichtbar sind.
- Fehlermeldungen auf Deutsch in `AUTH_ERR`. Merkliste: Firestore `users/{uid}` `{ liked, updated }`, beim Login mit lokaler Liste zusammengeführt.
- Der firebaseConfig-Block ist **nicht geheim** und darf ins Repository.

---

## 4. Externe Konten und Stand

| Dienst | Stand | Nächster Schritt |
|---|---|---|
| GitHub (djsunji) | Repo + Pages laufen | – |
| **Awin** (Affiliate) | Publisher-Profil angenommen (11.10.2026) | Bei Reiseanbietern **mit Produkt-Feed** bewerben (z. B. ltur.ch), dann Create-a-Feed (CSV) → Link als GitHub-Secret `FEED_URLS`, Workflow «Angebote aktualisieren» starten |
| **Firebase** | noch nicht angelegt | Projekt anlegen, E-Mail + Google aktivieren, Microsoft (Azure-App), Facebook (Meta-App), Apple (nur mit Developer-Konto, sonst aus `LOGIN_PROVIDERS` entfernen), Domain `djsunji.github.io` autorisieren, Firestore (europe-west6) + `firestore.rules` |

**Wichtig:** Der Awin-Feed-Link enthält einen persönlichen API-Schlüssel. Nie in Code, Commits oder Chat, nur als GitHub-Secret.

---

## 5. Design-Geschichte und Vorlieben von Dejan

Reihenfolge der Wünsche (das Letzte gilt):
1. Römisch/antik → zu schwer. 2. Schlichter. 3. Goldenes Logo → **«Das Gold geht nicht»**.
4. «Moderner, heller, einladender, es ist eine Ferien-App». 5. Türkis/Koralle. 6. Neues **schwarzes Strich-Logo**
(Dreieck mit Sonne, Palmen, Meer + Schriftzug «VENI VIDI VOLO») mit monochromem Papier-Stil.
7. «Bisschen farbiger» → aktuelle Koralle-/Petrol-Akzente. 8. Logo muss im Nachtmodus sichtbar sein (invertiert).

Arbeitsweise, die gut ankam:
- Direkt umsetzen statt viel fragen; kurze Antworten auf Deutsch, ohne Fachjargon.
- Nach jeder Änderung: testen (mobil ~400 px und Desktop 1440 px, Tag/Nacht), dann veröffentlichen.
- Dejan schickt oft Screenshots von Problemen (z. B. PowerShell). Dejan arbeitet unter Windows.
- Änderungen dürfen direkt auf `main` (GitHub Pages veröffentlicht automatisch).

---

## 6. Offene Punkte und Ideen

**Offen (braucht Dejan):**
- Awin-Feed verbinden (siehe oben). Danach Import mit echtem Feed prüfen und `feed-config.json` anpassen.
- Firebase einrichten, Config eintragen, Login mit allen Anbietern testen.

**Technisch sinnvoll als Nächstes:**
- Konto löschen in der App (aktuell nur per E-Mail-Anfrage, siehe Datenschutz Punkt 10).
- Beispielangebote aktualisieren oder ausblenden, sobald der Feed läuft (abgelaufene Last-Minute-Termine).
- Automatische Tests (z. B. Playwright): Tippzonen, Filterzähler, Login-Demo, Mobil/Desktop, Tag/Nacht.
- Eigene Domain (z. B. venividivolo.ch) für GitHub Pages; dann auch in Firebase autorisieren.
- Bei neuen Diensten (Analytics, Werbung, weitere Partner) `datenschutz.html` nachführen.
- Optional: Inhalte der Claude-Design-Skizze (https://claude.ai/artifact/Wd4WcwPgH9MtwV1XvEJfrQ) übernehmen; sie nutzt noch das alte türkise Logo.

---

## 7. Lokal arbeiten

```
cd D:\claude\venividivolo
git pull
npx serve .            # oder: python -m http.server 8000
```
`offers.json` wird per `fetch` geladen und funktioniert nicht über `file://`.

Feed-Import lokal testen:
```
node scripts/import-feed.mjs pfad\zu\feed.csv
```

Veröffentlichen:
```
git add -A
git commit -m "Beschreibung"
git push
```
