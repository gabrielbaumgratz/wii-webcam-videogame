const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const loadingHud = document.getElementById('loading-hud');

window.isHandPresent = false;
window.isSecondHandPresent = false;
window.hand1X = 0.5; window.hand1Y = 0.5;
window.hand2X = 0.5; window.hand2Y = 0.5;

function applySensitivity(val) {
    let s = (val - 0.5) * window.sensitivity + 0.5;
    if (s < 0) return 0;
    if (s > 1) return 1;
    return s;
}

function onResults(results) {
    if (loadingHud.style.display !== 'none') {
        loadingHud.style.display = 'none';
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // Draw mirrored video with lower opacity for glass look
    canvasCtx.globalAlpha = 0.6;
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.globalAlpha = 1.0;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        window.isHandPresent = true;
        
        let handsData = results.multiHandLandmarks.map(landmarks => {
            return {
                x: landmarks[8].x, // Index finger tip
                y: landmarks[8].y,
                marks: landmarks
            };
        });

        handsData.sort((a, b) => a.x - b.x);

        window.hand1X = applySensitivity(handsData[0].x);
        window.hand1Y = applySensitivity(handsData[0].y);
        
        // Use Accent Green and Atmos Blue for tracking lines
        drawConnectors(canvasCtx, handsData[0].marks, HAND_CONNECTIONS, {color: 'rgba(175, 237, 145, 0.8)', lineWidth: 2});
        drawLandmarks(canvasCtx, handsData[0].marks, {color: '#FFFFFF', lineWidth: 1, radius: 2});

        if (handsData.length > 1) {
            window.isSecondHandPresent = true;
            window.hand2X = applySensitivity(handsData[1].x);
            window.hand2Y = applySensitivity(handsData[1].y);
            
            // Player 2 uses Atmospheric Blue
            drawConnectors(canvasCtx, handsData[1].marks, HAND_CONNECTIONS, {color: 'rgba(72, 100, 150, 0.8)', lineWidth: 2});
            drawLandmarks(canvasCtx, handsData[1].marks, {color: '#FFFFFF', lineWidth: 1, radius: 2});
        } else {
            window.isSecondHandPresent = false;
        }

    } else {
        window.isHandPresent = false;
        window.isSecondHandPresent = false;
    }
    canvasCtx.restore();
}

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
  width: 640, height: 480
});

camera.start().catch(err => {
    loadingHud.innerHTML = "SYSTEM ERROR";
    console.error(err);
});
