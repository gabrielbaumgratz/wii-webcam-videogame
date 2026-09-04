<div align="center">
  <a href="https://github.com/gabrielbaumgratz" target="_blank">
    <img src="https://img.shields.io/badge/Webseite-051A42?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
  </a>
  <a href="https://linkedin.com/in/gabrielbaumgratz" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://instagram.com/gabrielbaumgratz" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
</div>
<br>
<div align="center">
  <a href="README.md">🇧🇷 Português</a> | 
  <a href="README_EN.md">🇺🇸 English</a> | 
  <a href="README_ES.md">🇪🇸 Español</a> | 
  <strong>🇩🇪 Deutsch</strong>
</div>
<br>

# Wii Web Videogame

Eine Browser-basierte Minispielsammlung, die vollständig durch Ihre Körperbewegungen über Ihre Webcam gesteuert wird.

Keine zusätzliche Hardware erforderlich. Ihr Finger fungiert als Maus für die Navigation und Ihre Hand als Controller während der Spiele.

---

## Wie es funktioniert

- **Erfassung & Tracking:** Das Spiel greift auf Ihre Webcam zu und erkennt sofort die Geometrie Ihrer Hand.
- **Navigation (Dwell Click):** Die Spitze Ihres Zeigefingers steuert den Menüzeiger. Wenn Sie Ihren Finger 1,5 Sekunden lang über einer Schaltfläche halten, wird automatisch ein Klick ausgelöst.
- **Verfügbare Spiele:**
  - **3D-Tennis:** Bewegen Sie Ihre Hand vertikal und horizontal, um Ihren Schläger in der Tiefe auszurichten. Verwendet das offizielle Tennis-Zählsystem (15, 30, 40, Einstand und Vorteil).
  - **Moto Racer:** Bewegen Sie Ihre Hand seitwärts, um das Motorrad zu lenken und Hindernissen auszuweichen.
  - **Air Hockey:** Verteidigen Sie Ihre Seite, indem Sie Ihre Hand vertikal bewegen, um den Puck zu schlagen (Solo- oder lokaler Split-Screen-Modus).

## 🚀 Wie man es lokal ausführt (Schritt für Schritt)
 
Um Ihre Privatsphäre zu schützen, blockieren moderne Browser den Kamerazugriff, wenn Sie HTML-Dateien direkt von der Festplatte öffnen. Um zu spielen, müssen wir einen **lokalen Server** erstellen. Es ist sehr einfach, folgen Sie einfach diesen Anweisungen!

### Voraussetzungen
Sie benötigen mindestens EINES der folgenden Programme auf Ihrem Computer:
- [Node.js](https://nodejs.org/) (Version 14+ empfohlen)
- **ODER** [Python](https://www.python.org/downloads/) (Version 3.7+ empfohlen)

### Schritt 1: Dateien herunterladen
1. Laden Sie die Spieldateien herunter (Verwenden Sie den grünen Button **"Code" -> "Download ZIP"** oben), oder über das Terminal:
   ```bash
   git clone https://github.com/gabrielbaumgratz/wii-webcam-videogame.git
   ```
2. Entpacken Sie die ZIP-Datei in einen Ordner.
3. Öffnen Sie Ihr Terminal (Eingabeaufforderung/PowerShell unter Windows, Terminal unter Mac/Linux) und navigieren Sie zum Spielordner.

### Schritt 2: Lokalen Server starten
Geben Sie im Spielordner **NUR EINEN** der folgenden Befehle ein, je nachdem, was Sie installiert haben:

**Wenn Sie Node.js gewählt haben:**
```bash
npx http-server -p 8000
```
*(Wenn Sie zur Installation des Pakets aufgefordert werden, geben Sie "y" ein und drücken Sie Enter)*

**Wenn Sie Python gewählt haben:**
```bash
python -m http.server 8000
```

### Schritt 3: Zeit zum Spielen!
1. **Schließen Sie das Terminalfenster nicht** (es ist vorerst der Motor des Spiels).
2. Öffnen Sie Google Chrome, Edge oder Safari.
3. Geben Sie in der Adressleiste GENAU diesen Link ein und drücken Sie Enter:
   👉 **`http://localhost:8000`**
4. Der Browser fragt, ob Sie den Kamerazugriff erlauben. Klicken Sie auf **Zulassen**.
5. Treten Sie ein wenig zurück, heben Sie die Hand und haben Sie Spaß!

---

## Verwendete Technologien

Das Projekt wurde so entwickelt, dass es reibungslos direkt im Browser (clientseitig) läuft und verfügt über eine Benutzeroberfläche, die auf der *Y2K Futurism* und *Liquid Glass* Ästhetik basiert.

- **Frontend:** HTML5, CSS3 und Vanilla JS.
- **Künstliche Intelligenz:** Das Motion Tracking nutzt die Computer-Vision-Bibliothek **MediaPipe** (von Google). 
- **Leistung:** Die KI läuft auf **WebAssembly (WASM)**, wodurch der Kamera-Feed mit hochoptimiertem Code in Echtzeit verarbeitet wird.

---

## Datenschutz und Sicherheit

Die gesamte Projektarchitektur basiert auf lokaler Verarbeitung. Es werden keine Bilder, Videos oder persönlichen Daten über das Internet übertragen. Die Kameraauslesung erfolgt ausschließlich im Speicher Ihres Browsers, nur um die geometrischen Koordinaten Ihrer Hand zu extrahieren.

---

## Roadmap

- **Mobile Integration:** Nutzung des Smartphone-Gyroskops als alternativer Controller über einen Python-WebSocket-Server.
- **Neues Spiel (Golf):** Entwicklung einer *Schwung*-Mechanik, die auf Armbeschleunigung basiert.
