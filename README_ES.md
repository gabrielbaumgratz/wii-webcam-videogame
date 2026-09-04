<div align="center">
  <a href="https://github.com/gabrielbaumgratz" target="_blank">
    <img src="https://img.shields.io/badge/Sitio_Web-051A42?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
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
  <strong>🇪🇸 Español</strong> | 
  <a href="README_DE.md">🇩🇪 Deutsch</a>
</div>
<br>

# Wii Web Videogame

Una colección de minijuegos para el navegador controlada enteramente por los movimientos de tu cuerpo utilizando tu cámara web.

No se requiere hardware adicional. Tu dedo actúa como el ratón para la navegación y tu mano actúa como el control durante las partidas.

---

## Cómo Funciona

- **Captura y Seguimiento:** El juego accede a tu cámara y detecta la geometría de tu mano al instante.
- **Navegación (Dwell Click):** La punta de tu dedo índice controla el cursor del menú. Mantener el dedo quieto sobre un botón durante 1.5s activa un clic automáticamente.
- **Juegos Disponibles:**
  - **Tenis 3D:** Mueve tu mano vertical y horizontalmente para alinear la raqueta en profundidad. Utiliza el sistema de puntuación oficial de tenis (15, 30, 40, Iguales y Ventaja).
  - **Moto Racer:** Desplaza tu mano lateralmente para guiar la motocicleta y esquivar obstáculos.
  - **Hockey de Mesa:** Defiende tu lado moviendo la mano verticalmente para golpear el disco (Modo Solo o Pantalla Dividida local).

## 🚀 Cómo Ejecutarlo Localmente (Paso a Paso)
 
Para proteger tu privacidad, los navegadores modernos bloquean el acceso a la cámara si abres un archivo HTML directamente. Para jugar, necesitamos "fingir" que el sitio está en internet creando un **servidor local**. ¡Es muy fácil, solo sigue estas instrucciones!

### Requisitos previos
Necesitarás al menos UNO de los siguientes programas instalados en tu computadora:
- [Node.js](https://nodejs.org/es) (Versión 14+ recomendada)
- **O** [Python](https://www.python.org/downloads/) (Versión 3.7+ recomendada)

### Paso 1: Descargar los Archivos
1. Descarga los archivos (Usa el botón verde **"Code" -> "Download ZIP"** en la parte superior), o si prefieres la terminal:
   ```bash
   git clone https://github.com/gabrielbaumgratz/wii-webcam-videogame.git
   ```
2. Si descargaste el ZIP, extráelo en una carpeta de tu computadora.
3. Abre tu terminal (Símbolo del sistema/PowerShell en Windows, Terminal en Mac/Linux) y navega hasta la carpeta del juego.

### Paso 2: Iniciar el Servidor Local
Dentro de la carpeta del juego, escribe **SOLO UNO** de los siguientes comandos, dependiendo de lo que hayas instalado:

**Si elegiste Node.js:**
```bash
npx http-server -p 8000
```
*(Si te pide instalar el paquete, escribe "y" y presiona Enter)*

**Si elegiste Python:**
```bash
python -m http.server 8000
```

### Paso 3: ¡A Jugar!
1. **No cierres la ventana de la terminal** (es el motor del juego por ahora).
2. Abre Google Chrome, Edge o Safari.
3. En la barra de direcciones, escribe EXACTAMENTE este enlace y presiona Enter:
   👉 **`http://localhost:8000`**
4. El navegador te preguntará si permites el acceso a la Cámara. Haz clic en **Permitir**.
5. ¡Aléjate un poco, levanta la mano y diviértete!

---

## Tecnologías Utilizadas

El proyecto fue desarrollado para ejecutarse de manera fluida directamente en el navegador (client-side), con una interfaz basada en la estética *Y2K Futurism* y *Liquid Glass*.

- **Frontend:** HTML5, CSS3 y JavaScript puro (Vanilla JS).
- **Inteligencia Artificial:** El seguimiento de movimiento utiliza la biblioteca de visión por computadora **MediaPipe** (de Google). 
- **Rendimiento:** La IA se ejecuta sobre **WebAssembly (WASM)**, procesando la señal de la cámara mediante código optimizado en tiempo real.

---

## Privacidad y Seguridad

Toda la arquitectura del proyecto se basa en procesamiento local. Ninguna imagen, video o dato personal se transmite por internet. La lectura de la cámara ocurre estrictamente en la memoria de tu navegador solo para extraer las coordenadas geométricas de la mano.

---

## Próximos Pasos (Roadmap)

- **Integración Móvil:** Uso del giroscopio del teléfono como controlador alternativo a la cámara, utilizando un servidor Python con WebSockets.
- **Nuevo Juego (Golf):** Desarrollo de una mecánica de *swing* basada en la aceleración del brazo.
