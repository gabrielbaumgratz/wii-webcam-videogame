const tenCvs = document.getElementById("tennisCanvas");
const tenCtx = tenCvs.getContext("2d");

let tenTimer = null;
let tB = { x: 400, y: 200, z: 0.5, vx: 3, vy: -2, vz: -0.015 }; 
let tP1 = { x: 400, y: 150 }; 
let tP2 = { x: 400, y: 200 }; 

let tScore1 = 0, tScore2 = 0;
let showingWinScreenTennis = false;
let tennisWinner = "";

function startTennis() {
    tScore1 = tScore2 = 0;
    showingWinScreenTennis = false;
    resetTennisBall(0.5);
    if (tenTimer) clearInterval(tenTimer);
    
    tenTimer = setInterval(() => {
        if (window.activeGame === 'tennis') {
            updateTennis();
            drawTennis();
        } else {
            clearInterval(tenTimer);
        }
    }, 1000/60);
}

function resetTennisBall(startZ) {
    if (checkTennisWin()) return;
    tB.x = 400; tB.y = 200; tB.z = startZ;
    tB.vx = (Math.random() - 0.5) * 8;
    tB.vy = -3;
    tB.vz = (startZ === 1) ? -0.015 * window.difficultyMultiplier : 0.015 * window.difficultyMultiplier;
}

// Lógica de Pontos Clássica (15, 30, 40, Game)
function checkTennisWin() {
    if (tScore1 >= 4 && tScore1 - tScore2 >= 2) {
        showingWinScreenTennis = true;
        tennisWinner = "PC Venceu o Game!";
        return true;
    }
    if (tScore2 >= 4 && tScore2 - tScore1 >= 2) {
        showingWinScreenTennis = true;
        tennisWinner = "Você Venceu o Game! 🏆";
        return true;
    }
    return false;
}

function getTennisScoreText(pts1, pts2) {
    if (pts1 >= 3 && pts2 >= 3) {
        if (pts1 === pts2) return "40 - 40 (Deuce)";
        if (pts1 > pts2) return "Vantagem PC";
        return "Vantagem Você";
    }
    const terms = ["0", "15", "30", "40"];
    let s1 = pts1 < 4 ? terms[pts1] : "Game";
    let s2 = pts2 < 4 ? terms[pts2] : "Game";
    return `PC: ${s1} | Você: ${s2}`;
}

function updateTennis() {
    if (showingWinScreenTennis) return;

    let targetX = (1 - window.hand1X) * tenCvs.width;
    let targetY = window.hand1Y * tenCvs.height;
    tP2.x += (targetX - tP2.x) * 0.3;
    tP2.y += (targetY - tP2.y) * 0.3;

    let pcSpeed = 5 * window.difficultyMultiplier;
    if (tP1.x < tB.x - 20) tP1.x += pcSpeed;
    else if (tP1.x > tB.x + 20) tP1.x -= pcSpeed;
    
    tB.x += tB.vx; tB.y += tB.vy; tB.z += tB.vz;
    tB.vy += 0.2; 

    if (tB.y > 350) { tB.y = 350; tB.vy = -tB.vy * 0.8; }

    if (tB.z <= 0) {
        let dx = Math.abs(tB.x - tP2.x);
        let dy = Math.abs(tB.y - tP2.y);
        if (dx < 50 && dy < 50) {
            tB.vz = 0.015 + (Math.random() * 0.005);
            tB.vx = (tB.x - tP2.x) * 0.1;
            tB.vy = -6;
            tB.z = 0;
        } else {
            tScore1++;
            resetTennisBall(1);
        }
    }

    if (tB.z >= 1) {
        let dx = Math.abs(tB.x - tP1.x);
        if (dx < 60) {
            tB.vz = -0.015 - (Math.random() * 0.005);
            tB.vx = (tB.x - tP1.x) * 0.1;
            tB.vy = -5;
            tB.z = 1;
        } else {
            tScore2++;
            resetTennisBall(0);
        }
    }

    if (tB.x < 0 || tB.x > 800) tB.vx *= -1;
}

function drawTennis() {
    tenCtx.fillStyle = '#87CEEB'; tenCtx.fillRect(0, 0, 800, 250);
    tenCtx.fillStyle = '#228B22'; tenCtx.fillRect(0, 250, 800, 150);

    tenCtx.fillStyle = '#1e5f30';
    tenCtx.beginPath();
    tenCtx.moveTo(250, 250); tenCtx.lineTo(550, 250);
    tenCtx.lineTo(700, 400); tenCtx.lineTo(100, 400);
    tenCtx.clearRect(0, 0, tenCvs.width, tenCvs.height);
    
    if (showingWinScreenTennis) {
        tenCtx.fillStyle = 'white';
        tenCtx.font = '30px Outfit';
        tenCtx.textAlign = 'center';
        let winnerText = (tScore1 >= 4) ? "System Wins Game!" : "User Wins Game!";
        tenCtx.fillText(winnerText, 400, 200);
        return;
    }

    tenCtx.fillStyle = '#e94560';
    tenCtx.beginPath(); tenCtx.ellipse(tP1.x, tP1.y, 20, 30, 0, 0, Math.PI*2); tenCtx.fill();

    let bScale = 1 - (tB.z > 1 ? 1 : (tB.z < 0 ? 0 : tB.z)); 
    let bRadius = 5 + (bScale * 15);
    
    tenCtx.fillStyle = 'rgba(0,0,0,0.3)';
    tenCtx.beginPath(); tenCtx.arc(tB.x, 350, bRadius, 0, Math.PI*2); tenCtx.fill();

    tenCtx.fillStyle = '#dfff00'; 
    tenCtx.beginPath(); tenCtx.arc(tB.x, tB.y, bRadius, 0, Math.PI*2); tenCtx.fill();

    tenCtx.fillStyle = 'rgba(0, 191, 255, 0.5)';
    tenCtx.strokeStyle = '#00bfff';
    tenCtx.lineWidth = 4;
    tenCtx.beginPath(); tenCtx.ellipse(tP2.x, tP2.y, 40, 60, 0, 0, Math.PI*2);
    tenCtx.fill(); tenCtx.stroke();
    
    // Placar Oficial de Tênis
    tenCtx.fillStyle = '#fff';
    tenCtx.font = '30px Arial';
    let scoreText = getTennisScoreText(tScore1, tScore2);
    // Centralizar placar no topo
    tenCtx.fillText(scoreText, 400 - (tenCtx.measureText(scoreText).width / 2), 40);
}
