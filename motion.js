// ==========================================
// MOTION ENGINE EXTREMAMENTE OTIMIZADA
// ==========================================
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const loadingHud = document.getElementById('loading-hud');

window.isHandPresent = false;
window.isSecondHandPresent = false;

// Variáveis com interpolação suave (Lerp)
let targetHand1X = 0.5, targetHand1Y = 0.5;
let targetHand2X = 0.5, targetHand2Y = 0.5;

window.hand1X = 0.5; window.hand1Y = 0.5;
window.hand2X = 0.5; window.hand2Y = 0.5;

function applySensitivity(val) {
    let s = (val - 0.5) * window.sensitivity + 0.5;
    if (s < 0) return 0;
    if (s > 1) return 1;
    return s;
}

function onResults(results) {
    if (loadingHud.style.display !== 'none') loadingHud.style.display = 'none';

    // Desenha apenas a câmera crua, sem sombras, sem transparências
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        window.isHandPresent = true;
        
        let handsData = results.multiHandLandmarks.map(landmarks => {
            return { x: landmarks[8].x, y: landmarks[8].y, marks: landmarks };
        });

        handsData.sort((a, b) => a.x - b.x);

        targetHand1X = applySensitivity(handsData[0].x);
        targetHand1Y = applySensitivity(handsData[0].y);
        
        // Desenha apenas pontinhos para máxima performance
        drawLandmarks(canvasCtx, handsData[0].marks, {color: '#AFED91', lineWidth: 1, radius: 2});

        if (handsData.length > 1) {
            window.isSecondHandPresent = true;
            targetHand2X = applySensitivity(handsData[1].x);
            targetHand2Y = applySensitivity(handsData[1].y);
            drawLandmarks(canvasCtx, handsData[1].marks, {color: '#486496', lineWidth: 1, radius: 2});
        } else {
            window.isSecondHandPresent = false;
        }
    } else {
        window.isHandPresent = false;
        window.isSecondHandPresent = false;
    }
}

// Loop contínuo de suavização (Smoothing) para arrumar a "câmera travando"
function smoothTracking() {
    window.hand1X += (targetHand1X - window.hand1X) * 0.3; // Interpolação super leve
    window.hand1Y += (targetHand1Y - window.hand1Y) * 0.3;
    window.hand2X += (targetHand2X - window.hand2X) * 0.3;
    window.hand2Y += (targetHand2Y - window.hand2Y) * 0.3;
    requestAnimationFrame(smoothTracking);
}
smoothTracking();

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => { await hands.send({image: videoElement}); },
  width: 320, height: 240 // Redução da resolução interna para economizar CPU
});

camera.start().catch(err => {
    loadingHud.innerHTML = "ERROR";
    console.error(err);
});
