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
// FUTURISTIC VIRTUAL CURSOR (Liquid Energy)
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

        // Motion trail / soft glow variables
        let coreRadius = 6;
        let ringRadius = 24;
        let accentColor = '#AFED91'; // Accent Green
        let atmosColor = '#486496';  // Atmospheric Blue

        if (foundBtn) {
            if (hoverTarget !== foundBtn) {
                if(hoverTarget) hoverTarget.classList.remove('hovering');
                hoverTarget = foundBtn;
                hoverStartTime = performance.now();
                hoverTarget.classList.add('hovering');
            } else {
                let elapsed = performance.now() - hoverStartTime;
                let progress = Math.min(elapsed / DWELL_TIME, 1);
                
                // Active / Gesture state (Compression and Glow)
                ringRadius = 24 - (progress * 4); // Rings compress slightly
                coreRadius = 6 + (progress * 2);

                // Dwell Progress Ring (Accent Green)
                cursorCtx.beginPath();
                cursorCtx.arc(cx, cy, 32, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * progress));
                cursorCtx.strokeStyle = accentColor;
                cursorCtx.lineWidth = 4;
                cursorCtx.lineCap = 'round';
                cursorCtx.stroke();

                if (progress >= 1) {
                    // Interaction trigger
                    hoverTarget.click();
                    hoverTarget.classList.remove('hovering');
                    hoverTarget = null; 
                    hoverStartTime = performance.now() + 1500;
                    
                    // Ripple effect could be added here
                }
            }
        } else {
            if (hoverTarget) {
                hoverTarget.classList.remove('hovering');
                hoverTarget = null;
            }
        }

        // Draw the digital entity cursor
        
        // 1. Soft outer blur (Glass glow)
        cursorCtx.shadowBlur = 15;
        cursorCtx.shadowColor = hoverTarget ? accentColor : atmosColor;
        
        // 2. Translucent outer ring
        cursorCtx.beginPath();
        cursorCtx.arc(cx, cy, ringRadius, 0, Math.PI*2);
        cursorCtx.fillStyle = hoverTarget ? 'rgba(175, 237, 145, 0.15)' : 'rgba(72, 100, 150, 0.2)';
        cursorCtx.fill();
        cursorCtx.strokeStyle = hoverTarget ? 'rgba(175, 237, 145, 0.6)' : 'rgba(255, 255, 255, 0.3)';
        cursorCtx.lineWidth = 1.5;
        cursorCtx.stroke();

        // 3. Solid glowing core
        cursorCtx.shadowBlur = 0; // Reset shadow for core
        cursorCtx.beginPath();
        cursorCtx.arc(cx, cy, coreRadius, 0, Math.PI*2);
        cursorCtx.fillStyle = hoverTarget ? accentColor : '#FFFFFF';
        cursorCtx.fill();
    }
    
    requestAnimationFrame(updateCursor);
}
updateCursor();
