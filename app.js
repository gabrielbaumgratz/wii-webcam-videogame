window.difficultyMultiplier = 1;
window.maxScore = 5;
window.activeGame = null;

// Lógica de Navegação
function navTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function setDifficulty(mult, score) {
    window.difficultyMultiplier = mult;
    window.maxScore = score;
    let diffName = score === 5 ? "Fácil" : (score === 10 ? "Médio" : "Difícil");
    document.getElementById('current-diff-text').innerText = `Dificuldade Atual: ${diffName} (${score} pts)`;
    navTo('start-screen');
}

function startGame(gameName) {
    navTo(gameName + '-screen');
    window.activeGame = gameName;
    if (gameName === 'pong') startPong();
    if (gameName === 'tennis') startTennis();
    if (gameName === 'moto') startMoto();
}

function backToMenu() {
    window.activeGame = null;
    navTo('select-screen');
}

// ==========================================
// MOUSE VIRTUAL (DWELL CLICK / HOVER TO CLICK)
// ==========================================
const cursorCanvas = document.getElementById('cursor-canvas');
const cursorCtx = cursorCanvas.getContext('2d');
cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
});

let hoverTarget = null;
let hoverStartTime = 0;
const DWELL_TIME = 1500; // Tempo parado no botão para clicar (1.5 segundos)

function updateCursor() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    
    if (window.isHandPresent) {
        // Mapear posição: X é invertido porque a câmera está espelhada
        let cx = (1 - window.handX) * cursorCanvas.width;
        let cy = window.handY * cursorCanvas.height;

        // Procura botões usando classes 'wii-btn' onde o cursor virtual está
        let elements = document.elementsFromPoint(cx, cy);
        let foundBtn = elements.find(el => el.classList && el.classList.contains('wii-btn'));

        if (foundBtn) {
            if (hoverTarget !== foundBtn) {
                // Entrou em um botão novo
                if(hoverTarget) hoverTarget.classList.remove('hovering');
                hoverTarget = foundBtn;
                hoverStartTime = performance.now();
                hoverTarget.classList.add('hovering');
            } else {
                // Continua no mesmo botão, carregar círculo
                let elapsed = performance.now() - hoverStartTime;
                let progress = Math.min(elapsed / DWELL_TIME, 1);
                
                // Desenhar a Trava de Segurança (Anel em volta)
                cursorCtx.beginPath();
                cursorCtx.arc(cx, cy, 35, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * progress));
                cursorCtx.strokeStyle = '#00ff00';
                cursorCtx.lineWidth = 6;
                cursorCtx.stroke();

                if (progress >= 1) {
                    // Clique automático!
                    hoverTarget.click();
                    hoverTarget.classList.remove('hovering');
                    hoverTarget = null; 
                    hoverStartTime = performance.now() + 1500; // Evita clique duplo acidental (Cooldown)
                }
            }
        } else {
            // Saiu de qualquer botão
            if (hoverTarget) {
                hoverTarget.classList.remove('hovering');
                hoverTarget = null;
            }
        }

        // Desenhar a "Mãozinha/Cursor" azulzinha do Wii
        cursorCtx.beginPath();
        cursorCtx.arc(cx, cy, 15, 0, Math.PI*2);
        cursorCtx.fillStyle = 'rgba(0, 191, 255, 0.9)';
        cursorCtx.fill();
        cursorCtx.strokeStyle = 'white';
        cursorCtx.lineWidth = 3;
        cursorCtx.stroke();
    }
    
    requestAnimationFrame(updateCursor);
}
updateCursor();
