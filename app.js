window.difficultyMultiplier = 1;
window.maxScore = 5;
window.sensitivity = 1.2;
window.activeGame = null;
window.playersMode = 1;

function updateConfigText() {
    let diffName = window.maxScore === 5 ? "Light" : (window.maxScore === 10 ? "Standard" : "Intense");
    let sensName = window.sensitivity === 0.8 ? "Low" : (window.sensitivity === 1.2 ? "Balanced" : "High");
    document.getElementById('current-diff-text').innerText = `Current: ${diffName} (${window.maxScore} pts) | Sensitivity: ${sensName}`;
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

// INICIAR JOGOS
function startGame(gameName, players) {
    window.playersMode = players || 1;
    
    // Todos usam o mesmo wrapper UI agora
    navTo('game-ui-screen');
    window.activeGame = gameName;
    
    if (gameName === 'pong') {
        if(typeof initPong3D === 'function') initPong3D();
    } else {
        // Tênis e Moto voltarão em 3D futuramente
        document.getElementById('winner-text').style.display = 'block';
        document.getElementById('winner-text').innerText = "Game mode migrating to 3D. Please check back later!";
    }
}

function backToMenu() {
    window.activeGame = null;
    if(typeof stopPong3D === 'function') stopPong3D();
    navTo('select-screen');
}

// ==========================================
// FUTURISTIC VIRTUAL CURSOR
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
    
    if (window.isHandPresent) {
        let cx = (1 - window.hand1X) * cursorCanvas.width;
        let cy = window.hand1Y * cursorCanvas.height;

        let elements = document.elementsFromPoint(cx, cy);
        let foundBtn = elements.find(el => el.classList && el.classList.contains('wii-btn'));

        let coreRadius = 6;
        let ringRadius = 24;
        let accentColor = '#AFED91'; 

        if (foundBtn) {
            if (hoverTarget !== foundBtn) {
                if(hoverTarget) hoverTarget.classList.remove('hovering');
                hoverTarget = foundBtn;
                hoverStartTime = performance.now();
                hoverTarget.classList.add('hovering');
            } else {
                let elapsed = performance.now() - hoverStartTime;
                let progress = Math.min(elapsed / DWELL_TIME, 1);
                
                ringRadius = 24 - (progress * 4);
                coreRadius = 6 + (progress * 2);

                cursorCtx.beginPath();
                cursorCtx.arc(cx, cy, 32, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * progress));
                cursorCtx.strokeStyle = accentColor;
                cursorCtx.lineWidth = 4;
                cursorCtx.lineCap = 'round';
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
        cursorCtx.arc(cx, cy, ringRadius, 0, Math.PI*2);
        cursorCtx.fillStyle = hoverTarget ? 'rgba(175, 237, 145, 0.3)' : 'rgba(72, 100, 150, 0.4)';
        cursorCtx.fill();
        cursorCtx.strokeStyle = hoverTarget ? 'rgba(175, 237, 145, 0.8)' : 'rgba(255, 255, 255, 0.5)';
        cursorCtx.lineWidth = 2;
        cursorCtx.stroke();

        cursorCtx.beginPath();
        cursorCtx.arc(cx, cy, coreRadius, 0, Math.PI*2);
        cursorCtx.fillStyle = hoverTarget ? accentColor : '#FFFFFF';
        cursorCtx.fill();
    }
    
    requestAnimationFrame(updateCursor);
}
updateCursor();
