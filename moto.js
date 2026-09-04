const mCvs = document.getElementById("motoCanvas");
const mCtx = mCvs.getContext("2d");

let motoTimer = null;
let mPlayerX = 400; 
let obstacles = [];
let mScore = 0;
let mGameOver = false;

function startMoto() {
    obstacles = [];
    mScore = 0;
    mGameOver = false;
    mPlayerX = 400;
    
    if (motoTimer) clearInterval(motoTimer);
    motoTimer = setInterval(() => {
        if (window.activeGame === 'moto') {
            updateMoto();
            drawMoto();
        } else {
            clearInterval(motoTimer);
        }
    }, 1000/60);
}

function updateMoto() {
    if (mGameOver) return;
    
    // Controlar a moto guiando a mão pra esquerda e pra direita
    let targetX = (1 - window.hand1X) * mCvs.width;
    mPlayerX += (targetX - mPlayerX) * 0.2;
    if(mPlayerX < 150) mPlayerX = 150;
    if(mPlayerX > 650) mPlayerX = 650;

    mScore++; // Pontuação aumenta enquanto sobrevive
    
    // Gerar obstáculos no horizonte (Dificuldade afeta a chance)
    if (Math.random() < 0.03 * window.difficultyMultiplier) {
        obstacles.push({
            x: 400 + (Math.random() - 0.5) * 200, // Surge no centro da pista
            z: 1 // 1 é muito longe (horizonte), 0 é batendo na câmera
        });
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.z -= 0.015 * window.difficultyMultiplier; // Vem na sua direção
        
        // Posição Real na Tela (Perspectiva Central)
        let spreadX = obs.x - 400;
        let actualX = 400 + (spreadX / Math.max(obs.z, 0.1));
        
        // Se chegou no Z 0.1, está na mesma linha da moto
        if (obs.z < 0.1 && obs.z > -0.1) {
            let dx = Math.abs(actualX - mPlayerX);
            if (dx < 45) { // Bateu
                mGameOver = true;
            }
        }
        
        // Passou da tela
        if (obs.z < -0.2) obstacles.splice(i, 1);
    }
}

function drawMoto() {
    // Fundo da estrada
    mCtx.fillStyle = '#000022';
    mCtx.fillRect(0, 0, 800, 200); // Céu
    mCtx.fillStyle = '#111';
    mCtx.fillRect(0, 200, 800, 200); // Chão
    
    // Pista desenhada em trapézio (perspectiva)
    mCtx.fillStyle = '#333';
    mCtx.beginPath();
    mCtx.moveTo(350, 200);
    mCtx.lineTo(450, 200);
    mCtx.lineTo(750, 400);
    mCtx.lineTo(50, 400);
    mCtx.fill();

    // Faixas da pista
    let faixaOffset = (mScore * window.difficultyMultiplier) % 40;
    mCtx.fillStyle = '#fff';
    mCtx.beginPath();
    mCtx.moveTo(400, 200);
    mCtx.lineTo(400, 400);
    mCtx.stroke(); // Simples linha no meio por enquanto

    // Desenha obstáculos (carros/caixas)
    obstacles.forEach(obs => {
        let spreadX = obs.x - 400;
        let actualX = 400 + (spreadX / Math.max(obs.z, 0.1));
        let actualY = 200 + ((400 - 200) * (1 - obs.z)); // Desce na tela
        
        // Aumenta de tamanho conforme chega perto
        let width = 40 * (1 - obs.z);
        let height = 40 * (1 - obs.z);
        
        mCtx.fillStyle = '#e94560'; // Obstáculo vermelho
        mCtx.fillRect(actualX - width/2, actualY - height, width, height);
    });

    // Moto (Você)
    mCtx.fillStyle = '#00bfff';
    mCtx.fillRect(mPlayerX - 20, 320, 40, 60);

    // Texto de Pontuação
    mCtx.fillStyle = 'white';
    mCtx.font = '24px Arial';
    mCtx.fillText("Score: " + mScore, 20, 40);

    if (mGameOver) {
        mCtx.fillStyle = '#e94560';
        mCtx.font = '40px Arial';
        mCtx.fillText("BATEU!", 330, 150);
        mCtx.font = '20px Arial';
        mCtx.fillText("Clique no Menu para voltar", 280, 190);
    }
}
