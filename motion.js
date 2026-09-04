const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const loadingHud = document.getElementById('loading-hud');

window.handX = 0.5; // Normalizado (0 a 1)
window.handY = 0.5; // Normalizado (0 a 1)
window.isHandPresent = false;

function onResults(results) {
    if (loadingHud.style.display !== 'none') {
        loadingHud.style.display = 'none';
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        window.isHandPresent = true;
        const landmarks = results.multiHandLandmarks[0];
        
        // Landmark 8: PONTA DO DEDO INDICADOR! (Melhor para apontar botões)
        window.handX = landmarks[8].x; 
        window.handY = landmarks[8].y;

        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 2});
        drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1, radius: 2});
    } else {
        window.isHandPresent = false;
    }
    canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => { await hands.send({image: videoElement}); },
  width: 640, height: 480
});

camera.start().catch(err => {
    loadingHud.innerHTML = "Erro de Câmera";
    loadingHud.style.color = "red";
    console.error(err);
});
