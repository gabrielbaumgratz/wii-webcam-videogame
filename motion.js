// ==========================================
// ULTRA-OPTIMIZED MOTION ENGINE (Fase 7)
// ==========================================
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d', { alpha: true }); // Otimização para transparência
const loadingHud = document.getElementById('loading-hud');

window.isHandPresent = false;
window.isSecondHandPresent = false;

// Interpolação super rápida
let targetHand1X = 0.5, targetHand1Y = 0.5;
let targetHand2X = 0.5, targetHand2Y = 0.5;
window.hand1X = 0.5; window.hand1Y = 0.5;
window.hand2X = 0.5; window.hand2Y = 0.5;

function applySensitivity(val) {
    let s = (val - 0.5) * window.sensitivity + 0.5;
    return Math.max(0, Math.min(1, s));
}

function onResults(results) {
    if (loadingHud.style.display !== 'none') loadingHud.style.display = 'none';

    // LIMPEZA ABSOLUTA: Não desenhamos mais o frame do vídeo na CPU!
    // O vídeo já aparece lá trás nativamente por CSS na Placa de Vídeo.
    // Desenhamos SÓ os pontinhos brilhantes!
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        window.isHandPresent = true;
        
        let handsData = results.multiHandLandmarks.map(landmarks => {
            return { x: landmarks[8].x, y: landmarks[8].y, marks: landmarks };
        });

        handsData.sort((a, b) => a.x - b.x);

        let tip1 = handsData[0].marks[8];
        targetHand1X = applySensitivity(tip1.x);
        targetHand1Y = applySensitivity(tip1.y);
        
        // Ponto Vermelho super rápido
        canvasCtx.fillStyle = '#e60012';
        canvasCtx.beginPath();
        canvasCtx.arc(tip1.x * canvasElement.width, tip1.y * canvasElement.height, 4, 0, Math.PI*2);
        canvasCtx.fill();

        if (handsData.length > 1) {
            window.isSecondHandPresent = true;
            let tip2 = handsData[1].marks[8];
            targetHand2X = applySensitivity(tip2.x);
            targetHand2Y = applySensitivity(tip2.y);
            
            // Ponto Azul
            canvasCtx.fillStyle = '#0070cc';
            canvasCtx.beginPath();
            canvasCtx.arc(tip2.x * canvasElement.width, tip2.y * canvasElement.height, 4, 0, Math.PI*2);
            canvasCtx.fill();
        } else {
            window.isSecondHandPresent = false;
        }
    } else {
        window.isHandPresent = false;
        window.isSecondHandPresent = false;
    }
}

// LERP (Suavização a 60fps independentes da câmera)
function smoothTracking() {
    window.hand1X += (targetHand1X - window.hand1X) * 0.4; 
    window.hand1Y += (targetHand1Y - window.hand1Y) * 0.4;
    window.hand2X += (targetHand2X - window.hand2X) * 0.4;
    window.hand2Y += (targetHand2Y - window.hand2Y) * 0.4;
    requestAnimationFrame(smoothTracking);
}
smoothTracking();

// INICIALIZAÇÃO MEDIAPIPE LITE (Extremamente rápida)
const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 0, // <--- LITE MODEL: Zero Lag, altíssima velocidade!
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

// ==========================================
// NATIVE CAMERA CAPTURE & requestVideoFrameCallback
// ==========================================
let lastVideoTime = -1;

async function processCameraFrame() {
    if (videoElement.currentTime !== lastVideoTime) {
        lastVideoTime = videoElement.currentTime;
        await hands.send({ image: videoElement });
    }
    // API Nativa: Só envia para a IA quando o hardware capta um frame novo (evita engasgos)
    if ('requestVideoFrameCallback' in videoElement) {
        videoElement.requestVideoFrameCallback(processCameraFrame);
    } else {
        requestAnimationFrame(processCameraFrame);
    }
}

navigator.mediaDevices.getUserMedia({ 
    video: { width: 320, height: 240, frameRate: { ideal: 30, max: 30 } } 
}).then((stream) => {
    videoElement.srcObject = stream;
    videoElement.play();
    videoElement.onloadedmetadata = () => {
        if ('requestVideoFrameCallback' in videoElement) {
            videoElement.requestVideoFrameCallback(processCameraFrame);
        } else {
            processCameraFrame(); // Fallback
        }
    };
}).catch(err => {
    loadingHud.innerHTML = "CAM ERROR";
    console.error(err);
});
