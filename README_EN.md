<div align="center">
  <a href="https://github.com/gabrielbaumgratz" target="_blank">
    <img src="https://img.shields.io/badge/Website-051A42?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
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
  <strong>🇺🇸 English</strong> | 
  <a href="README_ES.md">🇪🇸 Español</a> | 
  <a href="README_DE.md">🇩🇪 Deutsch</a>
</div>
<br>

# Wii Web Videogame

A browser-based mini-game collection controlled entirely by your body movements using your webcam.

No extra hardware is required. Your finger acts as the mouse for navigation, and your hand acts as the controller during matches.

---

## How It Works

- **Capture & Tracking:** The game accesses your webcam and instantly detects the geometry of your hand.
- **Navigation (Dwell Click):** The tip of your index finger controls the menu cursor. Holding your finger still over a button for 1.5s automatically triggers a click.
- **Available Games:**
  - **3D Tennis:** Move your hand vertically and horizontally to align your racket in depth. Uses the official tennis scoring system (15, 30, 40, Deuce, and Advantage).
  - **Moto Racer:** Shift your hand sideways to steer the motorcycle and dodge obstacles.
  - **Air Hockey:** Defend your side by moving your hand vertically to strike the puck (Solo or Local Split-Screen mode).

## How to Run It Locally

Modern browsers block webcam access when opening HTML files directly from the disk. Therefore, you need to start a local server.

1. Clone the repository:
   ```bash
   git clone https://github.com/gabrielbaumgratz/wii-webcam-videogame.git
   cd wii-webcam-videogame
   ```
2. Start the local server (Node.js example):
   ```bash
   npx http-server -p 8000
   ```
3. Open `http://localhost:8000` in your browser.
4. Grant camera permission.

---

## Technologies Used

The project was developed to run smoothly directly in the browser (client-side), featuring an interface based on the *Y2K Futurism* and *Liquid Glass* aesthetic.

- **Frontend:** HTML5, CSS3, and Vanilla JS.
- **Artificial Intelligence:** Motion tracking uses the **MediaPipe** computer vision library (by Google). 
- **Performance:** The AI runs on **WebAssembly (WASM)**, processing the camera feed using highly optimized code in real-time.

---

## Privacy and Security

The entire project architecture is based on local processing. No images, videos, or personal data are transmitted over the internet. Camera reading occurs strictly within your browser's memory solely to extract the geometric coordinates of your hand.

---

## Roadmap

- **Mobile Integration:** Using the smartphone's gyroscope as an alternative controller via a Python WebSocket server.
- **New Game (Golf):** Developing a *swing* mechanic based on arm acceleration.
