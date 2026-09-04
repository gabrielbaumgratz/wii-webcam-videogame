const videoElement = document.getElementById('input_video');
const loadingElement = document.getElementById('loading');
const cvs = document.getElementById('gameCanvas'); // Referência para as dimensões

function onResults(results) {
    // Esconde a mensagem de loading assim que os frames começam a chegar
    if (loadingElement.style.display !== 'none') {
        loadingElement.style.display = 'none';
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Pegamos a primeira mão detectada
        const landmarks = results.multiHandLandmarks[0];
        
        // Landmark 9 é a base do dedo médio (no meio da palma), bom pra rastrear
        const handCenterY = landmarks[9].y; 
        
        // landmarks.y é um valor de 0.0 a 1.0. Multiplicamos pela altura do Canvas
        const mappedY = handCenterY * cvs.height;
        
        // Passa a nova posição alvo para o script do jogo (game.js)
        if(window.setPlayer2TargetY) {
            window.setPlayer2TargetY(mappedY);
        }
    }
}

// Configura o MediaPipe Hands
const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 1, // Só precisamos de uma mão
  modelComplexity: 1,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6
});

hands.onResults(onResults);

// Configura a captura da câmera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    // Envia cada frame de vídeo para a IA analisar
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 480
});

// Inicia a câmera
camera.start().catch(err => {
    loadingElement.innerHTML = "Erro ao acessar a câmera. Dê permissão de acesso no navegador e tente novamente.";
    loadingElement.style.color = "red";
    console.error(err);
});
