const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variáveis do Jogo
let p1Score = 0;
let p2Score = 0;
const WINNING_SCORE = 5;
let showingWinScreen = false;

// Raquetes
const paddleThickness = 15;
const paddleHeight = 100;

// Jogador 1 (Esquerda - Computador)
let paddle1Y = canvas.height / 2 - paddleHeight / 2;

// Jogador 2 (Direita - Você / Webcam)
let paddle2Y = canvas.height / 2 - paddleHeight / 2;
// Variável que a câmera vai atualizar (alvo para onde a raquete deve ir)
let targetPaddle2Y = canvas.height / 2 - paddleHeight / 2; 

// Bola
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 7;
let ballSpeedY = 5;
const ballRadius = 8;

function ballReset() {
    if (p1Score >= WINNING_SCORE || p2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    // Inverte a direção da bola e volta pro meio
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement() {
    let paddle1YCenter = paddle1Y + (paddleHeight / 2);
    // Segue a bola, mas com um pequeno atraso proposital
    if (paddle1YCenter < ballY - 35) {
        paddle1Y += 6;
    } else if (paddle1YCenter > ballY + 35) {
        paddle1Y -= 6;
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }

    computerMovement();

    // Suaviza o movimento da raquete da webcam (interpolação)
    paddle2Y += (targetPaddle2Y - paddle2Y) * 0.3;
    
    // Impede a raquete de sair da tela
    if (paddle2Y < 0) paddle2Y = 0;
    if (paddle2Y > canvas.height - paddleHeight) paddle2Y = canvas.height - paddleHeight;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Lógica da parede esquerda (Computador)
    if (ballX < paddleThickness) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.25;
        } else {
            p2Score++; // Ponto pra você
            ballReset();
        }
    }

    // Lógica da parede direita (Você)
    if (ballX > canvas.width - paddleThickness) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle2Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.25;
        } else {
            p1Score++; // Ponto pro PC
            ballReset();
        }
    }

    // Quica no teto e no chão
    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    // Fundo
    colorRect(0, 0, canvas.width, canvas.height, '#111');

    if (showingWinScreen) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        if (p1Score >= WINNING_SCORE) {
            ctx.fillText("Computador Venceu!", canvas.width / 2 - 140, canvas.height / 2);
        } else if (p2Score >= WINNING_SCORE) {
            ctx.fillText("Você Venceu!", canvas.width / 2 - 100, canvas.height / 2);
        }
        ctx.font = '16px Arial';
        ctx.fillText("Recarregue a página (F5) para jogar de novo", canvas.width / 2 - 160, canvas.height / 2 + 40);
        return;
    }

    drawNet();

    // Raquete 1 (PC - Vermelha)
    colorRect(0, paddle1Y, paddleThickness, paddleHeight, '#ff3366');

    // Raquete 2 (Você - Azul)
    colorRect(canvas.width - paddleThickness, paddle2Y, paddleThickness, paddleHeight, '#00bfff');

    // Bola
    colorCircle(ballX, ballY, ballRadius, 'white');

    // Placar
    ctx.font = '40px Arial';
    ctx.fillStyle = '#ff3366';
    ctx.fillText(p1Score, 100, 80);
    ctx.fillStyle = '#00bfff';
    ctx.fillText(p2Score, canvas.width - 100, 80);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    ctx.fillStyle = drawColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    ctx.fillStyle = drawColor;
    ctx.fillRect(leftX, topY, width, height);
}

// Inicia o Loop do Jogo (60 frames por segundo)
const framesPerSecond = 60;
setInterval(function() {
    moveEverything();
    drawEverything();
}, 1000 / framesPerSecond);

// Função que a motion.js vai chamar para atualizar a posição
window.setPlayer2TargetY = function(y) {
    targetPaddle2Y = y - (paddleHeight / 2);
}
