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

## 🚀 How to Run It Locally (Step-by-Step)
 
To protect your privacy, modern browsers block webcam access if you try opening an HTML file directly from your disk. To play at home, we need to "pretend" the site is on the internet by creating a **local server**. It's very easy, just follow these instructions!

### Prerequisites
You will need at least ONE of the following programs installed on your computer:
- [Node.js](https://nodejs.org/) (Version 14+ recommended)
- **OR** [Python](https://www.python.org/downloads/) (Version 3.7+ recommended)

### Step 1: Download the Files
1. Download the game files (Use the green **"Code" -> "Download ZIP"** button at the top of this page), or if you prefer the terminal:
   ```bash
   git clone https://github.com/gabrielbaumgratz/wii-webcam-videogame.git
   ```
2. If you downloaded the ZIP, extract it to a folder on your computer.
3. Open your terminal (Command Prompt/PowerShell on Windows, Terminal on Mac/Linux) and navigate to the extracted game folder.

### Step 2: Start the Local Server
Inside the game folder, type just **ONE** of the commands below, depending on what you installed:

**If you chose Node.js:**
```bash
npx http-server -p 8000
```
*(If it asks to install the package, type "y" and press Enter)*

**If you chose Python:**
```bash
python -m http.server 8000
```

### Step 3: Time to Play!
1. **Do not close the terminal window** (it's the game's engine for now).
2. Open Google Chrome, Edge, or Safari.
3. In the address bar at the top, type EXACTLY this link and press Enter:
   👉 **`http://localhost:8000`**
4. The browser will ask if you allow Camera access. Click **Allow**.
5. Step back a bit, raise your hand, and have fun!

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
