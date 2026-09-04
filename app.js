window.difficultyMultiplier = 1;
window.maxScore = 5;
window.sensitivity = 1.2;
window.activeGame = null;
window.playersMode = 1; // 1 ou 2

// Funções para atualizar os textos de configuração
function updateConfigText() {
    let diffName = window.maxScore === 5 ? "Fácil" : (window.maxScore === 10 ? "Médio" : "Difícil");
    let sensName = window.sensitivity === 0.8 ? "Baixa" : (window.sensitivity === 1.2 ? "Normal" : "Alta");
    document.getElementById('current-diff-text').innerText = `Atual: ${diffName} (${window.maxScore} pts) | Sensibilidade: ${sensName}`;
}

function navTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function setDifficulty(mult, score) {
    window.difficultyMultiplier = mult;
    window.maxScore = score;
    updateConfigText();
}

function setSensitivity(sens) {
    window.sensitivity = sens;
    updateConfigText();
}

function startGame(gameName, players) {
    window.playersMode = players || 1;
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
// MOUSE VIRTUAL (DWELL CLICK)
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
const DWELL_TIME = 1500;

function updateCursor() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    
    // Para navegação, vamos usar sempre a mão 1 (a primeira que aparece ou a da direita)
    if (window.isHandPresent) {
        let cx = (1 - window.hand1X) * cursorCanvas.width;
        let cy = window.hand1Y * cursorCanvas.height;

        let elements = document.elementsFromPoint(cx, cy);
        let foundBtn = elements.find(el => el.classList && el.classList.contains('wii-btn'));

        if (foundBtn) {
            if (hoverTarget !== foundBtn) {
                if(hoverTarget) hoverTarget.classList.remove('hovering');
                hoverTarget = foundBtn;
                hoverStartTime = performance.now();
                hoverTarget.classList.add('hovering');
            } else {
                let elapsed = performance.now() - hoverStartTime;
                let progress = Math.min(elapsed / DWELL_TIME, 1);
                
                cursorCtx.beginPath();
                cursorCtx.arc(cx, cy, 35, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * progress));
                cursorCtx.strokeStyle = '#00ff00';
                cursorCtx.lineWidth = 6;
                cursorCtx.stroke();

                if (progress >= 1) {
                    hoverTarget.click();
                    hoverTarget.classList.remove('hovering');
                    hoverTarget = null; 
                    hoverStartTime = performance.now() + 1500;
                }
            }
        } else {
            if (hoverTarget) {
                hoverTarget.classList.remove('hovering');
                hoverTarget = null;
            }
        }

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
