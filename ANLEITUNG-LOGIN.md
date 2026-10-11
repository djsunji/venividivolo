# Login einrichten (E-Mail, Google, Microsoft, Facebook, Apple)

Die App hat eine fertige Anmeldemaske. Ohne Einrichtung läuft sie im **Demo-Modus**:
Konten mit E-Mail funktionieren, liegen aber nur im Browser des Geräts. Für echte Konten
braucht es einen Login-Dienst. Wir nutzen **Firebase** von Google: kostenlos bis zu sehr
vielen Nutzern, und es kann alle gewünschten Anmeldearten.

Die Menüs in Firebase und bei den Anbietern ändern sich ab und zu. Wenn ein Begriff nicht
genau so heisst, such den ähnlichsten.

## 1. Firebase-Projekt anlegen

1. Auf [console.firebase.google.com](https://console.firebase.google.com) mit einem Google-Konto anmelden.
2. «Projekt hinzufügen», Name z. B. `venividivolo`. Google Analytics kannst du ausschalten.
3. In der Projektübersicht auf das Web-Symbol `</>` klicken, App-Name `Veni Vidi Volo`, «App registrieren».
4. Firebase zeigt einen Block `firebaseConfig = { apiKey: …, authDomain: …, projectId: …, appId: … }`.
   Diese Werte trägst du in `index.html` bei `const FIREBASE_CONFIG = null;` ein, also z. B.
   `const FIREBASE_CONFIG = { apiKey: "AIza…", authDomain: "venividivolo.firebaseapp.com", projectId: "venividivolo", appId: "1:…" };`
   Diese Werte sind nicht geheim (sie stehen in jeder Firebase-Website). Du kannst sie auch
   einfach Claude schicken, dann wird es eingetragen.

## 2. Anmeldearten einschalten

In Firebase: «Authentication» › «Jetzt starten» › Reiter «Sign-in method» (Anmeldemethode).

- **E-Mail/Passwort:** aktivieren, speichern. Fertig.
- **Google:** aktivieren, Support-E-Mail wählen, speichern. Fertig.
- **Microsoft:** Firebase zeigt eine «Weiterleitungs-URI» (endet auf `/__/auth/handler`), kopieren.
  Im [Azure-Portal](https://portal.azure.com) › «App-Registrierungen» › «Neue Registrierung»,
  Kontotyp «Konten in allen Organisationsverzeichnissen und persönliche Microsoft-Konten»,
  Umleitungs-URI (Web) = die kopierte Adresse. Danach unter «Zertifikate & Geheimnisse» einen
  geheimen Clientschlüssel erstellen. Anwendungs-ID und Schlüssel in Firebase eintragen.
- **Facebook:** Auf [developers.facebook.com](https://developers.facebook.com) eine App erstellen
  (Anwendungsfall «Nutzer mit Facebook-Login authentifizieren»). App-ID und App-Geheimcode in
  Firebase eintragen und die Weiterleitungs-URI von Firebase bei Facebook unter
  «Facebook Login» › «Einstellungen» › «Gültige OAuth Redirect URIs» einfügen. Die App auf «Live» stellen.
- **Apple:** braucht ein kostenpflichtiges Apple-Developer-Konto. Wenn du das (noch) nicht
  willst, in `index.html` bei `LOGIN_PROVIDERS` den Eintrag `"apple"` entfernen. Dann
  verschwindet der Knopf. Gleiches gilt für jeden anderen Anbieter, den du nicht einrichtest.

## 3. Deine Website freigeben

«Authentication» › «Einstellungen» › «Autorisierte Domains» › «Domain hinzufügen»:
`<dein-name>.github.io` (und später deine eigene Domain, falls du eine hast).

## 4. Merkliste speichern (Datenbank)

1. In Firebase «Firestore Database» › «Datenbank erstellen», Standort z. B. `europe-west6 (Zürich)`,
   «Produktionsmodus».
2. Reiter «Regeln», den Inhalt von `firestore.rules` hineinkopieren, «Veröffentlichen».
   So sieht jede Person nur ihre eigene Merkliste.

## 5. Testen

Seite neu laden, oben rechts auf das Personen-Symbol tippen, ein Konto erstellen.
Der Hinweis «Demo-Modus» verschwindet, sobald Firebase verbunden ist.

## Rechtliches

Sobald sich Leute registrieren, speicherst du Personendaten. Du brauchst dann eine
**Datenschutzerklärung** (Schweizer DSG, bei EU-Nutzern auch DSGVO) und ein **Impressum**.
Darin steht, dass Firebase (Google) für die Anmeldung genutzt wird.
