const pongCanvas = document.getElementById("pongCanvas");
const pongCtx = pongCanvas.getContext("2d");

let pongTimer = null;
let p1Score = 0;
let p2Score = 0;
let showingWinScreenPong = false;

const pThick = 15;
const pHeight = 100;
let paddle1Y = 150;
let paddle2Y = 150;

let bX = 400; let bY = 200;
let bSpeedX = 7; let bSpeedY = 5;

function resetPongBall() {
    if (p1Score >= window.maxScore || p2Score >= window.maxScore) showingWinScreenPong = true;
    bSpeedX = -bSpeedX;
    bX = 400; bY = 200;
}

function startPong() {
    p1Score = p2Score = 0;
    showingWinScreenPong = false;
    bX = 400; bY = 200;
    bSpeedX = 7 * window.difficultyMultiplier;
    bSpeedY = 5 * window.difficultyMultiplier;
    
    if (pongTimer) clearInterval(pongTimer);
    pongTimer = setInterval(() => {
        if (window.activeGame === 'pong') { updatePong(); drawPong(); }
        else clearInterval(pongTimer);
    }, 1000/60);
}

function updatePong() {
    if (showingWinScreenPong) return;

    // CONTROLE DA RAQUETE ESQUERDA (PLAYER 1 ou PC)
    if (window.playersMode === 2) {
        // Modo 2 Jogadores: A raquete esquerda usa a mão direita da imagem (invertida, hand2Y)
        // Isso porque quem fica à esquerda da câmera, aparece na direita do canvas espelhado.
        let target1Y = window.hand2Y * pongCanvas.height;
        paddle1Y += (target1Y - (paddle1Y + pHeight/2)) * 0.3;
        
        if (paddle1Y < 0) paddle1Y = 0;
        if (paddle1Y > pongCanvas.height - pHeight) paddle1Y = pongCanvas.height - pHeight;
    } else {
        // Modo 1 Jogador: PC controla a esquerda
        let p1Center = paddle1Y + pHeight/2;
        let iaSpeed = 6 * window.difficultyMultiplier;
        if (p1Center < bY - 35) paddle1Y += iaSpeed;
        else if (p1Center > bY + 35) paddle1Y -= iaSpeed;
    }

    // CONTROLE DA RAQUETE DIREITA (PLAYER 2 / PLAYER PRINCIPAL)
    // Lê a mão da esquerda da imagem (hand1Y)
    let target2Y = window.hand1Y * pongCanvas.height;
    paddle2Y += (target2Y - (paddle2Y + pHeight/2)) * 0.3;
    
    if (paddle2Y < 0) paddle2Y = 0;
    if (paddle2Y > pongCanvas.height - pHeight) paddle2Y = pongCanvas.height - pHeight;

    // Física
    bX += bSpeedX; bY += bSpeedY;

    if (bX < pThick) {
        if (bY > paddle1Y && bY < paddle1Y + pHeight) {
            bSpeedX = -bSpeedX;
            bSpeedY = (bY - (paddle1Y + pHeight/2)) * 0.25;
        } else { p2Score++; resetPongBall(); }
    }
    if (bX > pongCanvas.width - pThick) {
        if (bY > paddle2Y && bY < paddle2Y + pHeight) {
            bSpeedX = -bSpeedX;
            bSpeedY = (bY - (paddle2Y + pHeight/2)) * 0.25;
        } else { p1Score++; resetPongBall(); }
    }
    if (bY < 0 || bY > pongCanvas.height) bSpeedY = -bSpeedY;
}

function drawPong() {
    pongCtx.fillStyle = '#111';
    pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);
    
    if (showingWinScreenPong) {
        pongCtx.fillStyle = 'white';
        pongCtx.font = '30px Arial';
        let winnerText = "";
        if (window.playersMode === 2) {
            winnerText = p1Score >= window.maxScore ? "Jogador 1 (Esquerda) Venceu!" : "Jogador 2 (Direita) Venceu!";
        } else {
            winnerText = p1Score >= window.maxScore ? "PC Venceu" : "Você Venceu";
        }
        pongCtx.fillText(winnerText, 200, 200);
        return;
    }
    
    for (let i = 0; i < pongCanvas.height; i += 40) {
        pongCtx.fillStyle = 'white';
        pongCtx.fillRect(399, i, 2, 20);
    }
    
    pongCtx.fillStyle = '#e94560'; pongCtx.fillRect(0, paddle1Y, pThick, pHeight);
    pongCtx.fillStyle = '#00bfff'; pongCtx.fillRect(pongCanvas.width - pThick, paddle2Y, pThick, pHeight);
    
    pongCtx.fillStyle = 'white';
    pongCtx.beginPath(); pongCtx.arc(bX, bY, 8, 0, Math.PI*2); pongCtx.fill();
    
    pongCtx.font = '40px Arial';
    pongCtx.fillStyle = '#e94560'; pongCtx.fillText(p1Score, 100, 80);
    pongCtx.fillStyle = '#00bfff'; pongCtx.fillText(p2Score, 650, 80);
}
