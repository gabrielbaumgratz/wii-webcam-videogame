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
    // Usa o maxScore configurado no menu!
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

    let p1Center = paddle1Y + pHeight/2;
    let iaSpeed = 6 * window.difficultyMultiplier;
    if (p1Center < bY - 35) paddle1Y += iaSpeed;
    else if (p1Center > bY + 35) paddle1Y -= iaSpeed;

    let targetY = window.handY * pongCanvas.height;
    paddle2Y += (targetY - (paddle2Y + pHeight/2)) * 0.3;
    
    if (paddle2Y < 0) paddle2Y = 0;
    if (paddle2Y > pongCanvas.height - pHeight) paddle2Y = pongCanvas.height - pHeight;

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
        pongCtx.fillText(p1Score >= window.maxScore ? "PC Venceu" : "Você Venceu", 300, 200);
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
