// PONG LOGIC
const pongCanvas = document.getElementById("pongCanvas");
const pongCtx = pongCanvas.getContext("2d");

let pongTimer = null;
let p1Score = 0; let p2Score = 0;
let showingWinScreenPong = false;

const pThick = 15; const pHeight = 100;
let paddle1Y = 150; let paddle2Y = 150;
let bX = 400; let bY = 200;
let bSpeedX = 7; let bSpeedY = 5;

// Colors matching the aesthetic
const colP1 = 'rgba(72, 100, 150, 0.9)'; // Atmos Blue
const colP2 = 'rgba(175, 237, 145, 0.9)'; // Accent Green
const colBall = '#FFFFFF';

function resetPongBall() {
    if (p1Score >= window.maxScore || p2Score >= window.maxScore) showingWinScreenPong = true;
    bSpeedX = -bSpeedX; bX = 400; bY = 200;
}

function startPong() {
    p1Score = p2Score = 0; showingWinScreenPong = false;
    bX = 400; bY = 200;
    bSpeedX = 7 * window.difficultyMultiplier; bSpeedY = 5 * window.difficultyMultiplier;
    
    if (pongTimer) clearInterval(pongTimer);
    pongTimer = setInterval(() => {
        if (window.activeGame === 'pong') { updatePong(); drawPong(); }
        else clearInterval(pongTimer);
    }, 1000/60);
}

function updatePong() {
    if (showingWinScreenPong) return;

    if (window.playersMode === 2) {
        let target1Y = window.hand2Y * pongCanvas.height;
        paddle1Y += (target1Y - (paddle1Y + pHeight/2)) * 0.3;
        if (paddle1Y < 0) paddle1Y = 0;
        if (paddle1Y > pongCanvas.height - pHeight) paddle1Y = pongCanvas.height - pHeight;
    } else {
        let p1Center = paddle1Y + pHeight/2;
        let iaSpeed = 6 * window.difficultyMultiplier;
        if (p1Center < bY - 35) paddle1Y += iaSpeed;
        else if (p1Center > bY + 35) paddle1Y -= iaSpeed;
    }

    let target2Y = window.hand1Y * pongCanvas.height;
    paddle2Y += (target2Y - (paddle2Y + pHeight/2)) * 0.3;
    if (paddle2Y < 0) paddle2Y = 0;
    if (paddle2Y > pongCanvas.height - pHeight) paddle2Y = pongCanvas.height - pHeight;

    bX += bSpeedX; bY += bSpeedY;

    if (bX < pThick) {
        if (bY > paddle1Y && bY < paddle1Y + pHeight) {
            bSpeedX = -bSpeedX; bSpeedY = (bY - (paddle1Y + pHeight/2)) * 0.25;
        } else { p2Score++; resetPongBall(); }
    }
    if (bX > pongCanvas.width - pThick) {
        if (bY > paddle2Y && bY < paddle2Y + pHeight) {
            bSpeedX = -bSpeedX; bSpeedY = (bY - (paddle2Y + pHeight/2)) * 0.25;
        } else { p1Score++; resetPongBall(); }
    }
    if (bY < 0 || bY > pongCanvas.height) bSpeedY = -bSpeedY;
}

function drawPong() {
    // Clear transparent so background shows through the glass canvas
    pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
    
    if (showingWinScreenPong) {
        pongCtx.fillStyle = 'white';
        pongCtx.font = '30px Outfit';
        pongCtx.textAlign = 'center';
        let winnerText = window.playersMode === 2 ? 
            (p1Score >= window.maxScore ? "Player 1 (Left) Wins" : "Player 2 (Right) Wins") : 
            (p1Score >= window.maxScore ? "System Wins" : "User Wins");
        pongCtx.fillText(winnerText, 400, 200);
        return;
    }
    
    // Center line
    for (let i = 0; i < pongCanvas.height; i += 40) {
        pongCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        pongCtx.fillRect(399, i, 2, 20);
    }
    
    // Paddles with soft glow
    pongCtx.shadowBlur = 15;
    pongCtx.shadowColor = colP1;
    pongCtx.fillStyle = colP1; pongCtx.fillRect(0, paddle1Y, pThick, pHeight);
    
    pongCtx.shadowColor = colP2;
    pongCtx.fillStyle = colP2; pongCtx.fillRect(pongCanvas.width - pThick, paddle2Y, pThick, pHeight);
    
    // Ball
    pongCtx.shadowBlur = 10;
    pongCtx.shadowColor = 'white';
    pongCtx.fillStyle = colBall;
    pongCtx.beginPath(); pongCtx.arc(bX, bY, 8, 0, Math.PI*2); pongCtx.fill();
    
    // Score
    pongCtx.shadowBlur = 0;
    pongCtx.font = '60px Outfit';
    pongCtx.textAlign = 'left';
    pongCtx.fillStyle = 'rgba(72, 100, 150, 0.6)'; pongCtx.fillText(p1Score, 100, 80);
    pongCtx.textAlign = 'right';
    pongCtx.fillStyle = 'rgba(175, 237, 145, 0.6)'; pongCtx.fillText(p2Score, 700, 80);
    pongCtx.textAlign = 'start'; // reset
}
