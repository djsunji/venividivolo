# Echte Reiseangebote einbinden (Affiliate-Feed)

Die App lädt automatisch die Datei `offers.json`, wenn sie neben `index.html` liegt.
Fehlt die Datei, zeigt sie die 14 Beispielangebote. Die Datei wird jeden Tag von GitHub
selbst neu erstellt: Ein kleines Skript holt deinen Angebots-Feed und wandelt ihn um.

## 1. Bei einem Affiliate-Netzwerk anmelden (machst du)

1. Konto als **Publisher** eröffnen, zum Beispiel bei [Awin](https://www.awin.com/ch).
   Als Website gibst du deine GitHub-Pages-Adresse an (siehe README).
   Awin verlangt beim Anmelden eine kleine, rückzahlbare Gebühr zur Prüfung.
2. Im Netzwerk nach Reiseanbietern suchen, die in der Schweiz verkaufen
   (z. B. «ltur.ch» ist auf Awin gelistet) und dich bei deren Partnerprogramm bewerben.
   Wichtig: Nur Programme mit **Produkt-Feed** liefern einzelne Angebote mit Preis und Bild.
3. Sobald du angenommen bist: Bei Awin im Menü «Toolbox» › «Create-a-Feed» die Programme
   auswählen, Format **CSV**, und die Download-Adresse kopieren. Sie enthält deinen
   persönlichen Schlüssel, darum nie öffentlich teilen.

Andere Netzwerke (Tradedoubler, Travelpayouts usw.) funktionieren ähnlich, solange sie
einen CSV-Feed anbieten. Weichen die Spaltennamen ab, trägst du sie in
`scripts/feed-config.json` ein.

## 2. Feed in GitHub hinterlegen (machst du, einmalig)

Vorher prüfen: Im Repository muss der Ordner `.github/workflows` mit `angebote.yml` liegen.
Beim Hochladen per Drag-and-drop werden versteckte Ordner manchmal ausgelassen. Dann
«Add file» › «Create new file», als Namen `.github/workflows/angebote.yml` eintippen und den
Inhalt der Datei aus dem Zip hineinkopieren.


1. Im Repository: «Settings» › «Secrets and variables» › «Actions» › «New repository secret».
2. Name: `FEED_URLS`, Wert: die kopierte Download-Adresse. Mehrere Feeds mit
   Zeilenumbruch trennen. «Add secret».
3. «Actions» › «Angebote aktualisieren» › «Run workflow». Nach etwa einer Minute liegt
   `offers.json` im Repository und die Seite zeigt die echten Angebote.

Danach läuft das jeden Morgen automatisch.

## Was das Skript macht

- Liest CSV-Feeds, auch gepackt (.gz).
- Erkennt Land, Ort, Nächte, Verpflegung, Sterne und Reiseart aus den Feld- und
  Beschreibungstexten. Die Reisezeit ab Zürich kommt aus einer Tabelle pro Land.
- Übernimmt nur Angebote in CHF mit Preis, Link und erkennbarem Reiseziel
  (max. 200, die grössten Rabatte zuerst).
- Die Fotos aus dem Feed werden in der App gezeigt, die Illustrationen bleiben als Ersatz,
  falls ein Bild nicht lädt.

Lokal testen: `FEED_URLS="https://…" node scripts/import-feed.mjs` oder mit einer
heruntergeladenen Datei `node scripts/import-feed.mjs feed.csv`.

## Gut zu wissen

- Die Links im Feed sind bereits deine Affiliate-Links. Bucht jemand darüber, bekommst
  du die Provision.
- Auf der Seite muss stehen, dass es Werbe- bzw. Partnerlinks sind (Impressum und
  Hinweis). Das gehört zu den Bedingungen der Netzwerke.
