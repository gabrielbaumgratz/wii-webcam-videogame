// GLOBAL SETTINGS
window.sensitivity = 1.2;

// PER-GAME SETTINGS
window.activeGame = null;
window.gameConfigs = {
    pong: { mode: 1, difficultyMult: 1, targetScore: 5 },
    tennis: { mode: 1, difficultyMult: 1, targetScore: 5 },
    moto: { mode: 1, difficultyMult: 1, targetScore: 5 }
};

let pendingGame = 'pong';

function navTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Global Sensitivity Selection
function setSensitivity(sens, btnElement) {
    window.sensitivity = sens;
    let parent = document.getElementById('sensitivity-options');
    parent.querySelectorAll('.wii-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
}

// Game Hub specific settings
function openGameHub(gameId) {
    pendingGame = gameId;
    let title = gameId === 'pong' ? 'AIR HOCKEY 3D' : (gameId === 'tennis' ? 'COURT TENNIS' : 'MOTO RACER');
    document.getElementById('game-hub-title').innerText = title + ' CONFIG';
    navTo('game-hub-screen');
}

function setGameMode(players, btnElement) {
    window.gameConfigs[pendingGame].mode = players;
    let parent = document.getElementById('player-options');
    parent.querySelectorAll('.wii-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
}

function setGameDifficulty(mult, score, btnElement) {
    window.gameConfigs[pendingGame].difficultyMult = mult;
    window.gameConfigs[pendingGame].targetScore = score;
    let parent = document.getElementById('difficulty-options');
    parent.querySelectorAll('.wii-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
}

function launchGame() {
    let conf = window.gameConfigs[pendingGame];
    window.playersMode = conf.mode;
    window.difficultyMultiplier = conf.difficultyMult;
    window.maxScore = conf.targetScore;
    window.activeGame = pendingGame;
    
    navTo('game-ui-screen');
    
    if (pendingGame === 'pong' && typeof initPong3D === 'function') {
        initPong3D();
    } else {
        document.getElementById('winner-text').style.display = 'block';
        document.getElementById('winner-text').innerText = "SYSTEM OFFLINE FOR UPGRADES";
    }
}

function backToMenu() {
    window.activeGame = null;
    if(typeof stopPong3D === 'function') stopPong3D();
    navTo('select-screen');
}

// ==========================================
// VIRTUAL CURSOR (Neon Green)
// ==========================================
const cursorCanvas = document.getElementById('cursor-canvas');
const cursorCtx = cursorCanvas.getContext('2d');
cursorCanvas.width = window.innerWidth; cursorCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    cursorCanvas.width = window.innerWidth; cursorCanvas.height = window.innerHeight;
});

let hoverTarget = null;
let hoverStartTime = 0;
const DWELL_TIME = 1200; // Faster dwell time for more responsive feel

function updateCursor() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    
    if (window.isHandPresent) {
        let cx = (1 - window.hand1X) * cursorCanvas.width;
        let cy = window.hand1Y * cursorCanvas.height;

        let elements = document.elementsFromPoint(cx, cy);
        let foundBtn = elements.find(el => el.classList && el.classList.contains('wii-btn'));

        let coreRadius = 8;
        let ringRadius = 28;
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
                
                ringRadius = 28 - (progress * 6); // Compress inward
                
                // Drawing loading ring
                cursorCtx.beginPath();
                cursorCtx.arc(cx, cy, 35, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * progress));
                cursorCtx.strokeStyle = '#FFFFFF';
                cursorCtx.lineWidth = 5;
                cursorCtx.lineCap = 'round';
                cursorCtx.stroke();

                if (progress >= 1) {
                    hoverTarget.click();
                    hoverTarget.classList.remove('hovering');
                    hoverTarget = null; 
                    hoverStartTime = performance.now() + 1500; // Cooldown
                }
            }
        } else {
            if (hoverTarget) {
                hoverTarget.classList.remove('hovering');
                hoverTarget = null;
            }
        }

        // Draw Outer Translucent Ring
        cursorCtx.beginPath();
        cursorCtx.arc(cx, cy, ringRadius, 0, Math.PI*2);
        cursorCtx.fillStyle = 'rgba(55, 178, 77, 0.4)';
        cursorCtx.fill();
        cursorCtx.strokeStyle = accentColor;
        cursorCtx.lineWidth = 2;
        cursorCtx.stroke();

        // Draw Solid Glowing Core
        cursorCtx.shadowBlur = 15;
        cursorCtx.shadowColor = accentColor;
        cursorCtx.beginPath();
        cursorCtx.arc(cx, cy, coreRadius, 0, Math.PI*2);
        cursorCtx.fillStyle = '#FFFFFF';
        cursorCtx.fill();
        cursorCtx.shadowBlur = 0;
    }
    
    requestAnimationFrame(updateCursor);
}
updateCursor();
